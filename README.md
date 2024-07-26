# nodejs-express-axios-starter

## How to start the application
1. Run `npm install` to install application dependencies
2. Start the application with `npm start` or `npm run dev` to reload the server when changes are made
3. To check that your application is running enter url http://localhost:3000

## How to run the accessibillity tests (pa11y-ci) locally
1. Make sure that in the .pa11yci file, the URLS of the pages you would like to test are included
2. Run `pa11y-ci`in the terminal

## How to run unit tests locally
1. Make sure that your have ran `npm install` to install dependencies
2. Run `npm test` in the terminal

## How to make a new page
1. Create a html file in the views/pages directory
2. Add these nunjucks arround the div you are adding:
    {% extends "siteTemplate.html" %}
    {% block content %}
        //Your Content here
    {% endblock %}
3. Test it to make sure it works

## Backend
1. Follow the steps to run the backend for this application [here](https://github.com/shaunganley/java-dropwizard-flyway-starter")
2. To test the backend you can check out the API [here](https://ivpztrmt3p.eu-west-1.awsapprunner.com/swagger)

