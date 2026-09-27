import { ApiHelpers } from "@cypress/support/helpers/api-helpers";

import { CommonHelpers } from "@cypress/support/helpers/common-helpers";

import { LOCATORS } from "@cypress/support/helpers/constants";

const LABELS = {
    employeeId: "Employee Id",
    dateOfBirth: "Date of Birth",
};
interface EmployeeInfo {
    firstName: string;
    middleName: string;
    lastName: string;
    nationality: string;
    maritalStatus: string;
    dateOfBirth: string;
    gender: string;
}
export class PIMPage {

    /**
     * Gets the employee form
     */
    static getEmployeeForm() {
        return cy.get(LOCATORS.employeeForm);
    }

    /**
     * Gets the hidden file input used for uploads
     */
    static getFileInput() {
        return cy.get(LOCATORS.fileInput);
    }

    /**
     * Types a value into a field inside the employee form
     * @param locator - the field's selector
     * @param value - the text to type
     * @param index - which matching element to use if there is more than one
     */
    static typeInForm(locator: string, value: string, index: number = 0) {
        PIMPage.getEmployeeForm().find(locator).eq(index).type(value);
    }

    /**
     * Types into one of the password fields
     * @param password - the password to type
     * @param index - 0 for password, 1 for confirm password
     */
    static typePassword(password: string, index: number) {
        PIMPage.typeInForm(LOCATORS.passwordInput, password, index);
    }

    /**
     * Clicks a button that contains this text
     * @param text - the button's text
     * @param locator - the selector to search inside, defaults to any button
     */
    static clickButton(text: string, locator: string = LOCATORS.button) {
        cy.contains(locator, text).click();
    }

    /**
     * Clicks the Save button
     * @param locator - the selector to search inside, defaults to any button
     */
    static clickSave(locator: string = LOCATORS.button) {
        PIMPage.clickButton("Save", locator);
    }

    /**
     * Clicks an element with this text inside a given container
     * @param locator - the container's selector
     * @param text - the text to look for and click
     */
    static clickInside(locator: string, text: string) {
        cy.get(locator).contains(text).click();
    }

    /**
     * Clicks one of the action buttons in a table row
     * @param index - 0 for the first action (edit/download), 1 for the second (delete)
     */
    static clickTableAction(index: number) {
        cy.get(LOCATORS.tableActions).find(LOCATORS.button).eq(index).click();
    }

    /**
     * Gets the input that belongs to a label
     * @param label - the field's label text
     */
    static getInput(label: string) {
        return CommonHelpers.getInputGroup(label).find(LOCATORS.input);
    }

    /**
     * Gets the date input that belongs to a label
     * @param label - the field's label text
     */
    static getDateInput(label: string) {
        return CommonHelpers.getInputGroup(label).find(LOCATORS.dateInput);
    }

    /**
     * Gets the radio button with this label text
     * @param label - the radio's label text
     */
    static getRadio(label: string) {
        return cy.contains(LOCATORS.label, label).find(LOCATORS.radioInput);
    }

    /**
     * Checks that an input has a given value
     * @param locator - the input's selector
     * @param value - the expected value
     */
    static checkInputValue(locator: string, value: string) {
        cy.get(locator).should("have.value", value);
    }

    /**
     * Checks the three name fields (first, middle, last)
     * @param firstName - expected first name
     * @param middleName - expected middle name
     * @param lastName - expected last name
     */
    static checkNames(firstName: string, middleName: string, lastName: string) {
        PIMPage.checkInputValue(LOCATORS.firstNameInput, firstName);
        PIMPage.checkInputValue(LOCATORS.middleNameInput, middleName);
        PIMPage.checkInputValue(LOCATORS.lastNameInput, lastName);
    }

    /**
     * Checks that a dropdown shows a given value
     * @param label - the dropdown's label text
     * @param value - the expected value shown
     */
    static checkSelectValue(label: string, value: string) {
        CommonHelpers.getInputGroup(label)
            .find(LOCATORS.selectText)
            .should("contain.text", value);
    }

    /**
     * Opens the PIM page from the side menu
     */
    static goToPIM() {

        ApiHelpers.interceptEmployeeList();
        PIMPage.clickInside(LOCATORS.menuItem, "PIM");
        ApiHelpers.waitForEmployeeList();
    }

    /**
     * Opens the My Info page from the side menu
     */
    static goToMyInfo() {
        PIMPage.clickInside(LOCATORS.menuItem, "My Info");
    }

    /**
     * Clicks the Add button to create a new employee
     */
    static clickAddEmployee() {
        PIMPage.clickInside(LOCATORS.addButton, "Add");
    }

    /**
     * Logs the current user out
     */
    static logout() {
        cy.get(LOCATORS.userDropdown).click();
        cy.contains("Logout").click();
    }

    /**
     * Fills the first, middle and last name fields
     * @param firstName - first name to type
     * @param middleName - middle name to type
     * @param lastName - last name to type
     */
    static fillNames(firstName: string, middleName: string, lastName: string) {
        PIMPage.typeInForm(LOCATORS.firstNameInput, firstName);
        PIMPage.typeInForm(LOCATORS.middleNameInput, middleName);
        PIMPage.typeInForm(LOCATORS.lastNameInput, lastName);
    }

