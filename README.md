
# react-firebase-ql

[![npm version](https://img.shields.io/npm/v/react-firebase-ql)](https://www.npmjs.com/package/react-firebase-ql) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

React Firebase QL is a lightweight library that **simplifies working with Firebase in React apps**. It wraps Firebase queries and updates inside **React hooks**, giving developers a feel of using Firebase like a **SQL environment**, where you can quickly call methods like `.save()` or `.find()` on your models.  

It also provides simple utilities for **Firebase Authentication, Firestore, and Storage** — including easy file uploads via the `.doUpload` method.

## 🔹 Features

- **React hooks for Firebase**: `useFetch`, `useStream`, `useAuth`, `useCount`.
- **Model-based API**: Create classes extending `BaseModel` to interact with Firestore.
- **SQL-like operations**: Quickly `save()` or `find()` data without boilerplate.
- **File uploads**: Simple `.doUpload` on the `Storage` class.
- Supports **Firebase Authentication, Firestore, and Storage**.
- Written in **TypeScript** with full type support.

## ⚙️ Installation

Install via npm or yarn:

```bash
npm install react-firebase-ql firebase
# or
yarn add react-firebase-ql firebase
```




## 🛠️ Setup
**Initialize Firebase** 

Make sure you have Firebase initialized in your project: 

```ts
// firebase.config.ts
import { initializeApp } from "firebase/app";
import { AppCheck, initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage"

declare global {
  // eslint-disable-next-line no-var
  var FIREBASE_APPCHECK_DEBUG_TOKEN: boolean | string | undefined;
}

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let appCheck: AppCheck;

// for appcheck (recommended)
if (typeof window !== "undefined") {
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = window.location.hostname==='localhost';

    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider('YOUR-APPCHECK-KEY'),
      isTokenAutoRefreshEnabled: true // Set to true to allow auto-refresh.
    });
}

// initialize other firebase resources
export const firebaseAuth = getAuth(app)
export const firestoreDB = getFirestore(app)
export const server = getFunctions(app)
export const storage = getStorage(app)

// set emulator for local environment
if(typeof window !== 'undefined' && window.location.hostname === 'localhost'){
  const host = "127.0.0.1";
  connectAuthEmulator(firebaseAuth, `http://${host}:9099`);
  connectFunctionsEmulator(server, host, 5001);
  connectFirestoreEmulator(firestoreDB, host, 8080);
  connectStorageEmulator(storage, host, 9199);
}


// Create and export firestore documents like this
export enum FIREBASETABLE {
    USERS = 'users',
    ---
}
```
## Creating Models

Organize your models in a dedicated folder
src/ or app/ - for nextjs developers

```css
src/
└── models/
  ├── Users.model.ts
    ├── Posts.model.ts
    └── ...other models
```

## Example: Users Model

```ts
// src/models/Users.model.ts
import { firestoreDB } from "../firebase.config";
import { FIREBASETABLE } from "../firebase.config";
import { BaseModel, errorLogger } from "react-firebase-ql";

export interface YourFirestoreDocumentStructure {
    reference?: string,
    firstName: string;
    ---
}

export class UsersModel extends BaseModel {

    data: YourFirestoreDocumentStructure | YourFirestoreDocumentStructure[] | undefined;
   
    
    constructor(){
        super(FIREBASETABLE.users, firestoreDB);
    }

    otherMethods(){
        ...
    }

        
}

```
## Using Hooks
Fetch a single user record by reference

```ts
import { useFetch } from "react-firebase-ql";
import { UsersModel } from "../models/Users.model";

export default function UserProfile() {
  const [user, loading] = useFetch({
    model: new UsersModel(),
    reference: reference! --document reference
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <p>
      {user.firstName}
    </p>
  );
}

```

## Authors

- [@breedware](https://www.github.com/breedware)

Breedware Limited