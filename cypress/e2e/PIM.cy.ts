import { faker } from "@faker-js/faker";
import { LoginPage } from "../support/Pages/LoginPage";
import { PIMPage } from "../support/Pages/PimPage";

describe("PIM Page Tests", () => {
  const Username = "Admin";
  const Password = "admin123";
  let employeeId: number;

  beforeEach(() => {
    LoginPage.goToLoginPage();
    LoginPage.login(Username, Password);
  });

  afterEach(() => {
    if (!employeeId) return;
    cy.clearCookies();
    cy.clearLocalStorage();
    LoginPage.goToLoginPage();
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