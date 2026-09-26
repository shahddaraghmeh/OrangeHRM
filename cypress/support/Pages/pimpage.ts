import {
    interceptCreateEmployee,
    interceptEmployees,
    waitForEmployeeCreation,
    waitForEmployees,

} from "@cypress/support/helpers/api-helpers";

import {
    getInputGroup,
    selectOption,
} from "@cypress/support/helpers/common-helpers";

import { LOCATORS } from "@cypress/support/helpers/constants";

export class PIMPage {
    static goToPIM() {
        interceptEmployees();

        cy.get(LOCATORS.menuItem)
            .contains("PIM")
            .click();

        waitForEmployees();
    }

    static clickAddEmployee() {
        cy.get(LOCATORS.addButton)
            .contains("Add")
            .click();
    }

    static goToMyInfo() {
        cy.contains("My Info").click();
    }

    static logout() {
        cy.get(LOCATORS.userDropdown).click();
        cy.contains("Logout").click();
    }

    static fillNames(
        firstName: string,
        middleName: string,
        lastName: string,
    ) {
        cy.get(LOCATORS.employeeForm)
            .find('input[name="firstName"]')
            .type(firstName);

        cy.get(LOCATORS.employeeForm)
            .find('input[name="middleName"]')
            .type(middleName);

        cy.get(LOCATORS.employeeForm)
            .find('input[name="lastName"]')
            .type(lastName);
    }

    static enableLoginDetails() {
        cy.get(LOCATORS.employeeForm)
            .find(".oxd-switch-input")
            .click();
    }

    static typeUsername(username: string) {
        cy.get(LOCATORS.employeeForm)
            .find(LOCATORS.inputGroup)
            .contains("label", "Username")
            .parents(LOCATORS.inputGroup)
            .find('input[autocomplete="off"]')
            .type(username);
    }

    static typePasswords(password: string) {
        cy.get(LOCATORS.employeeForm)
            .find('input[type="password"]')
            .eq(0)
            .type(password);

        cy.get(LOCATORS.employeeForm)
            .find('input[type="password"]')
            .eq(1)
            .type(password);
    }

    static saveNewEmployee(
        onSaved: (employeeId: string) => void,
    ) {
        interceptCreateEmployee();

        cy.contains("button", "Save").click();

        cy.get(LOCATORS.errorMessage)
            .should("not.exist");

        waitForEmployeeCreation(onSaved);
    }
    static checkNameFieldsFilled(
        firstName: string,
        middleName: string,
        lastName: string,
    ) {
        getInputGroup("Employee Id")
            .find("input")
            .should("not.have.value", "");

        cy.get('input[name="firstName"]')
            .should("have.value", firstName);

        cy.get('input[name="middleName"]')
            .should("have.value", middleName);

        cy.get('input[name="lastName"]')
            .should("have.value", lastName);
    }

    static selectNationality(nationality: string) {
        selectOption("Nationality", nationality);
    }

    static selectMaritalStatus(status: string) {
        selectOption("Marital Status", status);
    }

    static typeDateOfBirth(date: string) {
        getInputGroup("Date of Birth")
            .find(".oxd-date-input input")
            .type(date);
    }

    static selectGender(gender: string) {
        cy.contains("label", gender)
            .find("input[type='radio']")
            .check({ force: true });
    }

    static savePersonalDetails() {
        cy.contains('button[type="submit"]', "Save")
            .first()
            .click();
    }

    static checkPersonalDetails(employee: {
        firstName: string;
        middleName: string;
        lastName: string;
        nationality: string;
        maritalStatus: string;
        dateOfBirth: string;
        gender: string;
    }) {
        cy.get('input[name="firstName"]')
            .should("have.value", employee.firstName);

        cy.get('input[name="middleName"]')
            .should("have.value", employee.middleName);

        cy.get('input[name="lastName"]')
            .should("have.value", employee.lastName);

        getInputGroup("Nationality")
            .find(".oxd-select-text")
            .should(
                "contain.text",
                employee.nationality,
            );

        getInputGroup("Marital Status")
            .find(".oxd-select-text")
            .should(
                "contain.text",
                employee.maritalStatus,
            );

        getInputGroup("Date of Birth")
            .find(".oxd-date-input input")
            .should(
                "have.value",
                employee.dateOfBirth,
            );

        cy.contains("label", employee.gender)
            .find("input[type='radio']")
            .should("be.checked");
    }

    static searchEmployeeById(employeeId: string) {
        getInputGroup("Employee Id")
            .find("input")
            .type(String(employeeId));

        cy.intercept(
            "GET",
            "**/api/v2/pim/employees*",
        ).as("searchResult");

        cy.contains("button", "Search").click();

        cy.wait("@searchResult");
    }

    static openEmployee(employeeId: string) {
        PIMPage.searchEmployeeById(employeeId);

        cy.get(LOCATORS.tableActions)
            .find("button")
            .first()
            .click();
    }

    static deleteFoundEmployee() {
        cy.get(LOCATORS.tableActions)
            .find("button")
            .eq(1)
            .click();

        cy.contains("button", "Yes, Delete")
            .click();

        cy.contains("Successfully Deleted")
            .should("be.visible");
    }

    static uploadProfilePicture(fileName: string) {
        cy.get(LOCATORS.fileInput)
            .selectFile(
                `cypress/fixtures/${fileName}`,
                { force: true },
            );
    }

    static openAttachments() {
        cy.get(LOCATORS.attachmentButton)
            .find("i.bi-plus")
            .parent()
            .should("be.visible")
            .click();
    }

    static uploadAttachment(fileName: string) {
        cy.get(LOCATORS.fileInput)
            .selectFile(`cypress/fixtures/${fileName}`, { force: true });
    }

    static saveAttachment() {
        cy.get(LOCATORS.fileInput)
            .parents("form")
            .within(() => {
                cy.contains("button", "Save").click();
            });
    }

    static downloadAttachment() {
        cy.get(LOCATORS.tableActions)
            .find("button")
            .first()
            .click();
    }

    static validateDownloadedFile(fileName: string) {
        const filePath =
            `${Cypress.config("downloadsFolder")}/${fileName}`;


    }
}