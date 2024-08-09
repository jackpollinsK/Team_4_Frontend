/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const pa11y = require('pa11y');
require('dotenv').config();

const WEBSITE_URL = process.env.WEBSITE_URL || "http://localhost:3000";
const EMAIL1 = process.env.LOGIN_EMAIL_1
const PASSWORD1 = process.env.LOGIN_PASSWORD_1
const EMAIL2 = process.env.LOGIN_EMAIL_2
const PASSWORD2 = process.env.LOGIN_PASSWORD_2

// Define URLs and actions to test
const URLsToTest = [
    {
        url: `${WEBSITE_URL}/`,
        actions: []
    },
    {
        url: `${WEBSITE_URL}/loginForm`,
        actions: []
    },
    {
        url: `${WEBSITE_URL}/logoutForm`,
        actions: []
    },
    {
        url: `${WEBSITE_URL}/notLoggedIn`,
        actions: []
    },
    {
        url: `${WEBSITE_URL}/notAuthorised`,
        actions: [
            `navigate to ${WEBSITE_URL}/loginForm`,
            `set field #email to ${EMAIL2}`,
            `set field #password to ${PASSWORD2}`,
            'click element #submit',
            'wait for path to be /',
            `navigate to ${WEBSITE_URL}/notAuthorised`,
        ]
    },
    {
        url: `${WEBSITE_URL}/AIJobSearch`,
        actions: [
            `navigate to ${WEBSITE_URL}/loginForm`,
            `set field #email to ${EMAIL1}`,
            `set field #password to ${PASSWORD1}`,
            'click element #submit',
            'wait for path to be /',
            `navigate to ${WEBSITE_URL}/AIJobSearch`,
        ]
    },
    {
        url: `${WEBSITE_URL}/jobRoles`,
        actions: [
            `navigate to ${WEBSITE_URL}/loginForm`,
            `set field #email to ${EMAIL2}`,
            `set field #password to ${PASSWORD2}`,
            'click element #submit',
            'wait for path to be /',
            `navigate to ${WEBSITE_URL}/jobRoles`,
        ]
    },
    {
        url: `${WEBSITE_URL}/jobRoles-1`,
        actions: [
            `navigate to ${WEBSITE_URL}/loginForm`,
            `set field #email to ${EMAIL2}`,
            `set field #password to ${PASSWORD2}`,
            'click element #submit',
            'wait for path to be /',
            `navigate to ${WEBSITE_URL}/jobRoles-1`,
        ]
    },
    {
        url: `${WEBSITE_URL}/jobRolesApply-1`,
        actions: [
            `navigate to ${WEBSITE_URL}/loginForm`,
            `set field #email to ${EMAIL1}`,
            `set field #password to ${PASSWORD1}`,
            'click element #submit',
            'wait for path to be /',
            `navigate to ${WEBSITE_URL}/jobRolesApply-1`,
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
