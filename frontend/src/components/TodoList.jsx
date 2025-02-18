import React, { useState } from "react";
import { deleteTodo, updateTodo } from "../api";
import { toast } from "react-toastify";

const formatDate = (isoDate) => {
    if (!isoDate) return ""; // Prevent errors if date is missing
    const date = new Date(isoDate);
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const year = date.getUTCFullYear();
    return `${month}/${day}/${year}`; // MM/DD/YYYY format
};

const TodoList = ({ todos, refreshTodos }) => {
    const [sortBy, setSortBy] = useState("dueDate");
    const [editingValues, setEditingValues] = useState({});
    const [typingTimeout, setTypingTimeout] = useState(null); // Store timeout ID for debouncing

    const handleDescriptionChange = (id, value) => {
        setEditingValues((prev) => ({ ...prev, [id]: value }));

        // Clear previous timeout
        if (typingTimeout) clearTimeout(typingTimeout);

        // Debounce API call (wait 500ms after last keystroke)
        const newTimeout = setTimeout(() => {
            handleUpdate(id, "description", value);
        }, 500);

        setTypingTimeout(newTimeout);
    };

    // Sorting function
    const sortedTodos = [...todos].sort((a, b) => {
        if (sortBy === "dueDate") {
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (sortBy === "description") {
            return a.description.localeCompare(b.description);
        } else if (sortBy === "creationDate") {
            return new Date(a.creationDate) - new Date(b.creationDate);
        }
        return 0;
    });

    const handleDelete = async (id) => {
        try {
            await deleteTodo(id);
            toast.success("Task deleted!");
            refreshTodos();
        } catch (error) {
            toast.error("Failed to delete task.");
        }
    };

    const handleUpdate = async (id, field, value) => {
        try {
            await updateTodo(id, { [field]: value });
            toast.success("Task updated!");
            refreshTodos();
        } catch (error) {
            toast.error("Failed to update task.");
        }
    };

    return (
        <div>
            {/* Sorting Section */}
            <div className="sort-container">
                <label>Sort By:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="dueDate">Due Date</option>
                    <option value="description">Alphabetical</option>
                    <option value="creationDate">Creation Date</option>
                </select>
            </div>

            {/* Task Table */}
            <table id="todo-table">
                <thead>
                <tr>
                    <th>Description</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {sortedTodos.length > 0 ? (
                    sortedTodos.map((todo) => (
                        <tr key={todo._id}>
                            <td>
                                <input
                                    type="text"
                                    value={editingValues[todo._id] ?? todo.description}
                                    onChange={(e) => handleDescriptionChange(todo._id, e.target.value)}
                                    className="task-input"
                                />
                            </td>
                            <td>
                                <input
                                    type="date"
                                    value={new Date(todo.dueDate).toISOString().split("T")[0]}
                                    onChange={(e) => handleUpdate(todo._id, "dueDate", e.target.value)}
                                    className="task-input"
                                />
                            </td>
                            <td>{todo.status}</td>
                            <td>
                                <button onClick={() => handleDelete(todo._id)} className="delete-btn">
                                Delete
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="4" className="text-center text-gray-500 py-4">
                            No tasks available.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default TodoList;