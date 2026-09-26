import { faker } from "@faker-js/faker";
import { PIMPage } from "@cypress/support/Pages/pim-page";
import { selectOption } from "@cypress/support/helpers/common-helpers";

describe("PIM Page Tests", () => {
  const username = "Admin";
  const Password = "admin123";
  let employeeId = "";

  beforeEach(() => {
    employeeId = "";
    cy.login(username, Password);
  });

  afterEach(() => {
    cy.logout();
    cy.login(username, Password);

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

      PIMPage.saveNewEmployee();

      PIMPage.checkNameFieldsFilled(
        employee.firstName,
        employee.middleName,
        employee.lastName,
      );

      selectOption("Nationality", employee.nationality);
      selectOption("Marital Status", employee.maritalStatus);
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

      PIMPage.uploadFile("profile-picture.jpg");

      PIMPage.enableLoginDetails();

      const newUsername = `shahd_${faker.string
        .alphanumeric(4)
        .toLowerCase()}`;

      PIMPage.typeUsername(newUsername);
      PIMPage.typePasswords(employee.password);
      PIMPage.saveNewEmployee();

      selectOption("Nationality", employee.nationality);
      selectOption("Marital Status", employee.maritalStatus);
      PIMPage.typeDateOfBirth(employee.dateOfBirth);
      PIMPage.selectGender(employee.gender);
      PIMPage.savePersonalDetails();

      PIMPage.openAttachments();
      PIMPage.uploadFile("attachments/employee.xlsx");
      PIMPage.saveAttachment();

      PIMPage.downloadAttachment();
      PIMPage.validateDownloadedFile("employee.xlsx");

      cy.logout();

      cy.login(newUsername, employee.password);

      PIMPage.goToMyInfo();
      PIMPage.checkPersonalDetails(employee);
    });
  });
});