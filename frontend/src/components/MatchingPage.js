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
import React from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { URL_MATCH_SVC, URL_USER_SVC } from "../configs";
import { STATUS_CODE_SUCCESS } from "../constants";
import { Link } from "react-router-dom";

class MatchingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDialogOpen: false, 
            dialogTitle: '',
            dialogMsg: '', 
            difficulty: 'none', 
            isSuccessful: false,
            socket: io(URL_MATCH_SVC)
        };

        this.state.socket.on('match success', (msg) => {
            this.setState(() => ({
                dialogTitle: 'Match',
                dialogMsg: msg.message, 
                isSuccessful: false, 
                isDialogOpen: true
            }));
            this.props.setQuestionID(msg.data.questionId);
        });
        this.state.socket.on('match failure', (msg) => {
            this.setState(() => ({
                dialogTitle: 'Match',
                dialogMsg: msg.message, 
                isSuccessful: false, 
                isDialogOpen: true
            }));
        });
    }

    handleLogout = async () => {
        const res = await axios.delete(URL_USER_SVC+'/login', { username: this.props.username })
            .catch((err) => {
                this.setState(() => ({
                    dialogTitle: 'Logout',
                    dialogMsg: err.response.data.message, 
                    isSuccessful: false, 
                    isDialogOpen: true
                }));
            });
        if (res && res.status === STATUS_CODE_SUCCESS) {
            this.props.setUsername('');
            this.setState(() => ({
                dialogTitle: 'Logout',
                dialogMsg: res.data.message, 
                isSuccessful: false, 
                isDialogOpen: true
            }));
        }
    }

    handleMatch = () => {
        this.setState(() => ({
            isSuccessful: false
        }));
        this.state.socket.emit('new match', {
            token: document.cookie, 
            username: this.props.username, 
            difficultyLevel: this.state.difficulty 
        });
    }
    
    handleEasyMatch = () => {
        this.setState(
            () => ({difficulty: 'easy'}), 
            () => { this.handleMatch(); }
        );
    }

    handleMedMatch = () => {
        this.setState(
            () => ({difficulty: 'medium'}), 
            () => { this.handleMatch(); }
        );
    }

    handleDifMatch = () => {
        this.setState(
            () => ({difficulty: 'hard'}), 
            () => { this.handleMatch(); }
        );
    }

    gotoChgPw = () => this.props.setMode('changePw');
    gotoDelAcc = () => this.props.setMode('deleteAcc');

    closeDialog = () => this.setState(() => ({
        isDialogOpen: false
    }));

    render() {
        return (
        <Box display={"flex"} flexDirection={"column"}>
            <Typography variant={"h3"} marginBottom={"2rem"}>Match with a Friend!</Typography>
            <Box display={"flex"} flexDirection={"row"}>
                <Button variant={"outlined"} onClick={this.handleLogout}>Log out</Button>
                <Button variant={"outlined"} component={Link} to="/account" onClick={this.gotoDelAcc}>Delete Account</Button>
                <Button variant={"outlined"} component={Link} to="/account" onClick={this.gotoChgPw}>Change Password</Button>
            </Box>
            <Box display={"flex"} flexDirection={"row"}>
                <Button variant={"outlined"} onClick={this.handleEasyMatch}>Match - Easy</Button>
                <Button variant={"outlined"} onClick={this.handleMedMatch}>Match - Medium</Button>
                <Button variant={"outlined"} onClick={this.handleDifMatch}>Match - Hard</Button>
            </Box>

            <Dialog
                open={this.state.isDialogOpen}
                onClose={this.closeDialog}
            >
                <DialogTitle>Match</DialogTitle>
                <DialogContent>
                    <DialogContentText>{this.state.dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions> 
                    {this.state.isSuccessful
                        ? <Button component={Link} to="/room">Proceed to Room</Button>
                        : <Button onClick={this.closeDialog}>Done</Button>
                    }
                </DialogActions>
            </Dialog>
        </Box>
        )
    }
}

export default MatchingPage;
