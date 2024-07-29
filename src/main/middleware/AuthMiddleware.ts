import express from "express";
import { jwtDecode } from "jwt-decode";
import { JwtToken, UserRole } from "../models/JwtToken";
import "core-js/stable/atob";

export const allowRoles = (allowedRoles: UserRole[]) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if(!req.session.token){
            res.redirect("/notLoggedOn")
            return res.status(401);
        }

        const decodedToken: JwtToken = jwtDecode(req.session.token);
        if(!allowedRoles.includes(decodedToken.Role)){
            res.redirect("/notAuthorised")
            return res.status(403);
        }

        next();
    }
}