import Express from "express";
import { getJobRoles } from "../services/JobRoleService"

export const getAllJobRoles = async (req: Express.Request, res: Express.Response): Promise<void> => {
    res.render('pages/allJobRolesList.html', {jobRoles: await getJobRoles(), pageName: "Job Roles"});
}