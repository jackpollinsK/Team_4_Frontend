/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const pa11y = require('pa11y');

// Define login actions
const loginActions = [
    'navigate to http://localhost:3000/loginForm',
    'set field #email to eoghan@random.com',
    'set field #password to password321',
    'click element #submit',
];

// Define URLs and actions to test
const urlsToTest = [
    {
        url: 'http://localhost:3000/loginForm',
        actions: [
            'set field #email to eoghan@random.com',
            'set field #password to password321',
            'click element #submit',
        ]
    },
    {
        url: 'http://localhost:3000/',
    },
    {
        url: 'http://localhost:3000/jobRoles',
        requiresLogin: true // Mark this URL as requiring login
    },
    // Add more URLs and actions here
];

(async () => {
    for (const test of urlsToTest) {
        try {
            if (test.requiresLogin) {
                // Run login actions before testing this URL
                await pa11y('http://localhost:3000', {
                    actions: loginActions
                });
            }
            
            // Run Pa11y for the URL
            const results = await pa11y(test.url, {
                actions: test.actions || []
            });
            console.log(`Results for ${test.url}:`, results);
        } catch (error) {
            console.error(`Error testing ${test.url}:`, error);
        }
    }
})();
