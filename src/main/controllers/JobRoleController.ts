import Express from "express";
import { getJobRoleById, getJobRoles } from "../services/JobRoleService"
import { JobRoleResponse } from "../models/JobRoleResponse";

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
        const jobRole: JobRoleResponse = await getJobRoleById(req.params.id);
        res.render('pages/allJobRolesList.html', {jobRole});
    }catch (e) {
        res.locals.errormessage = e.message;
        res.locals.pageName = "Job Roles";
        res.render("pages/allJobRolesList.html", res);
    }
}