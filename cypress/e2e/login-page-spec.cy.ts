import { LoginPage } from "@cypress/support/Pages/loginpage-spec";

describe("Login Page Tests", () => {

  const username = "Admin";
  const password = "admin123";

  beforeEach(() => {
    LoginPage.goToLoginPage();
  });

  it("TC01: Verify login with valid username and password", () => {
    LoginPage.login(username, password);

    LoginPage.checkDashboardUrl();
    LoginPage.checkDashboardTitle();
  });

  it("TC02: Verify login with invalid username", () => {
    LoginPage.login("Admin123", password);

    LoginPage.checkInvalidLoginMsg();
  });

  it("TC03: Verify login with invalid password", () => {
    LoginPage.login(username, "123456");

    LoginPage.checkInvalidLoginMsg();
  });

  it("TC04: Verify login without username", () => {
    LoginPage.typePassword(password);
    LoginPage.clickLoginBtn();

    LoginPage.checkFirstRequiredMsg();
  });

  it("TC05: Verify login without password", () => {
    LoginPage.typeUsername(username);
    LoginPage.clickLoginBtn();

    LoginPage.checkLastRequiredMsg();
  });

  it("TC06: Verify login with empty username and password", () => {
    LoginPage.clickLoginBtn();

    LoginPage.checkRequiredMsgShown();
  });

});