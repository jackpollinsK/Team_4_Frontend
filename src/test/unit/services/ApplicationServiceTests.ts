import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { expect } from 'chai';
import { describe, it } from "node:test";
import { postJobRoleAplication } from "../../../main/services/ApplicationService";
import { JobApplyRoleRequest } from "../../../main/models/JobApplyRoleRequest";

const mock = new MockAdapter(axios);

const testData: JobApplyRoleRequest = {
  email: 'adam@random.com',
  roleID: 1,
  cvLink: 'A link to a cv'
}

describe('ApplicationService', function () {

  describe('postJobRoleAplication', function () {

    it('should post application', async () => {
      mock.onPost("/api/apply-for-role").reply(201, testData);
    })

    it('should throw exception when 500 error returned from axios', async () => {
      mock.onPost("/api/apply-for-role").reply(500);
      try {
        await postJobRoleAplication(testData);
      } catch (e) {
        expect(e.message).to.equal('Internal Server Error.');
      }
    })

    it('should throw exception when 400 error returned from axios', async () => {
      mock.onPost("/api/apply-for-role").reply(400);
      try {
        await postJobRoleAplication(testData);
      } catch (e) {
        expect(e.message).to.equal('You have already applied to this job');
      }
    })
  })

  describe('processJobRoleAplication', function () {


  })

})


