import { API_ENDPOINTS } from "./constants";

export function interceptEmployees() {
    cy.intercept("GET", API_ENDPOINTS.employees).as("getEmployees");
}

export function waitForEmployees() {
    cy.wait("@getEmployees")
        .its("response.statusCode")
        .should("eq", 200);
}

export function interceptCreateEmployee() {
    cy.intercept("POST", API_ENDPOINTS.createEmployee).as("createEmployee");
}

export function waitForEmployeeCreation(
    onCreated: (employeeId: string) => void,
) {
    cy.wait("@createEmployee").then((interception) => {
        expect(interception.response?.statusCode).to.eq(200);

        const employeeId =
            interception.response?.body?.data?.employeeId;

        expect(employeeId).to.exist;

        onCreated(String(employeeId));
    });
}
export function interceptPersonalDetails() {
    cy.intercept("GET", API_ENDPOINTS.personalDetails).as("getPersonalDetails");
}

export function waitForPersonalDetails() {
    cy.wait("@getPersonalDetails", { timeout: 5000 })
        .its("response.statusCode")
        .should("eq", 200);
}