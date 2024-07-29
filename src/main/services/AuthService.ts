import axios, { AxiosResponse } from "axios";
import { LoginRequest } from "../models/LoginRequest";

axios.defaults.baseURL = process.env.API_URL || 'http://localhost:8080/';

export const URL: string = "/api/auth/login";

export const getTokenByloggingIn = async (loginRequest: LoginRequest): Promise<string> => {
    try{
        const response: AxiosResponse = await axios.post(URL, loginRequest);

        return response.data;
    } catch (e) {
        if(e.response.status == 404){
            throw new Error("Invalid Email - Try Again.");
        }
        else if(e.response.status == 400){
            throw new Error("Invalid Credentials.");
        }
        else if(e.response.status == 500){
            throw new Error("Internal Server Error.");
        }
        else{
            throw new Error(e.message);
        }
    } 
}