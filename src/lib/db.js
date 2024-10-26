import axios from 'axios';

export async function verifyAdminUser(username, password) {
    try {
        const response = await axios.post(`http://localhost:8080/api/v0.1/admins/${username}`);
        if (response.status === 200) {
            return response.data; // Return admin user data if successful
        }
        return null; // Return null if credentials are incorrect
    } catch (error) {
        console.error("Error verifying admin user:", error);
        return null; // Handle error appropriately
    }
}

export async function verifyWorkerUser(username, password) {
    try {
        const response = await axios.post(`http://localhost:8080/api/v0.1/workers/${username}`);
        if (response.status === 200) {
            return response.data; // Return worker user data if successful
        }
        return null; // Return null if credentials are incorrect
    } catch (error) {
        console.error("Error verifying worker user:", error);
        return null; // Handle error appropriately
    }
}
