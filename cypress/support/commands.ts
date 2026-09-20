/// <reference types="cypress" />

Cypress.Commands.add("login", (username: string, password: string) => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.visit(
    "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
  );

  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add("logout", () => {
  cy.get(".oxd-userdropdown-tab").click();
  cy.get('a[href="/web/index.php/auth/logout"]').click();
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