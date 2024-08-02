import Express from "express";
import { postJobRoleAplication } from "../services/ApplicationService"
import { JobApplyRoleRequest } from "../models/JobApplyRoleRequest"
import { jwtDecode } from "jwt-decode";
import { uploadFileToS3 } from "../Utils/AwsUtil";


export const getApplyJobRolesForm = async (req: Express.Request, res: Express.Response): Promise<void> => {
    res.render('pages/applyForJobRole.html', { id: req.params.id, pageName: 'Apply for a Job', token: req.session.token });
}

export const postApplyJobRolesForm = async (req: Express.Request, res: Express.Response): Promise<void> => {
    try {
        //Get user and the Job ID
        const uEmail = jwtDecode(req.session.token).sub;
        const id = Number(req.params.id);

        //Check if File is correct format
    if (req.file == null) {
        res.locals.errormessage = "You must upload file";
        throw new Error('You must upload file');
    }
    else if (req.file.mimetype != 'application/pdf') {
        throw new Error('You must upload a PDF');
    }

    //Set details for AWS Bucket
    const date = new Date().toISOString();
    const cvKey = uEmail.split('@')[0] + "/" + id + "-" + date +  ".pdf";
    const cvFile = req.file.buffer;

    await uploadFileToS3(cvFile, cvKey);

    //Send data to the backend
    const application: JobApplyRoleRequest = {
        email: uEmail,
        roleID: id,
        cvLink: cvKey
    };

    await postJobRoleAplication(application);
    res.redirect('/job-roles');
} catch (e) {
    res.locals.errormessage = e.message;
    res.render('pages/applyForJobRole.html', { id: req.params.id, pageName: 'Apply for a Job', errormessage: e.message });
}

}


