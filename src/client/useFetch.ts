'use client'

import { BaseModel, errorLogger, whereClause } from "firebase-client-ql"
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react"


// 👇 Hook is now generic
export const useFetch = <T extends BaseModel >(param: {
    model: T | any
    where?: whereClause[],
    reference?: string,
    filter?: {
        orderBy?: { parameter: string, direction?: 'asc' | 'desc' };
        offset?: string;
        limit?: number;
    }
}): [typeof param.model.data, boolean, Dispatch<SetStateAction<boolean>>] => {

    const [data, setData] = useState<unknown>();
    const [loading, setLoading] = useState(true);

    const fetcher = useCallback(async () => {
        if (!param.reference && !param.where) return;

        try {
            const model = param.model;

            if (param.reference) {
                const found = await model.find(param.reference);
                if (found) setData(model.data);
            } else if (param.where) {
                const found = await model.findWhere({
                    wh: param.where,
                    lim: param.filter?.limit ?? 100,
                    order: param.filter?.orderBy,
                    offset: param.filter?.offset
                });
                setData(found);
            }
        } catch (error) {
            errorLogger("useFetch: ", error);
        } finally {
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
}
