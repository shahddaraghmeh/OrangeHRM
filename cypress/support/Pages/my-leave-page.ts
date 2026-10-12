const LOCATORS = {
    pageUrl: "/web/index.php/leave/viewMyLeaveList",
    tableBody: ".oxd-table-body",
};

export class MyLeavePage {

    /**
     * Opens the My Leave page
     */
    static visit() {
        cy.visit(LOCATORS.pageUrl);
    }

    /**
     * Checks that the records table contains a leave with the given status
     * @param status - the expected status text, e.g. "Scheduled"
     */
    static checkLeaveStatus(status: string) {
        cy.get(LOCATORS.tableBody).should("contain.text", status);
    }
}