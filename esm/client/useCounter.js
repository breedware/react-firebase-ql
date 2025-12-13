'use client';
import { errorLogger } from "firebase-client-ql";
import { useCallback, useEffect, useState } from "react";
export const useCount = (param) => {
    const [data, setData] = useState(0);
    const [loading, setLoading] = useState(true);
    const fetcher = useCallback(async () => {
        if (!param.where)
            return;
        try {
            const model = param.model;
            const found = await model.countData(param.where);
            setData(found);
        }
        catch (error) {
            errorLogger("useCount: ", error);
        }
        finally {
            setLoading(false);
        }
    }, [
        JSON.stringify(param.where),
        loading
    ]);
    useEffect(() => {
        fetcher();
    }, [fetcher]);
    return [data, loading, setLoading];
};
//# sourceMappingURL=useCounter.js.map