import { useEffect, useState } from "react";

const STORAGE_KEY = "commongrounds_focus_history";

export const useFocusHistory = () => {
    const [history, setHistory] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse focus history:", e);
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }, [history]);

    const addSession = (session) => {
        const newSession = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...session,
        };
        setHistory((prev) => [newSession, ...prev]);
        return newSession;
    };

    const clearHistory = () => {
        setHistory([]);
    };

    return {
        history,
        addSession,
        clearHistory,
    };
};
