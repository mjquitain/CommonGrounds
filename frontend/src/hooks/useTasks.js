import { useEffect, useState } from "react";
import { tasks as initialTasks } from "../data/mock_task_data";

const STORAGE_KEY = "commongrounds_tasks";

export const useTasks = () => {
    const [tasks, setTasks] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse stored tasks:", e);
                return initialTasks;
            }
        }
        return initialTasks;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (newTask) => {
        const taskWithId = {
            ...newTask,
            id: Date.now(),
            progress: newTask.progress || 0,
        };
        setTasks((prev) => [...prev, taskWithId]);
        return taskWithId;
    };

    const updateTask = (id, updates) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
        );
    };

    const deleteTask = (id) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    const resetTasks = () => {
        setTasks(initialTasks);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks));
    };

    return {
        tasks,
        addTask,
        updateTask,
        deleteTask,
        resetTasks,
    };
};
