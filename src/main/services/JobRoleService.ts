
import axios, { AxiosResponse } from "axios";
import { JobRoleResponse } from "../models/JobRoleResponse";
import { JobRoleSingleResponse } from "../models/JobRoleSingleResponse";
axios.defaults.baseURL = process.env.API_URL || 'http://localhost:8080';
import { getHeader } from "../services/AuthUtil";
import { JobRoleRequest } from "../models/JobRoleRequest";


export const URL: string = "/api/JobRoles";
export const getJobRoles = async (token: string): Promise<JobRoleResponse[]> => {
    try {
        const response: AxiosResponse = await axios.get(URL, getHeader(token))

        return response.data;        
    } catch (e) {
        throw new Error('Failed to get JobRoles')
    }
}

export const getJobRoleById = async (id: string, token: string): Promise<JobRoleSingleResponse> => {
    try {
        const response: AxiosResponse = await axios.get(URL + "/" + id, getHeader(token));
        return response.data;        
    } catch (e) {
        if(e.response.status == 404){
            throw new Error("Job Not Found");
        }
        else if(e.response.status == 500){
            throw new Error("Sorry There is a problem on our end!");
        }
        else{
            throw new Error(e.message);
        }
    }
}

export const createRole = async(jobRoleRequest: JobRoleRequest): Promise<string> => {
    try {
        const response: AxiosResponse = await axios.post(URL, jobRoleRequest)
        
        return response.data
    } catch (e) {
        throw new Error(e.message)
    }
}