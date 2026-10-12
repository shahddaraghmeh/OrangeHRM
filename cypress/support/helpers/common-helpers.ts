import { LOCATORS } from "@cypress/support/helpers/constants";
export class CommonHelpers {
    /**
     * Finds the input group (label + field) that contains this text
     * @param {string} text - the label text to search for, e.g. "Nationality"
     * @param {number} index - the index of the input group to select
     */
    static getInputGroup(text: string, index: number = 0) {
        return cy
            .contains(LOCATORS.inputGroup, text)
            .eq(index);
    }

    /**
     * Opens a dropdown by its label and picks an option from it
     * @param {string} label - the dropdown's label, e.g. "Nationality"
     * @param {string} option - the option text to click, e.g. "Palestinian"
     */
    static selectOption(label: string, option: string) {
        CommonHelpers.getInputGroup(label).find(".oxd-select-text").click();
        cy.contains(option).click();
    }

    /**
     * Types a value into the input that belongs to this label
     * @param {string} label - the field's label, e.g. "Employee Id"
     * @param {string} value - the text to type
     */
    static typeInField(label: string, value: string) {
        CommonHelpers.getInputGroup(label).find("input").type(value);
    }
}