import express from "express";
import { jwtDecode } from "jwt-decode";
import { JwtToken, UserRole } from "../models/JwtToken";
import "core-js/stable/atob";

export const allowRoles = (allowedRoles: UserRole[]) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if (!req.session.token || req.session.token == '') {
            res.redirect("/notLoggedIn")
            return res.status(401);
        }

        try {
            const decodedToken: JwtToken = jwtDecode(req.session.token);
            if (!allowedRoles.includes(decodedToken.Role)) {
                res.redirect("/notAuthorised")
                return res.status(403);
            }
            next();
        } catch (error) {
            console.error('Token decoding error:', error.message);
        }
    }
}
