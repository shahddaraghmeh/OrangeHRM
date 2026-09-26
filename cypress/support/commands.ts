/// <reference types="cypress" />

import { LOCATORS } from "@cypress/support/helpers/constants";

Cypress.Commands.add("login", (username: string, password: string) => {

  cy.visit(
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
  );

  cy.get(LOCATORS.usernameField).type(username);
  cy.get(LOCATORS.passwordField).type(password);
  cy.get(LOCATORS.submitButton).click();
  //cy.url({ timeout: 15000 }).should("include", "/dashboard");
});

Cypress.Commands.add("logout", () => {
  cy.get(LOCATORS.userDropdown).click();
  cy.get(LOCATORS.logoutLink).click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable;
      logout(): Chainable;
    }
  }
}

export { };