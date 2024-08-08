import { expect } from 'chai';
import { describe } from "node:test";
import sinon from "sinon";
import { aiFiltering, postAIResponse } from "../../../main/services/OpenAIService";
import { JobRoleResponse } from "../../../main/models/JobRoleResponse";
import * as JobRoleService from '../../../main/services/JobRoleService'
import { OpenAIRequest } from "../../../main/models/OpenAIRequest";

const job: JobRoleResponse = {
    id: 1,
    roleName: "TestName",
    location: "Belfast",
    capability: "engineer",
    band: "senior",
    closingDate: undefined,
    status: "Open"
}

const aiFilterEntry: OpenAIRequest = {
    location: "belfast city center",
    capability: "software engineer",
    band: "senior"
}

const aiFilterTest: OpenAIRequest[] = [aiFilterEntry];

const jobList: JobRoleResponse[] = [job]

describe('OpenAIService', function () {
    describe('postAIResponse', function () {
        //Check 500 error from own API
        it("Should return an error message when getAllJobRoles returns with an error", async () => {

            sinon.stub(JobRoleService, 'getJobRoles').throws(new Error("Failed to get JobRoles"));

            try {
                await postAIResponse(aiFilterTest, '');
            } catch (e) {
                expect(e.message).to.equal("Sorry There is a problem on our end!")
            }
        });
    });

    describe('aiFiltering', function () {
        //Check if job role is returned
        it("Should return a job role when filter matches aiParameters", async () => {

            const aiEntrySuccess: OpenAIRequest = {
                location: "belfast city center",
                capability: "software engineer",
                band: "senior"
            }

            const aiScucess = [aiEntrySuccess];

            const result = await aiFiltering(aiScucess, jobList);

            expect(result).deep.equal(jobList);
        });

        //Check error when no jobs are returned
        it("Should return an error when no job matches the ai Parameters", async () => {
            const aiEntryAiError: OpenAIRequest = {
                location: "Tilted towers",
                capability: "software engineer",
                band: "pro"
            }
            const aiError = [aiEntryAiError];

            try {
                await aiFiltering(aiError, jobList);
            } catch (e) {
                expect(e.message).to.equal("We couldn't find any jobs that would suit you");
            }

        })

        it("Should return an error when filter has any bad values", async () => {
            const aiEntryValueError: OpenAIRequest = {
                location: undefined,
                capability: undefined,
                band: undefined
            }

            const aiError = [aiEntryValueError];

            try {
                await aiFiltering(aiError, jobList);
            } catch (e) {
                expect(e.message).to.equal("Something went wrong please try again");
            }

        })
    })
});