import { getTokenByloggingIn} from "../services/AuthService";
import express from "express";

export const getLoginForm = async (req: express.Request, res: express.Response): Promise<void> => {
    res.render('loginForm.html');
}

export const postLoginForm  = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        req.session.token = await getTokenByloggingIn(req.body);
        res.redirect('/loginForm')
    } catch (e) {
        res.locals.errormessage = e.message;
        res.render('loginForm.html', req.body);
    }
}

export const getLogoutForm = async (req: express.Request, res: express.Response): Promise<void> => {
    res.render('logoutForm.html');
}

export const postLogoutForm = async(req: express.Request, res: express.Response): Promise<void> => {

    console.log('Before: '+ req.session.token)
    req.session.token = "";
    console.log('After: '+req.session.token)
    res.redirect('/loginForm')

}