'use client'

import { BaseModel, errorLogger, whereClause } from "firebase-client-ql";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"


// Count firestore data
export const useCount = <T extends BaseModel >(param: {
    model: T | any,
    where?: whereClause[],
}): [number, boolean, Dispatch<SetStateAction<boolean>>] => {

    const [data, setData] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    const fetcher = useCallback(async () => {
        if ( !param.where) return;

        try {
            const model = param.model;
            const found = await model.countData(param.where)
            setData(found);
        } catch (error) {
            errorLogger("useCount: ", error);
        } finally {
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
}
