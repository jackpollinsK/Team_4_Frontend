
import axios, { AxiosResponse } from "axios";
import { JobRoleResponse } from "../models/JobRoleResponse";
axios.defaults.baseURL = process.env.API_URL || 'http://localhost:8080';
import { getHeader } from "../services/AuthUtil";
import { OpenAIRequest } from "../models/OpenAIRequest";

export const URL: string = "/api/AIJobSearch";

export const postAIResponse = async (request: OpenAIRequest, token: string): Promise<JobRoleResponse[]> => {
    try {
        const response: AxiosResponse = await axios.post(URL, request ,getHeader(token));
        return response.data; 
    } catch (e) {
        throw new Error('Failed to get JobRoles');
    }
}