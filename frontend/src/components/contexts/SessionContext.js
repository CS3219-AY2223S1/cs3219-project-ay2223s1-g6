import { createContext, useState } from 'react';

export const SessionContext = createContext(null);

export const SessionProvider = ({ children }) => {
  const [sessionActive, setSessionActive] = useState(false);

  return (
    <SessionContext.Provider value={{ sessionActive, setSessionActive }}>{children}</SessionContext.Provider>
  );
};
