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

interface testReq1 {
  session: {
    token: string;
  };
  params: {
    id: number;
  };
  file: File | null;
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
  const validJwtToken = jwt.sign({ Role: UserRole.User, sub: "test@random.com"}, secretKey, { expiresIn: '8h' });

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
        locals: {errormessage: ''}
      };
      
      await ApplicationContoller.postApplyJobRolesForm(req as unknown as express.Request, res as unknown as express.Response);

      expect(res.redirect.calledOnce).to.be.true;
      expect(res.redirect.calledWith('/job-roles')).to.be.true;
    });

    it('should return error when no file is uploaded', async () => {
      //You must upload file

      sinon.stub(AwsUtil, "uploadFileToS3");
      sinon.stub(ApplicationService, "postJobRoleAplication");

      const req: testReq1 = {
        session: { token: validJwtToken },
        params: { id: 1 },
        file: null
      };

      const res = {
        render: sinon.spy(),
        locals: { errormessage: '' }
      };

      const expectedErrorMessage: string = 'You must upload file';
      await ApplicationContoller.postApplyJobRolesForm(req as unknown as express.Request, res as unknown as express.Response);

      expect(res.render.calledOnce).to.be.true;
      expect(res.locals.errormessage).to.equal(expectedErrorMessage);
    });

    it('should return error when file is incorrect format', async () => {
      //Case for Invalid format
      sinon.stub(AwsUtil, "uploadFileToS3")
      sinon.stub(ApplicationService, "postJobRoleAplication")

      const expectedErrorMessage = "You must upload a PDF"

      const req = {
        session: { token: validJwtToken },
        params: { id: 1 },
        file: { mimetype: 'Incorrect', buffer: new Buffer("dawdawdawdaw") }
      };

      const res = {
        render: sinon.spy(),
        locals: {errormessage: ''}
      };

      await ApplicationContoller.postApplyJobRolesForm(req as unknown as express.Request, res as unknown as express.Response);

      expect(res.render.calledOnce).to.be.true;
      expect(res.locals.errormessage).equal(expectedErrorMessage);
    });

    it('should throw error when service returns 400', async () => {
      //Case for User already exists

      const errormessage = "You have already applied to this job";

      sinon.stub(AwsUtil, "uploadFileToS3")
      sinon.stub(ApplicationService, "postJobRoleAplication").throws(new Error(errormessage));

      const req = {
        session: { token: validJwtToken },
        params: { id: 1 },
        file: { mimetype: 'application/pdf', buffer: new Buffer("dawdawdawdaw") }
      };

      const res = {
        render: sinon.spy(),
        status: sinon.stub().returnsThis(),
        locals: { errormessage: '' }
      };

      await ApplicationContoller.postApplyJobRolesForm(req as unknown as express.Request, res as unknown as express.Response);

      expect(res.render.calledOnce).to.be.true;
      expect(res.locals.errormessage).equal(errormessage);
    });

    it('should throw an error when AWS Fails upload', async () => {
      //Case for Aws error
      const errormessage = "Sorry Something went wrong on our side try again later";

      sinon.stub(AwsUtil, "uploadFileToS3").throws(new Error(errormessage));
      sinon.stub(ApplicationService, "postJobRoleAplication");

      const req = {
        session: { token: validJwtToken },
        params: { id: 1 },
        file: { mimetype: 'application/pdf', buffer: new Buffer("dawdawdawdaw") }
      };

      const res = {
        render: sinon.spy(),
        locals: { errormessage: '' }
      };

      await ApplicationContoller.postApplyJobRolesForm(req as unknown as express.Request, res as unknown as express.Response);

      expect(res.render.calledOnce).to.be.true;
      expect(res.locals.errormessage).equal(errormessage);
    });

    it('should return a error when 500 is returned from service', async () => {
      //Case for Server Error
      const errormessage = "Internal Server Error.";

      sinon.stub(AwsUtil, "uploadFileToS3")
      sinon.stub(ApplicationService, "postJobRoleAplication").throws(new Error(errormessage));

      const req = {
        session: { token: validJwtToken },
        params: { id: 1 },
        file: { mimetype: 'application/pdf', buffer: new Buffer("dawdawdawdaw") }
      };

      const res = {
        render: sinon.spy(),
        status: sinon.stub().returnsThis(),
        locals: { errormessage: '' }
      };

      await ApplicationContoller.postApplyJobRolesForm(req as unknown as express.Request, res as unknown as express.Response);

      expect(res.render.calledOnce).to.be.true;
      expect(res.locals.errormessage).equal(errormessage);
    });

  });

});
