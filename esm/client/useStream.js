'use client';
import { errorLogger } from 'firebase-client-ql';
import { useEffect } from 'react';
export const useStream = (param, callback) => {
    useEffect(() => {
        let unsubscribe;
        try {
            const { model, reference, where, filter } = param;
            if (reference) {
                unsubscribe = model.stream((data) => {
                    if (data)
                        callback(data);
                }, reference);
            }
            else if (where) {
                const allInvalid = where.every((item) => item.value === undefined);
                if (allInvalid) {
                    callback([]);
                    return;
                }
                unsubscribe = model.streamWhere(where, (data) => {
                    if (data)
                        callback(data);
                }, 100, filter === null || filter === void 0 ? void 0 : filter.orderBy, filter === null || filter === void 0 ? void 0 : filter.offset);
            }
        }
        catch (error) {
            errorLogger('useStream error:', error);
        }
        return () => {
            if (typeof unsubscribe === 'function') {
                unsubscribe();
            }
        };
    }, [JSON.stringify(param.where), JSON.stringify(param.filter), param.reference]);
};
//# sourceMappingURL=useStream.js.map