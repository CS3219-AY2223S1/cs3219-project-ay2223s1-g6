import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { URL_USER_SVC } from "../configs";
import { STATUS_CODE_SUCCESS } from "../constants";
import { Link } from "react-router-dom";

function LoginPage(props) {
    const {setUsername, setMode} = props;
    const [tempUsername, setTempUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMsg, setDialogMsg] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);

    const handleLogin = async () => {
        setIsSuccessful(false);
        const res = await axios.post(URL_USER_SVC+'/login', { username: tempUsername, password: password })
            .catch((err) => {
                setDialogMsg(err.response.data.message);
            })
        if (res && res.status === STATUS_CODE_SUCCESS) {
            setDialogMsg(res.data.message);
            setIsSuccessful(true);
            setUsername(tempUsername);
        }
        setIsDialogOpen(true);
    }

    const gotoSignup = () => setMode('signUp');

    const closeDialog = () => setIsDialogOpen(false);

    return (
        <Box display={"flex"} flexDirection={"column"} width={"30%"}>
            <Typography variant={"h3"} marginBottom={"2rem"}>Login</Typography>
            <TextField
                label="Username"
                variant="standard"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                sx={{marginBottom: "1rem"}}
                autoFocus
            />
            <TextField
                label="Password"
                variant="standard"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{marginBottom: "2rem"}}
            />
            <Box display={"flex"} flexDirection={"row"} justifyContent={"space-around"}>
                <Button variant={"outlined"} component={Link} to="/account" onClick={gotoSignup}>Signup</Button>
                <Button variant={"outlined"} onClick={handleLogin}>Log in</Button>
            </Box>

            <Dialog
                open={isDialogOpen}
                onClose={closeDialog}
            >
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    {isSuccessful
                        ? <Button component={Link} to="/match">Proceed</Button>
                        : <Button onClick={closeDialog}>Done</Button>
                    }
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default LoginPage;
