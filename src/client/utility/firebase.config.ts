import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { Auth, connectAuthEmulator } from "firebase/auth";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getAnalytics, isSupported } from "firebase/analytics";

interface InitProps {
    app: any;
    auth: Auth;
    withEmulator: boolean;
}

export const initFirebaseClient = async ({
    app,
    auth,
    withEmulator
}: InitProps) => {
  if (typeof window === "undefined") return;

  const isLocalhost = window.location.hostname === "localhost";


  // Analytics (safe)
  if (await isSupported()) {
    getAnalytics(app);
  }

  // Emulators
  if (isLocalhost && withEmulator) {
    const host = "127.0.0.1";
    connectAuthEmulator(auth, `http://${host}:9099`);
    connectFunctionsEmulator(getFunctions(app), host, 5001);
    connectFirestoreEmulator(getFirestore(app), host, 8080);
    connectStorageEmulator(getStorage(app), host, 9199);
  }
};