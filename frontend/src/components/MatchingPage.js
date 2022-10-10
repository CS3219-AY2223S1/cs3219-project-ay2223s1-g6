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
import React, { useState } from "react";
import { io } from "socket.io-client";
import { URL_MATCH_SVC } from "../configs";
import { Link } from "react-router-dom";

class MatchingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDialogOpen: false, 
            dialogMsg: "", 
            difficulty: "", 
            isSuccessful: false,
            socket: io(URL_MATCH_SVC)
        };

        this.state.socket.on('match success', (msg) => {
            this.setState((state, props) => ({
                dialogMsg: msg.message, 
                isSuccessful: false, 
                isDialogOpen: true
            }));
        });
        this.state.socket.on('match failure', (msg) => {
            this.setState((state, props) => ({
                dialogMsg: msg.message, 
                isSuccessful: false, 
                isDialogOpen: true
            }));
        });
    }

    handleMatch = () => {
        this.setState((state, props) => ({
            isSuccessful: false
        }));
        this.state.socket.emit("new match", { 
            token: document.cookie, 
            username: this.props.username, 
            difficultyLevel: this.state.difficulty 
        });
    }
    
    handleEasyMatch = () => {
        this.setState((state, props) => ({
            difficulty: 'easy'
        }));
        this.handleMatch();
    }

    handleMedMatch = () => {
        this.setState((state, props) => ({
            difficulty: 'medium' 
        }));
        this.handleMatch();
    }

    handleDifMatch = () => {
        this.setState((state, props) => ({
            difficulty: 'hard' 
        }));
        this.handleMatch();
    }

    closeDialog = () => this.setState((state, props) => ({
        isDialogOpen: false
    }));

    render() {
        return (
        <Box display={"flex"} flexDirection={"column"}>
            <Typography variant={"h3"} marginBottom={"2rem"}>Match with a Friend!</Typography>
            <Box display={"flex"} flexDirection={"row"}>
                <Button variant={"outlined"} component={Link} to="/logout">Log Out</Button>
                <Button variant={"outlined"} component={Link} to="/deleteacc">Delete Account</Button>
                <Button variant={"outlined"} component={Link} to="/updateacc">Change Password</Button>
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
