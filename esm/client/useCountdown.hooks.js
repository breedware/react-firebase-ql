'use client';
import { useEffect, useState } from "react";
export const useCountdown = (key) => {
    const [remaining, setRemaining] = useState(0);
    const [endTime, setEndTime] = useState(null);
    useEffect(() => {
        if (typeof window === 'undefined')
            return;
        const stored = window.localStorage.getItem(key);
        setEndTime(stored ? Number(stored) : null);
    }, [key]);
    useEffect(() => {
        if (!endTime) {
            setRemaining(0);
            return;
        }
        const tick = () => {
            const diff = Math.max(0, endTime - Date.now());
            setRemaining(diff);
            if (diff === 0) {
                localStorage.removeItem(key);
            }
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [endTime, key]);
    return {
        isActive: remaining > 0,
        seconds: Math.ceil(remaining / 1000),
    };
};
//# sourceMappingURL=useCountdown.hooks.js.map