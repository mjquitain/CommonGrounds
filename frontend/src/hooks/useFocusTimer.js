import { useEffect, useRef, useState } from "react";

export const useFocusTimer = (initialSettings, onSessionComplete) => {
    const [settings, setSettings] = useState({
        focusTime: initialSettings?.focusTime || 25,
        shortBreak: initialSettings?.shortBreak || 5,
        longBreak: initialSettings?.longBreak || 15,
    });

    const [mode, setMode] = useState("focus"); // 'focus', 'shortBreak', 'longBreak'
    const [timeLeft, setTimeLeft] = useState(settings.focusTime * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [completedSessions, setCompletedSessions] = useState(0);
    const [hasBeenStarted, setHasBeenStarted] = useState(false);
    const intervalRef = useRef(null);
    const isCompletingRef = useRef(false);
    const onSessionCompleteRef = useRef(onSessionComplete);

    // Update the callback ref
    useEffect(() => {
        onSessionCompleteRef.current = onSessionComplete;
    }, [onSessionComplete]);

    // Update timeLeft when settings or mode changes (only if timer hasn't been started)
    useEffect(() => {
        if (!hasBeenStarted) {
            const minutes = mode === "focus"
                ? settings.focusTime
                : mode === "shortBreak"
                    ? settings.shortBreak
                    : settings.longBreak;
            setTimeLeft(minutes * 60);
        }
    }, [settings, mode, hasBeenStarted]);

    // Timer countdown
    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        handleTimerComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, timeLeft]);

    const handleTimerComplete = () => {
        // Prevent duplicate calls
        if (isCompletingRef.current) {
            return;
        }
        isCompletingRef.current = true;

        setIsRunning(false);

        // Calculate session data before mode switch
        const sessionData = {
            mode: mode,
            duration: mode === "focus"
                ? settings.focusTime
                : mode === "shortBreak"
                    ? settings.shortBreak
                    : settings.longBreak,
            completedMinutes: mode === "focus"
                ? settings.focusTime
                : mode === "shortBreak"
                    ? settings.shortBreak
                    : settings.longBreak,
        };

        // Call the callback to save to history
        if (onSessionCompleteRef.current) {
            onSessionCompleteRef.current(sessionData);
        }

        // Play notification sound or show notification
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Timer Complete!", {
                body: mode === "focus" ? "Time for a break!" : "Break's over! Time to focus!",
            });
        }

        if (mode === "focus") {
            setCompletedSessions((prev) => prev + 1);
        }

        // Auto-switch to next mode
        setHasBeenStarted(false);
        if (mode === "focus") {
            setMode("shortBreak");
        } else if (mode === "shortBreak") {
            setMode("longBreak");
        } else {
            setMode("focus");
        }

        // Auto-start the next session after a brief delay
        setTimeout(() => {
            setIsRunning(true);
            setHasBeenStarted(true);
            isCompletingRef.current = false; // Reset the flag for the next session
        }, 100);
    };

    const start = () => {
        setIsRunning(true);
        setHasBeenStarted(true);
    };

    const pause = () => {
        setIsRunning(false);
    };

    const restart = () => {
        setIsRunning(false);
        setHasBeenStarted(false);
        const minutes = mode === "focus"
            ? settings.focusTime
            : mode === "shortBreak"
                ? settings.shortBreak
                : settings.longBreak;
        setTimeLeft(minutes * 60);
    };

    const switchMode = (newMode) => {
        setIsRunning(false);
        setHasBeenStarted(false);
        setMode(newMode);
    };

    const updateSettings = (newSettings) => {
        setSettings(newSettings);
        if (!hasBeenStarted) {
            const minutes = mode === "focus"
                ? newSettings.focusTime
                : mode === "shortBreak"
                    ? newSettings.shortBreak
                    : newSettings.longBreak;
            setTimeLeft(minutes * 60);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return {
        settings,
        updateSettings,
        mode,
        switchMode,
        timeLeft,
        formatTime,
        isRunning,
        start,
        pause,
        restart,
        completedSessions,
    };
};
