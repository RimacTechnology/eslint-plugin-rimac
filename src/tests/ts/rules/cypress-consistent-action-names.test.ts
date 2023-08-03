import dedent from 'dedent'

import type { CypressConsistentActionNamesOptionsType } from '../../../rules/cypress-consistent-action-names'
import rule from '../../../rules/cypress-consistent-action-names'
import {
    TS_FILE_PATH,
    tsRuleTester,
} from '../utils'

const options: CypressConsistentActionNamesOptionsType[] = [{
    allowedPrefixes: ['type', 'check', 'click', 'select', 'drag'],
    fileExtension: '.cy.ts',
}]

const settings = {
    isInTest: true,
}

tsRuleTester.run<string, CypressConsistentActionNamesOptionsType[]>(rule.name, rule.value, {
    invalid: [
        {
            code: dedent`
                @TableActions
                export class HardwareComponentListViewPage {
                    public elements

                    constructor() {
                        this.elements = {
                            adas: () => cy.getBySelector('ADAS'),
                            addHardwareComponentButton: () => cy.getBySelector('add-hardware-component-button'),
                        }
                    }

                    public async openCreateNewHardwareComponentDialog(): Cypress.Chainable {
                        return this
                            .elements
                            .newComponentButton()
                            .click()
                    }

                    private async flyAway(): Cypress.Chainable {
                        return this
                            .elements
                            .newComponentButton()
                            .click()
                    }
                }
            `,
            errors: [
                {
                    column: 5,
                    line: 12,
                    messageId: 'default',
                },
            ],
            filename: TS_FILE_PATH,
            options,
            settings,
        }
    ],
    valid: [{
        code: dedent`
            @TableActions
            export class HardwareComponentListViewPage {
                public elements

                constructor() {
                    this.elements = {
                        adas: () => cy.getBySelector('ADAS'),
                        addHardwareComponentButton: () => cy.getBySelector('add-hardware-component-button'),
                    }
                }

                public async clickSomething(): Cypress.Chainable {
                    return this
                        .elements
                        .newComponentButton()
                        .click()
                    }

                private async flyAway(): Cypress.Chainable {
                    return this
                        .elements
                        .newComponentButton()
                        .click()
                }
            }
        `,
        filename: TS_FILE_PATH,
        options,
        settings,
    }],
})
