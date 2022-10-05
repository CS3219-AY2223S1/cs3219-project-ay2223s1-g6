import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography
} from "@mui/material";
import {useState} from "react";
import { io } from "socket.io-client";
import {URL_MATCH_SVC} from "../configs";
import {STATUS_CODE_MATCH} from "../constants";
import {Link} from "react-router-dom";

function MatchingPage(props) {
    const username = props.username;
    //console.log('username is ' + username);
    //console.log('cookie: ' + document.cookie);

    const socket = io(URL_MATCH_SVC);
    socket.on('match success', () => {
        setDialogMsg('Successful');
        setIsSuccessful(true);
        setIsDialogOpen(true);
    });
    socket.on('match failure', (msg) => {
        setDialogMsg(msg);
        setIsSuccessful(false);
        setIsDialogOpen(true);
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMsg, setDialogMsg] = useState("");
    const [difficulty, setDifficulty] = useState(0);
    const [isSuccessful, setIsSuccessful] = useState(false);

    const handleMatch = () => {
        setIsSuccessful(false);
        socket.emit("new match", { username: username, difficultyLevel: difficulty });
    }
    
    const handleEasyMatch = () => {
        setDifficulty(1);
        handleMatch();
    }

    const handleMedMatch = () => {
        setDifficulty(2);
        handleMatch();
    }

    const handleDifMatch = () => {
        setDifficulty(3);
        handleMatch();
    }

    const closeDialog = () => setIsDialogOpen(false);

    return (
        <Box display={"flex"} flexDirection={"column"}>
            <Typography variant={"h3"} marginBottom={"2rem"}>Match with a Friend!</Typography>
            <Box display={"flex"} flexDirection={"row"}>
                <Button variant={"outlined"} component={Link} to="/logout">Log Out</Button>
                <Button variant={"outlined"} component={Link} to="/deleteacc">Delete Account</Button>
                <Button variant={"outlined"} component={Link} to="/updateacc">Change Password</Button>
            </Box>
            <Box display={"flex"} flexDirection={"row"}>
                <Button variant={"outlined"} onClick={handleEasyMatch}>Match - Easy</Button>
                <Button variant={"outlined"} onClick={handleMedMatch}>Match - Medium</Button>
                <Button variant={"outlined"} onClick={handleDifMatch}>Match - Difficult</Button>
            </Box>

            <Dialog
                open={isDialogOpen}
                onClose={closeDialog}
            >
                <DialogTitle>Match</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions> 
                    {isSuccessful
                        ? <Button component={Link} to="/room">Proceed to Room</Button>
                        : <Button onClick={closeDialog}>Done</Button>
                    }
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default MatchingPage;
