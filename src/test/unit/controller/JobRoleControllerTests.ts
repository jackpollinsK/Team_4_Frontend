import * as JobRoleController from "../../../controllers/JobRoleController";
import * as JobRoleService from "../../../../src/services/JobRoleService";
import { JobRoleResponse } from "../../../models/JobRoleResponse";
import { expect } from 'chai';
import sinon from 'sinon';

const expected: JobRoleResponse = {
    roleName: "Manager",
    location: "New York", 
    capability: "Coding",
    band: "B",
    closingDate: new Date(2019, 1, 16)
}

describe('JobRoleController',function() {
    afterEach(() => {
        sinon.restore();
    });

    describe('getAllJobRoles', function () {
        it('should view Job Roles when Job Roles returned', async () => {
            const jobRoleList = [expected];
            sinon.stub(JobRoleService, 'getJobRoles').resolves(jobRoleList);
            const req = { };
            const res = { render: sinon.spy() };

            await JobRoleController.getAllJobRoles(req as any, res as any); // eslint-disable-line @typescript-eslint/no-explicit-any

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('allJobRolesList', {jobRoles : jobRoleList})).to.be.true;
        });
    })
    it.only('should render view with error message when error thrown', async () => {
        const errorMessage: string = 'Error message';
        sinon.stub(JobRoleService, 'getJobRoles').rejects(new Error(errorMessage));

        const req = { };
        const res = { render: sinon.spy(), locals: { errormessage: '' } };

        await JobRoleController.getAllJobRoles(req as any, res as any); // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWith('allJobRolesList')).to.be.true;
        expect(res.locals.errormessage).to.equal(errorMessage);
      });
})