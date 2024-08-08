import { fileFromPath } from "openai";
import { JobRoleResponse } from "../models/JobRoleResponse";
import { OpenAIRequest } from "../models/OpenAIRequest";
import { getJobRoles } from "./JobRoleService";


export const postAIResponse = async (filterList: OpenAIRequest[], token: string): Promise<JobRoleResponse[]> => {
    try {
        const apiResponse = await getJobRoles(token);
        return await aiFiltering(filterList, apiResponse);
    } catch (e) {
        if (e.message == "Failed to get JobRoles") {
            throw new Error("Sorry There is a problem on our end!");
        }
        else {
            throw new Error(e.message);
        }
    }
}

export const aiFiltering = async (filterList: OpenAIRequest[], jobRoles: JobRoleResponse[]): Promise<JobRoleResponse[]> => {

    const result: JobRoleResponse[] = [];
    try {
        jobRoles.forEach(job => {
            filterList.forEach(filter => {
                if (filter.location.toLowerCase().includes(job.location.toLowerCase()) && filter.capability.toLowerCase().includes(job.capability.toLowerCase()) && filter.band.toLowerCase().includes(job.band.toLowerCase()))
                    {
                        result.push(job);
                    }
            })
        })

    } catch (e) {
    throw new Error("Something went wrong please try again")
}


if (result.length == 0) {
    throw new Error("We couldn't find any jobs that would suit you")
}

return result;
}