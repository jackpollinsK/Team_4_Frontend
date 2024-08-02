import express from "express";
import nunjucks from "nunjucks";
import multer from "multer";
import bodyParser from "body-parser";
import session from "express-session";

import { getAllJobRoles, getJobRole } from "./main/controllers/JobRoleController";
import { dateFilter } from "./main/filters/DateFilter";
import { getLoginForm, getLogoutForm, getNotAuthorisedIn, getNotLoggedIn, postLoginForm, postLogoutForm } from "./main/controllers/AuthControllers";
import { getHomePage } from "./main/controllers/HomeController";
import { allowRoles } from "./main/middleware/AuthMiddleware";
import { UserRole } from "./main/models/JwtToken";
import { getApplyJobRolesForm, postApplyJobRolesForm } from "./main/controllers/ApplicationController";

const app = express();

const storage = multer.memoryStorage();
const upload = multer( { storage: storage } )

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

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

app.get('/', getHomePage);

app.get('/loginForm', getLoginForm);
app.post('/loginForm', postLoginForm);
app.get('/logoutForm', getLogoutForm);
app.post('/logoutForm', postLogoutForm);

app.get('/notLoggedIn', getNotLoggedIn);
app.get('/notAuthorised', getNotAuthorisedIn);

app.get('/job-roles', allowRoles([UserRole.Admin, UserRole.User]), getAllJobRoles);

app.get('/job-apply-:id', allowRoles([UserRole.Admin, UserRole.User]), getApplyJobRolesForm);
app.post('/job-apply-:id', upload.single('file'), allowRoles([UserRole.Admin, UserRole.User]), postApplyJobRolesForm);
app.get('/job-roles-:id',allowRoles([UserRole.Admin, UserRole.User]), getJobRole);
