import { getToken} from "../services/AuthService";
import express from "express";

export const getLoginForm = async (req: express.Request, res: express.Response): Promise<void> => {
    res.render('loginForm.html');
}

export const postLoginForm  = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        req.session.token = await getToken(req.body);
        res.redirect('/loginForm')
    } catch (e) {
        res.locals.errormessage = e.message;
        res.render('loginForm.html', req.body);
    }
}