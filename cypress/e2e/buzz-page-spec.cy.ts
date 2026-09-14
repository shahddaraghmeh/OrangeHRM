import { LoginPage } from "@cypress/support/Pages/loginpage";
import { BuzzPage } from "@cypress/support/Pages/buzzpage";

describe("Buzz Page Tests", () => {

  const username = "Admin";
  const password = "admin123";

  beforeEach(() => {
    LoginPage.visit();
    LoginPage.login(username, password);
  });

  it("TC07: Verify user can create a post using fixture data", () => {
    cy.fixture("BuzzPost.json").then((data) => {

      BuzzPage.goToBuzzPage();
      BuzzPage.typePost(data.postText);
      BuzzPage.clickPostButton();
      BuzzPage.checkPostIsVisible(data.postText);
    });
  });
});