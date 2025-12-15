'use client';

import {
  Dispatch,
  ReactNode,
  useReducer,
  Context,
  createContext,
  useEffect,
} from 'react';

import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { errorLogger } from 'firebase-client-ql';

enum AUTHACTIONTYPE {
    SETFBUSER = "SETFBUSER",
}

/**
 * AUTH state maintained accross
 * all components
 */
interface AUTHSTATE {
    FBUser?: User
}

interface AUTHACTION {
    type: AUTHACTIONTYPE,
    payload: User | undefined
}


const initialAUTHState: AUTHSTATE = {}

const AUTHReducer = (state: AUTHSTATE, action: AUTHACTION): AUTHSTATE => {
  switch (action.type) {
    case AUTHACTIONTYPE.SETFBUSER: {
      const nextUser = action.payload;

      if (state.FBUser?.uid === nextUser?.uid) {
        return state;
      }

      return {
        ...state,
        FBUser: nextUser,
      };
    }

    default:
      return state;
  }
};



const initialDispatch: Dispatch<AUTHACTION> = () => {};

export const AUTHContext: Context<AUTHSTATE> =
  createContext(initialAUTHState);

const AUTHDispatch: Context<Dispatch<AUTHACTION>> =
  createContext(initialDispatch);

type AUTHProviderProps = {
  children: ReactNode;
  auth: Auth;
};

export const AUTHProvider = ({ children, auth }: AUTHProviderProps) => {
  const [AUTHState, dispatch] = useReducer(
    AUTHReducer,
    initialAUTHState
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      
      dispatch({
          type: AUTHACTIONTYPE.SETFBUSER,
          payload: authUser ?? undefined,
        });
      });

    return unsubscribe;
  }, []);

  return (
    <AUTHContext.Provider value={AUTHState}>
      <AUTHDispatch.Provider value={dispatch}>
        {children}
      </AUTHDispatch.Provider>
    </AUTHContext.Provider>
  );
};
