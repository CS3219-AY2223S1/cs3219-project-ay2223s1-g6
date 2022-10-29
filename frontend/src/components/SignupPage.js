import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { URL_USER_SVC } from '../configs';
import { STATUS_CODE_SUCCESS } from '../constants';
import { AuthContext } from './contexts/AuthContext';

function SignupPage(props) {
    const {setUsername} = props;
    
    const [tempUsername, setTempUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMsg, setDialogMsg] = useState("");
    const [isSuccessful, setIsSuccessful] = useState(false);

    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    const handleSignup = async () => {
        setIsSuccessful(false);
        const res = await axios.post(URL_USER_SVC+'/account', { username: tempUsername, password: password }, { withCredentials: true })
            .catch((err) => {
                setDialogMsg(err.response.data.message);
            })
        if (res && res.status === STATUS_CODE_SUCCESS) {
            setDialogMsg(res.data.message);
            setIsSuccessful(true);
            setUsername(tempUsername);
            Cookies.set('username', tempUsername);
            authContext.setLoggedIn(true);
            navigate('/match');
        }
        setIsDialogOpen(true);
    }

    const closeDialog = () => setIsDialogOpen(false);

    return (
        <Box display={"flex"} flexDirection={"column"} width={"30%"}>
            <Typography variant={"h3"} marginBottom={"2rem"}>Sign Up</Typography>
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
            <Box display={"flex"} flexDirection={"column"} justifyContent={"space-around"}>
                <Button variant={"outlined"} onClick={handleSignup}>Sign up</Button>
                <br/>
                <Button color="secondary" component={Link} to="/login">Have an account? Go to login</Button>
            </Box>

            <Dialog
                open={isDialogOpen}
                onClose={closeDialog}
            >
                <DialogTitle>Sign Up</DialogTitle>
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

export default SignupPage;
