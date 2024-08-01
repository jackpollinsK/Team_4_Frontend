
import axios, { AxiosResponse } from "axios";
import { JobApplyRoleRequest } from "../models/JobApplyRoleRequest";
axios.defaults.baseURL = process.env.API_URL || 'http://localhost:8080/';

export const postJobRoleAplication = async (application: JobApplyRoleRequest): Promise<JobApplyRoleRequest> => {
    try {
        const response: AxiosResponse = await axios.post("/api/apply-for-role", application);
        return response.data;
    } catch(e) {
        if(e.response.status == 400){
            throw new Error("You have already applied to this job");
        }
        else if(e.response.status == 500){
            throw new Error("Internal Server Error.");
        }
        else{
            throw new Error(e.message);
        }
    }

}