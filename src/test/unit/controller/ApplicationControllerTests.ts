import { expect } from 'chai';
import sinon from 'sinon';
import express from "express";
import * as ApplicationContoller from "../../../main/controllers/ApplicationController";
import * as ApplicationService from "../../../main/services/ApplicationService";
import { getApplyJobRolesForm } from '../../../main/controllers/ApplicationController';
import jwt from 'jsonwebtoken';
import { allowRoles } from "../../../main/middleware/AuthMiddleware";
import { UserRole } from "../../../main/models/JwtToken";
import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    token: string;
  }
}

describe('ApplicationController', function () {
  afterEach(() => {
    sinon.restore();
  });

  const secretKey = 'SUPER_SECRET';
  const validJwtToken = jwt.sign({ Role: UserRole.User }, secretKey, { expiresIn: '8h' });

  describe('getApplicationForm', function () {
    it('should render application form when user is logged in', async () => {
      //Case for Successful Upload

      const req = {
        session: { token: validJwtToken },
        params: { id: 1 }
      };

      const res = {
        render: sinon.spy(),
      };

      await ApplicationContoller.getApplyJobRolesForm(req as unknown as express.Request, res as unknown as express.Response);

      expect(res.render.calledOnce).to.be.true;
      expect(res.render.calledWith('pages/applyForJobRole.html', { id: req.params.id, pageName: 'Apply for a Job', token: req.session.token })).to.be.true;
    });
  });

  it('should render Not logged in page when user is not signed in', async () => {
    //Case for Successful Upload
    const req = {
      session: { token: '' },
      params: { id: 1 }
    };

    const res = {
      render: sinon.spy(),
      status: sinon.stub().returnsThis(),
      redirect: sinon.stub().returnsThis(),
      locals: { errormessage: '' }
    };

    const next = sinon.stub();

    await ApplicationContoller.getApplyJobRolesForm(req as unknown as express.Request, res as unknown as express.Response);


    const middleware = allowRoles([UserRole.Admin, UserRole.User]);

    await middleware(req as unknown as express.Request, res as unknown as express.Response, next);

    expect(res.render.calledOnce).to.be.true;
    expect(res.redirect.calledWith('/notLoggedIn')).to.be.true;
  });


  describe('postApplicationForm', function () {
    it('should render login form view', async () => {
      //Case for Successful Upload
    });

    it('should render login form view', async () => {
      //You must upload file
    });

    it('should render login form view', async () => {
      //auth reqected
    });

    it('should render login form view', async () => {
      //Case for Invalid format
    });

    it('should render login form view', async () => {
      //Case for No file
    });

    it('should render login form view', async () => {
      //Case for User already exists
    });

    it('should render login form view', async () => {
      //Case for Aws error
    });

    it('should render login form view', async () => {
      //Case for Server Error
    });

  });

});
