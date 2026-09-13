import { LoginPage } from "../support/Pages/LoginPage";
import { BuzzPage } from "../support/Pages/BuzzPage";

describe("Buzz Page Tests", () => {

  const username = "Admin";
  const password = "admin123";

  beforeEach(() => {
    LoginPage.goToLoginPage();
    LoginPage.login(username, password);
  });

  it("TC07: Verify user can create a post using fixture data", () => {
    BuzzPage.goToBuzz();
    BuzzPage.createPostFromFixture("BuzzPost.json");
  });
});