const LOCATORS = {
    menuItem: "span.oxd-main-menu-item--name",
    addBtn: "button.oxd-button--secondary",
    employeeForm: ".orangehrm-employee-form",
    errorMsg: ".oxd-input-field-error-message",
    inputGroup: ".oxd-input-group",
    userDropdown: ".oxd-userdropdown-tab",
    tableActions: ".oxd-table-cell-actions",
}
export class PIMPage {


    static goToPIM() {
        cy.intercept("GET", "**/web/index.php/api/v2/pim/employees*").as("getEmployees");
        cy.get(LOCATORS.menuItem).contains("PIM").click();
        cy.wait("@getEmployees").its("response.statusCode").should("eq", 200);
    }

    static clickAddEmployee() {
        cy.get(LOCATORS.addBtn).contains("Add").click();
    }
    static fillNames(firstName: string, middleName: string, lastName: string) {
        cy.get(LOCATORS.employeeForm).find('input[name="firstName"]').type(firstName);
        cy.get(LOCATORS.employeeForm).find('input[name="middleName"]').type(middleName);
        cy.get(LOCATORS.employeeForm).find('input[name="lastName"]').type(lastName);
    }
    static enableLoginDetails() {
        cy.get(LOCATORS.employeeForm).find(".oxd-switch-input").click();
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
        cy.get(LOCATORS.employeeForm).find('input[type="password"]').eq(0).type(password);
        cy.get(LOCATORS.employeeForm).find('input[type="password"]').eq(1).type(password);
    }

    static saveNewEmployee(onSaved: (empId: string) => void) {
        cy.intercept("POST", "**/web/index.php/api/v2/pim/employees").as("createEmployee");
        cy.contains("button", "Save").click();
        cy.get(LOCATORS.errorMsg).should("not.exist");

        cy.wait("@createEmployee").then((interception) => {
            expect(interception.response?.statusCode).to.eq(200);
            onSaved(interception.response!.body.data.employeeId);
        });
    }

    static checkNameFieldsFilled(firstName: string, middleName: string, lastName: string) {
        cy.contains("label", "Employee Id").parents(LOCATORS.inputGroup).find("input").should("not.have.value", "");
        cy.get('input[name="firstName"]').should("have.value", firstName);
        cy.get('input[name="middleName"]').should("have.value", middleName);
        cy.get('input[name="lastName"]').should("have.value", lastName);
    }

    static selectNationality(nationality: string) {
        cy.contains("label", "Nationality").parents(LOCATORS.inputGroup).find(".oxd-select-text").click();
        cy.contains(nationality).click();
    }

    static selectMaritalStatus(status: string) {
        cy.contains("label", "Marital Status").parents(LOCATORS.inputGroup).find(".oxd-select-text").click();
        cy.contains(status).click();
    }

    static typeDateOfBirth(date: string) {
        cy.contains("label", "Date of Birth").closest(LOCATORS.inputGroup).find(".oxd-date-input input").type(date);
    }

    static selectGender(gender: string) {
        cy.contains("label", gender).find("input[type='radio']").check({ force: true });
    }

    static savePersonalDetails() {
        cy.contains('button[type="submit"]', "Save").first().click();
    }

    static logout() {
        cy.get(LOCATORS.userDropdown).click();
        cy.contains("Logout").click();
    }

    static goToMyInfo() {
        cy.contains("My Info").click();
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
        cy.get('input[name="firstName"]').should("have.value", employee.firstName);
        cy.get('input[name="middleName"]').should("have.value", employee.middleName);
        cy.get('input[name="lastName"]').should("have.value", employee.lastName);
        cy.contains("label", "Nationality").parents(LOCATORS.inputGroup).find(".oxd-select-text").should("contain.text", employee.nationality);
        cy.contains("label", "Marital Status").parents(LOCATORS.inputGroup).find(".oxd-select-text").should("contain.text", employee.maritalStatus);
        cy.contains("label", "Date of Birth").closest(LOCATORS.inputGroup).find(".oxd-date-input input").should("have.value", employee.dateOfBirth);
        cy.contains("label", employee.gender).find("input[type='radio']").should("be.checked");
    }

    static searchEmployeeById(employeeId: string) {
        cy.contains("label", "Employee Id").parents(LOCATORS.inputGroup).find("input").type(String(employeeId));

        cy.intercept("GET", "**/api/v2/pim/employees*").as("searchResult");
        cy.contains("button", "Search").click();
        cy.wait("@searchResult");
    }

    static deleteFoundEmployee() {
        cy.get(LOCATORS.tableActions).find("button").eq(1).click();
        cy.contains("button", "Yes, Delete").click();
        cy.contains("Successfully Deleted").should("be.visible");
    }
}