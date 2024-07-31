
import axios, { AxiosResponse } from "axios";
import { JobRoleResponse } from "../models/JobRoleResponse";
axios.defaults.baseURL = process.env.API_URL || 'http://localhost:8080/';
import { getHeader } from "../services/AuthUtil";

export const URL: string = "/api/JobRoles";
export const getJobRoles = async (token: string): Promise<JobRoleResponse[]> => {
    try {
        const response: AxiosResponse = await axios.get(URL, getHeader(token))

        return response.data;        
    } catch (e) {
        throw new Error('Failed to get JobRoles')
    }
}