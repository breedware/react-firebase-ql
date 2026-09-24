import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectStorageEmulator, getStorage } from "firebase/storage";
import { connectAuthEmulator } from "firebase/auth";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { getAnalytics, isSupported } from "firebase/analytics";
export const initFirebaseClient = async ({ app, auth, withEmulator }) => {
    if (typeof window === "undefined")
        return;
    const isLocalhost = window.location.hostname === "localhost";
    if (await isSupported()) {
        getAnalytics(app);
    }
    if (isLocalhost && withEmulator) {
        const host = "127.0.0.1";
        connectAuthEmulator(auth, `http://${host}:9099`);
        connectFunctionsEmulator(getFunctions(app), host, 5001);
        connectFirestoreEmulator(getFirestore(app), host, 8080);
        connectStorageEmulator(getStorage(app), host, 9199);
    }
};
//# sourceMappingURL=firebase.config.js.map