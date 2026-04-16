import { connectFirestoreEmulator, Firestore } from "firebase/firestore";
import { connectStorageEmulator, FirebaseStorage } from "firebase/storage";
import { Auth, connectAuthEmulator } from "firebase/auth";
import { connectFunctionsEmulator, Functions } from "firebase/functions";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { getAnalytics, isSupported } from "firebase/analytics";

interface InitProps {
    app: any;
    siteKey: string;
    auth: Auth;
    functionInstance: Functions;
    firestoreDb: Firestore;
    firebaseStorage: FirebaseStorage;
    withEmulator: boolean;
}

export const initFirebaseClient = async ({
    app,
    siteKey,
    auth,
    functionInstance,
    firestoreDb,
    firebaseStorage,
    withEmulator
}: InitProps) => {
  if (typeof window === "undefined") return;

  const isLocalhost = window.location.hostname === "localhost";

  // App Check
  (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = isLocalhost;

  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(
      siteKey
    ),
    isTokenAutoRefreshEnabled: true,
  });

  // Analytics (safe)
  if (await isSupported()) {
    getAnalytics(app);
  }

  // Emulators
  if (isLocalhost && withEmulator) {
    const host = "127.0.0.1";
    connectAuthEmulator(auth, `http://${host}:9099`);
    connectFunctionsEmulator(functionInstance, host, 5001);
    connectFirestoreEmulator(firestoreDb, host, 8080);
    connectStorageEmulator(firebaseStorage, host, 9199);
  }
};