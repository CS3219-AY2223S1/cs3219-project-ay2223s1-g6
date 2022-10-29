import Cookies from 'js-cookie';
import { createContext, useState } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const checkLoggedIn = () => {
    // TODO: Ideally, user should be determined solely based on token
    // TODO: Validate token
    const uname = Cookies.get('username');
    const token = Cookies.get('auth');
    console.log('logged in function called in AuthContext!');
    return !!(uname && token);
  };

  // subsequent rerender using setLoggedIn will not trigger checkLoggedIn!
  const [loggedIn, setLoggedIn] = useState(() => checkLoggedIn());

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>{children}</AuthContext.Provider>
  );
};
