import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/user";

const testUserApi = async () => {
    const testUser = {
        fullName: "Test User",
        email: `test_${Date.now()}@gmail.com`, // Unique email for each run
        password: "password123",
        role: "candidate"
    };

    try {
        console.log("--- Testing Registration ---");
        const regResponse = await axios.post(`${API_URL}/register`, testUser);
        console.log("Registration Success:", regResponse.data);

        console.log("\n--- Testing Login ---");
        const loginResponse = await axios.post(`${API_URL}/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log("Login Success:", loginResponse.data);
        console.log("Received Token:", loginResponse.data.token);
    }
    catch (error) {
        if (error.response) {
            console.error("API Error:", error.response.status, error.response.data);
        } else {
            console.error("Connection Error:", error.message);
        }
    }
}


// Run this file using node UnitTesting/UserApiTesting.js for every test it will create a new user and login with it.
testUserApi();