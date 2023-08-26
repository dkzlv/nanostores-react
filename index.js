import { listenKeys, withContext, createLocalContext, globalContext } from 'nanostores';
import React from 'react';
const NanostoresContext = React.createContext(globalContext);
export function useNanostoresContext() {
    return React.useContext(NanostoresContext);
}
export function NanostoresLocalContext({ localId, values, children }) {
    let parentCtx = useNanostoresContext();
    let localCtx = createLocalContext(parentCtx, localId, values);
    return React.createElement(NanostoresContext.Provider, { value: localCtx }, children);
}
export function useStore(store, opts = {}) {
    let storeWithCtx = withContext(store, useNanostoresContext());
    let subscribe = React.useCallback((onChange) => {
        if (opts.keys) {
            return listenKeys(storeWithCtx, opts.keys, onChange);
        }
        return storeWithCtx.listen(onChange);
    }, [opts.keys, storeWithCtx]);
    return React.useSyncExternalStore(subscribe, storeWithCtx.get.bind(storeWithCtx), storeWithCtx.get.bind(storeWithCtx));
}
