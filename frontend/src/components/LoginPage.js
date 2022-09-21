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
import {useState} from "react";
import axios from "axios";
import {URL_USER_SVC} from "../configs";
import {STATUS_CODE_LOGIN} from "../constants";
import {Link} from "react-router-dom";

function LoginPage(props) {
    const setUsername = props.setUsername;
    const [tempUsername, setTempUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMsg, setDialogMsg] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);

    const handleLogin = async () => {
        setIsSuccessful(false);
        const res = await axios.post(URL_USER_SVC, { tempUsername, password })
            .catch((err) => {
                setDialogMsg('Unsuccessful');
            })
        if (res && res.status === STATUS_CODE_LOGIN) {
            setDialogMsg('Successful');
            setIsSuccessful(true);
            setUsername(tempUsername);
            //document.cookie = res.data.jwt;
        }
        setIsDialogOpen(true);
    }

    // stub
    /*const handleLogin = () => {
        setDialogMsg('Successful');
        setIsSuccessful(true);
        setUsername(tempUsername);
        console.log('username is '+ tempUsername);
        setIsDialogOpen(true);
    }*/

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
            <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
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
                        ? <Button component={Link} to="/match">Proceed to match</Button>
                        : <Button onClick={closeDialog}>Done</Button>
                    }
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default LoginPage;
