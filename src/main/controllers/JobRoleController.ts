import express from "express";
import { deleteJobRoleById, getJobRoleById, getJobRoles } from "../services/JobRoleService"
import { JobRoleSingleResponse } from "../models/JobRoleSingleResponse";
import { jwtDecode } from "jwt-decode";

export const getAllJobRoles = async (req: express.Request, res: express.Response): Promise<void> => {
    try{
        res.render('pages/allJobRolesList.html', {jobRoles: await getJobRoles(req.session.token), pageName: "Job Roles", token: req.session.token, userLevel: jwtDecode(req.session.token)});
    }catch (e) {
        res.locals.errormessage = e.message;
        res.locals.pageName = "An Error Occured";
        res.render("pages/errorPage.html", res);
    }
}

export const getJobRole = async (req: express.Request, res: express.Response): Promise<void> => {
    try{
        const job : JobRoleSingleResponse = await getJobRoleById(req.params.id,req.session.token)
        res.render('pages/singleJobRole.html', {pageName: job.roleName+ ": " + job.band, job: job, token: req.session.token, userLevel: jwtDecode(req.session.token)});
    }catch (e) {
        res.locals.errormessage = e.message;
        res.locals.pageName = "An Error Occured";
        res.render("pages/errorPage.html", res);
    }
}

export const deleteJobRole = async (req: express.Request, res: express.Response): Promise<void> => {
    try{
        await deleteJobRoleById(req.params.id,req.session.token)
        res.redirect('/jobRoles');
    }catch (e) {
        res.locals.errormessage = e.message;
        res.locals.pageName = "An Error Occured";
        res.render("pages/errorPage.html", res);
    }
} 