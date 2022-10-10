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
import { URL_USER_SVC } from "../configs";
import { STATUS_CODE_SUCCESS } from "../constants";
import { Link } from "react-router-dom";

function LogoutPage(props) {
    const username = props.username;
    const setUsername = props.setUsername;
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMsg, setDialogMsg] = useState("");
    const [isSuccessful, setIsSuccessful] = useState(false);

    const handleLogout = async () => {
        setIsSuccessful(false);
        const res = await axios.post(URL_USER_SVC, { username })
            .catch((err) => {
                setDialogMsg(err.response.data.message);
            })
        if (res && res.status === STATUS_CODE_SUCCESS) {
            setDialogMsg(res.data.message);
            setIsSuccessful(true);
            setUsername('');
        }
        setIsDialogOpen(true);
    }

    const closeDialog = () => setIsDialogOpen(false);

    return (
        <Box display={"flex"} flexDirection={"column"} width={"30%"}>
            <Button variant={"outlined"} onClick={handleLogout}>Log out</Button>

            <Dialog
                open={isDialogOpen}
                onClose={closeDialog}
            >
                <DialogTitle>Logout</DialogTitle>
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

export default LogoutPage;
