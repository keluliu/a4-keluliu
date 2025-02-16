import React, { useState } from "react";
import { addTodo } from "../api";
import { toast } from "react-toastify";

const TodoForm = ({ refreshTodos }) => {
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addTodo(description, dueDate);
            toast.success("Task added!");
            setDescription("");
            setDueDate("");
            refreshTodos(); // ✅ Ensure tasks are reloaded
        } catch (error) {
            toast.error("Failed to add task.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <input
                type="text"
                placeholder="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="input-field"
            />
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
                className="input-field"
            />
            <button type="submit" className="primary-btn">
                Add Task
            </button>
        </form>
    );
};

export default TodoForm;