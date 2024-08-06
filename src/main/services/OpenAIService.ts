import { JobRoleResponse } from "../models/JobRoleResponse";
import { OpenAIRequest } from "../models/OpenAIRequest";
import { getJobRoles } from "./JobRoleService";


export const postAIResponse = async (filter: OpenAIRequest, token: string): Promise<JobRoleResponse[]> => {
    try {
        const apiResponse = await getJobRoles(token);
        return await aiFiltering(filter, apiResponse);
    } catch (e) {
        if(e.response.status == 500){
            throw new Error("Sorry There is a problem on our end!");
        }
        else{
            throw new Error('There is an error with your request. Try again later');
        }
    }
}

export const aiFiltering = async (filter: OpenAIRequest, jobRoles: JobRoleResponse[]): Promise<JobRoleResponse[]> => {

    const result: JobRoleResponse[] = [];

    jobRoles.forEach(job => {
        if (filter.band.toLocaleLowerCase().includes(job.band.toLowerCase()) && 
        filter.capability.toLowerCase().includes(job.capability.toLowerCase()) && 
        filter.location.toLowerCase().includes(job.location.toLowerCase())){

            result.push(job)
        }
    });

    if (result.length == 0){
        throw new Error("We couldn't find any jobs that would suit you")
    }

    return result;
}