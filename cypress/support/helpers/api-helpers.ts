import { API_ENDPOINTS } from "@cypress/support/helpers/constants";

enum HTTP_METHODS {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
}

export class ApiHelpers {
    /**
     * Generates a unique alias for an API request
     * @param {string} name - the name of the API request
     */
    static generateAlias(name: string) {
        return `${name}_${Cypress._.uniqueId()}`;
    }

    /**
     * Intercepts (listens to) an API request, meaning it makes Cypress watch a specific request before it happens
     * @param {string} method - the request type, such as GET or POST
     * @param {string} url - the url of the request we want to watch
     * @param {string} alias - a name we give the request so we can refer to it later with wait
     */
    static interceptApi(method: HTTP_METHODS, url: string, alias: string) {
        cy.intercept(method, url).as(alias);
    }

    /**
     * Waits for the request to finish and checks that it returned the expected status code
     * @param {string} alias - the name of the request we intercepted earlier
     * @param {number} [expectedStatus] - the expected status code, default is 200
     */
    static waitForApi(alias: string, expectedStatus: number = 200) {
        return cy.wait(`@${alias}`).then((interception) => {
            expect(interception.response?.statusCode).to.eq(expectedStatus);
            return interception;
        });
    }

    /**
     * Intercepts the request that fetches the list of employees
     */
    static interceptEmployeeList() {
        const alias = this.generateAlias("getEmployees");

        this.interceptApi(HTTP_METHODS.GET, API_ENDPOINTS.employees, alias);
        return alias;
    }

    /**
     * Waits for the fetch employees list request to finish
     */
    static waitForEmployeeList(alias: string) {
        this.waitForApi(alias);
    }

    /**
     * Intercepts the request that creates a new employee
     */
    static interceptCreateEmployee() {
        const alias = this.generateAlias("createEmployee");

        this.interceptApi(HTTP_METHODS.POST, API_ENDPOINTS.createEmployee, alias);
        return alias;
    }

    /**
     * Waits for the create employee request to finish, gets the new employee id from the response, and sends it to you
     * @param {string} alias - the alias of the intercepted request
     * @param {(employeeId: string) => void} onCreated - function you call when the new employee id arrives
     */
    static waitForEmployeeCreation(
        alias: string,
        onCreated: (employeeId: string) => void,
    ) {
        this.waitForApi(alias).then((interception) => {
            const employeeId = interception.response?.body.data.employeeId;

            onCreated(employeeId);
        });
    }
}