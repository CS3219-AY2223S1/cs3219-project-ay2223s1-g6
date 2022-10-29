import { Box } from '@mui/material';
import { useContext, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccountPage from './components/AccountPage';
import ChangePwPage from './components/ChangePwPage';
import { AuthContext } from './components/contexts/AuthContext';
import { SessionContext } from './components/contexts/SessionContext';
import DeleteAccPage from './components/DeleteAccPage';
import LoginPage from './components/LoginPage';
import MatchingPage from './components/MatchingPage';
import { PrivateRoute } from './components/PrivateRoute';
import { RedirectRoute } from './components/RedirectRoute';
import RoomPage from './components/RoomPage';

function App() {
  const [username, setUsername] = useState('');
  const [mode, setMode] = useState('signUp');
  const [questionID, setQuestionID] = useState(0);

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
              <Route path="/signup"
                     element={<AccountPage mode={mode} username={username} setUsername={setUsername}/>}/>
            </Route>
            <Route element={<PrivateRoute isAllowed={authContext.loggedIn}
                                          redirectReason={'Login is required to access this page!'}/>}>
              <Route path="/delete-account"
                     element={<DeleteAccPage username={username} setUsername={setUsername}/>}/>
              <Route path="/change-password"
                     element={<ChangePwPage username={username} setUsername={setUsername}/>}/>
              <Route path="/match"
                     element={<MatchingPage username={username} setQuestionID={setQuestionID} setMode={setMode}/>}/>
              <Route path="/room"
                     element={
                       <PrivateRoute isAllowed={sessionContext.sessionActive}
                                     redirectPath={'/match'}
                                     redirectReason={'A match is required to access this page!'}>
                         <RoomPage username={username} questionID={questionID}/>
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
