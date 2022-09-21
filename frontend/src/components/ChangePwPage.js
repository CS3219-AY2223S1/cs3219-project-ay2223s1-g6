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
import {STATUS_CODE_CHANGEPW} from "../constants";
import {Link} from "react-router-dom";

function ChangePwPage(props) {
    const username = props.username;
    const setUsername = props.setUsername;

    const [password, setPassword] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogMsg, setDialogMsg] = useState('');
    const [isSuccessful, setIsSuccessful] = useState(false);

    const handleChangePw = async () => {
        setIsSuccessful(false);
        const res = await axios.post(URL_USER_SVC, { username, password })
            .catch((err) => {
                setDialogMsg('Unsuccessful');
            })
        if (res && res.status === STATUS_CODE_CHANGEPW) {
            setDialogMsg('Successful');
            setIsSuccessful(true);
            setUsername('');
        }
        setIsDialogOpen(true);
    }

    // stub
    /*const handleChangePw = () => {
        setDialogMsg('Successful');
        setIsSuccessful(true);
        setUsername('');
        console.log('username is empty');
        setIsDialogOpen(true);
    }*/

    const closeDialog = () => setIsDialogOpen(false);

    return (
        <Box display={"flex"} flexDirection={"column"}>
            <Typography variant={"h3"} marginBottom={"2rem"}>Change Password</Typography>
            <TextField
                label="Password"
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
