import express from "express";
import { createRole, getJobRoleById, getJobRoles, getBands, getCapabilities, getLocations} from "../services/JobRoleService"
import { JobRoleSingleResponse } from "../models/JobRoleSingleResponse";
import { jwtDecode } from "jwt-decode";
import { Band } from "../models/Band";
import { Capability } from "../models/Capability";
import { Location } from "../models/Location";
import { JobRoleRequest } from "../models/JobRoleRequest";

export const getAllJobRoles = async (req: express.Request, res: express.Response): Promise<void> => {
    try{
        res.render('pages/allJobRolesList.html', {jobRoles: await getJobRoles(req.session.token), pageName: "Job Roles", token: req.session.token, userLevel: jwtDecode(req.session.token)});
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

export const getRoleForm = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const locations: Location[] = await getLocations(req.session.token);
        const capabilities: Capability[] = await getCapabilities(req.session.token);
        const bands: Band[] = await getBands(req.session.token);

        res.render('pages/jobRoleForm.html', {pageName : "Create New Role",
            capabilities: capabilities,
            locations: locations,
            bands: bands,
            roleName: "",
            description: "",
            responsibilities: "",
            jobSpec: "",
            closingDate: "",
            selectedLocation: "",
            selectedBand: "",
            selectedCapability: "",
            token: req.session.token
        });
    } catch (e) {
        res.locals.errormessage = e.message;
        res.locals.pageName = "An Error Ocured";
        res.render('pages/errorPage.html', res);
    }
}

export const postRoleForm = async (req: express.Request, res: express.Response): Promise<void> => {
    try {
        const errors: string[] = [];
        if (!req.body.roleName) errors.push('Role Name is required.');
        if (!req.body.closingDate) errors.push('Closing Date is required.');
        if (!req.body.description) errors.push('Description is required.');
        if (!req.body.responsibilities) errors.push('Responsibilities are required.');
        if (!req.body.jobSpec) errors.push('Job Spec is required.');

        if (errors.length > 0) {
            try {
                const locations: Location[] = await getLocations(req.session.token);
                const capabilities: Capability[] = await getCapabilities(req.session.token);
                const bands: Band[] = await getBands(req.session.token);

                res.render('pages/jobRoleForm.html', {
                    capabilities: capabilities,
                    locations: locations,
                    bands: bands,
                    roleName: req.body.roleName,
                    description: req.body.description,
                    responsibilities: req.body.responsibilities,
                    jobSpec: req.body.jobSpec,
                    closingDate: req.body.closingDate,
                    selectedLocation: req.body.location,
                    selectedBand: req.body.band,
                    selectedCapability: req.body.capability,
                    errorMessages: errors,
                    token: req.session.token
                });
            } catch (dropDownError) {
                res.locals.errormessage = dropDownError.message;
                res.locals.pageName = "An Error Ocured";
                res.render('pages/errorPage.html');
            }
            return;
        }

        const jobRoleRequest: JobRoleRequest = {
            roleName: req.body.roleName,
            location: Number(req.body.location),
            capability: Number(req.body.capability),
            band: Number(req.body.band),
            closingDate: new Date(req.body.closingDate),
            description: req.body.description,
            responsibilities: req.body.responsibilities,
            jobSpec: req.body.jobSpec,
        };

        await createRole(jobRoleRequest, req.session.token);
        res.redirect('/');
    } catch (e) {
        console.error(e);
        res.locals.errormessage = e.message
        res.locals.pageName = "An Error Ocured";
        res.render('pages/errorPage.html');
    }
}
