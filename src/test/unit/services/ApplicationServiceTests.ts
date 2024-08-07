import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { expect } from 'chai';
import { describe, it } from "node:test";
import { postJobRoleAplication, processJobRoleAplication } from "../../../main/services/ApplicationService";
import { JobApplyRoleRequest } from "../../../main/models/JobApplyRoleRequest";
import * as AwsUtil from "../../../main/Utils/AwsUtil"
import sinon from "sinon";
import jwt from 'jsonwebtoken';
import { UserRole } from "../../../main/models/JwtToken";
import express from "express";

const mock = new MockAdapter(axios);

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

const testData: JobApplyRoleRequest = {
  email: 'adam@random.com',
  roleID: 1,
  cvLink: 'A link to a cv'
}
const secretKey = 'SUPER_SECRET';
const validJwtToken = jwt.sign({ Role: UserRole.User, sub: "test@random.com" }, secretKey, { expiresIn: '8h' });

const req: testReq1 = {
  session: { token: validJwtToken },
  params: { id: 1 },
  file: null
};

describe('ApplicationService', function () {
  describe('processJobRoleAplication', function () {

  afterEach(() => {
    sinon.restore();
  });

    it('should post application', async () => {
      mock.onPost("/api/apply-for-role").reply(201, testData);
    })

    it('should throw exception when 500 error returned from axios', async () => {
      mock.onPost("/api/apply-for-role").reply(500);
      try {
        await postJobRoleAplication(testData, req.session.token);
      } catch (e) {
        expect(e.message).to.equal('Internal Server Error.');
      }
    })

    it('should throw exception when 400 error returned from axios', async () => {
      mock.onPost("/api/apply-for-role").reply(400);
      try {
        await postJobRoleAplication(testData, req.session.token);
      } catch (e) {
        expect(e.message).to.equal('You have already applied to this job');
      }
    })

    it('should return error when no file is uploaded', async () => {
      //You must upload file

      sinon.stub(AwsUtil, "uploadFileToS3");

      const req: testReq1 = {
        session: { token: validJwtToken },
        params: { id: 1 },
        file: null
      };

      const expectedErrorMessage: string = 'You must upload file';

      try {
        await processJobRoleAplication(req as unknown as express.Request);
      } catch(e){
        expect(e.message).to.equal(expectedErrorMessage);
      }
      sinon.restore();
    });

    it('should return error when file is incorrect format', async () => {
      //Case for Invalid format
      sinon.stub(AwsUtil, "uploadFileToS3");

      const expectedErrorMessage = "You must upload a PDF"

      const req = {
        session: { token: validJwtToken },
        params: { id: 1 },
        file: { mimetype: 'Incorrect', buffer: new Buffer("dawdawdawdaw") }
      };

      try {
        await processJobRoleAplication(req as unknown as express.Request);
      } catch(e){
        expect(e.message).to.equal(expectedErrorMessage);
      }
      sinon.restore();
    });

    it('should throw error when service returns 400', async () => {
      //Case for User already exists

      const expectedErrorMessage = "You have already applied to this job";

      sinon.stub(AwsUtil, "uploadFileToS3")

      const req = {
        session: { token: validJwtToken },
        params: { id: 1 },
        file: { mimetype: 'application/pdf', buffer: new Buffer("dawdawdawdaw") }
      };

      try {
        await processJobRoleAplication(req as unknown as express.Request);
      } catch(e){
        expect(e.message).to.equal(expectedErrorMessage);
      }
      sinon.restore();
    });

    it('should throw an error when AWS Fails upload', async () => {
      //Case for Aws error
      const expectedErrorMessage = "Sorry Something went wrong on our side try again later";

      sinon.stub(AwsUtil, "uploadFileToS3").throws(new Error("Sorry Something went wrong on our side try again later"));
     // sinon.stub(ApplicationService, "postJobRoleAplication");

      const req = {
        session: { token: validJwtToken },
        params: { id: 1 },
        file: { mimetype: 'application/pdf', buffer: new Buffer("dawdawdawdaw") }
      };
      try {
        await processJobRoleAplication(req as unknown as express.Request);
      } catch(e){
        expect(e.message).to.equal(expectedErrorMessage);
      }
      sinon.restore();
    });

  })

})


