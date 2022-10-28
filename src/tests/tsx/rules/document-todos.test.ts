/* eslint-disable sort-keys-fix/sort-keys-fix */

import dedent from 'dedent'

import rule from '../../../rules/document-todos'
import {
    jsxRuleTester,
    TSX_FILE_PATH,
} from '../utils'

type OptionType = Record<string, string>

const options: OptionType[] = [{
    url: 'https://rimac-automobili.atlassian.net/',
}]

jsxRuleTester.run<string, Record<string, string>[]>(rule.name, rule.value, {
    invalid: [
        {
            code: dedent`
                //todo something is wrong
                const hello = 1
            `,
            options,
            filename: TSX_FILE_PATH,
            errors: [
                {
                    line: 1,
                    messageId: 'default',
                },
            ],
        },
        {
            code: dedent`
                // todo something is wrong
                const hello = 1
            `,
            options,
            filename: TSX_FILE_PATH,
            errors: [
                {
                    line: 1,
                    messageId: 'default',
                },
            ],
        },
        {
            code: dedent`
                // todo: something is wrong
                const hello = 1
            `,
            options,
            filename: TSX_FILE_PATH,
            errors: [
                {
                    line: 1,
                    messageId: 'default',
                },
            ],
        },
        {
            code: dedent`
                // FIXME: I'm not documented
                const Component = () => {
                    return (
                        <div 
                            props={true}
                            style={{ height: '50px' }}
                        >
                            <p>Hello</p>
                        </div>
                    )
                }
            `,
            filename: TSX_FILE_PATH,
            options,
            errors: [
                {
                    line: 1,
                    messageId: 'default',
                },
            ],
        },
        {
            code: dedent`
                const Component = () => {
                    return (
                        <div 
                            props={true}
                            // TODO: I'm not documented
                            style={{ height: '50px' }}
                        >
                            <p>Hello</p>
                        </div>
                    )
                }
            `,
            filename: TSX_FILE_PATH,
            options,
            errors: [
                {
                    line: 5,
                    messageId: 'default',
                },
            ],
        },
        {
            code: dedent`
                const Component = () => {
                    return (
                        <div 
                            props={true}
                            style={{ height: '50px' }}
                        >
                            {/* TODO: I'm not documented */}
                            <p>Hello</p>
                        </div>
                    )
                }
            `,
            filename: TSX_FILE_PATH,
            options,
            errors: [
                {
                    line: 7,
                    messageId: 'default',
                },
            ],
        },
        {
            code: dedent`
                const Component = () => {
                    /**
                     * What is happening
                     * TODO: Where is the link
                     */
                    return (
                        <div 
                            props={true}
                            style={{ height: '50px' }}
                        >
                            <p>Hello</p>
                        </div>
                    )
                }
            `,
            filename: TSX_FILE_PATH,
            options,
            errors: [
                {
                    line: 2,
                    messageId: 'default',
                },
            ],
        },
        {
            code: dedent`
                // TODO: another one
                const Component = () => {
                    /**
                     * What is happening
                     * TODO: Where is the link
                     */
                    return (
                        <div 
                            props={true}
                            // TODO: and another one
                            style={{ height: '50px' }}
                        >
                            {/* TODO: last one */}
                            <p>Hello</p>
                        </div>
                    )
                }
            `,
            filename: TSX_FILE_PATH,
            options,
            errors: [
                {
                    line: 1,
                    messageId: 'default',
                },
                {
                    line: 3,
                    messageId: 'default',
                },
                {
                    line: 10,
                    messageId: 'default',
                },
                {
                    line: 13,
                    messageId: 'default',
                },
            ],
        },
    ],
    valid: [
        {
            code: '// some random comment that contains todo and fixme:',
            filename: TSX_FILE_PATH,
            options,
        },
        {
            code: dedent`
                const Component = () => {
                    return (
                        <div 
                            props={true}
                            style={{ height: '50px' }}
                        >
                            <p>Hello</p>
                        </div>
                    )
                }
            `,
            options,
            filename: TSX_FILE_PATH,
        },
        {
            code: dedent`
                // Just a plain old comment
                const Component = () => {
                    /**
                     * What is happening
                     * Who am I?
                     */
                    return 1
                }
            `,
            options,
            filename: TSX_FILE_PATH,
        },
        {
            code: dedent`
                // TODO: something is wrong https://rimac-automobili.atlassian.net/jira/software/c/projects/QIA/5887
                const Component = 1
            `,
            options,
            filename: TSX_FILE_PATH,
        },
        {
            code: dedent`
                const Component = () => {
                    return (
                        <div 
                            props={true}
                            // FIXME: something is wrong https://rimac-automobili.atlassian.net/jira/QIA/5887
                            style={{ height: '50px' }}
                        >
                            <p>Hello</p>
                        </div>
                    )
                }
            `,
            options,
            filename: TSX_FILE_PATH,
        },
        {
            code: dedent`
                const Component = () => {
                    return (
                        <div 
                            props={true}
                            style={{ height: '50px' }}
                        >
                            {/* FIXME: something is wrong https://rimac-automobili.atlassian.net/jira/QIA/5887j */}
                            <p>Hello</p>
                        </div>
                    )
                }
            `,
            options,
            filename: TSX_FILE_PATH,
        },
        {
            code: dedent`
                const Component = () => {
                    /**
                     * What is happening
                     *  TODO: something is wrong https://rimac-automobili.atlassian.net/jira/QIA/5887j 
                     */
                    const hello = 1
                }
            `,
            options,
            filename: TSX_FILE_PATH,
        },
        {
            code: dedent`
                // todo: something is wrong https://rimac-automobili.atlassian.net/jira/QIA/5887j'
                const hello = 1
            `,
            options,
            filename: TSX_FILE_PATH,
        },
        {
            code: dedent`
                //todo something is wrong https://rimac-automobili.atlassian.net/jira/QIA/5887j'
                const hello = 1
            `,
            options,
            filename: TSX_FILE_PATH,
        },
    ],
})
