import { JobRoleRequest } from "../models/JobRoleRequest";

const currentDate = new Date();

export const validateJobRoleRequest = (jobRoleRequest: JobRoleRequest): string[] => {
    const errors: string[] = [];
    const date = new Date(jobRoleRequest.closingDate);

    if (!jobRoleRequest.roleName || jobRoleRequest.roleName.length > 100) {
        errors.push("Invalid Role Name");
    }

    if (!jobRoleRequest.description || jobRoleRequest.description.length > 2000) {
        errors.push("Invalid Description length");
    }

    if (!jobRoleRequest.responsibilities || jobRoleRequest.responsibilities.length > 1000) {
        errors.push("Invalid Responsibilities length");
    }

    if (!jobRoleRequest.jobSpec || jobRoleRequest.jobSpec.length > 500) {
        errors.push("Invalid Job Specification Link");
    }

    if (date < currentDate) {
        errors.push("Invalid Closing Date");
    }

    return errors;
}
