import * as AuthController from "../../../main/controllers/AuthControllers";
import * as AuthService from "../../../main/services/AuthService";
import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express';
import { LoginRequest } from "../../../main/models/LoginRequest";
import { JwtToken } from "../../../main/models/JwtToken";
import "express-session";
import session from "express-session";
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
      const req = {};
      const res = { render: sinon.spy() };

      await AuthController.getLoginForm(req as any, res as any);

      expect(res.render.calledOnce).to.be.true;
    });
  });

  describe('postLoginForm', function () {
    it('should post login form and redirect to logout form view', async () => {

      const loginRequestObj: LoginRequest = {
        email: "adam@random.com",
        password: "pass123"
      }

      sinon.stub(AuthService, 'getTokenByloggingIn').resolves('12345');

      const req = {
        body: loginRequestObj,
        session: { token: '12345' }
      };

      const res = {
        render: sinon.spy(),
        redirect: sinon.spy()
      };

      await AuthController.postLoginForm(req as any, res as any);

      expect(res.redirect.calledOnce).to.be.true;
      expect(res.redirect.calledWith('/logoutForm')).to.be.true;
    });

    it('should render loginForm view with  User does not exist error message when said error is thrown', async () => {
      const errorMessage: string = 'User does not exist.';
      sinon.stub(AuthService, 'getTokenByloggingIn').resolves('12345').rejects(new Error(errorMessage));

      const invalidEmailLoginRequestObj: LoginRequest = {
        email: "invalid@random.com",
        password: "pass123"
      }

      const req = {
        body: invalidEmailLoginRequestObj,
        session: { token: '12345' }
      };

      const res = {
        render: sinon.spy(),
        redirect: sinon.spy(),
        locals: { errormessage: '' }
      };

      await AuthController.postLoginForm(req as any, res as any);

      expect(res.render.calledOnce).to.be.true;
      expect(res.locals.errormessage).to.equal(errorMessage);
    });

    it('should render loginForm view with  User is not valid: Invalid Credentials. when said error is thrown', async () => {
      const errorMessage: string = 'User does not exist.';
      sinon.stub(AuthService, 'getTokenByloggingIn').resolves('12345').rejects(new Error(errorMessage));

      const invalidPasswordLoginRequestObj: LoginRequest = {
        email: "adam@random.com",
        password: "invalidpass"
      }

      const req = {
        body: invalidPasswordLoginRequestObj,
        session: { token: '12345' }
      };

      const res = {
        render: sinon.spy(),
        redirect: sinon.spy(),
        locals: { errormessage: '' }
      };

      await AuthController.postLoginForm(req as any, res as any);

      expect(res.render.calledOnce).to.be.true;
      expect(res.locals.errormessage).to.equal(errorMessage);
    });
  });

  describe('getLogoutForm', function () {
    it('should render logout form view', async () => {
      const req = {};
      const res = { render: sinon.spy() };

      await AuthController.getLogoutForm(req as any, res as any);

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

      await AuthController.postLogoutForm(req as any, res as any);

      expect(res.redirect.calledOnce).to.be.true;
      expect(res.redirect.calledWith('/loginForm')).to.be.true;
    });
  });

});
