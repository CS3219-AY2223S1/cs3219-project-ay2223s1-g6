import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import AccountPage from './components/AccountPage';
import LoginPage from './components/LoginPage';
import MatchingPage from "./components/MatchingPage";
import RoomPage from "./components/RoomPage";
import {Box} from "@mui/material";
import {useState} from "react";

function App() {
    const [username, setUsername] = useState('');
    const [mode, setMode] = useState('signUp');
    const [questionID, setQuestionID] = useState(0);

    return (
        <div className="App">
            <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Navigate replace to="/login" />}></Route>
                        <Route path="/account" element={<AccountPage mode={mode} username={username} setUsername={setUsername} />}/>
                        <Route path="/login" element={<LoginPage setUsername={setUsername} setMode={setMode} />} />
                        <Route path="/match" element={<MatchingPage username={username} setQuestionID={setQuestionID} setMode={setMode} />} />
                        <Route path="/room" element={<RoomPage username={username} questionID={questionID} />} />
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;
