/**
 * Helper for logging in and switching between users inside a single test.
 */
export class AuthHelper {
    /**
     * Logs in through the UI and waits for the dashboard.
     * @param username - the user to log in as
     * @param password - the user's password
     */
    static login(username: string, password: string) {
        cy.login(username, password);
        cy.url().should("include", "/dashboard/index");
    }

    /**
    * Logs out the current user through the UI, waits for the login page, then logs in as another user.
    * @param username - the user to log in as
    * @param password - the user's password
    */
    static switchUser(username: string, password: string) {
        cy.logout();
        cy.url().should("include", "/auth/login");
        this.login(username, password);
    }
}