import Express from "express";
import { postJobRoleAplication } from "../services/ApplicantService"
import { JobApplyRoleRequest } from "../models/JobApplyRoleRequest"
import { jwtDecode } from "jwt-decode";
import { unlink } from "fs";
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
        throw new Error('You must upload file');
    }
    else if (req.file.mimetype != 'application/pdf') {
        throw new Error('You must upload a PDF');
    }

    //Set details for AWS Bucket
    const cvKey = uEmail.split('@')[0] + "/Job" + id + ".pdf";
    const cvFile = new Blob([req.file.buffer])
    await uploadFileToS3(cvFile, cvKey);

    //Send data to the backend
    const application: JobApplyRoleRequest = {
        email: uEmail,
        roleID: id,
        cvLink: cvKey
    };
    console.log(application);

    await postJobRoleAplication(application);
    res.redirect('/job-roles');
} catch (e) {
    if (e.message === 'Invalid token specified: must be a string') {
        e.message = 'You must Sign in before applying for a job!'
    }
    res.render('pages/applyForJobRole.html', { id: req.params.id, pageName: 'Apply for a Job', errormessage: e.message });
}

//Delete temp file after successful upload
await unlink(req.file.path, (err) => {
    if (err) throw 'An Error Occured in the upload';
  });

}


