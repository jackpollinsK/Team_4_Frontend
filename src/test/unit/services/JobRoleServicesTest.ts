import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { expect } from 'chai';
import { JobRoleResponse } from "../../../models/JobRoleResponse";
import { describe } from "node:test";
import { getJobRoles, URL} from '../../../services/JobRoleService';

const expected: JobRoleResponse = {
    roleName: "Manager",
    location: "New York", 
    capability: "Coding",
    band: "B",
    closingDate: new Date(2019, 1, 16)
}
const mock = new MockAdapter(axios);

describe('JobRoleService', function () {
    describe('getJobRoles', function () {
        it('should return roles from response', async () => {
            const data = [expected];
            mock.onGet(URL).reply(200,data);
            const results = await getJobRoles();


            const actual: JobRoleResponse = {
                roleName: results[0].roleName,
                location: results[0].location, 
                capability: results[0].capability,
                band: results[0].band,
                closingDate: new Date(results[0].closingDate)

            }


            expect(actual).to.deep.equal(expected) 
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


