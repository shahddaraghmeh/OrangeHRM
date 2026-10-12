export interface ICreateUserPayload {
    username: string;
    password: string;
    status: boolean;
    userRoleId: number;
    empNumber: number;
}

export interface IDeleteIdsPayload {
    ids: number[];
}

/**
 * Name data used to create an employee through the API
 */
export interface IEmployeeNamePayload {
    firstName: string;
    middleName: string;
    lastName: string;
}