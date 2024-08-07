import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { expect } from 'chai';
import { JobRoleResponse } from "../../../main/models/JobRoleResponse";
import { describe } from "node:test";
import { deleteJobRoleById, getJobRoleById, getJobRoles, URL, BANDS_URL, CAPABILITIES_URL, LOCATIONS_URL, getBands, getLocations, getCapabilities, createRole} from '../../../main/services/JobRoleService';
import { JobRoleSingleResponse } from "../../../main/models/JobRoleSingleResponse";
import { UserRole } from "../../../main/models/JwtToken";
import jwt from 'jsonwebtoken';
import { Band } from "../../../main/models/Band";
import { Location } from "../../../main/models/Location";
import { Capability } from "../../../main/models/Capability";
import { JobRoleRequest } from "../../../main/models/JobRoleRequest";

const secretKey = 'SUPER_SECRET';
const validJwtToken = jwt.sign({ Role: UserRole.Admin, sub: "test@random.com" }, secretKey, { expiresIn: '8h' });

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

const expectedBands = { id: 1, name: 'Test Band' };
const expectedCapabilities = { id: 1, name: 'Test Capability' };
const expectedLocations = { id: 1, name: 'Test Location', address: 'Test Address', phone: 12345678 };

const mock = new MockAdapter(axios);

describe('JobRoleService', function () {
  beforeEach(() => {
    mock.reset()
  });
  describe('getJobRoles', function () {
    it('should return roles from response', async () => {
      const data = [expected];

      mock.onGet(URL).reply(200, data);

      const results = await getJobRoles(validJwtToken);

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
      await getJobRoles(validJwtToken);
    } catch (e) {
      expect(e.message).to.equal('Failed to get JobRoles');
      return;
    }
  })
})

describe('getJobRoleById', function () {
  it('should return role from response when logged in', async () => {

    mock.onGet(URL + "/1").reply(200, expectedSingle);

    const results = await getJobRoleById("1", validJwtToken);

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
      await getJobRoleById("1", validJwtToken);
    } catch (e) {
      expect(e.message).to.equal('Job Role Not Found');
    }
  });

  it('should throw exception when 500 error returned from axios when logged in', async () => {

    mock.onGet(URL + "/1").reply(500, expectedSingle);
    try {
      await getJobRoleById("1", validJwtToken);
    } catch (e) {
      expect(e.message).to.equal('Sorry There is a problem on our end!');
    }
  });
});

describe('deleteJobRoleById', function () {

  it('should delete job role, when logged in with Admin account', async () => {

    mock.onDelete(URL + "/1").reply(200);

    const response = await deleteJobRoleById("1", validJwtToken);

    expect(response.status).to.equal(200);
  });

  it('should throw exception when 404 error returned from axios when logged in with admin ', async () => {
    mock.onDelete(URL + "/10000").reply(404);
    try {
      await deleteJobRoleById("10000", validJwtToken);
    } catch (e) {
      expect(e.message).to.equal('Job Role Not Found');
    }
  });

  it('should throw exception when 500 error returned from axios when logged in with admin', async () => {
    mock.onDelete(URL + "/1").reply(500);
    try {
      await deleteJobRoleById("1", validJwtToken);
    } catch (e) {
      expect(e.message).to.equal('Sorry There is a problem on our end!');
    }
  });
});

describe('Get Dropdown data', function (){

  it('Should return bands succesfully', async () => {
    mock.onGet(BANDS_URL).reply(200, expectedBands);
      const result: Band[] = await getBands(validJwtToken);
      expect(result).to.deep.equal(expectedBands);
  })

  it('Should return location succesfully', async () => {
    mock.onGet(LOCATIONS_URL).reply(200, expectedLocations);
      const result: Location[] = await getLocations(validJwtToken);
      expect(result).to.deep.equal(expectedLocations);
  })
  it('Should return capabilities succesfully', async () => {
    mock.onGet(CAPABILITIES_URL).reply(200, expectedCapabilities);
      const result: Capability[] = await getCapabilities("12345");
      expect(result).to.deep.equal(expectedCapabilities);
  })
  it('Should fail to return bands', async () => {
    mock.onGet(BANDS_URL).reply(500);
    try {
      await getBands(validJwtToken);
    } catch (e) {
      expect(e.message).to.equal('Failed to get bands');
    }   
  })
  it('Should fail to return locations', async () => {
    mock.onGet(LOCATIONS_URL).reply(500);
    try {
      await getLocations(validJwtToken);
    } catch (e) {
      expect(e.message).to.equal('Failed to get locations');
    }   
  })
  it('Should fail to return capabilities', async () => {
    mock.onGet(CAPABILITIES_URL).reply(500);
    try {
      await getCapabilities(validJwtToken);
    } catch (e) {
      expect(e.message).to.equal('Failed to get capabilities');
    }   
  })
})
describe('createRole', function () {
  it('should create a job role successfully and return the response data', async () => {
      const jobRoleRequest: JobRoleRequest = {
          roleName: 'Test Role',
          location: 1,
          capability: 2,
          band: 3,
          closingDate: new Date('2025-12-18'),
          description: 'Test Description',
          responsibilities: 'Test Responsibilities',
          jobSpec: 'Test Spec',
          openPostions: 5
      };

      const expectedResponse = 'Role created successfully';

      mock.onPost(URL).reply(200, expectedResponse);

      const result = await createRole(jobRoleRequest, validJwtToken);

      expect(result).to.deep.equal(expectedResponse);
  });

  it('should throw an error if the request fails', async () => {
      const jobRoleRequest: JobRoleRequest = {
          roleName: 'Test Role',
          location: 1,
          capability: 2,
          band: 3,
          closingDate: new Date('2025-12-18'),
          description: 'Test Description',
          responsibilities: 'Test Responsibilities',
          jobSpec: 'Test Spec',
          openPostions: 5
      };

      mock.onPost(URL).reply(500);

      try {
          await createRole(jobRoleRequest, validJwtToken);
      } catch (e) {
          expect(e.message).to.equal('Failed to create Job Role');
      }
  });
})