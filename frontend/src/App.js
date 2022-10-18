import { Box } from '@mui/material';
import { useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import AccountPage from './components/AccountPage';
import ChangePwPage from './components/ChangePwPage';
import DeleteAccPage from './components/DeleteAccPage';
import LoginPage from './components/LoginPage';
import MatchingPage from './components/MatchingPage';
import RoomPage from './components/RoomPage';

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
            <Route path="/signup" element={<AccountPage mode={mode} username={username} setUsername={setUsername}/>}/>
            <Route path="/delete-account" element={<DeleteAccPage username={username} setUsername={setUsername}/>}/>
            <Route path="/change-password" element={<ChangePwPage username={username} setUsername={setUsername}/>}/>
            <Route path="/login" element={<LoginPage setUsername={setUsername} setMode={setMode}/>}/>
            <Route path="/match"
                   element={<MatchingPage username={username} setQuestionID={setQuestionID} setMode={setMode}/>}/>
            <Route path="/room" element={<RoomPage username={username} questionID={questionID}/>}/>
          </Routes>
        </Router>
      </Box>
    </div>
  );
}

export default App;
