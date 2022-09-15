import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import MatchingPage from "./components/MatchingPage";
import RoomPage from "./components/RoomPage";
import {Box} from "@mui/material";

function App() {
    return (
        <div className="App">
            <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
                <Router>
                    <Routes>
                        <Route exact path="/" element={<Navigate replace to="/signup" />}></Route>
                        <Route path="/signup" element={<SignupPage/>}/>
                        <Route path="/login" element={<LoginPage/>} />
                        <Route path="/match" element={<MatchingPage/>} />
                        <Route path="/room" element={<RoomPage/>} />
                    </Routes>
                </Router>
            </Box>
        </div>
    );
}

export default App;
