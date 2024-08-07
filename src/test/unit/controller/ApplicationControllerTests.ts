import { expect } from 'chai';
import sinon from 'sinon';
import express from "express";
import * as ApplicationContoller from "../../../main/controllers/ApplicationController";
import * as ApplicationService from "../../../main/services/ApplicationService";
import * as AwsUtil from "../../../main/Utils/AwsUtil"
import jwt from 'jsonwebtoken';
import { allowRoles } from "../../../main/middleware/AuthMiddleware";
import { UserRole } from "../../../main/models/JwtToken";
import * as JobRoleService from '../../../main/services/JobRoleService';
import { JobRoleSingleResponse } from '../../../main/models/JobRoleSingleResponse';

declare module 'express-session' {
  interface SessionData {
    token: string;
  }
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

describe('ApplicationController', function () {
  afterEach(() => {
    sinon.restore();
  });

  const secretKey = 'SUPER_SECRET';
  const validJwtToken = jwt.sign({ Role: UserRole.User, sub: "test@random.com" }, secretKey, { expiresIn: '8h' });

  describe('getApplicationForm', function () {
    it('should render application form when user is logged in', async () => {
      //Case for Successful Upload

      sinon.stub(JobRoleService, 'getJobRoleById').resolves(expectedJobRoleSingle)

      const req = {
        session: { token: validJwtToken },
        params: { id: 1 }
      };

      const res = {
        render: sinon.spy(),
      };

      await ApplicationContoller.getApplyJobRolesForm(req as unknown as express.Request, res as unknown as express.Response);

      expect(res.render.calledOnce).to.be.true;
      expect(res.render.calledWith('pages/applyForJobRole.html', { id: req.params.id, pageName: 'Apply for a Job', token: req.session.token, job: expectedJobRoleSingle })).to.be.true;
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

      sinon.stub(AwsUtil, "uploadFileToS3");
      sinon.stub(ApplicationService, "postJobRoleAplication");

      const req = {
        session: { token: validJwtToken },
        params: { id: 1 },
        file: { mimetype: 'application/pdf', buffer: new Buffer("dawdawdawdaw") }
      };

      const res = {
        render: sinon.spy(),
        redirect: sinon.stub().returnsThis(),
        locals: { errormessage: '' }
      };

      await ApplicationContoller.postApplyJobRolesForm(req as unknown as express.Request, res as unknown as express.Response);

      expect(res.redirect.calledOnce).to.be.true;
      expect(res.redirect.calledWith('/jobRoles')).to.be.true;
    });
  });

});
