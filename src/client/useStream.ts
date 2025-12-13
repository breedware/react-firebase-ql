'use client';

import { BaseModel, errorLogger, whereClause } from 'firebase-client-ql';
import { useEffect } from 'react';


export const useStream = <T extends BaseModel>(
  param: {
    model: T | any;
    where?: whereClause[];
    reference?: string;
    filter?: {
      orderBy?: { parameter: string; direction?: 'asc' | 'desc' };
      offset?: string;
    };
  },
  callback: (data: any) => void
): void => {

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    try {
      const {model, reference, where, filter } = param;

      if (reference) {
        unsubscribe = model.stream((data: any) => {
          if (data) callback(data);
        }, reference);
      } else if (where) {
        if (where.length > 0) {
            const allInvalid = where.every((item) => item.value === undefined);
            if (allInvalid) {
              callback([]);
              return;
            }
        }
        unsubscribe = model.streamWhere(
          where,
          (data: any) => {
            if (data) callback(data);
          },
          100,
          filter?.orderBy,
          filter?.offset
        );
      }
    } catch (error) {
      errorLogger('useStream error:', error);
    }

    // Proper cleanup
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [JSON.stringify(param.where), JSON.stringify(param.filter), param.reference]);
};
