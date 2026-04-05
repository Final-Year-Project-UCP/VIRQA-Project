import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

const testAdminApi = async () => {
    const ts = Date.now();
    const adminUser = {
        fullName: "Test Admin",
        email: `admin_${ts}@gmail.com`,
        password: "password123",
        organization: "VIRQA"
    };

    let cookieHeader = "";

    try {
        console.log("\n1. --- Testing Admin Registration (User Controller) ---");
        const regResponse = await axios.post(`${API_URL}/user/register`, adminUser);
        console.log("Registration Success:", regResponse.data);

        console.log("\n2. --- Testing Admin Login (User Controller) ---");
        const loginResponse = await axios.post(`${API_URL}/user/login`, {
            email: adminUser.email,
            password: adminUser.password
        });
        console.log("Login Success:", loginResponse.data);

        const cookies = loginResponse.headers['set-cookie'];
        const tokenStr = cookies ? cookies.find(c => c.startsWith('token=')) : null;
        cookieHeader = tokenStr ? tokenStr.split(';')[0] : '';

        const axiosConfig = {
            headers: { Cookie: cookieHeader },
            withCredentials: true
        };

        console.log("\n3. --- Testing Admin GET Profile ---");
        const getProfileRes = await axios.get(`${API_URL}/admin/profile`, axiosConfig);
        console.log("GET Profile Success:", getProfileRes.data);

        console.log("\n4. --- Testing Admin POST Profile ---");
        const postProfileRes = await axios.post(`${API_URL}/admin/profile`, {
            fullName: "Updated Admin Name",
            department: "IT",
            professionalBio: "A test bio"
        }, axiosConfig);
        console.log("POST Profile Success:", postProfileRes.data);

        console.log("\n5. --- Testing Admin Add Employee ---");
        const testEmployeeEmail = `employee_${ts}@gmail.com`;
        const addEmpRes = await axios.post(`${API_URL}/admin/add-employee`, {
            email: testEmployeeEmail,
            role: "Developer"
        }, axiosConfig);
        console.log("Add Employee Success:", addEmpRes.data);

        console.log("\n6. --- Testing Admin Update Employee ---");
        const newEmployeeEmail = `updated_emp_${ts}@gmail.com`;
        const updateEmpRes = await axios.patch(`${API_URL}/admin/update-employee`, {
            oldEmail: testEmployeeEmail,
            email: newEmployeeEmail,
            role: "Senior Developer"
        }, axiosConfig);
        console.log("Update Employee Success:", updateEmpRes.data);

        console.log("\n7. --- Testing Admin Manage Employees (GET) ---");
        const getManageEmpRes = await axios.get(`${API_URL}/admin/manage-employee`, axiosConfig);
        const employees = getManageEmpRes.data.data;
        console.log(`Manage Employees Success: Found ${employees.length} employees.`);

        const insertedEmployee = employees.find(e => e.email === newEmployeeEmail);
        if (insertedEmployee) {
            console.log("\n8. --- Testing Admin Delete Employee ---");
            const delEmpRes = await axios.delete(`${API_URL}/admin/employee/${insertedEmployee._id}`, axiosConfig);
            console.log("Delete Employee Success:", delEmpRes.data);
        } else {
            console.log("\n8. --- Skipping Delete Employee: Could not find created employee ---");
        }

    } catch (error) {
        if (error.response) {
            console.error("API Error Status:", error.response.status);
            console.error("API Error Data:", error.response.data);
        } else {
            console.error("Connection Error:", error.message);
        }
    }
};

testAdminApi();
