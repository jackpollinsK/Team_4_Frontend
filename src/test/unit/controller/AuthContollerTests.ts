import * as AuthController from "../../../main/controllers/AuthControllers";
import * as AuthService from "../../../main/services/AuthService";
import { expect } from 'chai';
import sinon from 'sinon';
import express from "express";
import { LoginRequest } from "../../../main/models/LoginRequest";
import "express-session";
declare module "express-session" {
  interface SessionData {
    token: string;
  }
}

describe('AuthController', function () {
  afterEach(() => {
    sinon.restore();
  });

  describe('getLoginForm', function () {
    it('should render login form view', async () => {
      const req = { session: {token: ''} };
      const res = { render: sinon.spy() };

      await AuthController.getLoginForm(req as express.Request, res as unknown as express.Response);

      expect(res.render.calledOnce).to.be.true;
    });
  });

  describe('postLoginForm', function () {
    it('should post login form and redirect to home form view', async () => {

      const loginRequestObj: LoginRequest = {
        email: "adam@random.com",
        password: "pass123"
      }

      sinon.stub(AuthService, 'getTokenByloggingIn').resolves('12345');

      const req = {
        body: loginRequestObj,
        session: {token: ''}
      };

      const res = {
        render: sinon.spy(),
        redirect: sinon.spy()
      };

      await AuthController.postLoginForm(req as express.Request, res as unknown as express.Response);

      expect(req.session.token).to.equal('12345');
      expect(res.redirect.calledOnce).to.be.true;
      expect(res.redirect.calledWith('/')).to.be.true;
    });

    it('should render loginForm view with, user does not exist, error message when said error is thrown', async () => {
      const errorMessage: string = 'user does not exist.';
      sinon.stub(AuthService, 'getTokenByloggingIn').rejects(new Error(errorMessage));

      const invalidEmailLoginRequestObj: LoginRequest = {
        email: "invalid@random.com",
        password: "pass123"
      }

      const req = {
        body: invalidEmailLoginRequestObj,
        session: { token: '' }
      };

      const res = {
        render: sinon.spy(),
        redirect: sinon.spy(),
        locals: { errormessage: '' }
      };

      await AuthController.postLoginForm(req as express.Request, res as unknown as express.Response);

      expect(res.render.calledOnce).to.be.true;
      expect(res.locals.errormessage).to.equal(errorMessage);
    });

    it('should render loginForm view with, user is not valid: Invalid Credentials., error message when said error is thrown', async () => {
      const errorMessage: string = 'user is not valid: Invalid Credentials.';
      sinon.stub(AuthService, 'getTokenByloggingIn').rejects(new Error(errorMessage));

      const invalidEmailLoginRequestObj: LoginRequest = {
        email: "adam@random.com",
        password: "invalidPass"
      }

      const req = {
        body: invalidEmailLoginRequestObj,
        session: { token: '' }
      };

      const res = {
        render: sinon.spy(),
        redirect: sinon.spy(),
        locals: { errormessage: '' }
      };

      await AuthController.postLoginForm(req as express.Request, res as unknown as express.Response);

      expect(res.render.calledOnce).to.be.true;
      expect(res.locals.errormessage).to.equal(errorMessage);
    });
  });

  describe('getLogoutForm', function () {
    it('should render logout form view', async () => {
      const req = { session: {token: ''} };
      const res = { render: sinon.spy() };

      await AuthController.getLogoutForm(req as express.Request, res as unknown as express.Response);

      expect(res.render.calledOnce).to.be.true;
    });
  });

  describe('postLogoutForm', function () {
    it('should post logout form and redirect to login form view', async () => {

      const req = {
        session: { token: '12345' }
      };

      const res = {
        render: sinon.spy(),
        redirect: sinon.spy()
      };

      await AuthController.postLogoutForm(req as express.Request, res as unknown as express.Response);

      expect(req.session.token).to.equal('');
      expect(res.redirect.calledOnce).to.be.true;
      expect(res.redirect.calledWith('/')).to.be.true;
    });

    describe('getNotLoggedIn', function () {
      it('should render notLoggedIn form view', async () => {
        const req = {};
        const res = { render: sinon.spy() };
  
        await AuthController.getNotLoggedIn(req as express.Request, res as unknown as express.Response);
  
        expect(res.render.calledOnce).to.be.true;
      });
    });

  });

});
