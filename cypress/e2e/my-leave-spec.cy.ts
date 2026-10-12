import { AuthHelper } from "@cypress/support/helpers/auth-helper";
import { EmployeeHelper } from "@cypress/support/helpers/employee-helper";
import { LeaveHelper } from "@cypress/support/helpers/leave-helper";
import { MyLeavePage } from "@cypress/support/pages/my-leave-page";

const ADMIN_USERNAME = "Admin";
const ADMIN_PASSWORD = "admin123";
const LEAVE_STATUS_SCHEDULED = "Scheduled";

describe("My Leave", () => {
    // Short unique id so every run creates a different employee and username
    const uniqueId = Date.now().toString().slice(-6);
    const employee = { firstName: "Leave", middleName: "", lastName: `Test${uniqueId}` };
    const employeeUser = { username: `leave${uniqueId}`, password: "Test@12345" };
    const leaveDate = LeaveHelper.getFutureWorkingDate();

    // Values returned by the API during the test, used by the next steps and the cleanup
    let empNumber: number;
    let userId: number;
    let leaveTypeId: number;
    let leaveRequestId: number;

    beforeEach(() => {
        // Given: an employee with login credentials and leave entitlements, created via API as admin
        AuthHelper.login(ADMIN_USERNAME, ADMIN_PASSWORD);

        EmployeeHelper.createEmployee(employee)
            .then((id) => {
                empNumber = id;
                // The login account needs the employee number
                return EmployeeHelper.createUser(id, employeeUser.username, employeeUser.password);
            })
            .then((id) => {
                userId = id;
                return LeaveHelper.getFirstLeaveTypeId();
            })
            .then((id) => {
                leaveTypeId = id;
                LeaveHelper.addEntitlement(empNumber, leaveTypeId, leaveDate);
            });
    });

    afterEach(() => {
        // Cleanup via API as admin: delete the user first, then the employee
        AuthHelper.switchUser(ADMIN_USERNAME, ADMIN_PASSWORD);

        if (userId) EmployeeHelper.deleteUser(userId);
        if (empNumber) EmployeeHelper.deleteEmployee(empNumber);
    });

    it("shows an approved future leave as Scheduled", () => {
        // When: the employee logs in and requests a future leave via API
        AuthHelper.switchUser(employeeUser.username, employeeUser.password);
        LeaveHelper.applyLeave(leaveTypeId, leaveDate).then((id) => {
            leaveRequestId = id;
        });

        // And: the admin logs in and approves the leave request via API
        AuthHelper.switchUser(ADMIN_USERNAME, ADMIN_PASSWORD);
        // cy.then makes sure the id is read after the previous request has returned
        cy.then(() => LeaveHelper.approveLeave(leaveRequestId));

        // And: the employee logs in again and opens the My Leave page
        AuthHelper.switchUser(employeeUser.username, employeeUser.password);
        MyLeavePage.visit();

        // Then: the leave appears in the records table with the status Scheduled
        MyLeavePage.checkLeaveStatus(LEAVE_STATUS_SCHEDULED);
    });
});