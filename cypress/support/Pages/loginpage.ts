
const LOCATORS = {
  pageUrl: "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
  form: ".orangehrm-login-form",
  userInput: 'input[name="username"]',
  passInput: 'input[name="password"]',
  errorText: ".orangehrm-login-error .oxd-alert-content-text",
  requiredText: ".oxd-input-group__message",
  dashboardTitle: ".oxd-topbar-header-breadcrumb h6",
  dashboardUrl: "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index",
}
export class LoginPage {


  static visit() {
    cy.visit(LOCATORS.pageUrl);
  }

  static typeUsername(user: string) {
    cy.get(LOCATORS.form).find(LOCATORS.userInput).type(user);
  }

  static typePassword(pass: string) {
    cy.get(LOCATORS.form).find(LOCATORS.passInput).type(pass);
  }

  static clickLoginBtn() {
    cy.get(LOCATORS.form).find("button").contains("Login").click();
  }


  static login(user: string, pass: string) {
    this.typeUsername(user);
    this.typePassword(pass);
    this.clickLoginBtn();
  }

  // checks
  static checkDashboardUrl() {
    cy.url().should("eq", LOCATORS.dashboardUrl);
  }

  static checkDashboardTitle() {
    cy.get(LOCATORS.dashboardTitle).should("have.text", "Dashboard");
  }

  static checkInvalidLoginMsg() {
    cy.get(LOCATORS.errorText).should("have.text", "Invalid credentials");
  }

  static checkFirstRequiredMsg() {
    cy.get(LOCATORS.requiredText).first().should("have.text", "Required");
  }

  static checkLastRequiredMsg() {
    cy.get(LOCATORS.requiredText).last().should("have.text", "Required");
  }

  static checkRequiredMsgShown() {
    cy.get(LOCATORS.form).contains("Required").should("have.text", "Required");
  }
}