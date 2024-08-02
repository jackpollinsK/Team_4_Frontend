import { expect } from 'chai';
import sinon from 'sinon';
import express from "express";
import * as ApplicationContoller from "../../../main/controllers/ApplicationController";
import * as ApplicationService from "../../../main/services/ApplicationService";
import * as AwsUtil from "../../../main/Utils/AwsUtil"
import jwt from 'jsonwebtoken';
import { allowRoles } from "../../../main/middleware/AuthMiddleware";
import { UserRole } from "../../../main/models/JwtToken";
import session from 'express-session';
import { buffer } from 'stream/consumers';
import { error } from 'console';

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
    it('should upload application and redirect to job roles', async () => {
      //Case for Successful Upload

      sinon.stub(AwsUtil, "uploadFileToS3").resolves();
      sinon.stub(ApplicationService, "postJobRoleAplication").resolves();

      const req = {
        session: { token: validJwtToken },
        params: { id: 1 },
        file: { mimeType: 'application/pdf', buffer: new Buffer("dawdawdawdaw") }
      };

      const res = {
        render: sinon.spy(),
        redirect: sinon.stub().returnsThis()
      };


      await ApplicationContoller.postApplyJobRolesForm(req as unknown as express.Request, res as unknown as express.Response);

      expect(res.redirect.calledOnce).to.be.true;
      expect(res.redirect.calledWith('/job-roles')).to.be.true;
    });

    it.only('should return error when no file is uploaded', async () => {
      //You must upload file

      sinon.stub(AwsUtil, "uploadFileToS3").resolves();
      sinon.stub(ApplicationService, "postJobRoleAplication").resolves();

      const req = {
        session: { token: validJwtToken },
        params: { id: 1 },
        file: { }
      };

      const res = {
        render: sinon.spy(),
      };

      await ApplicationContoller.postApplyJobRolesForm(req as unknown as express.Request, res as unknown as express.Response);

      expect(res.render.calledOnce).to.be.true;
      expect(res.render('pages/applyForJobRole.html', { id: req.params.id, pageName: 'Apply for a Job', errormessage: "You must upload file" })).to.be.true;

    });

    it('should render login form view', async () => {
      //Case for Invalid format
      sinon.stub(AwsUtil, "uploadFileToS3").resolves();
      sinon.stub(ApplicationService, "postJobRoleAplication").resolves();

      const req = {
        session: { token: validJwtToken },
        params: { id: 1 },
        file: { mimeType: 'Incorrect', buffer: new Buffer("dawdawdawdaw") }
      };

      const res = {
        render: sinon.spy(),
      };

      await ApplicationContoller.postApplyJobRolesForm(req as unknown as express.Request, res as unknown as express.Response);

      expect(res.render.calledOnce).to.be.true;
      expect(res.render('pages/applyForJobRole.html', { id: req.params.id, pageName: 'Apply for a Job', errormessage: "You must upload a PDF" })).to.be.true;
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
