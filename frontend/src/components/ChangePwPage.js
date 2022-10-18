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
import Cookies from 'js-cookie';
import { URL_USER_SVC } from "../configs";
import { STATUS_CODE_SUCCESS } from "../constants";
import { Link, useNavigate } from 'react-router-dom';

function ChangePwPage(props) {
    const {username, setUsername} = props;

    const [password, setPassword] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMsg, setDialogMsg] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);

    const navigate = useNavigate();

    const handleChangePw = async () => {
        setIsSuccessful(false);
        const res = await axios.put(URL_USER_SVC+'/account', { username: username, newPassword: password }, { withCredentials: true })
            .catch((err) => {
                setDialogMsg(err.response.data.message);
            })
        if (res && res.status === STATUS_CODE_SUCCESS) {
            setDialogMsg(res.data.message);
            setIsSuccessful(true);
            // setUsername('');
            // Cookies.set('username', '');
            // Cookies.set('auth', '');
            navigate('/match');
        }
        setIsDialogOpen(true);
    }

    const closeDialog = () => setIsDialogOpen(false);

    return (
        <Box display={"flex"} flexDirection={"column"} width={"30%"}>
            <Typography variant={"h3"} marginBottom={"2rem"}>Change Password</Typography>
            <TextField
                label="New Password"
                variant="standard"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{marginBottom: "2rem"}}
            />
            <Box display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
                <Button variant={"outlined"} onClick={handleChangePw}>Confirm Password</Button>
            </Box>

            <Dialog
                open={isDialogOpen}
                onClose={closeDialog}
            >
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    {isSuccessful
                        ? <Button component={Link} to="/login">Log in</Button>
                        : <Button onClick={closeDialog}>Done</Button>
                    }
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ChangePwPage;
