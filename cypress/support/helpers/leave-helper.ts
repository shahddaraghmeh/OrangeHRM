import { ApiHelpers } from "@cypress/support/helpers/api-helpers";
import * as LeavePayload from "@cypress/support/api/payload/leave-payload";

const ENDPOINTS = {
    leaveTypes: "/web/index.php/api/v2/leave/leave-types",
    entitlements: "/web/index.php/api/v2/leave/leave-entitlements",
    leaveRequests: "/web/index.php/api/v2/leave/leave-requests",
    employeeLeaveRequest: (leaveRequestId: number) =>
        `/web/index.php/api/v2/leave/employees/leave-requests/${leaveRequestId}`,
};

const ENTITLEMENT_DAYS = 10;

export class LeaveHelper {

    /**
     * Returns a future date that falls on a weekday, formatted as YYYY-MM-DD
     * @param daysAhead - minimum number of days from today, default 14
     */
    static getFutureWorkingDate(daysAhead: number = 14) {
        const date = new Date();

        date.setDate(date.getDate() + daysAhead);
        while (date.getDay() === 0 || date.getDay() === 6) {
            date.setDate(date.getDate() + 1);
        }

        return date.toLocaleDateString("en-CA");
    }

    /**
     * Gets the id of the first available leave type
     */
    static getFirstLeaveTypeId() {
        return ApiHelpers.sendCheckedRequest("GET", ENDPOINTS.leaveTypes).then(
            (response) => response.body.data[0].id as number,
        );
    }

    /**
     * Adds a leave entitlement covering the whole year of the given date
     * @param empNumber - the employee to give the entitlement to
     * @param leaveTypeId - the leave type
     * @param leaveDate - a date (YYYY-MM-DD) whose year the entitlement should cover
     */
    static addEntitlement(empNumber: number, leaveTypeId: number, leaveDate: string) {
        const year = leaveDate.slice(0, 4);
        const payload: LeavePayload.IAddEntitlementPayload = {
            empNumber,
            leaveTypeId,
            fromDate: `${year}-01-01`,
            toDate: `${year}-12-31`,
            entitlement: ENTITLEMENT_DAYS,
        };

        return ApiHelpers.sendCheckedRequest("POST", ENDPOINTS.entitlements, payload);
    }

    /**
     * Applies a one-day leave as the currently logged in user and returns the leave request id
     * @param leaveTypeId - the leave type
     * @param leaveDate - the leave day (YYYY-MM-DD)
     */
    static applyLeave(leaveTypeId: number, leaveDate: string) {
        const payload: LeavePayload.IApplyLeavePayload = {
            leaveTypeId,
            fromDate: leaveDate,
            toDate: leaveDate,
            comment: null,
            duration: { type: "full_day" },
        };

        return ApiHelpers.sendCheckedRequest("POST", ENDPOINTS.leaveRequests, payload).then(
            (response) => response.body.data.id as number,
        );
    }

    /**
     * Approves a leave request as the currently logged in admin
     * @param leaveRequestId - the id returned from applyLeave
     */
    static approveLeave(leaveRequestId: number) {
        return ApiHelpers.sendCheckedRequest("PUT", ENDPOINTS.employeeLeaveRequest(leaveRequestId), {
            action: "APPROVE",
        });
    }
}