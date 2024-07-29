import Express from "express";
import { getJobRoles } from "../services/JobRoleService"

export const getAllJobRoles = async (req: Express.Request, res: Express.Response): Promise<void> => {
    try{
        res.render('pages/allJobRolesList.html', {jobRoles: await getJobRoles(), pageName: "Job Roles", token: req.session.token});
    }catch (e) {
        res.locals.errormessage = e.message;
        res.locals.pageName = "Job Roles";
        res.render("pages/allJobRolesList.html", res);
    }
}