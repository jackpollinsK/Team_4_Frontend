import express from "express";
import nunjucks from "nunjucks";
import bodyParser from "body-parser";
import session from "express-session";

import { getAllJobRoles } from "./controllers/JobRoleController";
import { dateFilter } from "./filters/DateFilter";
import { getHomePage } from "./controllers/HomeController";

const app = express();

nunjucks.configure('views/', {
    autoescape: false,
    express: app
});

const env = nunjucks.configure('views',{
  autoescape: true,
  express: app
});

env.addFilter('date', dateFilter);
app.use(express.static('public'));
app.set('view engine', 'html')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(session({ secret: 'SUPER_SECRET', cookie: { maxAge: 28800000 }}));

declare module "express-session" {
  interface SessionData {
    token: string;
  }
}

app.get('/', getHomePage);
app.get('/job-roles', getAllJobRoles);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});