import * as AuthController from "../../../main/controllers/AuthControllers";
import * as AuthService from "../../../main/services/AuthService";
import { expect } from 'chai';
import sinon from 'sinon';
import { Request, Response } from 'express'; 
import { LoginRequest } from "../../../main/models/LoginRequest";
import { JwtToken } from "../../../main/models/JwtToken";
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
          const req = { };
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

        const req = {
          body: loginRequestObj
        };
        const res = { 
          render: sinon.spy(),
          redirect: sinon.spy(),
          locals: {}
        };

        await AuthController.postLoginForm(req as any, res as any);

        expect(res.redirect.calledOnce).to.be.true;
        expect(res.redirect.calledWith('/logoutForm')).to.be.true;
      });
  });


});
