import * as JobRoleController from "../../../main/controllers/JobRoleController";
import * as JobRoleService from "../../../main/services/JobRoleService";
import { JobRoleResponse } from "../../../main/models/JobRoleResponse";
import { expect } from 'chai';
import sinon from 'sinon';
import { JobRoleSingleResponse } from "../../../main/models/JobRoleSingleResponse";
import express from "express";
import { allowRoles } from "../../../main/middleware/AuthMiddleware";
import { UserRole } from "../../../main/models/JwtToken";


const expectedJobRole: JobRoleResponse = {
    id: 1,
    roleName: "Manager",
    location: "New York",
    capability: "Coding",
    band: "B",
    closingDate: new Date(2019, 1, 16),
    status: "open"
}

const expectedJobRoleSingle: JobRoleSingleResponse = {
    id: 1,
    roleName: "Engineer",
    location: "Belfast",
    capability: "Coding",
    band: "A",
    closingDate: new Date(2019, 1, 16),
    status: "Open",
    description: "A short description",
    responsibilities: "Something Important",
    jobSpec: "A Link to a page",
}

describe('JobRoleController', function () {
    afterEach(() => {
        sinon.restore();
    });

    describe('getAllJobRoles', function () {
        it('should view Job Roles when Job Roles returned, and user is logged in', async () => {

            const jobRoleList = [expectedJobRole];

            const req = {
                session: { token: '12345' }
            };

            const res = {
                render: sinon.spy(),
            };

            sinon.stub(JobRoleService, 'getJobRoles').resolves(jobRoleList);
            await JobRoleController.getAllJobRoles(req as express.Request, res as unknown as express.Response);

            console.log('Request:', req);
            console.log('Expected"', expectedJobRoleSingle);

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('pages/allJobRolesList.html', { jobRoles: jobRoleList, pageName: "Job Roles", token: req.session.token })).to.be.true;
        });
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
    it('should render not logged in view and return 401 status, when user is NOT logged in', async () => {

        const req = {
            session: { token: '' }
        };

        const res = {
            render: sinon.spy(),
            status: sinon.stub().returnsThis(),
            redirect: sinon.stub().returnsThis()
        };

        const next = sinon.stub();

        sinon.stub(JobRoleService, 'getJobRoles')

        await JobRoleController.getAllJobRoles(req as express.Request, res as unknown as express.Response);

        const middleware = allowRoles([UserRole.Admin, UserRole.User]);

        await middleware(req as unknown as express.Request, res as unknown as express.Response, next);

        expect((res.status as sinon.SinonStub).calledWith(401)).to.be.true;
        expect(req.session.token).to.equal('');
        expect(res.redirect.calledOnce).to.be.true;
        expect(res.redirect.calledWith('/notLoggedIn')).to.be.true;
    });
});


describe('getJobRole', function () {
    it('should view a Job Role when a Job Role is returned when user is logged in', async () => {

        const job = expectedJobRoleSingle;

        const req = { params: { id: 1 }, session: { token: '12345' } };
        const res = {
            render: sinon.spy(),
        };

        sinon.stub(JobRoleService, 'getJobRoleById').resolves(expectedJobRoleSingle);

        await JobRoleController.getJobRole(req as any, res as any); // eslint-disable-line @typescript-eslint/no-explicit-any

        console.log('Request:', req);
        console.log('Expected"', expectedJobRoleSingle);

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWith('pages/singleJobRole.html', {
            pageName: job.roleName + ": " + job.band,
            job: job,
            token: req.session.token
        })).to.be.true;
    });

    it('should render view with error message when error thrown when user is logged in ', async () => {
        const errorMessage: string = 'Failed to get Job Role';

        const req = { 
            params: { id: 1 },
            session: { token: "12345" }
        };
        const res = {
            render: sinon.spy(),
            locals: { errormessage: '' }
        };

        sinon.stub(JobRoleService, 'getJobRoleById').rejects(new Error(errorMessage));

        await JobRoleController.getJobRole(req as any, res as any); // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWith('pages/errorPage.html')).to.be.true;
        expect(res.locals.errormessage).to.equal(errorMessage);
    });

    it('should render not logged in view and return 401 status, when user is NOT logged in', async () => {

        const req = {
            param: {id: '1'},
            session: { token: '' }
        };

        const res = {
            render: sinon.spy(),
            status: sinon.stub().returnsThis(),
            redirect: sinon.stub().returnsThis(),
            locals: { errormessage: '' }
        };

        const next = sinon.stub();

        sinon.stub(JobRoleService, 'getJobRoleById')

        await JobRoleController.getJobRole(req as any, res as any); // eslint-disable-line @typescript-eslint/no-explicit-any

        const middleware = allowRoles([UserRole.Admin, UserRole.User]);

        await middleware(req as unknown as express.Request, res as unknown as express.Response, next);

        expect((res.status as sinon.SinonStub).calledWith(401)).to.be.true;
        expect(req.session.token).to.equal('');
        expect(res.redirect.calledOnce).to.be.true;
        expect(res.redirect.calledWith('/notLoggedIn')).to.be.true;
    });
});
});