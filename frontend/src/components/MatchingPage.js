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
    STATUS_CODE_LOGOUT, STATUS_CODE_DELACC, STATUS_CODE_CHANGEPW, 
    DIALOG_TO_SIGNUP, DIALOG_TO_LOGIN, DIALOG_TO_MATCH, DIALOG_TO_ROOM
} from "../constants";
import {Link} from "react-router-dom";

function MatchingPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogMsg, setDialogMsg] = useState("");
    const [dialogButton, setDialogButton] = useState(0);
    const [difficulty, setDifficulty] = useState(0);

    const handleLogout = async () => {
        const res = await axios.post(URL_USER_SVC, { username, password }) //cookie
            .catch((err) => {
                setDialogMsg('Unsuccessful');
                setDialogButton(DIALOG_TO_MATCH);
            })
        if (res && res.status === STATUS_CODE_LOGOUT) {
            setDialogMsg('Successful');
            setDialogButton(DIALOG_TO_LOGIN);
        }
        setDialogTitle('Logout');
        setIsDialogOpen(true);
    }

    const handleDelAcc = async () => {
        const res = await axios.post(URL_USER_SVC, { username, password }) //cookie
            .catch((err) => {
                setDialogMsg('Unsuccessful');
                setDialogButton(DIALOG_TO_MATCH);
            })
        if (res && res.status === STATUS_CODE_DELACC) {
            setDialogMsg('Successful');
            setDialogButton(DIALOG_TO_SIGNUP);
        }
        setDialogTitle('Delete Account');
        setIsDialogOpen(true);
    }

    const handleChangePw = async () => {
        setPassword("dummyNewPassword");
        const res = await axios.post(URL_USER_SVC, { username, password }) //cookie
            .catch((err) => {
                setDialogMsg('Unsuccessful');
                setDialogButton(DIALOG_TO_MATCH);
            })
        if (res && res.status === STATUS_CODE_CHANGEPW) {
            setDialogMsg('Successful');
            setDialogButton(DIALOG_TO_LOGIN);
        }
        setDialogTitle('Change Password');
        setIsDialogOpen(true);
    }

    const handleMatch = async () => {
        const res = await axios.post(URL_MATCH_SVC, { difficulty })
            .catch((err) => {
                setDialogMsg('Unsuccessful');
                setDialogButton(DIALOG_TO_MATCH);
            })
        if (res && res.status === STATUS_CODE_CHANGEPW) {
            setDialogMsg('Successful');
            setDialogButton(DIALOG_TO_ROOM);
        }
        setDialogTitle('Match');
        setIsDialogOpen(true);
    }

    // stub
    /*const handleLogout = async () => {
        //setDialogMsg('Unsuccessful');
        //setDialogButton(DIALOG_TO_MATCH);
        setDialogMsg('Successful');
        setDialogButton(DIALOG_TO_LOGIN);
        setDialogTitle('Logout');
        setIsDialogOpen(true);
    }

    const handleDelAcc = async () => {
        //setDialogMsg('Unsuccessful');
        //setDialogButton(DIALOG_TO_MATCH);
        setDialogMsg('Successful');
        setDialogButton(DIALOG_TO_SIGNUP);
        setDialogTitle('Delete Account');
        setIsDialogOpen(true);
    }

    const handleChangePw = async () => {
        //setDialogMsg('Unsuccessful');
        //setDialogButton(DIALOG_TO_MATCH);
        setDialogMsg('Successful');
        setDialogButton(DIALOG_TO_LOGIN);
        setDialogTitle('Change Password');
        setIsDialogOpen(true);
    }

    const handleMatch = async () => {
        //setDialogMsg('Unsuccessful');
        //setDialogButton(DIALOG_TO_MATCH);
        setDialogMsg('Successful');
        setDialogButton(DIALOG_TO_ROOM);
        setDialogTitle('Match');
        setIsDialogOpen(true);
    }*/
    
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
                <Button variant={"outlined"} onClick={handleLogout}>Log Out</Button>
                <Button variant={"outlined"} onClick={handleDelAcc}>Delete Account</Button>
                <Button variant={"outlined"} onClick={handleChangePw}>Change Password</Button>
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
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions> 
                    {dialogButton === DIALOG_TO_SIGNUP
                        ? <Button component={Link} to="/signup">Done</Button>
                        : dialogButton === DIALOG_TO_LOGIN
                        ? <Button component={Link} to="/login">Done</Button>
                        : dialogButton === DIALOG_TO_MATCH
                        ? <Button onClick={closeDialog}>Done</Button>
                        : <Button component={Link} to="/room">Proceed to Room</Button>
                    }
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default MatchingPage;