    /**
     * Turns on the login details switch when adding an employee
     */
    static enableLoginDetails() {
        PIMPage.getEmployeeForm().find(LOCATORS.loginSwitch).click();
    }

    /**
     * Types a username into the login details form
     * @param username - the username to type
     */
    static typeUsername(username: string) {
        PIMPage.getEmployeeForm()
            .find(LOCATORS.inputGroup)
            .contains(LOCATORS.label, "Username")
            .parents(LOCATORS.inputGroup)
            .find(LOCATORS.usernameInput)
            .type(username);
    }

    /**
     * Types the same password into both the password and confirm password fields
     * @param password - the password to type
     */
    static typePasswords(password: string) {
        PIMPage.typePassword(password, 0); // password
        PIMPage.typePassword(password, 1); // confirm password
    }

    /**
     * Saves a new employee form and waits for it to be created
     * @param onSaved - called with the new employee id
     */
    static saveNewEmployee(onSaved: (employeeId: string) => void) {
        ApiHelpers.interceptCreateEmployee();

        PIMPage.clickSave();

        cy.get(LOCATORS.errorMessage).should("not.exist");

        ApiHelpers.waitForEmployeeCreation(onSaved);
    }

    /**
     * Checks that the Employee Id was generated and the name fields show the right values
     * @param firstName - expected first name
     * @param middleName - expected middle name
     * @param lastName - expected last name
     */
    static checkNameFieldsFilled(
        firstName: string,
        middleName: string,
        lastName: string,
    ) {
        PIMPage.getInput(LABELS.employeeId).should("not.have.value", "");

        PIMPage.checkNames(firstName, middleName, lastName);
    }

    /**
     * Types the date of birth
     * @param date - the date to type
     */
    static typeDateOfBirth(date: string) {
        PIMPage.getDateInput(LABELS.dateOfBirth).type(date);
    }

    /**
     * Selects the given gender's radio button
     * @param gender - the gender label to select
     */
    static selectGender(gender: string) {
        PIMPage.getRadio(gender).check({ force: true });
    }

    /**
     * Saves the personal details form
     */
    static savePersonalDetails() {
        PIMPage.clickSave(LOCATORS.submitButton);
    }

    /**
   * Checks that the personal details page shows the given employee's data
   * @param employee - the expected employee data
   */
    static checkPersonalDetails(employee: EmployeeInfo) {
        PIMPage.checkNames(
            employee.firstName,
            employee.middleName,
            employee.lastName,
        );

        PIMPage.checkSelectValue("Nationality", employee.nationality);
        PIMPage.checkSelectValue("Marital Status", employee.maritalStatus);

        PIMPage.getDateInput(LABELS.dateOfBirth).should(
            "have.value",
            employee.dateOfBirth,
        );

        PIMPage.getRadio(employee.gender).should("be.checked");
    }

    /**
     * Searches for an employee by their id
     * @param employeeId - the id to search for
     */
    static searchEmployeeById(employeeId: string) {
        ApiHelpers.interceptEmployeeList();

        PIMPage.getInput(LABELS.employeeId).type(String(employeeId));
        PIMPage.clickButton("Search");

        ApiHelpers.waitForEmployeeList();
    }

    /**
     * Searches for an employee by id and opens their record
     * @param employeeId - the id to search for
     */
    static openEmployee(employeeId: string) {
        PIMPage.searchEmployeeById(employeeId);
        PIMPage.clickTableAction(0);
    }

    /**
     * Deletes the employee currently shown in the search results
     */
    static deleteFoundEmployee() {
        PIMPage.clickTableAction(1);
        PIMPage.clickButton("Yes, Delete");

        cy.contains("Successfully Deleted").should("be.visible");
    }

    /**
     * Selects a file from fixtures and uploads it
     * @param fileName - path of the file inside cypress/fixtures
     */
    static uploadFile(fileName: string) {
        PIMPage.getFileInput().selectFile(
            `cypress/fixtures/${fileName}`,
            { force: true },
        );
    }

    /**
     * Opens the attachments panel
     */
    static openAttachments() {
        cy.get(LOCATORS.attachmentButton)
            .find(LOCATORS.addIcon)
            .parent()
            .should("be.visible")
            .click();
    }

    /**
     * Saves the attachment after uploading a file
     */
    static saveAttachment() {
        PIMPage.getFileInput()
            .parents(LOCATORS.form)
            .within(() => {
                PIMPage.clickSave();
            });
    }

    /**
     * Downloads the first attachment in the list
     */
    static downloadAttachment(index: number = 0) {
        PIMPage.clickTableAction(index);
    }

    /**
     * Checks that a downloaded file exists in the downloads folder
     * @param fileName - the file name to look for
     */
    static verifyDownloadedFileExists(fileName: string) {
        const filePath = `${Cypress.config("downloadsFolder")}/${fileName}`;
    }
    /**
 * Fills and saves the personal details section for an employee
 * @param employee - the employee data to fill in
 */
    static fillPersonalDetails(employee: EmployeeInfo) {
        CommonHelpers.selectOption("Nationality", employee.nationality);
        CommonHelpers.selectOption("Marital Status", employee.maritalStatus);
        PIMPage.typeDateOfBirth(employee.dateOfBirth);
        PIMPage.selectGender(employee.gender);
        PIMPage.savePersonalDetails();
    }
}