import { LOCATORS } from "@cypress/support/helpers/constants";

export function getInputGroup(text: string) {
    return cy
        .contains(LOCATORS.inputGroup, text)
        .first();
}

export function selectOption(label: string, option: string) {
    getInputGroup(label).find(".oxd-select-text").click();
    cy.contains(option).click();
}

export function typeInField(label: string, value: string) {
    getInputGroup(label).find("input").type(value);
}