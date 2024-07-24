# nodejs-express-axios-starter

## How to start the application
1. Run `npm install` to install application dependencies
2. Start the application with `npm start` or `npm run dev` to reload the server when changes are made
3. To check that your application is running enter url http://localhost:3000

## Backend
1. Follow the steps to run the backend for this application <a href="https://github.com/shaunganley/java-dropwizard-flyway-starter" target="_blank">here</a>

## How to run the accessibillity tests (pa11y-ci) locally
1. Make sure that in the .pa11yci file, the URLS of the pages you would like to test are included
2. run `pa11y-ci`in the terminal 

## How to add CSS styling to a page
1. Add these two lines of HTML 
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">

    <link href="./css/style.css" rel="stylesheet">
2. Following the bootstrap CSS documentation you can make use of all the features. `bg-primary` and `bg-secondary` current are following kainos colors. Fonts should change automaticly.