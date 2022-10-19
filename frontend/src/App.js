import { Box } from '@mui/material';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AccountPage from './components/AccountPage';
import ChangePwPage from './components/ChangePwPage';
import DeleteAccPage from './components/DeleteAccPage';
import LoginPage from './components/LoginPage';
import MatchingPage from './components/MatchingPage';
import { PrivateRoute } from './components/PrivateRoute';
import { RedirectRoute } from './components/RedirectRoute';
import RoomPage from './components/RoomPage';

function isLoggedIn() {
  // TODO: These should be in a separate component
  // TODO: Ideally, user should be determined solely based on token
  const uname = Cookies.get('username');
  const token = Cookies.get('auth');
  console.log('logged in function called');
  return !!(uname && token);
}

function isRoomActive() {
  return !!Cookies.get('room_id');
}

function App() {
  const [username, setUsername] = useState('');
  const [mode, setMode] = useState('signUp');
  const [questionID, setQuestionID] = useState(0);

  return (
    <div className="App">
      <Box display={'flex'} flexDirection={'column'} padding={'4rem'}>
        <Router>
          <Routes>
            <Route exact path="/" element={<Navigate replace to="/login"/>}></Route>
            <Route element={<RedirectRoute/>}>
              <Route path="/login" element={<LoginPage setUsername={setUsername} setMode={setMode}/>}/>
              <Route path="/signup" element={<AccountPage mode={mode} username={username} setUsername={setUsername}/>}/>
            </Route>
            <Route element={<PrivateRoute isAllowed={isLoggedIn()}
                                          redirectReason={'Login is required to access this page!'}/>}>
              <Route path="/delete-account" element={<DeleteAccPage username={username} setUsername={setUsername}/>}/>
              <Route path="/change-password" element={<ChangePwPage username={username} setUsername={setUsername}/>}/>
              <Route path="/match"
                     element={<MatchingPage username={username} setQuestionID={setQuestionID} setMode={setMode}/>}/>
              <Route path="/room"
                     element={<PrivateRoute isAllowed={isRoomActive()}
                                            redirectPath={'/match'}
                                            redirectReason={'A match is required to access this page!'}>
                       <RoomPage username={username} questionID={questionID}/>
                     </PrivateRoute>}/>
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
