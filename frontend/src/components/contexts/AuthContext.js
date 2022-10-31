import { Box, LinearProgress } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext(null);

const checkLoggedIn = async () => {
  // TODO: Ideally, user should be determined solely based on token
  const uname = Cookies.get('username');
  const token = Cookies.get('auth');
  const authSuccess = await authenticateUser(uname, token);
  if (!authSuccess) {
    Cookies.remove('username');
    Cookies.remove('auth');
    return false;
  }
  return true;
};

async function authenticateUser(username, token) {
  if (!username || !token) {
    return false;
  }

  // TODO: reference config file for user service url
  let authSuccess;
  await axios.get('http://localhost:8000/api/user/authentication', {
    params: {
      username: username,
      auth: token,
    },
  }).then(() => {
    authSuccess = true;
  }).catch(() => {
    authSuccess = false;
  });
  return authSuccess;
}

export const AuthProvider = ({ children }) => {
  // subsequent rerender using setLoggedIn will not trigger checkLoggedIn!
  const [loggedIn, setLoggedIn] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setChecking(true);
    checkLoggedIn().then((result) => {
      setLoggedIn(result);
      setChecking(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, setLoggedIn }}>
      {
        checking ?
          <Box sx={{ width: '100%' }}>
            <LinearProgress color="inherit"/>
          </Box>
          : children
      }
    </AuthContext.Provider>
  );
};
