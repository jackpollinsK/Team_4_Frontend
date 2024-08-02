import Express from "express";
import { postJobRoleAplication, processJobRoleAplication } from "../services/ApplicationService";
import { getJobRoleById } from "../services/JobRoleService";
import { JobRoleSingleResponse } from "../models/JobRoleSingleResponse";


export const getApplyJobRolesForm = async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
        const jobRole: JobRoleSingleResponse = await getJobRoleById(req.params.id, req.session.token);
        res.render('pages/applyForJobRole.html', { id: req.params.id, pageName: 'Apply for a Job', token: req.session.token, job: jobRole });
    } catch (e) {
        res.locals.errormessage = e.message
        res.locals.pageName = "An Error Ocured";
        res.render("pages/errorPage.html", res);
    }
}

export const postApplyJobRolesForm = async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
        await postJobRoleAplication(await processJobRoleAplication(req));
        res.redirect('/job-roles');

    } catch (e) {
        res.locals.errormessage = e.message;
        res.render('pages/applyForJobRole.html', { id: req.params.id, pageName: 'Apply for a Job', errormessage: e.message });
    }

}


