
export class LoginPage {

  static pageUrl = "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login";


  static form = ".orangehrm-login-form";
  static userInput = 'input[name="username"]';
  static passInput = 'input[name="password"]';
  static errorText = ".orangehrm-login-error .oxd-alert-content-text";
  static requiredText = ".oxd-input-group__message";
  static dashboardTitle = ".oxd-topbar-header-breadcrumb h6";
  static dashboardUrl = "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index";


  static goToLoginPage() {
    cy.visit(this.pageUrl);
  }

  static typeUsername(user: string) {
    cy.get(this.form).find(this.userInput).type(user);
  }

  static typePassword(pass: string) {
    cy.get(this.form).find(this.passInput).type(pass);
  }

  static clickLoginBtn() {
    cy.get(this.form).find("button").contains("Login").click();
  }


  static login(user: string, pass: string) {
    this.typeUsername(user);
    this.typePassword(pass);
    this.clickLoginBtn();
  }

  // checks
  static checkDashboardUrl() {
    cy.url().should("eq", this.dashboardUrl);
  }

  static checkDashboardTitle() {
    cy.get(this.dashboardTitle).should("have.text", "Dashboard");
  }

  static checkInvalidLoginMsg() {
    cy.get(this.errorText).should("have.text", "Invalid credentials");
  }

  static checkFirstRequiredMsg() {
    cy.get(this.requiredText).first().should("have.text", "Required");
  }

  static checkLastRequiredMsg() {
    cy.get(this.requiredText).last().should("have.text", "Required");
  }

  static checkRequiredMsgShown() {
    cy.get(this.form).contains("Required").should("have.text", "Required");
  }
}