import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { URL_USER_SVC } from '../../configs';
import { STATUS_CODE_SUCCESS } from '../../constants';
import { AuthContext } from '../contexts/AuthContext';

function DeleteAccPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMsg, setDialogMsg] = useState('');

    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    const handleDelAcc = async () => {
        const username = Cookies.get('username');
        const res = await axios.delete(URL_USER_SVC + '/account', {
            // TODO: Delete should not have body, bad backend
            data: {
                username,
            },
            withCredentials: true,
        }).catch((err) => {
            setDialogMsg(err);
            setIsDialogOpen(true);
        });
        if (res && res.status === STATUS_CODE_SUCCESS) {
            Cookies.remove('username');
            Cookies.remove('auth');
            // TODO: toast
            authContext.setLoggedIn(false);
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
                    <Button onClick={closeDialog}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default DeleteAccPage;
