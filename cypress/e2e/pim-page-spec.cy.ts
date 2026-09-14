import { faker } from "@faker-js/faker";
import { LoginPage } from "@cypress/support/Pages/loginpage";
import { PIMPage } from "@cypress/support/Pages/pimpage";

describe("PIM Page Tests", () => {
  const Username = "Admin";
  const Password = "admin123";
  let employeeId: string;

  beforeEach(() => {
    LoginPage.visit();
    LoginPage.login(Username, Password);
  });

  afterEach(() => {
    if (!employeeId) return;
    cy.clearCookies();
    cy.clearLocalStorage();
    LoginPage.visit();
    LoginPage.login(Username, Password);

    PIMPage.goToPIM();
    PIMPage.searchEmployeeById(employeeId);
    PIMPage.deleteFoundEmployee();
  });

  it("TC08: Create employee and verify employee information", () => {
    cy.fixture("employee.json").then((employee) => {
      PIMPage.goToPIM();
      PIMPage.clickAddEmployee();
      PIMPage.fillNames(employee.firstName, employee.middleName, employee.lastName);
      PIMPage.enableLoginDetails();
      const username = `shahd_${faker.string.alphanumeric(4).toLowerCase()}`;
      PIMPage.typeUsername(username);
      PIMPage.typePasswords(employee.password);
      PIMPage.saveNewEmployee((empId) => {
        employeeId = empId;
      });
      PIMPage.checkNameFieldsFilled(employee.firstName, employee.middleName, employee.lastName);
      PIMPage.selectNationality(employee.nationality);
      PIMPage.selectMaritalStatus(employee.maritalStatus);
      PIMPage.typeDateOfBirth(employee.dateOfBirth);
      PIMPage.selectGender(employee.gender);
      PIMPage.savePersonalDetails();
      PIMPage.logout();
      LoginPage.login(username, employee.password);
      PIMPage.goToMyInfo();
      PIMPage.checkPersonalDetails(employee);
    });
  });
});