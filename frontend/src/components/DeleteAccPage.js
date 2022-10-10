import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import {useState} from "react";
import axios from "axios";
import {URL_USER_SVC} from "../configs";
import {STATUS_CODE_SUCCESS} from "../constants";
import {Link} from "react-router-dom";

function DeleteAccPage(props) {
    const username = props.username;
    const setUsername = props.setUsername;
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMsg, setDialogMsg] = useState("");
    const [isSuccessful, setIsSuccessful] = useState(false);

    const handleDelAcc = async () => {
        setIsSuccessful(false);
        const res = await axios.post(URL_USER_SVC, { username }) //cookie
            .catch((err) => {
                setDialogMsg('Unsuccessful');
            })
        if (res && res.status === STATUS_CODE_SUCCESS) {
            setDialogMsg('Successful');
            setIsSuccessful(true);
            setUsername('');
        }
        setIsDialogOpen(true);
    }

    // stub
    /*const handleDelAcc = () => {
        setDialogMsg('Successful');
        setIsSuccessful(true);
        setUsername('');
        console.log('username is empty');
        setIsDialogOpen(true);
    }*/

    const closeDialog = () => setIsDialogOpen(false);

    return (
        <Box display={"flex"} flexDirection={"column"}>
            <Button variant={"outlined"} onClick={handleDelAcc}>Delete Account</Button>

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
                        ? <Button component={Link} to="/newacc">Home</Button>
                        : <Button onClick={closeDialog}>Done</Button>
                    }
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default DeleteAccPage;
