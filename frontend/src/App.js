import { Box } from '@mui/material';
import { useContext } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './components/contexts/AuthContext';
import { SessionContext } from './components/contexts/SessionContext';
import ChangePwPage from './components/pages/ChangePwPage';
import DeleteAccPage from './components/pages/DeleteAccPage';
import LoginPage from './components/pages/LoginPage';
import MatchPage from './components/pages/MatchPage';
import RoomPage from './components/pages/RoomPage';
import SignupPage from './components/pages/SignupPage';
import { PrivateRoute } from './components/PrivateRoute';
import { RedirectRoute } from './components/RedirectRoute';

function App() {
  const authContext = useContext(AuthContext);
  const sessionContext = useContext(SessionContext);

  return (
    <div className="App">
      <Box display={'flex'} flexDirection={'column'} padding={'4rem'}>
        <Router>
          <Routes>
            <Route exact path="/" element={<Navigate replace to="/login"/>}></Route>
            <Route element={<RedirectRoute shouldRedirect={authContext.loggedIn}/>}>
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/signup" element={<SignupPage/>}/>
            </Route>
            <Route element={<PrivateRoute isAllowed={authContext.loggedIn}
                                          redirectReason={'Login is required to access this page!'}/>}>
              <Route path="/delete-account" element={<DeleteAccPage/>}/>
              <Route path="/change-password" element={<ChangePwPage/>}/>
              <Route path="/match" element={<MatchPage/>}/>
              <Route path="/room" element={<PrivateRoute isAllowed={sessionContext.sessionActive}
                                                         redirectPath={'/match'}
                                                         redirectReason={'A match is required to access this page!'}>
                <RoomPage/>
              </PrivateRoute>}
              />
            </Route>
            <Route path="*" element={<h1>There's nothing here!</h1>}/>
          </Routes>
        </Router>
      </Box>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
