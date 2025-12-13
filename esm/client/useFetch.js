'use client';
import { errorLogger } from "firebase-client-ql";
import { useCallback, useEffect, useState } from "react";
export const useFetch = (param) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const fetcher = useCallback(async () => {
        var _a, _b, _c, _d;
        if (!param.reference && !param.where)
            return;
        try {
            const model = param.model;
            if (param.reference) {
                const found = await model.find(param.reference);
                if (found)
                    setData(model.data);
            }
            else if (param.where) {
                const found = await model.findWhere({
                    wh: param.where,
                    lim: (_b = (_a = param.filter) === null || _a === void 0 ? void 0 : _a.limit) !== null && _b !== void 0 ? _b : 100,
                    order: (_c = param.filter) === null || _c === void 0 ? void 0 : _c.orderBy,
                    offset: (_d = param.filter) === null || _d === void 0 ? void 0 : _d.offset
                });
                setData(found);
            }
        }
        catch (error) {
            errorLogger("useFetch: ", error);
        }
        finally {
            setLoading(false);
        }
    }, [
        param.reference,
        JSON.stringify(param.where),
        JSON.stringify(param.filter),
        loading
    ]);
    useEffect(() => {
        fetcher();
    }, [fetcher]);
    return [data, loading, setLoading];
};
//# sourceMappingURL=useFetch.js.map