import { faker } from "@faker-js/faker";
import { PIMPage } from "@cypress/support/Pages/pimpage";

describe("PIM Page Tests", () => {
  const username = "Admin";
  const password = "admin123";
  let employeeId = "";

  beforeEach(() => {
    employeeId = "";
    cy.login(username, password);
  });

  afterEach(() => {
    if (!employeeId) return;

    cy.clearCookies();
    cy.clearLocalStorage();

    cy.login(username, password);

    PIMPage.goToPIM();
    PIMPage.searchEmployeeById(employeeId);
    PIMPage.deleteFoundEmployee();
  });

  it("TC08: Create employee and verify employee information", () => {
    cy.fixture("employee.json").then((employee) => {
      PIMPage.goToPIM();
      PIMPage.clickAddEmployee();

      PIMPage.fillNames(
        employee.firstName,
        employee.middleName,
        employee.lastName,
      );

      PIMPage.enableLoginDetails();

      const newUsername = `shahd_${faker.string
        .alphanumeric(4)
        .toLowerCase()}`;

      PIMPage.typeUsername(newUsername);
      PIMPage.typePasswords(employee.password);

      PIMPage.saveNewEmployee((empId) => {
        employeeId = empId;
      });

      PIMPage.checkNameFieldsFilled(
        employee.firstName,
        employee.middleName,
        employee.lastName,
      );

      PIMPage.selectNationality(employee.nationality);
      PIMPage.selectMaritalStatus(employee.maritalStatus);
      PIMPage.typeDateOfBirth(employee.dateOfBirth);
      PIMPage.selectGender(employee.gender);
      PIMPage.savePersonalDetails();

      cy.logout();

      cy.login(newUsername, employee.password);

      PIMPage.goToMyInfo();
      PIMPage.checkPersonalDetails(employee);
    });
  });

  it("TC09: Upload employee profile picture, attach Excel file, and validate", () => {
    cy.fixture("employee.json").then((employee) => {
      PIMPage.goToPIM();
      PIMPage.clickAddEmployee();

      PIMPage.fillNames(
        employee.firstName,
        employee.middleName,
        employee.lastName,
      );

      PIMPage.uploadProfilePicture("profile-picture.jpg");

      PIMPage.enableLoginDetails();

      const newUsername = `shahd_${faker.string
        .alphanumeric(4)
        .toLowerCase()}`;

      PIMPage.typeUsername(newUsername);
      PIMPage.typePasswords(employee.password);
      PIMPage.saveNewEmployee((empId) => {
        employeeId = empId;
      });

      PIMPage.selectNationality(employee.nationality);
      PIMPage.selectMaritalStatus(employee.maritalStatus);
      PIMPage.typeDateOfBirth(employee.dateOfBirth);
      PIMPage.selectGender(employee.gender);
      PIMPage.savePersonalDetails();

      PIMPage.openAttachments();
      PIMPage.uploadAttachment("attachments/employee.xlsx");
      PIMPage.saveAttachment();

      PIMPage.downloadAttachment();
      PIMPage.validateDownloadedFile("employee.xlsx");

      cy.logout();

      cy.login(newUsername, employee.password);
    });
  });
});