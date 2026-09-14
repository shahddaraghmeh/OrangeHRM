const LOCATORS = {
    menuItem: ".oxd-main-menu-item",
    createPostBox: ".orangehrm-buzz-create-post",
    postInput: ".oxd-buzz-post-input",
    postBodyText: ".orangehrm-buzz-post-body-text",
};
export class BuzzPage {
    static goToBuzzPage() {
        cy.intercept("GET", "**/web/index.php/api/v2/buzz/feed**").as("FEEDREQUEST");
        cy.get(LOCATORS.menuItem).contains("Buzz").click();
        cy.wait("@FEEDREQUEST").its("response.statusCode").should("eq", 200);
    }
    static typePost(text: string) {
        cy.get(LOCATORS.createPostBox).find(LOCATORS.postInput).type(text);
    }
    static clickPostButton() {
        cy.intercept("POST", "**/api/v2/buzz/posts**").as("postRequest");
        cy.intercept("GET", "**/api/v2/buzz/feed**").as("feedAfterPost");
        cy.get(LOCATORS.createPostBox).find("button").contains("Post").click();
        cy.wait("@postRequest").its("response.statusCode").should("eq", 200);
        cy.wait("@feedAfterPost");
    }
    static checkPostIsVisible(text: string) {
        cy.contains(LOCATORS.postBodyText, text, { timeout: 10000 }).should("be.visible");
    }
}