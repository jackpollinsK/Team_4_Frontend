import { expect } from 'chai';
import { JobRoleRequest } from '../../../main/models/JobRoleRequest';
import { validateJobRoleRequest } from '../../../main/validators/validateJobRoleRequest';

describe('validateJobRoleRequest', () => {
    const currentDate = new Date();

    it('should return no errors for a valid job role request', () => {
        const validRequest: JobRoleRequest = {
            roleName: 'Valid Role',
            location: 1,
            capability: 2,
            band: 3,
            closingDate: new Date(currentDate.getTime() + 1000000),
            description: 'Valid description.',
            responsibilities: 'Valid responsibilities.',
            jobSpec: 'Valid job specification.',
            openPositions: 5
        };

        const errors = validateJobRoleRequest(validRequest);
        expect(errors).to.be.empty;
    });

    it('should return an error if the role name is too long', () => {
        const invalidRequest: JobRoleRequest = {
            roleName: 'a'.repeat(101),
            location: 1,
            capability: 2,
            band: 3,
            closingDate: new Date(currentDate.getTime() + 1000000),
            description: 'Valid description.',
            responsibilities: 'Valid responsibilities.',
            jobSpec: 'Valid job specification.',
            openPositions: 5
        };

        const errors = validateJobRoleRequest(invalidRequest);
        expect(errors).to.include('Role Name is too long');
    });

    it('should return an error if the description is too long', () => {
        const invalidRequest: JobRoleRequest = {
            roleName: 'Valid Role',
            location: 1,
            capability: 2,
            band: 3,
            closingDate: new Date(currentDate.getTime() + 1000000),
            description: 'a'.repeat(2001),
            responsibilities: 'Valid responsibilities.',
            jobSpec: 'Valid job specification.',
            openPositions: 5
        };

        const errors = validateJobRoleRequest(invalidRequest);
        expect(errors).to.include('Description is too long');
    });

    it('should return an error if the responsibilities are too long', () => {
        const invalidRequest: JobRoleRequest = {
            roleName: 'Valid Role',
            location: 1,
            capability: 2,
            band: 3,
            closingDate: new Date(currentDate.getTime() + 1000000),
            description: 'Valid description.',
            responsibilities: 'a'.repeat(1001),
            jobSpec: 'Valid job specification.',
            openPositions: 5
        };

        const errors = validateJobRoleRequest(invalidRequest);
        expect(errors).to.include('Responsibilities is too long');
    });

    it('should return an error if the job specification is too long', () => {
        const invalidRequest: JobRoleRequest = {
            roleName: 'Valid Role',
            location: 1,
            capability: 2,
            band: 3,
            closingDate: new Date(currentDate.getTime() + 1000000),
            description: 'Valid description.',
            responsibilities: 'Valid responsibilities.',
            jobSpec: 'a'.repeat(501),
            openPositions: 5
        };

        const errors = validateJobRoleRequest(invalidRequest);
        expect(errors).to.include('Job Specification is too long');
    });

    it('should return an error if the closing date is in the past', () => {
        const invalidRequest: JobRoleRequest = {
            roleName: 'Valid Role',
            location: 1,
            capability: 2,
            band: 3,
            closingDate: new Date(currentDate.getTime() - 1000000),
            description: 'Valid description.',
            responsibilities: 'Valid responsibilities.',
            jobSpec: 'Valid job specification.',
            openPositions: 5
        };

        const errors = validateJobRoleRequest(invalidRequest);
        expect(errors).to.include('Invalid Closing Date');
    });
});
