/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const pa11y = require('pa11y');
require('dotenv').config();

const EMAIL1 = process.env.LOGIN_EMAIL_1
const PASSWORD1 = process.env.LOGIN_PASSWORD_1
const EMAIL2 = process.env.LOGIN_EMAIL_2
const PASSWORD2 = process.env.LOGIN_PASSWORD_2

// Define URLs and actions to test
const URLsToTest = [
    {
        url: 'https://nczcbkjcc7.eu-west-1.awsapprunner.com/',
        actions: []
    },
    {
        url: 'https://nczcbkjcc7.eu-west-1.awsapprunner.com/loginForm',
        actions: []
    },
    {
        url: 'https://nczcbkjcc7.eu-west-1.awsapprunner.com/logoutForm',
        actions: []
    },
    {
        url: 'https://nczcbkjcc7.eu-west-1.awsapprunner.com/notLoggedIn',
        actions: []
    },
    {
        url: 'https://nczcbkjcc7.eu-west-1.awsapprunner.com/notAuthorised',
        actions: [
            'navigate to https://nczcbkjcc7.eu-west-1.awsapprunner.com/loginForm',
            `set field #email to ${EMAIL2}`,
            `set field #password to ${PASSWORD2}`,
            'click element #submit',
            'wait for path to be /',
            'navigate to https://nczcbkjcc7.eu-west-1.awsapprunner.com/notAuthorised',
        ]
    },
    {
        url: 'https://nczcbkjcc7.eu-west-1.awsapprunner.com/AIJobSearch',
        actions: [
            'navigate to https://nczcbkjcc7.eu-west-1.awsapprunner.com/loginForm',
            `set field #email to ${EMAIL1}`,
            `set field #password to ${PASSWORD1}`,
            'click element #submit',
            'wait for path to be /',
            'navigate to https://nczcbkjcc7.eu-west-1.awsapprunner.com/AIJobSearch',
        ]
    },
    {
        url: 'https://nczcbkjcc7.eu-west-1.awsapprunner.com/jobRoles',
        actions: [
            'navigate to https://nczcbkjcc7.eu-west-1.awsapprunner.com/loginForm',
            `set field #email to ${EMAIL2}`,
            `set field #password to ${PASSWORD2}`,
            'click element #submit',
            'wait for path to be /',
            'navigate to https://nczcbkjcc7.eu-west-1.awsapprunner.com/jobRoles',
        ]
    },
    {
        url: 'https://nczcbkjcc7.eu-west-1.awsapprunner.com/jobRoles-1',
        actions: [
            'navigate to https://nczcbkjcc7.eu-west-1.awsapprunner.com/loginForm',
            `set field #email to ${EMAIL2}`,
            `set field #password to ${PASSWORD2}`,
            'click element #submit',
            'wait for path to be /',
            'navigate to https://nczcbkjcc7.eu-west-1.awsapprunner.com/jobRoles-1',
        ]
    },
    {
        url: 'https://nczcbkjcc7.eu-west-1.awsapprunner.com/jobRolesApply-1',
        actions: [
            'navigate to https://nczcbkjcc7.eu-west-1.awsapprunner.com/loginForm',
            `set field #email to ${EMAIL1}`,
            `set field #password to ${PASSWORD1}`,
            'click element #submit',
            'wait for path to be /',
            'navigate to https://nczcbkjcc7.eu-west-1.awsapprunner.com/jobRolesApply-1',
        ]
    },
];

(async () => {
    for (const test of URLsToTest) {
        try { 
            // Run Pa11y for the URL with Puppeteer options including --no-sandbox
            const results = await pa11y(test.url, {
                actions: test.actions || [],
                // Include the Puppeteer options
                puppeteer: {
                    args: ['--no-sandbox', '--disable-setuid-sandbox']
                }
            });

            // Log results
            if (results.issues.length === 0) {
                console.log(`No accessibility issues found for ${test.url}`);
            } else {
                console.log(`Accessibility issues for ${test.url}:`);
                results.issues.forEach(issue => {
                    console.log(`- ${issue.message} (Context: ${issue.context})`);
                });
            }

        } catch (error) {
            console.error(`Error testing ${test.url}:`, error);
        }
    }
})();
