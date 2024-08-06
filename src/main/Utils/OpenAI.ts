import OpenAi from "openai";
import { OpenAIRequest } from "../models/OpenAIRequest";

const openai = new OpenAi({
    apiKey: process.env.OPEN_AI_KEY
});

export const getQueryParams = async (question: string): Promise<void> => {
    
    //creates prompt
    openai.chat.completions.create({
        messages: [{role: "system", content: "You are a helpful assistant."}],
        model: "gpt-4o-mini",
    });


    // try to assign varibales (If error is thrown prompt therefore is incorrect)
    const result: OpenAIRequest = {
        location: "",
        capability: "",
        band: "",
    };

}