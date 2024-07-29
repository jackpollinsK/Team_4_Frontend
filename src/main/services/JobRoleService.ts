
import axios, { AxiosResponse } from "axios";
import { JobRoleResponse } from "../models/JobRoleResponse";
axios.defaults.baseURL = process.env.API_URL || 'http://localhost:8080/';

export const URL: string = "/api/JobRoles";
export const getJobRoles = async (): Promise<JobRoleResponse[]> => {
    try {
        //Change url to AWS
        const response: AxiosResponse = await axios.get(URL)

        return response.data;        
    } catch (e) {
        throw new Error('Failed to get JobRoles')
    }
}

export const getJobRoleById = async (id: String): Promise<JobRoleResponse> => {
    try {
        const response: AxiosResponse = await axios.get(URL + "/" + id)

        return response.data;        
    } catch (e) {
        throw new Error('Failed to get JobRole')
    }
}