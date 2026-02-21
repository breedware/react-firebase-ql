'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useReducer, createContext, useEffect, } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
var AUTHACTIONTYPE;
(function (AUTHACTIONTYPE) {
    AUTHACTIONTYPE["SETUID"] = "SETFBUSER";
})(AUTHACTIONTYPE || (AUTHACTIONTYPE = {}));
const initialAUTHState = {};
const AUTHReducer = (state, action) => {
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
const initialDispatch = () => { };
export const AUTHContext = createContext(initialAUTHState);
const AUTHDispatch = createContext(initialDispatch);
export const AUTHProvider = ({ children, auth }) => {
    const [AUTHState, dispatch] = useReducer(AUTHReducer, initialAUTHState);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            var _a;
            if (!authUser)
                return;
            dispatch({
                type: AUTHACTIONTYPE.SETUID,
                payload: (_a = authUser.uid) !== null && _a !== void 0 ? _a : undefined,
            });
        });
        return () => unsubscribe();
    }, []);
    return (_jsx(AUTHContext.Provider, { value: AUTHState, children: _jsx(AUTHDispatch.Provider, { value: dispatch, children: children }) }));
};
//# sourceMappingURL=AuthProvider.provider.js.map