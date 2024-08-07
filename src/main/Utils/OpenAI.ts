import OpenAi from "openai";
import { OpenAIRequest } from "../models/OpenAIRequest";

const openai = new OpenAi({
    apiKey: process.env.OPENAI_API_KEY
});

//Need to wait until the add job role is complete
const exampleJson = {
    location: "Location",
    capability: "capability",
    band: "band"
}

const locationExamples = 'Belfast, Birmingham, Derry, Buenos Aires, Toronto';
const capabilityExamples = 'Engineering, Platforms, Data and Artificial Intelligence, Cyber Security, Workday, Experience Design, Product, Delivery, Operations, Business Development and Marketing, Organisational Strategy and Planning, People, Commercial and Financial Management, Business Services Support'
const bandExamples = 'Apperentice, Trainee, Associate, Senior Associate, Consultant, Manager, Principal, Leadership Community'


export const getQueryParams = async (question: string): Promise<OpenAIRequest> => {

    try {
        //creates prompt and sends to OpenAI API
        const aiResponse = openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an assistant designed to output JSON in this schema: " + exampleJson + 
                    "Location is the place, capability is the type of work, band is the profession level." + 
                    "For Location find the geographically to the questions location from from: " + locationExamples +
                    "For capability out of this set of capabilities find the most applicable from: " + capabilityExamples +
                    "For bands out of this out of this set of bands find the most applicable or if the band is mispelt choose the closest from: " + bandExamples,
                },
                {
                    role: "user",
                    content: question
                },
            ],
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            max_tokens: 2048
        });

        const aiResponseTest = await aiResponse;
        console.log(aiResponseTest);

        //Parse response to get an actual Json object
        const aiJson = JSON.parse((await aiResponse).choices[0].message.content);
        console.log(aiJson);

        //Assign to a predefined obeject
        const result: OpenAIRequest = {
            location: aiJson.Location,
            capability: aiJson.Capability,
            band: aiJson.Band,
        };

        if (result.band == undefined || result.capability == undefined || result.location == undefined){
            getQueryParams(question);
        }

        console.log(result);
        return result;

    } catch (e) {
        console.log(e);
        throw new Error('There is an error with your request. Try again later')
    }
}