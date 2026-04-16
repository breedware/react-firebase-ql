import { connectFirestoreEmulator } from "firebase/firestore";
import { connectStorageEmulator } from "firebase/storage";
import { connectAuthEmulator } from "firebase/auth";
import { connectFunctionsEmulator } from "firebase/functions";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { getAnalytics, isSupported } from "firebase/analytics";
export const initFirebaseClient = async ({ app, siteKey, auth, functionInstance, firestoreDb, firebaseStorage, withEmulator }) => {
    if (typeof window === "undefined")
        return;
    const isLocalhost = window.location.hostname === "localhost";
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = isLocalhost;
    initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(siteKey),
        isTokenAutoRefreshEnabled: true,
    });
    if (await isSupported()) {
        getAnalytics(app);
    }
    if (isLocalhost && withEmulator) {
        const host = "127.0.0.1";
        connectAuthEmulator(auth, `http://${host}:9099`);
        connectFunctionsEmulator(functionInstance, host, 5001);
        connectFirestoreEmulator(firestoreDb, host, 8080);
        connectStorageEmulator(firebaseStorage, host, 9199);
    }
};
//# sourceMappingURL=firebase.config.js.map