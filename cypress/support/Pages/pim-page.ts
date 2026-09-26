import {
    interceptCreateEmployee,
    interceptEmployees,
    waitForEmployeeCreation,
    waitForEmployees,
} from "@cypress/support/helpers/api-helpers";

import { getInputGroup } from "@cypress/support/helpers/common-helpers";

import { LOCATORS } from "@cypress/support/helpers/constants";


const EMPLOYEE_ID_LABEL = "Employee Id";
const DATE_OF_BIRTH_LABEL = "Date of Birth";

export class PIMPage {

    static getEmployeeForm() {
        return cy.get(LOCATORS.employeeForm);
    }


    static getFileInput() {
        return cy.get(LOCATORS.fileInput);
    }

    static typeInForm(locator: string, value: string, index: number = 0) {
        PIMPage.getEmployeeForm().find(locator).eq(index).type(value);
    }

    static typePassword(password: string, index: number) {
        PIMPage.typeInForm(LOCATORS.passwordInput, password, index);
    }

    static clickButton(text: string, locator: string = LOCATORS.button) {
        cy.contains(locator, text).click();
    }

    static clickSave(locator: string = LOCATORS.button) {
        PIMPage.clickButton("Save", locator);
    }

    static clickInside(locator: string, text: string) {
        cy.get(locator).contains(text).click();
    }

    static clickTableAction(index: number) {
        cy.get(LOCATORS.tableActions).find(LOCATORS.button).eq(index).click();
    }

    static getInput(label: string) {
        return getInputGroup(label).find(LOCATORS.input);
    }


    static getDateInput(label: string) {
        return getInputGroup(label).find(LOCATORS.dateInput);
    }

    static getRadio(label: string) {
        return cy.contains(LOCATORS.label, label).find(LOCATORS.radioInput);
    }

    static checkInputValue(locator: string, value: string) {
        cy.get(locator).should("have.value", value);
    }

    static checkNames(firstName: string, middleName: string, lastName: string) {
        PIMPage.checkInputValue(LOCATORS.firstNameInput, firstName);
        PIMPage.checkInputValue(LOCATORS.middleNameInput, middleName);
        PIMPage.checkInputValue(LOCATORS.lastNameInput, lastName);
    }

    static checkSelectValue(label: string, value: string) {
        getInputGroup(label)
            .find(LOCATORS.selectText)
            .should("contain.text", value);
    }


    static goToPIM() {
        interceptEmployees();
        PIMPage.clickInside(LOCATORS.menuItem, "PIM");
        waitForEmployees();
    }

    static goToMyInfo() {
        PIMPage.clickInside(LOCATORS.menuItem, "My Info");
    }

    static clickAddEmployee() {
        PIMPage.clickInside(LOCATORS.addButton, "Add");
    }

    static logout() {
        cy.get(LOCATORS.userDropdown).click();
        cy.contains("Logout").click();
    }


    static fillNames(firstName: string, middleName: string, lastName: string) {
        PIMPage.typeInForm(LOCATORS.firstNameInput, firstName);
        PIMPage.typeInForm(LOCATORS.middleNameInput, middleName);
        PIMPage.typeInForm(LOCATORS.lastNameInput, lastName);
    }

    static enableLoginDetails() {
        PIMPage.getEmployeeForm().find(LOCATORS.loginSwitch).click();
    }

    static typeUsername(username: string) {
        PIMPage.getEmployeeForm()
            .find(LOCATORS.inputGroup)
            .contains(LOCATORS.label, "Username")
            .parents(LOCATORS.inputGroup)
            .find(LOCATORS.usernameInput)
            .type(username);
    }

    static typePasswords(password: string) {
        PIMPage.typePassword(password, 0); // password
        PIMPage.typePassword(password, 1); // confirm password
    }

    static saveNewEmployee(onSaved: (employeeId: string) => void) {
        interceptCreateEmployee();

        PIMPage.clickSave();

        cy.get(LOCATORS.errorMessage).should("not.exist");

        waitForEmployeeCreation(onSaved);
    }

    static checkNameFieldsFilled(
        firstName: string,
        middleName: string,
        lastName: string,
    ) {
        PIMPage.getInput(EMPLOYEE_ID_LABEL).should("not.have.value", "");

        PIMPage.checkNames(firstName, middleName, lastName);
    }



    static typeDateOfBirth(date: string) {
        PIMPage.getDateInput(DATE_OF_BIRTH_LABEL).type(date);
    }

    static selectGender(gender: string) {
        PIMPage.getRadio(gender).check({ force: true });
    }

    static savePersonalDetails() {
        PIMPage.clickSave(LOCATORS.submitButton);
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
        PIMPage.checkNames(
            employee.firstName,
            employee.middleName,
            employee.lastName,
        );

        PIMPage.checkSelectValue("Nationality", employee.nationality);
        PIMPage.checkSelectValue("Marital Status", employee.maritalStatus);

        PIMPage.getDateInput(DATE_OF_BIRTH_LABEL).should(
            "have.value",
            employee.dateOfBirth,
        );

        PIMPage.getRadio(employee.gender).should("be.checked");
    }

    static searchEmployeeById(employeeId: string) {
        interceptEmployees();

        PIMPage.getInput(EMPLOYEE_ID_LABEL).type(String(employeeId));
        PIMPage.clickButton("Search");

        waitForEmployees();
    }

    static openEmployee(employeeId: string) {
        PIMPage.searchEmployeeById(employeeId);
        PIMPage.clickTableAction(0);
    }

    static deleteFoundEmployee() {
        PIMPage.clickTableAction(1);
        PIMPage.clickButton("Yes, Delete");

        cy.contains("Successfully Deleted").should("be.visible");
    }

    static uploadFile(fileName: string) {
        PIMPage.getFileInput().selectFile(
            `cypress/fixtures/${fileName}`,
            { force: true },
        );
    }

    static openAttachments() {
        cy.get(LOCATORS.attachmentButton)
            .find(LOCATORS.addIcon)
            .parent()
            .should("be.visible")
            .click();
    }

    static saveAttachment() {
        PIMPage.getFileInput()
            .parents(LOCATORS.form)
            .within(() => {
                PIMPage.clickSave();
            });
    }

    static downloadAttachment() {
        PIMPage.clickTableAction(0);
    }

    static validateDownloadedFile(fileName: string) {
        const filePath = `${Cypress.config("downloadsFolder")}/${fileName}`;


    }
}