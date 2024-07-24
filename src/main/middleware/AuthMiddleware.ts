import express from "express";
import { UserRole } from "../models/JwtToken";
import "core-js/stable/atob";

export const allowRoles = (allowedRoles: UserRole[]) => {
    return (req: express.Request, res: express.Response, next: express.NextFunction) => {
        if(!req.session.token){
            return res.status(401).send('Not logged in');
        }

        next();
    }
}