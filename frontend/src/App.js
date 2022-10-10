import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import MatchingPage from "./components/MatchingPage";
import RoomPage from "./components/RoomPage";
import LogoutPage from "./components/LogoutPage";
import DeleteAccPage from "./components/DeleteAccPage";
import ChangePwPage from "./components/ChangePwPage";
import {Box} from "@mui/material";
import {useState} from "react";

function App() {
    const [username, setUsername] = useState('');
    const [questionID, setQuestionID] = useState(0);

    return (
        <div className="App">
            <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Navigate replace to="/login" />}></Route>
                        <Route path="/newacc" element={<SignupPage setUsername={setUsername} />}/>
                        <Route path="/login" element={<LoginPage setUsername={setUsername} />} />
                        <Route path="/match" element={<MatchingPage username={username} setQuestionID={setQuestionID} />} />
                        <Route path="/room" element={<RoomPage username={username} questionID={questionID} />} />

                        <Route path="/logout" element={<LogoutPage username={username} setUsername={setUsername} />} />
                        <Route path="/deleteacc" element={<DeleteAccPage username={username} setUsername={setUsername} />} />
                        <Route path="/updateacc" element={<ChangePwPage username={username} setUsername={setUsername} />} />
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;
