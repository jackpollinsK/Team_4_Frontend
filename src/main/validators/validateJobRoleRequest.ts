import { JobRoleRequest } from "../models/JobRoleRequest";

const currentDate = new Date();

export const validateJobRoleRequest = (jobRoleRequest: JobRoleRequest): string[] => {
    const errors: string[] = [];
    const date = new Date(jobRoleRequest.closingDate);

    if (jobRoleRequest.roleName.length > 100) {
        errors.push("Role Name is too long");
    }

    if (jobRoleRequest.description.length > 2000) {
        errors.push("Description is too long");
    }

    if (jobRoleRequest.responsibilities.length > 1000) {
        errors.push("Responsibilities is too long");
    }

    if (jobRoleRequest.jobSpec.length > 500) {
        errors.push("Job Specification is too long");
    }

    if (date < currentDate) {
        errors.push("Invalid Closing Date");
    }

    return errors;
}
