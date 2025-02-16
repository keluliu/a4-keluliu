import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser, fetchTodos } from "../api";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";
import { toast } from "react-toastify";

const Dashboard = () => {
    const navigate = useNavigate();
    const [todos, setTodos] = useState([]);

    // ✅ Fetch Todos and Ensure Debugging
    const refreshTodos = async () => {
        try {
            const tasks = await fetchTodos();
            console.log("✅ API Response - Fetched Todos:", tasks); // DEBUGGING: Check what is being received

            if (Array.isArray(tasks)) {
                setTodos([...tasks]); // ✅ Force state update for re-render
                console.log("📌 Updated Todos in State:", tasks);
            } else {
                console.warn("⚠️ API did not return an array, resetting state.");
                setTodos([]);
            }
        } catch (error) {
            console.error("❌ Error fetching tasks:", error);
            setTodos([]);
        }
    };

    useEffect(() => {
        refreshTodos();

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "/frontend/src/css/index-output.css";
        link.id = "dashboard-style";

        document.head.appendChild(link);

        return () => {
            const existingLink = document.getElementById("dashboard-style");
            if (existingLink) existingLink.remove();
        };
    }, []);

    const handleLogout = async () => {
        await logoutUser();
        toast.success("Logged out!");
        navigate("/login");
    };

    return (
        <div>
            <div className="task-list-header">
                <h1 className="task-list-title">To-Do List Manager</h1>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>

            <TodoForm refreshTodos={refreshTodos} />

            {/* ✅ Debugging: Ensure `todos` has data */}
            {console.log("🔹 Passing to TodoList:", todos)}

            <TodoList todos={todos} refreshTodos={refreshTodos} />
        </div>
    );
};

export default Dashboard;