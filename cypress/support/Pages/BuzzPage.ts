export class BuzzPage {

    static menuItem = ".oxd-main-menu-item";
    static createPostBox = ".orangehrm-buzz-create-post";
    static postInput = ".oxd-buzz-post-input";
    static postBodyText = ".orangehrm-buzz-post-body-text";

    static goToBuzz() {
        cy.intercept("GET", "**/web/index.php/api/v2/buzz/feed**").as("FEEDREQUEST");

        cy.get(this.menuItem).contains("Buzz").click();

        cy.wait("@FEEDREQUEST").its("response.statusCode").should("eq", 200);
    }

    static typePost(text: string) {
        cy.get(this.createPostBox).find(this.postInput).type(text);
    }

    static clickPostButton() {
        cy.intercept("POST", "**/api/v2/buzz/posts**").as("postRequest");
        cy.intercept("GET", "**/api/v2/buzz/feed**").as("feedAfterPost");

        cy.get(this.createPostBox).find("button").contains("Post").click();

        cy.wait("@postRequest").its("response.statusCode").should("eq", 200);
        cy.wait("@feedAfterPost");
    }

    static verifyPostVisible(text: string) {
        cy.contains(this.postBodyText, text, { timeout: 10000 }).should("be.visible");
    }

    static createPostFromFixture(fixtureFile: string) {
        //cy.wait(1000);
        cy.fixture(fixtureFile).then((data) => {
            this.typePost(data.postText);
            this.clickPostButton();
            this.verifyPostVisible(data.postText);
        });
    }
}