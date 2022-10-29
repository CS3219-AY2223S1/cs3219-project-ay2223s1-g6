import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { URL_MATCH_SVC, URL_USER_SVC } from '../configs';
import { STATUS_CODE_SUCCESS } from '../constants';
import { AuthContext } from './contexts/AuthContext';
import { SessionContext } from './contexts/SessionContext';

class MyMatchingPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDialogOpen: false,
            dialogTitle: '',
            dialogMsg: '',
            difficulty: 'none',
            isTimerOpen: false,
            timer: 30,
            intervalId: 0,
            socket: io(URL_MATCH_SVC),
        };

        this.state.socket.on('match success', (msg) => {
            this.closeTimer();
            this.setState(() => ({
                dialogTitle: 'Match',
                dialogMsg: msg.message,
                isDialogOpen: true,
            }));
            // It is actually sufficient to pass questionId in props if the room page is not persistent on refresh
            Cookies.set('question_id', msg.data.questionId);
            // TODO: warn when leaving room page
            this.props.sessionContext.setSessionActive(true);
            this.props.navigate('/room');
        });
        this.state.socket.on('match failure', (msg) => {
            this.closeTimer();
            this.setState(() => ({
                dialogTitle: 'Match',
                dialogMsg: msg.message,
                isDialogOpen: true,
            }));
        });
    }

    handleLogout = async () => {
        const username = Cookies.get('username');
        console.log('logout username: ' + username);
        const res = await axios.delete(URL_USER_SVC + '/login', {
            data: { username },
            withCredentials: true,
            // TODO: Delete should not contain any body, the backend is bad
        })
            .catch((err) => {
                this.setState(() => ({
                    dialogTitle: 'Logout',
                    dialogMsg: err.response.data.message,
                    isDialogOpen: true,
                }));
            });
        if (res && res.status === STATUS_CODE_SUCCESS) {
            // TODO: Backend should be able to clear auth
            Cookies.remove('username');
            Cookies.remove('auth');
            this.props.authContext.setLoggedIn(false);
            this.props.navigate('/login');
        }
    }

    handleMatch = () => {
        this.state.socket.emit('new match', {
            token: Cookies.get('auth'),
            username: Cookies.get('username'),
            difficultyLevel: this.state.difficulty,
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
        return (
          <Box display={'flex'} flexDirection={'column'}>
              <Typography variant={'h3'} marginBottom={'2rem'}>Match with a Friend!</Typography>
              <Box display={'flex'} flexDirection={'row'}>
                  <Button variant={'outlined'} onClick={this.handleLogout}>Log out</Button>
                  <Button variant={'outlined'} component={Link} to="/delete-account">Delete Account</Button>
                  <Button variant={'outlined'} component={Link} to="/change-password">Change Password</Button>
              </Box>
              <Box display={'flex'} flexDirection={'row'}>
                  <Button variant={'outlined'} onClick={this.handleEasyMatch}>Match - Easy</Button>
                  <Button variant={'outlined'} onClick={this.handleMedMatch}>Match - Medium</Button>
                  <Button variant={'outlined'} onClick={this.handleDifMatch}>Match - Hard</Button>
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
                      <Button onClick={this.closeDialog}>Close</Button>
                  </DialogActions>
              </Dialog>

              {this.state.isTimerOpen
                ? <Typography variant={'h1'} marginTop={'2rem'}>{this.state.timer}</Typography>
                : <div></div>
              }
          </Box>
        );
    }
}

export default function MatchingPage(props) {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const sessionContext = useContext(SessionContext);
    return <MyMatchingPage {...props} navigate={navigate} authContext={authContext} sessionContext={sessionContext}/>;
}
