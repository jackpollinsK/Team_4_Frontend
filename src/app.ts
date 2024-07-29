import express from "express";
import nunjucks from "nunjucks";
import bodyParser from "body-parser";
import session from "express-session";

import { getAllJobRoles, getJobRole } from "./main/controllers/JobRoleController";
import { dateFilter } from "./main/filters/DateFilter";
import { getLoginForm, getLogoutForm, postLoginForm, postLogoutForm } from "./main/controllers/AuthControllers";
import { getHomePage } from "./main/controllers/HomeController";
import { getJobRoleById } from "./main/services/JobRoleService";

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
app.get('job-roles-:id', getJobRole)


app.get('/loginForm', getLoginForm);
app.post('/loginForm', postLoginForm);
app.get('/logoutForm', getLogoutForm);
app.post('/logoutForm', postLogoutForm);

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
