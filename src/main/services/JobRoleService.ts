
import axios, { AxiosResponse } from "axios";
import { JobRoleResponse } from "../models/JobRoleResponse";
import { JobRoleSingleResponse } from "../models/JobRoleSingleResponse";
axios.defaults.baseURL = process.env.API_URL || 'http://localhost:8080';
import { getHeader } from "../services/AuthUtil";
import { JobRoleRequest } from "../models/JobRoleRequest";
import { Band } from "../models/Band";
import { Capability } from "../models/Capability";
import { Location } from "../models/Location";


export const URL: string = "/api/JobRoles";
export const LOCATIONS_URL: string = "/api/location"
export const BANDS_URL: string = "/api/band"
export const CAPABILITIES_URL: string = "/api/capability"


export const getJobRoles = async (token: string): Promise<JobRoleResponse[]> => {
    try {
        const response: AxiosResponse = await axios.get(URL, getHeader(token))

        return response.data;        
    } catch (e) {
        throw new Error('Failed to get JobRoles');
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

export const createRole = async (jobRoleRequest: JobRoleRequest, token: string): Promise<string> => {
    try {
        console.log('Sending request with data:', jobRoleRequest);
        const response: AxiosResponse<string> = await axios.post(URL, jobRoleRequest, getHeader(token));
        console.log('Response received:', response.data);
        return response.data;
    } catch (e) {
            throw new Error('Failed to create Job Role');
        }
    }

export async function getBands(token: string): Promise<Band[]> {
    try {
        const response: AxiosResponse<Band[]> = await axios.get(BANDS_URL, getHeader(token));
        return response.data;
    } catch (e) {
        console.error('Error fetching bands:', e);
        throw new Error('Failed to fetch bands');
    }
}
export async function getCapabilities(token: string): Promise<Capability[]> {
    try {
        const response: AxiosResponse<Capability[]> = await axios.get(CAPABILITIES_URL, getHeader(token));
        return response.data;
    } catch (e) {
        console.error('Error fetching capabilities:', e);
        throw new Error('Failed to fetch capabilities');
    }
}
export async function getLocations(token: string): Promise<Location[]> {
    try {
        const response: AxiosResponse<Location[]> = await axios.get(LOCATIONS_URL, getHeader(token));
        return response.data;
    } catch (e) {
        console.error('Error fetching locations:', e);
        throw new Error('Failed to fetch locations');
    }
}