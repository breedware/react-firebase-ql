'use client';

import {
  Dispatch,
  ReactNode,
  useReducer,
  Context,
  createContext,
  useEffect,
} from 'react';

import { Auth, onAuthStateChanged } from 'firebase/auth';

enum AUTHACTIONTYPE {
    SETUID = "SETFBUSER",
}

/**
 * AUTH state maintained accross
 * all components
 */
interface AUTHSTATE {
    UID?: string
}

interface AUTHACTION {
    type: AUTHACTIONTYPE,
    payload: string | undefined
}


const initialAUTHState: AUTHSTATE = {}

const AUTHReducer = (state: AUTHSTATE, action: AUTHACTION): AUTHSTATE => {
  switch (action.type) {
    case AUTHACTIONTYPE.SETUID: {
      const nextUser = action.payload;

      if (state.UID === nextUser) {
        return state;
      }

      return {
        ...state,
        UID: nextUser,
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

      if(!authUser) return;

      dispatch({
          type: AUTHACTIONTYPE.SETUID,
          payload: authUser.uid ?? undefined,
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
