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
};

export const API_ENDPOINTS = {
    employees: "**/api/v2/pim/employees*",
    createEmployee: "**/api/v2/pim/employees",
    personalDetails: "**/api/v2/pim/employees/*/personal-details",
};