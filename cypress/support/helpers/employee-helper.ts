import { ApiHelpers } from "@cypress/support/helpers/api-helpers";
import * as UserPayload from "@cypress/support/api/payload/user-payload";

const ENDPOINTS = {
    employees: "/web/index.php/api/v2/pim/employees",
    users: "/web/index.php/api/v2/admin/users",
};

const ESS_ROLE_ID = 2;

export class EmployeeHelper {

    /**
     * Creates an employee via API and returns its empNumber
     * @param payload - employee name data
     */
    static createEmployee(payload: UserPayload.IEmployeeNamePayload) {
        return ApiHelpers.sendCheckedRequest("POST", ENDPOINTS.employees, payload).then(
            (response) => response.body.data.empNumber as number,
        );
    }

    /**
     * Creates an ESS login account for an employee and returns the user id
     * @param empNumber - the employee the account belongs to
     * @param username - login username
     * @param password - login password
     */
    static createUser(empNumber: number, username: string, password: string) {
        const payload: UserPayload.ICreateUserPayload = {
            username,
            password,
            status: true,
            userRoleId: ESS_ROLE_ID,
            empNumber,
        };

        return ApiHelpers.sendCheckedRequest("POST", ENDPOINTS.users, payload).then(
            (response) => response.body.data.id as number,
        );
    }

    /**
     * Deletes a user account via API
     * @param userId - the user id returned from createUser
     */
    static deleteUser(userId: number) {
        const payload: UserPayload.IDeleteIdsPayload = { ids: [userId] };

        return ApiHelpers.sendCheckedRequest("DELETE", ENDPOINTS.users, payload);
    }

    /**
     * Deletes an employee via API
     * @param empNumber - the employee number returned from createEmployee
     */
    static deleteEmployee(empNumber: number) {
        const payload: UserPayload.IDeleteIdsPayload = { ids: [empNumber] };

        return ApiHelpers.sendCheckedRequest("DELETE", ENDPOINTS.employees, payload);
    }
}