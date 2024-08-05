
import axios, { AxiosResponse } from "axios";
import { JobApplyRoleRequest } from "../models/JobApplyRoleRequest";
import { jwtDecode } from "jwt-decode";
import { uploadFileToS3 } from "../Utils/AwsUtil";
axios.defaults.baseURL = process.env.API_URL || 'http://localhost:8080/';
import Express from "express";

export const postJobRoleAplication = async (application: JobApplyRoleRequest): Promise<JobApplyRoleRequest> => {
    try {
        const response: AxiosResponse = await axios.post("/api/apply-for-role", application);
        return response.data;
    } catch (e) {
        if (e.response.status == 400) {
            throw new Error("You have already applied to this job");
        }
        else if (e.response.status == 500) {
            throw new Error("Internal Server Error.");
        }
        else {
            throw new Error(e.message);
        }
    }

}

export const processJobRoleAplication = async (req: Express.Request) => {
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
        const date = new Date().toISOString();
        const cvKey = uEmail.split('@')[0] + "/" + id + "-" + date + ".pdf";
        const cvFile = req.file.buffer;

        await uploadFileToS3(cvFile, cvKey);

        //Send data to the backend
        const application: JobApplyRoleRequest = {
            email: uEmail,
            roleID: id,
            cvLink: cvKey
        };

        return application;
}