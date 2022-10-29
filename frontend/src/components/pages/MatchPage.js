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
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { URL_MATCH_SVC, URL_USER_SVC } from '../../configs';
import { STATUS_CODE_SUCCESS } from '../../constants';
import { AuthContext } from '../contexts/AuthContext';
import { SessionContext } from '../contexts/SessionContext';

const DURATION = 30;

const socket = io(URL_MATCH_SVC);

function MatchPage() {
  const [timer, setTimer] = useState(DURATION);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [intervalId, setIntervalId] = useState(0);
  const [dialogMsg, setDialogMsg] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const sessionContext = useContext(SessionContext);

  const closeTimer = useCallback(() => {
    clearInterval(intervalId);
    setIsTimerOpen(false);
  }, [intervalId]);

  useEffect(() => {
    socket.on('match success', (msg) => {
      // It is actually sufficient to pass questionId in props if the room page is not persistent on refresh
      closeTimer();
      Cookies.set('question_id', msg.data.questionId);
      // TODO: warn when leaving room page
      sessionContext.setSessionActive(true);
      navigate('/room');
    });

    socket.on('match failure', (resp) => {
      closeTimer();
      setDialogTitle('Match');
      setDialogMsg(resp.message);
      setIsDialogOpen(true);
    });

    return () => {
      socket.off('match success');
      socket.off('match failure');
    };
  }, [navigate, sessionContext, closeTimer]);

  const handleLogout = async () => {
    const username = Cookies.get('username');
    console.log('logout username: ' + username);
    const res = await axios.delete(URL_USER_SVC + '/login', {
      data: { username },
      withCredentials: true,
      // TODO: Delete should not contain any body, the backend is bad
    }).catch((err) => {
      setDialogTitle('Logout');
      setDialogMsg(err.response.data.message);
      setIsDialogOpen(true);
    });
    if (res && res.status === STATUS_CODE_SUCCESS) {
      // TODO: Backend should be able to clear auth
      Cookies.remove('username');
      Cookies.remove('auth');
      authContext.setLoggedIn(false);
      navigate('/login');
    }
  };

  const handleMatch = (difficulty) => {
    socket.emit('new match', {
      token: Cookies.get('auth'),
      username: Cookies.get('username'),
      difficultyLevel: difficulty,
    });
    startTimer();
  };

  const handleEasyMatch = () => {
    handleMatch('easy');
  };

  const handleMediumMatch = () => {
    handleMatch('medium');
  };

  const handleHardMatch = () => {
    handleMatch('hard');
  };

  const startTimer = () => {
    const newIntervalID = setInterval(() => {
      if (timer > 1) {
        setTimer(prev => prev - 1);
      } else {
        closeTimer();
      }
    }, 1000);
    setIntervalId(newIntervalID);
    setTimer(DURATION);
    setIsTimerOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Typography variant={'h3'} marginBottom={'2rem'}>Match with a Friend!</Typography>
      <Box display={'flex'} flexDirection={'row'}>
        <Button variant={'outlined'} onClick={handleLogout}>Log out</Button>
        <Button variant={'outlined'} component={Link} to="/delete-account">Delete Account</Button>
        <Button variant={'outlined'} component={Link} to="/change-password">Change Password</Button>
      </Box>
      <Box display={'flex'} flexDirection={'row'}>
        <Button variant={'outlined'} onClick={handleEasyMatch}>Match - Easy</Button>
        <Button variant={'outlined'} onClick={handleMediumMatch}>Match - Medium</Button>
        <Button variant={'outlined'} onClick={handleHardMatch}>Match - Hard</Button>
      </Box>

      <Dialog
        open={isDialogOpen}
        onClose={closeDialog}
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMsg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {isTimerOpen
        ? <Typography variant={'h1'} marginTop={'2rem'}>{timer}</Typography>
        : <div></div>
      }
    </Box>
  );
}

export default MatchPage;
