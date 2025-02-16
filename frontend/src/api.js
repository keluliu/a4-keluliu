import axios from "axios";

const API_BASE_URL =
    process.env.NODE_ENV === "production"
        ? "https://a4-keluliu.vercel.app/api" // 🔹 Replace with your Vercel domain
        : "http://localhost:3000/api";

const API = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true // ✅ Ensures session cookies are sent
});

// ✅ Helper function to handle API errors
const handleApiError = (error) => {
    console.error("❌ API Error:", error.response?.data?.message || error.message);
    throw error.response?.data || { message: "An unexpected error occurred" };
};

// ✅ Authentication API Calls
export const loginUser = async (email, password) => {
    try {
        const response = await API.post("/auth/login", { email, password });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const registerUser = async (username, email, password) => {
    try {
        const response = await API.post("/auth/register", { username, email, password });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const logoutUser = async () => {
    try {
        const response = await API.get("/auth/logout");
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const fetchAuthStatus = async () => {
    try {
        const response = await API.get("/auth/check-auth");
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// ✅ Todo API Calls
export const fetchTodos = async () => {
    try {
        const response = await fetch("http://localhost:3000/api/todos", {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`❌ API Error: ${response.status}`);
        }

        const data = await response.json();
        console.log("🔍 API Response - Fetched Todos:", data); // ✅ Log fetched tasks

        return data || []; // Ensure it always returns an array
    } catch (error) {
        console.error("❌ Failed to fetch todos:", error);
        return [];
    }
};

export const addTodo = async (description, dueDate) => {
    try {
        const response = await fetch("http://localhost:3000/api/todos/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ description, dueDate }),
            credentials: "include", // ✅ Important for sending session cookies
        });

        if (!response.ok) {
            throw new Error(`❌ API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Request Failed:", error);
        throw error;
    }
};

export const updateTodo = async (id, updatedFields) => {
    try {
        const response = await fetch(`http://localhost:3000/api/todos/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, updatedFields }),
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`❌ API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Request Failed:", error);
        throw error;
    }
};

export const deleteTodo = async (id) => {
    try {
        const response = await fetch("http://localhost:3000/api/todos/delete", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`❌ API Error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Request Failed:", error);
        throw error;
    }
};