
import axios, { AxiosResponse } from "axios";
import { JobRoleResponse } from "../models/JobRoleResponse";

export const getJobRoles = async (): Promise<JobRoleResponse[]> => {
    try {
        //Change url to AWS
        const response: AxiosResponse = await axios.get("http://localhost:8080/api/JobRoles")

        return response.data;        
    } catch (e) {
        console.log(e);
        if (e.response?.status === 500){
            throw new Error('Server Error');
        }
        if (e.response?.status === 400){
            throw new Error('No data found');
        }
        throw new Error(e.message);
    }
}