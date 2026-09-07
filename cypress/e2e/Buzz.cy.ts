describe("Buzz Page Tests", () => {

  const username = "Admin";
  const password = "admin123";

  beforeEach(() => {
    cy.visit("https://opensource-demo.orangehrmlive.com/web/index.php/auth/login");
    cy.get(".orangehrm-login-form").find('input[name="username"]').type(username);
    cy.get(".orangehrm-login-form").find('input[name="password"]').type(password);
    cy.intercept("GET", "/web/index.php/dashboard/index").as("DASHBOARDREQUEST");
    cy.get(".orangehrm-login-form").find("button").contains("Login").click();
    cy.wait("@DASHBOARDREQUEST").its("response.statusCode").should("eq", 200);;

  });

  it("TC07: Verify user can create a post using fixture data", () => {

    cy.fixture("BuzzPost.json").then((data) => {
      cy.intercept("GET", "**/web/index.php/api/v2/buzz/feed**").as("FEEDREQUEST");

      cy.get(".oxd-main-menu-item").contains("Buzz").click();
      cy.wait("@FEEDREQUEST").its("response.statusCode").should("eq", 200);
      cy.intercept("POST", "**/api/v2/buzz/posts").as("postRequest");
      cy.get(".orangehrm-buzz-create-post").find(".oxd-buzz-post-input").type(data.postText);
      cy.get(".orangehrm-buzz-create-post").find("button").contains("Post").click();
      cy.wait("@postRequest").its("response.statusCode").should("eq", 200);
      cy.contains('.orangehrm-buzz-post-body-text', data.postText).should('be.visible');
    });
  });
});