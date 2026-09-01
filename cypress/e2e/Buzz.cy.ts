describe("Buzz Page Tests", () => {

  const username = "Admin";
  const password = "admin123";

  beforeEach(() => {
    cy.visit("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
    cy.get(".orangehrm-login-form").find('input[placeholder="Username"]').type(username);
    cy.get(".orangehrm-login-form").find('input[placeholder="Password"]').type(password);
    cy.get(".orangehrm-login-form").find("button").contains("Login").click();
    cy.url().should(  "eq", "https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index");
  });

  it("TC01: Verify user can create a post using fixture data", () => {
    cy.fixture("BuzzPost.json").then((data) => {
      cy.get(".oxd-main-menu-item").contains("Buzz").click();
      cy.url().should("eq", "https://opensource-demo.orangehrmlive.com/web/index.php/buzz/viewBuzz");
      cy.get(".orangehrm-buzz-create-post").find(".oxd-buzz-post-input").type(data.postText);
      cy.get(".orangehrm-buzz-create-post").find("button").contains("Post").click();
      cy.get(".orangehrm-buzz-post-body-text").contains(data.postText).should("be.visible");
    });
  });

});