import Express from "express";
import { getJobRoles } from "../services/JobRoleService"

export const getAllJobRoles = async (req: Express.Request, res: Express.Response): Promise<void> => {
    res.render('allJobRolesList.html', {jobRoles: await getJobRoles()});
}