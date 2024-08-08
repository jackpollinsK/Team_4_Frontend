import { expect } from 'chai';
import sinon from 'sinon';
import express from "express";
import { UserRole } from '../../../main/models/JwtToken';
import jwt from 'jsonwebtoken';

import { getPromptForm, postPromptForm } from '../../../main/controllers/OpenAIController';
import * as OpenAIService from '../../../main/services/OpenAIService';
import * as OpenAI from '../../../main/Utils/OpenAI';
import { allowRoles } from '../../../main/middleware/AuthMiddleware';
import { JobRoleResponse } from '../../../main/models/JobRoleResponse';
import { jwtDecode } from 'jwt-decode';
import { OpenAIRequest } from '../../../main/models/OpenAIRequest';


describe('OpenAIController', function () {
    afterEach(() => {
        sinon.restore();
    });

    const secretKey = 'SUPER_SECRET';
    const validJwtToken = jwt.sign({ Role: UserRole.User, sub: "test@random.com" }, secretKey, { expiresIn: '8h' });

    const exampleJob: JobRoleResponse = {
        id: 1,
        roleName: 'Test Role',
        location: 'Belfast',
        capability: 'enginner',
        band: 'senior',
        closingDate: undefined,
        status: 'open'
    }

    const aiQuerryEntry: OpenAIRequest = {
        location: 'Belfast',
        capability: 'enginner',
        band: 'senior'
    }

    const aiQuerryResponse: OpenAIRequest[] = [aiQuerryEntry];

    describe('getPropmtForm', function () {
        it('Should render Prompt form when user is logged in', async () => {

            const req = {
                session: { token: validJwtToken },
            };

            const res = {
                render: sinon.spy(),
                locals: { errormessage: '' }
            };

            await getPromptForm(req as unknown as express.Request, res as unknown as express.Response);

            expect(res.render.calledOnce).to.be.true;
        });

        it('Should render Prompt form when user is not logged in', async () => {

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


            await getPromptForm(req as unknown as express.Request, res as unknown as express.Response);
            const middleware = allowRoles([UserRole.Admin, UserRole.User]);

            await middleware(req as unknown as express.Request, res as unknown as express.Response, next);

            expect(res.render.calledOnce).to.be.true;
            expect(res.redirect.calledWith('/notLoggedIn')).to.be.true;

        });

    });

    describe('postPropmtForm', function () {
        //Check if post form is successful NOT WORKING
        it('Should filter job roles when Open AI gives a successful', async () => {

            const expectedList = [exampleJob]

            sinon.stub(OpenAI, 'getQueryParams').resolves(aiQuerryResponse)
            sinon.stub(OpenAIService, 'postAIResponse').resolves(expectedList)


            const req = {
                session: { token: validJwtToken },
                body: { prompt: 'test' }
            };

            const res = {
                render: sinon.spy(),
            };

            await postPromptForm(req as unknown as express.Request, res as unknown as express.Response);

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith("pages/allJobRolesList.html", { jobRoles: expectedList, pageName: "Job Roles", token: req.session.token, userLevel: jwtDecode(req.session.token) })).to.be.true;
        });

        //Check if Open AI API returns an error
        it('Should return an error message when OpenAIQuerry returns an error', async () => {

            const expectedErrorMessage = 'There is an error with your request. Try again later';
            sinon.stub(OpenAI, 'getQueryParams')
            sinon.stub(OpenAIService, 'postAIResponse').throws(new Error(expectedErrorMessage));

            const req = {
                session: { token: validJwtToken },
                body: { prompt: 'test' }
            };

            const res = {
                render: sinon.spy(),
                status: sinon.stub().returnsThis(),
                redirect: sinon.stub().returnsThis(),
                locals: { errormessage: '' }
            };

            try {
                await postPromptForm(req as unknown as express.Request, res as unknown as express.Response);
            } catch (e) {
                expect(e.message).to.equal(expectedErrorMessage);
            }
        })

        //Check if postAiResponse returns a 500
        it('Should retunr an error message when getAllJobs returns a 500 status', async () => {

            const expectedErrorMessage = 'Sorry There is a problem on our end!';
            sinon.stub(OpenAI, 'getQueryParams')
            sinon.stub(OpenAIService, 'postAIResponse').throws(new Error(expectedErrorMessage));

            const req = {
                session: { token: validJwtToken },
                body: { prompt: 'test' }
            };

            const res = {
                render: sinon.spy(),
                status: sinon.stub().returnsThis(),
                redirect: sinon.stub().returnsThis(),
                locals: { errormessage: '' }
            };

            try {
                await postPromptForm(req as unknown as express.Request, res as unknown as express.Response);
            } catch (e) {
                expect(e.message).to.equal(expectedErrorMessage);
            }
        })


    });
});