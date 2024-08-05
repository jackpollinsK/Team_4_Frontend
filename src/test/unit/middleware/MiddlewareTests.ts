import { expect } from 'chai';
import sinon from 'sinon';
import express from "express";
import { allowRoles } from "../../../main/middleware/AuthMiddleware";
import { UserRole } from "../../../main/models/JwtToken";
import "core-js/stable/atob";
import jwt from 'jsonwebtoken';

describe('Middleware', function () {
    afterEach(() => {
        sinon.restore();
    });

    describe('allowRoles', function () {
        it('should render notLoggedIn view and return 401 status, when user is NOT logged in', async () => {

            const req = {
                session: { token: '' }
            };

            const res = {
                status: sinon.stub().returnsThis(),
                redirect: sinon.stub().returnsThis()
            };

            const next = sinon.stub();

            const middleware = allowRoles([UserRole.Admin, UserRole.User]);

            await middleware(req as unknown as express.Request, res as unknown as express.Response, next);

            expect((res.status as sinon.SinonStub).calledWith(401)).to.be.true;
            expect(req.session.token).to.equal('');
            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.calledWith('/notLoggedIn')).to.be.true;
        });

        it('should render notAuthorised view and return 403 status, when a user is logged in with User permission, but they try to access admin permission content', async () => {

            const secretKey = 'SUPER_SECRET';
            const validJwtToken = jwt.sign({ Role: UserRole.User }, secretKey, { expiresIn: '8h' });

            const req = {
                session: { token: validJwtToken }
            };

            const res = {
                status: sinon.stub().returnsThis(),
                redirect: sinon.stub().returnsThis()
            };

            const next = sinon.stub();

            const middleware = allowRoles([UserRole.Admin]);

            await middleware(req as unknown as express.Request, res as unknown as express.Response, next);

            expect((res.status as sinon.SinonStub).calledWith(403)).to.be.true;
            expect(res.redirect.calledOnce).to.be.true;
            expect(res.redirect.calledWith('/notAuthorised')).to.be.true;
        });
    });
});