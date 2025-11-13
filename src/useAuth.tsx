'use client';
import { useEffect } from 'react';
import { Auth, onAuthStateChanged, User } from 'firebase/auth';


export function useAuth(auth: Auth, callback: (user: User | null)=>void) {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
     callback(authUser)
    });

    return () => unsubscribe();
  }, []);
}