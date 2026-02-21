'use client';
import { errorLogger } from 'firebase-client-ql';
import { useEffect, useState } from 'react';
export const useStream = (param) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        let unsubscribe;
        setLoading(true);
        try {
            const { model, reference, where, filter } = param;
            if (reference) {
                unsubscribe = model.stream((result) => {
                    setData(result);
                    setLoading(false);
                }, reference);
            }
            else if (where) {
                if (where.length > 0 && where.every(w => w.value === undefined)) {
                    setData([]);
                    setLoading(false);
                    return;
                }
                unsubscribe = model.streamWhere(where, (result) => {
                    setData(result !== null && result !== void 0 ? result : []);
                    setLoading(false);
                }, 100, filter === null || filter === void 0 ? void 0 : filter.orderBy, filter === null || filter === void 0 ? void 0 : filter.offset);
            }
        }
        catch (err) {
            errorLogger('useStream error:', err);
            setError(err);
            setLoading(false);
        }
        return () => {
            if (typeof unsubscribe === 'function')
                unsubscribe();
        };
    }, [
        JSON.stringify(param.where),
        JSON.stringify(param.filter),
        param.reference,
    ]);
    return { data, loading, error };
};
//# sourceMappingURL=useStream.js.map