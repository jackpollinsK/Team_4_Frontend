import { LoginRequest } from "../models/LoginRequest";
import { getTokenByloggingIn} from "../services/AuthService";
import express from "express";

export const getLoginForm = async (req: express.Request, res: express.Response): Promise<void> => {
    res.render('pages/loginPage.html', {pageName: 'Login page'});
}

export const postLoginForm  = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const loginResquest4: LoginRequest = {
            email: "adam@random.com",
            password: "pass123"
          }
        console.log(loginResquest4);
        const loginRequest: LoginRequest = req.body;
        console.log(req.body);
        req.session.token = await getTokenByloggingIn(loginRequest);
        console.log(req.session.token);
        res.redirect('/logoutForm')
    } catch (e) {
        console.log(e.message);
        res.locals.errormessage = e.message;
        res.render('pages/loginPage.html', {pageName: 'Login page'}, req.body);
    }
}

export const getLogoutForm = async (req: express.Request, res: express.Response): Promise<void> => {
    res.render('pages/logoutPage.html', {pageName: 'Logout page'});
}

export const postLogoutForm = async(req: express.Request, res: express.Response): Promise<void> => {

    console.log('Before: '+ req.session.token)
    req.session.token = "";
    console.log('After: '+req.session.token)
    res.redirect('/loginForm')

}