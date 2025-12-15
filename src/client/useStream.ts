'use client';

import { BaseModel, errorLogger, whereClause } from 'firebase-client-ql';
import { useEffect, useState } from 'react';

type UseStreamResult<T> = {
  data: T[];
  loading: boolean;
  error: unknown;
};

export const useStream = <T extends BaseModel>(
  param: {
    model: any;
    where?: whereClause[];
    reference?: string;
    filter?: {
      orderBy?: { parameter: string; direction?: 'asc' | 'desc' };
      offset?: string;
    };
  }
): UseStreamResult<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    setLoading(true);

    try {
      const { model, reference, where, filter } = param;

      if (reference) {
        unsubscribe = model.stream((result: T[]) => {
          setData(result ?? []);
          setLoading(false);
        }, reference);
      } 
      else if (where) {
        if (where.length > 0 && where.every(w => w.value === undefined)) {
          setData([]);
          setLoading(false);
          return;
        }

        unsubscribe = model.streamWhere(
          where,
          (result: T[]) => {
            setData(result ?? []);
            setLoading(false);
          },
          100,
          filter?.orderBy,
          filter?.offset
        );
      }
    } catch (err) {
      errorLogger('useStream error:', err);
      setError(err);
      setLoading(false);
    }

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [
    JSON.stringify(param.where),
    JSON.stringify(param.filter),
    param.reference,
  ]);

  return { data, loading, error };
};
