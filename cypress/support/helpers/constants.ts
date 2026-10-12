export const LOCATORS = {
    menuItem: "span.oxd-main-menu-item--name",
    addButton: "button.oxd-button--secondary",
    employeeForm: ".orangehrm-employee-form",
    errorMessage: ".oxd-input-field-error-message",
    inputGroup: ".oxd-input-group",
    userDropdown: ".oxd-userdropdown-tab",
    tableActions: ".oxd-table-cell-actions",
    fileInput: 'input[type="file"]',
    attachmentButton: "button.oxd-button.oxd-button--text",
    firstNameInput: 'input[name="firstName"]',
    middleNameInput: 'input[name="middleName"]',
    lastNameInput: 'input[name="lastName"]',

    loginSwitch: ".oxd-switch-input",
    usernameInput: 'input[autocomplete="off"]',
    passwordInput: 'input[type="password"]',
    input: "input",
    label: "label",
    form: "form",
    button: "button",
    submitButton: 'button[type="submit"]',
    radioInput: "input[type='radio']",
    dateInput: ".oxd-date-input input",
    selectText: ".oxd-select-text",
    addIcon: "i.bi-plus",

    usernameField: 'input[name="username"]',
    passwordField: 'input[name="password"]',
    logoutLink: 'a[href="/web/index.php/auth/logout"]',
};

export const API_ENDPOINTS = {
    employees: "**/api/v2/pim/employees*",
    createEmployee: "**/api/v2/pim/employees",
    personalDetails: "**/api/v2/pim/employees/*/personal-details",
};