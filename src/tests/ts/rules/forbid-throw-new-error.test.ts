import dedent from 'dedent'

import rule from '../../../rules/forbid-throw-new-error'
import {
    TS_FILE_PATH,
    tsRuleTester,
} from '../utils'

tsRuleTester.run(rule.name, rule.value, {
    invalid: [
        {
            code: dedent`throw new Error("Something failed");`,
            errors: [
                {
                    column: 11,
                    line: 1,
                    messageId: 'default',
                },
            ],
            filename: TS_FILE_PATH,
        },
    ],
    valid: [{
        code: dedent`throw new CustomError("Something failed");`,
        filename: TS_FILE_PATH,
    }],
})
