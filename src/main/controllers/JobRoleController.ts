import express from "express";
import { getJobRoleById, getJobRoles } from "../services/JobRoleService"
import { JobRoleSingleResponse } from "../models/JobRoleSingleResponse";

export const getAllJobRoles = async (req: express.Request, res: express.Response): Promise<void> => {
    try{
        res.render('pages/allJobRolesList.html', {jobRoles: await getJobRoles(req.session.token), pageName: "Job Roles", token: req.session.token});
    }catch (e) {
        res.locals.errormessage = e.message;
        res.locals.pageName = "Job Roles";
        res.render("pages/allJobRolesList.html", res);
    }
}

export const getJobRole = async (req: express.Request, res: express.Response): Promise<void> => {
    try{
        const job : JobRoleSingleResponse = await getJobRoleById(req.params.id,req.session.token)
        res.render('pages/singleJobRole.html', {pageName: job.roleName+ ": " + job.band, job: job, token: req.session.token});
    }catch (e) {
        res.locals.errormessage = e.message;
        res.locals.pageName = "An Error Ocured";
        res.render("pages/errorPage.html", res);
    }
}