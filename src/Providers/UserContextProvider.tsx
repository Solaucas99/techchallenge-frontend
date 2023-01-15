import React, { createContext, useMemo, useContext } from 'react';
import { useLocalStorage } from '../Hooks/useLocalStorage';

export type UserContext = {
  id?: string;
  createdAt?: string;
  username?: string;
  email?: string;
  js_solutions_score?: number;
  html_solutions_score?: number;
  code_complete_score?: number;
  quiz_score?: number;
  is_admin?: boolean;
  is_logged_in?: boolean;
};

type ContextType = {
  userContext: UserContext;
  setUserContext: (value: UserContext) => void;
  removeUserContext: () => void;
};

const contextInitialValue: UserContext = {
  id: '',
  createdAt: '',
  username: '',
  email: '',
  is_admin: false,
  is_logged_in: false,
};

const Context = createContext<ContextType | null>(null);

export function useUserContextProvider() {
  return useContext(Context) as ContextType;
}

function UserContextProvider({ children }: { children: React.ReactNode }) {
  const [userContext, setUserContext, removeUserContext] =
    useLocalStorage<UserContext>('userState', contextInitialValue);

  const obj = useMemo(
    () => ({
      userContext,
      setUserContext,
      removeUserContext,
    }),
    [userContext, setUserContext, removeUserContext]
  );

  return <Context.Provider value={obj}>{children}</Context.Provider>;
}

export default UserContextProvider;
