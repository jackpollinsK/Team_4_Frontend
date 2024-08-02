import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { expect } from 'chai';
import { JobRoleResponse } from "../../../main/models/JobRoleResponse";
import { describe } from "node:test";
import { getJobRoleById, getJobRoles, URL } from '../../../main/services/JobRoleService';
import { JobRoleSingleResponse } from "../../../main/models/JobRoleSingleResponse";


const expected: JobRoleResponse = {
  id: 1,
  roleName: "Manager",
  location: "New York",
  capability: "Coding",
  band: "B",
  closingDate: new Date(2019, 1, 16),
  status: "open"
}

const expectedSingle: JobRoleSingleResponse = {
  id: 1,
  roleName: "Engineer",
  location: "Belfast",
  capability: "Coding",
  band: "A",
  closingDate: new Date(2019, 1, 16),
  status: "Open",
  description: "A short description",
  responsibilities: "Something Important",
  jobSpec: "A Link to a page"
}

const mock = new MockAdapter(axios);

describe('JobRoleService', function () {
  describe('getJobRoles', function () {
    it('should return roles from response', async () => {
      const data = [expected];

      mock.onGet(URL).reply(200, data);

      const results = await getJobRoles("12345");

      expect(results[0].id).to.deep.equal(expected.id);
      expect(results[0].roleName).to.deep.equal(expected.roleName);
      expect(results[0].location).to.deep.equal(expected.location);
      expect(results[0].capability).to.deep.equal(expected.capability);
      expect(results[0].band).to.deep.equal(expected.band);
      expect(results[0].closingDate).to.deep.equal(expected.closingDate.toISOString());
      expect(results[0].status).to.deep.equal(expected.status);
    })

  })

  it('should throw exception when 500 error returned from axios', async () => {
    mock.onGet("/api/JobRoles").reply(500);
    try {
      await getJobRoles("12345");
    } catch (e) {
      expect(e.message).to.equal('Failed to get JobRoles');
      return;
    }
  })
})

describe('getJobRoleById', function () {
  it('should return role from response when logged in', async () => {

    mock.onGet(URL + "/1").reply(200, expectedSingle);

    const results = await getJobRoleById("1", "12345");

    expect(results.id).to.deep.equal(expectedSingle.id);
    expect(results.roleName).to.deep.equal(expectedSingle.roleName);
    expect(results.location).to.deep.equal(expectedSingle.location);
    expect(results.capability).to.deep.equal(expectedSingle.capability);
    expect(results.band).to.deep.equal(expectedSingle.band);
    expect(results.closingDate).to.deep.equal(expectedSingle.closingDate.toISOString());
    expect(results.status).to.deep.equal(expectedSingle.status);
    expect(results.description).to.deep.equal(expectedSingle.description);
    expect(results.responsibilities).to.deep.equal(expectedSingle.responsibilities);
    expect(results.jobSpec).to.deep.equal(expectedSingle.jobSpec);

  });

  it('should throw exception when 404 error returned from axios when logged in ', async () => {

    mock.onGet(URL + "/1").reply(404, expectedSingle);
    try {
      await getJobRoleById("1", "12345");
    } catch (e) {
      expect(e.message).to.equal('Job Not Found');
    }
  });

  it('should throw exception when 500 error returned from axios when logged in', async () => {

    mock.onGet(URL + "/1").reply(500, expectedSingle);
    try {
      await getJobRoleById("1", "12345");
    } catch (e) {
      expect(e.message).to.equal('Sorry There is a problem on our end!');
    }
  });
});



