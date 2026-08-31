
describe("Login Page Tests", () => {

  beforeEach(() => {
    cy.visit("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
  });

  const username = "Admin";
  const password = "admin123";


  it("TC01: Verify login with valid username and password", () => {

    cy.get(".orangehrm-login-form").find('input[placeholder="username"]').type(username);
    cy.get(".orangehrm-login-form").find('input[placeholder="password"]').type(password);
    cy.get(".orangehrm-login-form").find("button").contains("Login").click();
   
    cy.url().should("eq", "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");
    cy.get(".oxd-topbar-header-breadcrumb").find("h6").should("have.text", "Dashboard");
  });


  it("TC02: Verify login with invalid username", () => {

    cy.get(".orangehrm-login-form").find('input[placeholder="username"]').type("Admin123");
    cy.get(".orangehrm-login-form").find('input[placeholder="password"]').type(password);
    cy.get(".orangehrm-login-form").find("button").contains("Login").click();
cy.get(".orangehrm-login-error").find(".oxd-alert-content-text").should("have.text", "Invalid credentials");
  });


  it("TC03: Verify login with invalid password", () => {

    cy.get(".orangehrm-login-form").find('input[placeholder="username"]').type(username);
    cy.get(".orangehrm-login-form").find('input[placeholder="password"]').type("123456");
    cy.get(".orangehrm-login-form").find("button").contains("Login").click();
cy.get(".orangehrm-login-error").find(".oxd-alert-content-text").should("have.text", "Invalid credentials");
  });


  it("TC04: Verify login without username", () => {

    cy.get(".orangehrm-login-form").find('input[placeholder="password"]').type(password);
    cy.get(".orangehrm-login-form").find("button").contains("Login").click();
    cy.get(".oxd-input-group").first().find(".oxd-input-group__message").should("have.text", "Required");
  });


  it("TC05: Verify login without password", () => {

    cy.get(".orangehrm-login-form").find('input[placeholder="username"]').type(username);
    cy.get(".orangehrm-login-form").find("button").contains("Login").click();
    cy.get(".oxd-input-group").last().find(".oxd-input-group__message").should("have.text", "Required");
  });


  it("TC06: Verify login with empty username and password", () => {
    cy.get(".orangehrm-login-form").find("button").contains("Login").click();
    cy.get(".orangehrm-login-form").contains("Required").should("have.text", "Required");
  });

});

