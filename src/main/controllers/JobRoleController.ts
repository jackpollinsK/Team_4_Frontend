import express from "express";
import { deleteJobRoleById, createRole, getJobRoleById, getJobRoles, getBands, getCapabilities, getLocations } from "../services/JobRoleService"
import { JobRoleSingleResponse } from "../models/JobRoleSingleResponse";
import { jwtDecode } from "jwt-decode";
import { JobRoleRequest } from "../models/JobRoleRequest";

export const getAllJobRoles = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        res.render('pages/allJobRolesList.html', { jobRoles: await getJobRoles(req.session.token), pageName: "Job Roles", token: req.session.token, userLevel: jwtDecode(req.session.token) });
    } catch (e) {
        res.locals.errormessage = e.message;
        res.locals.pageName = "An Error Occured";
        res.render("pages/errorPage.html", res);
    }
}

export const getJobRole = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const job: JobRoleSingleResponse = await getJobRoleById(req.params.id, req.session.token)
        res.render('pages/singleJobRole.html', { pageName: job.roleName + ": " + job.band, job: job, token: req.session.token, userLevel: jwtDecode(req.session.token) });
    } catch (e) {
        res.locals.errormessage = e.message;
        res.locals.pageName = "An Error Occured";
        res.render("pages/errorPage.html", res);
    }
}

export const deleteJobRole = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        await deleteJobRoleById(req.params.id, req.session.token)
        res.redirect('/jobRoles');
    } catch (e) {
        res.locals.errormessage = e.message;
        res.locals.pageName = "An Error Occured";
        res.render("pages/errorPage.html", res);
    }
}

export const getRoleForm = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const [bands, locations, capabilities] = await Promise.all([
            getBands(req.session.token),
            getLocations(req.session.token),
            getCapabilities(req.session.token)
        ]);
        const userLevel = jwtDecode(req.session.token);
        res.render('pages/jobRoleForm.html', {
            pageName: "Create New Role",
            bands,
            locations,
            capabilities,
            token: req.session.token,
            userLevel
        });
    } catch (e) {
        res.locals.errormessage = e.message;
        res.locals.pageName = "An Error Occurred";
        res.render('pages/errorPage.html');
    }
}

export const postRoleForm = async (req: express.Request, res: express.Response): Promise<void> => {
    const jobRoleRequest: JobRoleRequest = req.body;

    try {
        const Id =await createRole(jobRoleRequest, req.session.token);
        
        res.redirect(`/jobRoles-${Id}`);
    } catch (e) {
        try {
            const [bands, locations, capabilities] = await Promise.all([
                getBands(req.session.token),
                getLocations(req.session.token),
                getCapabilities(req.session.token)
            ]);

            const errorMessages = e.message === 'Invalid Details'
                ? ['Invalid Details']
                : [e.message];

            res.render('pages/jobRoleForm.html', {
                pageName: "Create New Role",
                bands,
                locations,
                capabilities,
                jobRoleRequest,
                errorMessages
            });
        } catch (innerError) {
            res.locals.errormessage = 'Creation failed';
            res.locals.pageName = "An Error Occurred";
            res.render('pages/errorPage.html');
        }
    }
}


