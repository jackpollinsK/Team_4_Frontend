import * as JobRoleController from "../../../main/controllers/JobRoleController";
import * as JobRoleService from "../../../main/services/JobRoleService";
import { JobRoleResponse } from "../../../main/models/JobRoleResponse";
import { expect } from 'chai';
import sinon from 'sinon';

const expected: JobRoleResponse = {
    id: 1,
    roleName: "Manager",
    location: "New York", 
    capability: "Coding",
    band: "B",
    closingDate: new Date(2019, 1, 16),
    status : "open"
}

describe('JobRoleController',function() {
    afterEach(() => {
        sinon.restore();
    });

    describe('getAllJobRoles', function () {
        it('should view Job Roles when Job Roles returned', async () => {
            const jobRoleList = [expected];

            sinon.stub(JobRoleService, 'getJobRoles').resolves(jobRoleList);
            
            const req = { session: {token: ''} };
            const res = { render: sinon.spy() };

            await JobRoleController.getAllJobRoles(req as any, res as any); // eslint-disable-line @typescript-eslint/no-explicit-any

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('pages/allJobRolesList.html', {jobRoles : jobRoleList, pageName: "Job Roles", token: req.session.token})).to.be.true;
        });
    })

    it('should render view with error message when error thrown', async () => {
        const errorMessage: string = 'Error message';
        sinon.stub(JobRoleService, 'getJobRoles').rejects(new Error(errorMessage));

        const req = { };
        const res = { render: sinon.spy(), locals: { errormessage: '' } };

        await JobRoleController.getAllJobRoles(req as any, res as any); // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWith('pages/allJobRolesList.html')).to.be.true;
        expect(res.locals.errormessage).to.equal(errorMessage);
      });
})