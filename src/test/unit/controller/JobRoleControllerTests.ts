import * as JobRoleController from "../../../main/controllers/JobRoleController";
import * as JobRoleService from "../../../main/services/JobRoleService";
import { JobRoleResponse } from "../../../main/models/JobRoleResponse";
import { expect } from 'chai';
import sinon from 'sinon';
import { JobRoleSingleResponse } from "../../../main/models/JobRoleSingleResponse";

const expectedJobRole: JobRoleResponse = {
    id: 1,
    roleName: "Manager",
    location: "New York", 
    capability: "Coding",
    band: "B",
    closingDate: new Date(2019, 1, 16),
    status : "open"
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
    jobSpec: "A Link to a page"
}

describe('JobRoleController',function() {
    afterEach(() => {
        sinon.restore();
    });

    describe('getAllJobRoles', function () {
        it('should view Job Roles when Job Roles returned', async () => {
            const jobRoleList = [expectedJobRole];

            sinon.stub(JobRoleService, 'getJobRoles').resolves(jobRoleList);
            
            const req = { };
            const res = { render: sinon.spy() };

            await JobRoleController.getAllJobRoles(req as any, res as any); // eslint-disable-line @typescript-eslint/no-explicit-any

            expect(res.render.calledOnce).to.be.true;
            expect(res.render.calledWith('pages/allJobRolesList.html', {jobRoles : jobRoleList, pageName: "Job Roles"})).to.be.true;
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


describe('getJobRole', function () {
    it('should view a Job Role when a Job Role is returned', async () => {

        const job = expectedJobRoleSingle;

        sinon.stub(JobRoleService, 'getJobRoleById').resolves(expectedJobRoleSingle);

        const req = { params: {id: 1}};
        const res = { render: sinon.spy() };

        await JobRoleController.getJobRole(req as any, res as any); // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWith('pages/singleJobRole.html', {pageName: job.roleName+ ": " + job.band, job: job})).to.be.true;
    });


    it('should render view with error message when error thrown', async () => {
        const errorMessage: string = 'Error message';
        sinon.stub(JobRoleService, 'getJobRoleById').rejects(new Error(errorMessage));

        const req = { params: {id: 1}};
        const res = { render: sinon.spy(), locals: { errormessage: '' } };

        await JobRoleController.getJobRole(req as any, res as any); // eslint-disable-line @typescript-eslint/no-explicit-any

        expect(res.render.calledOnce).to.be.true;
        expect(res.render.calledWith('pages/errorPage.html')).to.be.true;
        expect(res.locals.errormessage).to.equal(errorMessage);
      });

})
})