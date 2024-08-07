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

const aiFilter: OpenAIRequest = {
    location: "belfast city center",
    capability: "software engineer",
    band: "senior"
}

const jobList: JobRoleResponse[] = [job]

describe('OpenAIService', function () {
    describe('postAIResponse', function () {
        //Check 500 error from own API
        it("Should return an error message when getAllJobRoles returns with an error", async () => {

            sinon.stub(JobRoleService, 'getJobRoles').throws(new Error("Failed to get JobRoles"));

            try {
                await postAIResponse(aiFilter, '');
            } catch (e) {
                expect(e.message).to.equal("Sorry There is a problem on our end!")
            }
        });
    });

    describe('aiFiltering', function () {
        //Check if job role is returned
        it("Should return a job role when filter matches aiParameters", async () => {

            const aiFilter: OpenAIRequest = {
                location: "belfast city center",
                capability: "software engineer",
                band: "senior"
            }

            const result = await aiFiltering(aiFilter, jobList);

            expect(result).deep.equal(jobList);
        });

        //Check error when no jobs are returned
        it("Should return an error when no job matches the ai Parameters", async () => {
            const aiFilter: OpenAIRequest = {
                location: "Tilted towers",
                capability: "software engineer",
                band: "pro"
            }

            try {
                const result = await aiFiltering(aiFilter, jobList);
            } catch (e) {
                expect(e.message).to.equal("We couldn't find any jobs that would suit you");
            }

        })
    })
});