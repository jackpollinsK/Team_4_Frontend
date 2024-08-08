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


export const getQueryParams = async (question: string): Promise<OpenAIRequest[]> => {

    try {
        //creates prompt and sends to OpenAI API
        const aiResponse = openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an assistant designed to output a list of JSON in this schema: " + exampleJson + 
                    "Location Examples: " + locationExamples + ". Capability Examples: " + capabilityExamples + ". Band Examples: " + bandExamples +
                    "Location is the place, capability is the type of work, band is the profession level use your best knowledge to pick out some jobs that would best suit the person using only these examples"
                },
                {
                    role: "user",
                    content: question
                },
            ],
            model: "gpt-4o-mini",
            max_tokens: 2048
        });

        const aiResponseTest = await aiResponse;

        //Process String to JSON list
        const aiJobLists = aiResponseTest.choices[0].message.content.substring(aiResponseTest.choices[0].message.content.indexOf('`') + 7 ,aiResponseTest.choices[0].message.content.lastIndexOf('`') -2)

        //Parse response to get an actual Json object
        const aiJson = JSON.parse(aiJobLists);

        //Assign to a predefined obeject
        const resultAi: OpenAIRequest[] = [];


        //Loop through to generate filter
        aiJson.forEach((entry: { Location: string; Capability: string; Band: string; }) => {

            console.log("New Entry " + entry.Location + ', ' + entry.Capability  + ', ' + entry.Band + '\n');

            const valid: OpenAIRequest = {
                location: entry.Location,
                capability: entry.Capability,
                band: entry.Band,
            };

            resultAi.push(valid);
            
        });

        return resultAi;

    } catch (e) {
        console.log(e);
        throw new Error('There is an error with your request. Try again later')
    }
}