import * as JobRoleController from "../../../main/controllers/JobRoleController";
import * as JobRoleService from "../../../main/services/JobRoleService";
import { JobRoleResponse } from "../../../main/models/JobRoleResponse";
import { expect } from 'chai';
import sinon from 'sinon';
import express from "express";

const expected: JobRoleResponse = {
    id: 1,
    roleName: "Manager",
    location: "New York",
    capability: "Coding",
    band: "B",
    closingDate: new Date(2019, 1, 16),
    status: "open"
}

describe('JobRoleController', function () {
    afterEach(() => {
        sinon.restore();
    });

    describe('getAllJobRoles', function () {
        it('should view Job Roles when Job Roles returned, and user is logged in', async () => {

            const jobRoleList = [expected];

            const req = {
                session: { token: '12345' }
            };

            const res = {
                render: sinon.spy(),
                redirect: sinon.spy(),
            };

            sinon.stub(JobRoleService, 'getJobRoles').resolves(jobRoleList);

            await JobRoleController.getAllJobRoles(req as express.Request, res as unknown as express.Response);

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('pages/allJobRolesList.html', { jobRoles: jobRoleList, pageName: "Job Roles" })).to.be.true;
        });
    })
    it('should render view with error message when error thrown, and user is logged in', async () => {

        const errorMessage: string = 'Failed to get JobRoles';

        const req = {
            session: { token: '12345' }
        };

        const res = {
            render: sinon.spy(),
            redirect: sinon.spy(),
            locals: { errormessage: '' }
        };

        sinon.stub(JobRoleService, 'getJobRoles').rejects(new Error(errorMessage));

        await JobRoleController.getAllJobRoles(req as express.Request, res as unknown as express.Response);

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWith('pages/allJobRolesList.html')).to.be.true;
        expect(res.locals.errormessage).to.equal(errorMessage);
    });
})