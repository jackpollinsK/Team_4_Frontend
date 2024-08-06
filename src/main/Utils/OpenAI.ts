import OpenAi from "openai";
import { OpenAIRequest } from "../models/OpenAIRequest";

const openai = new OpenAi({
    apiKey: process.env.OPENAI_API_KEY
});

export const getQueryParams = async (question: string): Promise<OpenAIRequest> => {
    
    try {
    //creates prompt and sends
    const aiResponse = openai.completions.create({
        model: "gpt-4o-mini",
        prompt: question
    });
    console.log(aiResponse);
    } catch (e){
        console.log(e.errorMessage);
    }

    console.log(question);


    // try to assign varibales (If error is thrown prompt therefore is incorrect)
    const result: OpenAIRequest = {
        location: "",
        capability: "",
        band: "",
    };

    return result;
}