# react-firebase-ql

Small helpers/hooks for integrating Firebase with React.

## Install
npm install firebase react
npm install my-react-firebase-lib

## Usage
import { useFirebaseAuth } from 'my-react-firebase-lib';

function App() {
  const user = useFirebaseAuth();
  return <div>{user ? user.email : 'not signed in'}</div>;
}
