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
import axios from "axios";
import {URL_USER_SVC, URL_MATCH_SVC} from "../configs";
import {
    STATUS_CODE_LOGOUT, STATUS_CODE_DELACC, STATUS_CODE_CHANGEPW, STATUS_CODE_MATCH
} from "../constants";
import {Link} from "react-router-dom";

function MatchingPage(props) {
    const username = props.username;
    console.log('username is ' + username);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMsg, setDialogMsg] = useState("");
    const [difficulty, setDifficulty] = useState(0);
    const [isSuccessful, setIsSuccessful] = useState(false);

    /*const handleMatch = async () => {
        setIsSuccessful(false);
        const res = await axios.post(URL_MATCH_SVC, { difficulty, username })
            .catch((err) => {
                setDialogMsg('Unsuccessful');
            })
        if (res && res.status === STATUS_CODE_MATCH) {
            setDialogMsg('Successful');
            setIsSuccessful(true);
        }
        setIsDialogOpen(true);
    }*/

    // stub
    const handleMatch = () => {
        setDialogMsg('Successful');
        setIsSuccessful(true);
        setIsDialogOpen(true);
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
