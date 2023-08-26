import { type ReadableAtom, type Context, type StoreValue } from 'nanostores';
import React from 'react';
export declare function useNanostoresContext(): Context;
export declare function NanostoresLocalContext({ localId, values, children }: React.PropsWithChildren<{
    localId: string;
    values?: Map<any, any>;
}>): React.ReactNode;
export declare function useStore<T extends ReadableAtom<any>>(store: T, opts?: {
    keys?: string[];
}): StoreValue<T>;
