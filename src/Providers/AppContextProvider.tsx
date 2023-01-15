import React, { useState, createContext, useMemo, useContext } from 'react';

export type AppContext = {
  isLoading: boolean;
};

type ContextType = {
  appContext: AppContext;
  setAppContext: React.Dispatch<React.SetStateAction<AppContext>>;
};

const contextInitialValue: AppContext = {
  isLoading: false,
};

const Context = createContext<ContextType | null>(null);

export function useAppContextProvider() {
  return useContext(Context) as ContextType;
}

function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [appContext, setAppContext] = useState<AppContext>(contextInitialValue);

  const obj = useMemo(
    () => ({
      appContext,
      setAppContext,
    }),
    [appContext, setAppContext]
  );

  return <Context.Provider value={obj}>{children}</Context.Provider>;
}

export default AppContextProvider;
