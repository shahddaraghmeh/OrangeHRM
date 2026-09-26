import { API_ENDPOINTS } from "@cypress/support/helpers/constants";

const ALIASES = {
    employees: "getEmployees",
    createEmployee: "createEmployee",
};

/**
 * Intercepts (listens to) an API request, meaning it makes Cypress watch a specific request before it happens
 * @param {string} method - the request type, such as GET or POST
 * @param {string} url - the url of the request we want to watch
 * @param {string} alias - a name we give the request so we can refer to it later with wait
 */
export function interceptApi(method: string, url: string, alias: string) {
    cy.intercept(method, url).as(alias);
}

/**
 * Waits for the request to finish and checks that it returned the expected status code
 * @param {string} alias - the name of the request we intercepted earlier
 * @param {number} [expectedStatus] - the expected status code, default is 200
 */
export function waitForApi(alias: string, expectedStatus: number = 200) {
    return cy.wait(`@${alias}`).then((interception) => {
        expect(interception.response?.statusCode).to.eq(expectedStatus);
        return interception;
    });
}

/**
 * Intercepts the request that fetches the list of employees
 */
export function interceptEmployees() {
    interceptApi("GET", API_ENDPOINTS.employees, ALIASES.employees);
}

/**
 * Waits for the fetch employees list request to finish
 */
export function waitForEmployees() {
    waitForApi(ALIASES.employees);
}

/**
 * Intercepts the request that creates a new employee
 */
export function interceptCreateEmployee() {
    interceptApi("POST", API_ENDPOINTS.createEmployee, ALIASES.createEmployee);
}

/**
 * Waits for the create employee request to finish, gets the new employee id from the response, and sends it to you
 * @param {(employeeId: string) => void} onCreated - function you call when the new employee id arrives
 */
export function waitForEmployeeCreation(
    onCreated: (employeeId: string) => void,
) {
    waitForApi(ALIASES.createEmployee).then((interception) => {
        const employeeId = interception.response?.body.data.employeeId;

        onCreated(employeeId);
    });
}