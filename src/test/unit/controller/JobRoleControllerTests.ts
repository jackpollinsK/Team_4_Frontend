import * as JobRoleController from "../../../main/controllers/JobRoleController";
import * as JobRoleService from "../../../main/services/JobRoleService";
import { JobRoleResponse } from "../../../main/models/JobRoleResponse";
import { expect } from 'chai';
import sinon from 'sinon';
import { JobRoleSingleResponse } from "../../../main/models/JobRoleSingleResponse";
import express from "express";
import { allowRoles } from "../../../main/middleware/AuthMiddleware";
import { UserRole } from "../../../main/models/JwtToken";
import jwt from 'jsonwebtoken';
import { jwtDecode } from "jwt-decode";
import { JobRoleRequest } from "../../../main/models/JobRoleRequest";


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

const secretKey = 'SUPER_SECRET';
const validUserJwtToken = jwt.sign({ Role: UserRole.User, sub: "test1@random.com" }, secretKey, { expiresIn: '8h' });
const validAdminJwtToken = jwt.sign({ Role: UserRole.Admin, sub: "test2@random.com" }, secretKey, { expiresIn: '8h' });

describe('JobRoleController', function () {
    afterEach(() => {
        sinon.restore();
    });

    describe('getAllJobRoles', function () {
        it('should view Job Roles when Job Roles returned, and user is logged in', async () => {

            const jobRoleList = [expectedJobRole];

            const req = {
                session: { token: validUserJwtToken }
            };

            const res = {
                render: sinon.spy(),
            };

            sinon.stub(JobRoleService, 'getJobRoles').resolves(jobRoleList);
            await JobRoleController.getAllJobRoles(req as express.Request, res as unknown as express.Response);

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('pages/allJobRolesList.html', { jobRoles: jobRoleList, pageName: "Job Roles", token: req.session.token, userLevel: jwtDecode(req.session.token) })).to.be.true;
        });

        it('should render view with error message when error thrown, and user is logged in', async () => {

            const errorMessage: string = 'Failed to get JobRoles';

            const req = {
                session: { token: validUserJwtToken }
            };

            const res = {
                render: sinon.spy(),
                redirect: sinon.spy(),
                locals: { errormessage: '' }
            };
            sinon.stub(JobRoleService, 'getJobRoles').rejects(new Error(errorMessage));

            await JobRoleController.getAllJobRoles(req as express.Request, res as unknown as express.Response);

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('pages/errorPage.html')).to.be.true;
            expect(res.locals.errormessage).to.equal(errorMessage);
        });

        it('should render not logged in view and return 401 status, when user is NOT logged in', async () => {

            const req = {
                session: { token: '' }
            };

            const res = {
                render: sinon.spy(),
                status: sinon.stub().returnsThis(),
                redirect: sinon.stub().returnsThis(),
                locals: { errormessage: '' }
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
            const req = { params: { id: 1 }, session: { token: validUserJwtToken } };
            const res = {
                render: sinon.spy(),
            };

            sinon.stub(JobRoleService, 'getJobRoleById').resolves(expectedJobRoleSingle);

            await JobRoleController.getJobRole(req as unknown as express.Request, res as unknown as express.Response);

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('pages/singleJobRole.html')).to.be.true;
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

            await JobRoleController.getJobRole(req as unknown as express.Request, res as unknown as express.Response);

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('pages/errorPage.html')).to.be.true;
            expect(res.locals.errormessage).to.equal(errorMessage);
        });

        it('should render not logged in view and return 401 status, when user is NOT logged in', async () => {

            const req = {
                param: { id: '1' },
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

            await JobRoleController.getJobRole(req as unknown as express.Request, res as unknown as express.Response);

            const middleware = allowRoles([UserRole.Admin, UserRole.User]);

            await middleware(req as unknown as express.Request, res as unknown as express.Response, next);

            expect((res.status as sinon.SinonStub).calledWith(401)).to.be.true;
            expect(req.session.token).to.equal('');
            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.calledWith('/notLoggedIn')).to.be.true;
        });
    });
    describe('getRoleForm', function () {
        afterEach(() => {
            sinon.restore();
        });

        it('should render the job role form with dropdown options', async () => {
            const locations = [{ id: 1, name: 'test location', address: 'test address', phone: 123456789 }];
            const capabilities = [{ id: 1, name: 'test capability' }];
            const bands = [{ id: 1, name: 'test band' }];

            const req = {
                session: { token: validAdminJwtToken }
            };

            const res = {
                render: sinon.spy(),
            };

            sinon.stub(JobRoleService, 'getLocations').resolves(locations);
            sinon.stub(JobRoleService, 'getCapabilities').resolves(capabilities);
            sinon.stub(JobRoleService, 'getBands').resolves(bands);

            await JobRoleController.getRoleForm(req as express.Request, res as unknown as express.Response);

            expect(res.render.calledOnce).to.be.true;
            res.render('pages/jobRoleForm.html', {
                pageName: "Create New Role",
                capabilities: capabilities,
                locations: locations,
                bands: bands,
                roleName: "",
                description: "",
                responsibilities: "",
                jobSpec: "",
                closingDate: "",
                selectedLocation: "",
                selectedBand: "",
                selectedCapability: "",
                openPostions: "",
                token: req.session.token
            });
        });

        it('should render error page if there is an error getting dropdown options', async () => {
            const errorMessage = 'Error retrieving dropdown options';

            const req = {
                session: { token: validAdminJwtToken }
            };

            const res = {
                render: sinon.spy(),
                locals: { errormessage: '' }
            };

            sinon.stub(JobRoleService, 'getLocations').rejects(new Error(errorMessage));
            sinon.stub(JobRoleService, 'getCapabilities').resolves([]);
            sinon.stub(JobRoleService, 'getBands').resolves([]);

            await JobRoleController.getRoleForm(req as express.Request, res as unknown as express.Response);

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('pages/errorPage.html')).to.be.true;
            expect(res.locals.errormessage).to.equal(errorMessage);
        });

        it('should create a new job role and redirect on successful submission', async () => {
            const jobRoleRequest: JobRoleRequest = {
                roleName: 'New Role',
                location: 1,
                capability: 1,
                band: 1,
                closingDate: new Date(),
                description: 'Description',
                responsibilities: 'Responsibilities',
                jobSpec: 'Job Spec',
                openPositions: 5
            };
            const req = { body: jobRoleRequest, session: { token: validAdminJwtToken } };
            const res = { redirect: sinon.stub() };

            sinon.stub(JobRoleService, 'createRole').resolves();

            await JobRoleController.postRoleForm(req as express.Request, res as unknown as express.Response);

            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.calledWith('/')).to.be.true;
        });
        it('should render error page if job role creation fails', async () => {
            const jobRoleRequest: JobRoleRequest = {
                roleName: 'New Role',
                location: 1,
                capability: 1,
                band: 1,
                closingDate: new Date(),
                description: 'Description',
                responsibilities: 'Responsibilities',
                jobSpec: 'Job Spec',
                openPositions: 5
            };
            const req = { body: jobRoleRequest, session: { token: validAdminJwtToken } };
            const res = { render: sinon.spy(), locals: { errormessage: '' } };

            sinon.stub(JobRoleService, 'createRole').rejects(new Error('Creation failed'));

            await JobRoleController.postRoleForm(req as express.Request, res as unknown as express.Response);

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('pages/errorPage.html')).to.be.true;
            expect(res.locals.errormessage).to.equal('Creation failed');
        });
    });

    describe('deleteJobRole', function () {
        it('should delete selected job role, then return to view all job roles, when Admin user is logged in', async () => {
            const req = { params: { id: 1 }, session: { token: validAdminJwtToken } };

            const res = {
                render: sinon.spy(),
                redirect: sinon.stub(),
                locals: { errormessage: '' }
            };

            sinon.stub(JobRoleService, 'getJobRoles');
            sinon.stub(JobRoleService, 'deleteJobRoleById');

            await JobRoleController.deleteJobRole(req as unknown as express.Request, res as unknown as express.Response);

            expect(res.redirect.calledWith('/jobRoles')).to.be.true;
        });

        it('should throw error, when trying to delete', async () => {
            const req = { params: { id: 1 }, session: { token: '' } };

            const res = {
                render: sinon.spy(),
                redirect: sinon.stub(),
                locals: { errormessage: '' }
            };

            const errorMessage = "Sorry There is a problem on our end!";
            sinon.stub(JobRoleService, 'getJobRoles');
            sinon.stub(JobRoleService, 'deleteJobRoleById').rejects(new Error(errorMessage));;

            await JobRoleController.deleteJobRole(req as unknown as express.Request, res as unknown as express.Response);
            console.log(res.locals.errormessage);

            expect(res.render.called).to.be.true;
            expect(res.locals.errormessage).to.equal(errorMessage);
            expect(res.render.calledWith('pages/errorPage.html')).to.be.true;
        });

    });
});