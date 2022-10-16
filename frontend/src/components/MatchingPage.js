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
import Cookies from 'js-cookie';
import React from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { URL_MATCH_SVC, URL_USER_SVC } from "../configs";
import { STATUS_CODE_SUCCESS } from "../constants";
import { Link, useNavigate } from 'react-router-dom';

class MyMatchingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false, 
            isDialogOpen: false, 
            dialogTitle: '',
            dialogMsg: '', 
            difficulty: 'none', 
            isSuccessful: false,
            isTimerOpen: false, 
            timer: 30, 
            intervalId: 0, 
            socket: io(URL_MATCH_SVC)
        };

        this.state.socket.on('match success', (msg) => {
            this.closeTimer();
            this.setState(() => ({
                dialogTitle: 'Match',
                dialogMsg: msg.message, 
                isSuccessful: false, 
                isDialogOpen: true
            }));
            this.props.setQuestionID(msg.data.questionId);
            this.props.navigate('/room');
        });
        this.state.socket.on('match failure', (msg) => {
            this.closeTimer();
            this.setState(() => ({
                dialogTitle: 'Match',
                dialogMsg: msg.message, 
                isSuccessful: false, 
                isDialogOpen: true
            }));
        });
    }

    componentDidMount() {
        this.setState(() => ({
            isLoggedIn: false
        }));
        if (Cookies.get('username') && Cookies.get('auth')) {
            this.setState(() => ({
                isLoggedIn: true
            }));
        } else {
            console.log('Cannot find username and token in cookie.')
        }
    }

    handleLogout = async () => {
        console.log('logout username: '+this.props.username);
        const res = await axios.delete(URL_USER_SVC+'/login', { username: this.props.username }, { withCredentials: true })
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
            Cookies.set('username', '');
            Cookies.set('auth', '');
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
            token: Cookies.get('auth'),
            username: Cookies.get('username'),
            difficultyLevel: this.state.difficulty
        });
        this.startTimer();
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

    startTimer = () => {
        const newIntervalID = setInterval(() => {
            if (this.state.timer > 1) {
                this.setState((prev) => ({
                    timer: prev.timer - 1
                }));
            } else {
                this.closeTimer();
            }
        }, 1000);
        this.setState(() => ({
            isTimerOpen: true, 
            timer: 30, 
            intervalId: newIntervalID
        }));
    }

    closeTimer = () => {
        clearInterval(this.state.intervalId);
        this.setState(() => ({
            isTimerOpen: false, 
            timer: 30, 
            intervalId: 0
        }));
    };

    render() {
        if (this.state.isLoggedIn) {
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
                        
                    {this.state.isTimerOpen
                        ? <Typography variant={"h1"} marginTop={"2rem"}>{this.state.timer}</Typography>
                        : <div></div>
                    }
                </Box>
            )
        } else {
            return (<div>You cannot access this page if you did not log in.</div>);
        }
    }
}

export default function MatchingPage(props) {
  const navigate = useNavigate();
  return <MyMatchingPage {...props} navigate={navigate}/>;
}
