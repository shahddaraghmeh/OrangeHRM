
import { faker } from "@faker-js/faker";
describe("PIM Page Tests", () => {
  const Username = "Admin";
  const Password = "admin123";

  beforeEach(() => {
    cy.visit("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
    cy.get('input[name="username"]').type(Username);
    cy.get('input[name="password"]').type(Password);
    cy.get(".orangehrm-login-form").find('button[type="submit"]').click();

  });

  it("TC08: Create employee and verify employee information", () => {
    cy.fixture("employee.json").then((employee) => {
      cy.intercept("GET", "**/web/index.php/api/v2/pim/employees*").as("getEmployees");
      cy.get("span.oxd-main-menu-item--name").contains("PIM").click();
      cy.wait("@getEmployees").its("response.statusCode").should("eq", 200);
      cy.get("button.oxd-button--secondary").contains("Add").click();
      cy.get(".orangehrm-employee-form").find('input[name="firstName"]').type(employee.firstName);
      cy.get(".orangehrm-employee-form").find('input[name="middleName"]').type(employee.middleName);
      cy.get(".orangehrm-employee-form").find('input[name="lastName"]').type(employee.lastName);
      cy.get(".orangehrm-employee-form").find(".oxd-switch-input").click();
      const username = `shahd_${faker.string.alphanumeric(4).toLowerCase()}`;
      cy.get(".orangehrm-employee-form").find(".oxd-input-group").contains("label", "Username").parents(".oxd-input-group").find('input[autocomplete="off"]').type(username);
      cy.get(".orangehrm-employee-form").find('input[type="password"]').eq(0).type(employee.password);
      cy.get(".orangehrm-employee-form").find('input[type="password"]').eq(1).type(employee.password);
      cy.intercept("POST", "**/web/index.php/api/v2/pim/employees").as("createEmployee");
      cy.contains("button", "Save").click();
      cy.get(".oxd-input-field-error-message").should("not.exist");
      cy.wait("@createEmployee").its("response.statusCode").should("eq", 200);
      cy.contains("label", "Employee Id").parents(".oxd-input-group").find("input").should("not.have.value", "");
      cy.get('input[name="firstName"]').should("have.value", employee.firstName);
      cy.get('input[name="middleName"]').should("have.value", employee.middleName);
      cy.get('input[name="lastName"]').should("have.value", employee.lastName);
      cy.contains("label", "Employee Id").parents(".oxd-input-group").find("input").should("not.have.value", "");
      cy.contains("label", "Nationality").parents(".oxd-input-group").find(".oxd-select-text").click();
      cy.contains(employee.nationality).click();
      cy.contains("label", "Marital Status").parents(".oxd-input-group").find(".oxd-select-text").click();
      cy.contains(employee.maritalStatus).click();
      cy.contains("label", "Date of Birth").closest(".oxd-input-group").find('.oxd-date-input input').type(employee.dateOfBirth);
      cy.contains("label", employee.gender).find("input[type='radio']").check({ force: true });
      cy.contains('button[type="submit"]', "Save").first().click();
      cy.get(".oxd-userdropdown-tab").click();
      cy.contains("Logout").click();
      cy.url().should("include", "/auth/login");
      cy.get('.orangehrm-login-form input[name="username"]').type(username);
      cy.get('.orangehrm-login-form input[name="password"]').type(employee.password);
      cy.get(".orangehrm-login-form").find('button[type="submit"]').click();
      cy.url().should("include", "/dashboard/index");
      cy.contains("My Info").click();
      cy.url().should("include", "/pim/viewPersonalDetails");
      cy.get('input[name="firstName"]').should("have.value", employee.firstName);
      cy.get('input[name="middleName"]').should("have.value", employee.middleName);
      cy.get('input[name="lastName"]').should("have.value", employee.lastName);
      cy.contains("label", "Nationality").parents(".oxd-input-group").find(".oxd-select-text").should("contain.text", employee.nationality);
      cy.contains("label", "Marital Status").parents(".oxd-input-group").find(".oxd-select-text").should("contain.text", employee.maritalStatus);
      cy.contains("label", "Date of Birth").closest(".oxd-input-group").find(".oxd-date-input input").should("have.value", employee.dateOfBirth);
      cy.contains("label", employee.gender).find("input[type='radio']").should("be.checked");
    });
  });
});
