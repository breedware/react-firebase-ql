'use client';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
export function useAuth(auth, callback) {
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
            callback(authUser);
        });
        return () => unsubscribe();
    }, []);
}
//# sourceMappingURL=useAuth.js.map