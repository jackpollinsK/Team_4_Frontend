
import axios, { AxiosResponse } from "axios";
import { JobRoleResponse } from "../models/JobRoleResponse";
axios.defaults.baseURL = process.env.API_URL || 'http://localhost:8080/';

export const URL: string = "/api/JobRoles";
export const getJobRoles = async (): Promise<JobRoleResponse[]> => {
    try {
        //Change url to AWS
        const response: AxiosResponse = await axios.get("http://localhost:8080/api/JobRoles")

        return response.data;        
    } catch (e) {
        throw new Error('Failed to get JobRoles')
    }
}