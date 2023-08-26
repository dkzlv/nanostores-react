import {
  listenKeys,
  withContext,
  createLocalContext,
  globalContext,
  type ReadableAtom,
  type Context,
  type MapStore,
  type StoreValue
} from 'nanostores'
import React from 'react'

const NanostoresContext = React.createContext(globalContext)

export function useNanostoresContext(): Context {
  return React.useContext(NanostoresContext)
}

export function NanostoresLocalContext({
  localId,
  values,
  children
}: React.PropsWithChildren<{
  localId: string
  values?: Map<any, any>
}>): React.ReactNode {
  let parentCtx = useNanostoresContext()
  let localCtx = createLocalContext(parentCtx, localId, values)

  return React.createElement(
    NanostoresContext.Provider,
    { value: localCtx },
    children
  )
}

export function useStore<T extends ReadableAtom<any>>(
  store: T,
  opts: { keys?: string[] } = {}
): StoreValue<T> {
  let storeWithCtx = withContext(store, useNanostoresContext())

  let subscribe = React.useCallback(
    (onChange: (v: T) => void) => {
      if (opts.keys) {
        return listenKeys(
          storeWithCtx as unknown as MapStore<T>,
          opts.keys as any,
          onChange
        )
      }
      return storeWithCtx.listen(onChange)
    },
    [opts.keys, storeWithCtx]
  )

  return React.useSyncExternalStore(
    subscribe,
    storeWithCtx.get.bind(storeWithCtx),
    storeWithCtx.get.bind(storeWithCtx)
  )
}
