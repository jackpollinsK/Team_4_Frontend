
import axios, { AxiosResponse } from "axios";
import { JobRoleResponse } from "../models/JobRoleResponse";

export const getJobRoles = async (): Promise<JobRoleResponse[]> => {
    try {
        //Change url to AWS
        const response: AxiosResponse = await axios.get("http://localhost:8080/api/JobRoles")

        return response.data;        
    } catch (e) {
        console.log(e);
        throw new Error('Failed to get JobRoles')
    }
}