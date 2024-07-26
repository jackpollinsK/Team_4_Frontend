import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { expect } from 'chai';
import { JobRoleResponse } from "../../../main/models/JobRoleResponse";
import { describe } from "node:test";
import { getJobRoles, URL} from '../../../main/services/JobRoleService';


const expected: JobRoleResponse = {
    id: 1,
    roleName: "Manager",
    location: "New York", 
    capability: "Coding",
    band: "B",
    closingDate: new Date(2019, 1, 16),
    status: "open"
}
const mock = new MockAdapter(axios);

describe('JobRoleService', function () {
    describe('getJobRoles', function () {
        it('should return roles from response', async () => {
            const data = [expected];

            mock.onGet(URL).reply(200,data);

            const results = await getJobRoles();
  
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
    mock.onGet(URL).reply(500);
    try {
      await getJobRoles();
    } catch (e) {
      expect(e.message).to.equal('Failed to get JobRoles');
      return;
    }
  })
})


