'use client';
import { useEffect, useState } from "react";
export const useCountdown = (key) => {
    const [remaining, setRemaining] = useState(0);
    useEffect(() => {
        if (typeof window === "undefined")
            return;
        const interval = setInterval(() => {
            const stored = localStorage.getItem(key);
            if (!stored) {
                setRemaining(0);
                return;
            }
            const endTime = Number(stored);
            const diff = Math.max(0, endTime - Date.now());
            if (diff <= 0) {
                localStorage.removeItem(key);
                setRemaining(0);
                return;
            }
            setRemaining(diff);
        }, 1000);
        return () => clearInterval(interval);
    }, [key]);
    return {
        isActive: remaining > 0,
        seconds: Math.ceil(remaining / 1000),
    };
};
//# sourceMappingURL=useCountdown.hooks.js.map