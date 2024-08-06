
import axios, { AxiosResponse } from "axios";
import { JobRoleResponse } from "../models/JobRoleResponse";
axios.defaults.baseURL = process.env.API_URL || 'http://localhost:8080';
import { getHeader } from "../services/AuthUtil";
import { OpenAIRequest } from "../models/OpenAIRequest";
import { getJobRoles } from "./JobRoleService";

export const URL: string = "/api/AIJobSearch";

export const postAIResponse = async (filter: OpenAIRequest, token: string): Promise<JobRoleResponse[]> => {
    try {
        const apiResponse = await getJobRoles(token);

        return await aiFiltering(filter, apiResponse);
    } catch (e) {
        throw new Error('Failed to get JobRoles');
    }
}

export const aiFiltering = async (filter: OpenAIRequest, jobRoles: JobRoleResponse[]): Promise<JobRoleResponse[]> => {

    var result: JobRoleResponse[] = [];

    jobRoles.forEach(job => {
        if (job.band == filter.band && job.capability == filter.capability && job.location == filter.location){
            result.push(job);
        }
    });

    return result;
}