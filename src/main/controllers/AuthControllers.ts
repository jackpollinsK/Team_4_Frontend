import { LoginRequest } from "../models/LoginRequest";
import { getTokenByloggingIn} from "../services/AuthService";
import express from "express";
import { jwtDecode } from "jwt-decode";

export const getLoginForm = async (req: express.Request, res: express.Response): Promise<void> => {
    res.render('pages/loginPage.html', {pageName: 'Login Page', token: req.session.token});
}

export const postLoginForm  = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const loginRequest: LoginRequest = req.body;
        req.session.token = await getTokenByloggingIn(loginRequest);
        res.redirect('/')
    } catch (e) {
        res.locals.errormessage = e.message;
        res.locals.pageName = "Login Page"
        res.render('pages/loginPage.html', req.body);
    }
}

export const getLogoutForm = async (req: express.Request, res: express.Response): Promise<void> => {
    res.render('pages/logoutPage.html', {pageName: 'Logout Page', token: req.session.token});
}

export const postLogoutForm = async(req: express.Request, res: express.Response): Promise<void> => {
    req.session.token = "";
    res.redirect('/')
}

export const getNotLoggedIn = async (req: express.Request, res: express.Response): Promise<void> => {
    res.render('pages/notLoggedIn.html', {pageName: 'Not Logged In'});
}

export const getNotAuthorised = async (req: express.Request, res: express.Response): Promise<void> => {
    res.render('pages/notAuthorised.html', {pageName: 'Not Authorised', token: req.session.token, userLevel: jwtDecode(req.session.token)});
}