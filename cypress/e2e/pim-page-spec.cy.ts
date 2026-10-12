import { faker } from "@faker-js/faker";
import { PIMPage } from "@cypress/support/pages/pim-page";

describe("PIM Page Tests", () => {
  const userName = "Admin";
  const password = "admin123";
  let employeeId = "";
  const attachmentFileName = "employee.xlsx";
  const profilePictureFileName = "profile-picture.jpg";
  beforeEach(() => {
    employeeId = "";
    cy.login(userName, password);
  });

  afterEach(() => {
    cy.logout();
    cy.login(userName, password);
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

      PIMPage.fillPersonalDetails(employee);

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

      PIMPage.uploadFile(`attachments/${profilePictureFileName}`);

      PIMPage.enableLoginDetails();

      const newUsername = `shahd_${faker.string
        .alphanumeric(4)
        .toLowerCase()}`;

      PIMPage.typeUsername(newUsername);
      PIMPage.typePasswords(employee.password);
      PIMPage.saveNewEmployee((empId) => {
        employeeId = empId;
      });

      PIMPage.fillPersonalDetails(employee);
      PIMPage.openAttachments();
      PIMPage.uploadFile(`attachments/${attachmentFileName}`);
      PIMPage.saveAttachment();

      PIMPage.downloadAttachment();
      PIMPage.verifyDownloadedFileExists(attachmentFileName);

      cy.logout();

      cy.login(newUsername, employee.password);

      PIMPage.goToMyInfo();
      PIMPage.checkPersonalDetails(employee);
    });
  });
});