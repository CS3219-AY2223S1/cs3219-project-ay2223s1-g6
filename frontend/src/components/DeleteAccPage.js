import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { URL_USER_SVC } from "../configs";
import { STATUS_CODE_SUCCESS } from "../constants";
import { Link, useNavigate } from 'react-router-dom';

function DeleteAccPage(props) {
    const {username, setUsername} = props;
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMsg, setDialogMsg] = useState("");
    const [isSuccessful, setIsSuccessful] = useState(false);

    const navigate = useNavigate();

    const handleDelAcc = async () => {
        setIsSuccessful(false);
        const username = Cookies.get('username');
        const res = await axios.delete(URL_USER_SVC+'/account', {
            // TODO: Delete should not have body, bad backend
            data: {
                username
            },
            withCredentials: true,
        })
            .catch((err) => {
                setDialogMsg('Delete account is not successful.');
                setIsDialogOpen(true);
                setIsSuccessful(false);
            });
        if (res && res.status === STATUS_CODE_SUCCESS) {
            // setDialogMsg(res.data.message);
            // setIsSuccessful(true);
            // setUsername('');
            Cookies.remove('username');
            Cookies.remove('auth');

            // TODO: Should navigate with a success message instead of dialog
            navigate('/login');
        }
    }

    const closeDialog = () => setIsDialogOpen(false);

    return (
        <Box display={"flex"} flexDirection={"column"} width={"30%"}>
            <Button color={"warning"} variant={"outlined"} onClick={handleDelAcc}>Delete Account</Button>

            <Dialog
                open={isDialogOpen}
                onClose={closeDialog}
            >
                <DialogTitle>Delete Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    {isSuccessful
                        ? <Button component={Link} to="/">Home</Button>
                        : <Button onClick={closeDialog}>Done</Button>
                    }
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default DeleteAccPage;
