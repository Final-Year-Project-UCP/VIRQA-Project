import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

const testEmployeeApi = async () => {
    const ts = Date.now();

    // We need an admin to create an employee
    const adminUser = {
        fullName: "Test Admin",
        email: `admin_${ts}@gmail.com`,
        password: "password123",
        organization: "VIRQA"
    };

    let adminCookieHeader = "";

    try {
        console.log("\n1. --- Testing Admin Setup for Employee Creation ---");
        await axios.post(`${API_URL}/user/register`, adminUser);
        const loginResponse = await axios.post(`${API_URL}/user/login`, {
            email: adminUser.email,
            password: adminUser.password
        });

        const cookies = loginResponse.headers['set-cookie'];
        const tokenStr = cookies ? cookies.find(c => c.startsWith('token=')) : null;
        adminCookieHeader = tokenStr ? tokenStr.split(';')[0] : '';

        const adminConfig = {
            headers: { Cookie: adminCookieHeader },
            withCredentials: true
        };

        console.log("\n2. --- Admin: POST /add-employee ---");
        const empEmail = `employee_${ts}@gmail.com`;
        const addEmpRes = await axios.post(`${API_URL}/admin/add-employee`, {
            email: empEmail,
            role: "Developer"
        }, adminConfig);
        console.log("Add Employee Success:", addEmpRes.data);

        // Extract token from activation link: http://localhost:5173/activate-account?token=XYZ
        const activationLink = addEmpRes.data.activationLink;
        const employeeToken = new URL(activationLink).searchParams.get("token");
        console.log("Extracted Employee Token:", employeeToken);

        console.log("\n3. --- Employee: POST /activate-account ---");
        const activateRes = await axios.post(`${API_URL}/employee/activate-account`, {
            token: employeeToken,
            password: "employeePassword123" // Setting their own password
        });
        console.log("Activate Account Success:", activateRes.data);

        console.log("\n4. --- Employee: POST /login ---");
        const empLoginRes = await axios.post(`${API_URL}/user/login`, {
            email: empEmail,
            password: "employeePassword123"
        });
        console.log("Employee Login Success:", empLoginRes.data);

        const empCookies = empLoginRes.headers['set-cookie'];
        const empTokenStr = empCookies ? empCookies.find(c => c.startsWith('token=')) : null;
        const empCookieHeader = empTokenStr ? empTokenStr.split(';')[0] : '';

        const empConfig = {
            headers: { Cookie: empCookieHeader },
            withCredentials: true
        };

        console.log("\n5. --- Employee: POST /profile ---");
        const updateProfileRes = await axios.post(`${API_URL}/employee/profile`, {
            fullName: "Updated Employee Name",
            department: "Engineering",
            professionalBio: "Writing code efficiently"
        }, empConfig);
        console.log("Employee Profile Update Success:", updateProfileRes.data);

    } catch (error) {
        if (error.response) {
            console.error("API Error Status:", error.response.status);
            console.error("API Error Data:", error.response.data);
        } else {
            console.error("Connection Error:", error.message);
        }
    }
};

testEmployeeApi();
