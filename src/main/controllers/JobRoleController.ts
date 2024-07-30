import Express from "express";
import { getJobRoleById, getJobRoles } from "../services/JobRoleService"
import { JobRoleSingleResponse } from "../models/JobRoleSingleResponse";

export const getAllJobRoles = async (req: Express.Request, res: Express.Response): Promise<void> => {
    try{
        res.render('pages/allJobRolesList.html', {jobRoles: await getJobRoles(), pageName: "Job Roles"});
    }catch (e) {
        res.locals.errormessage = e.message;
        res.locals.pageName = "Job Roles";
        res.render("pages/allJobRolesList.html", res);
    }
}

export const getJobRole = async (req: Express.Request, res: Express.Response): Promise<void> => {
    try{
        const job : JobRoleSingleResponse = await getJobRoleById(req.params.id)
        res.render('pages/singleJobRole.html', {pageName: job.roleName+ ": " + job.band, job: job});
    }catch (e) {
        res.locals.errormessage = e.message;
        res.locals.pageName = "An Error Ocured";
        res.render("pages/errorPage.html", res);
    }
}