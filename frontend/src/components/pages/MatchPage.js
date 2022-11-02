import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid, 
  Menu, 
  MenuItem,  
  Typography,
} from '@mui/material';
import { Person } from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { URL_MATCH_SVC_MATCH_NAMESPACE, URL_USER_SVC } from '../../configs';
import { STATUS_CODE_SUCCESS } from '../../constants';
import { AuthContext } from '../contexts/AuthContext';
import { SessionContext } from '../contexts/SessionContext';

const DURATION = 30;

function MatchPage() {

  const [timer, setTimer] = useState(DURATION);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [dialogMsg, setDialogMsg] = useState('');
  const [dialogTitle, setDialogTitle] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [socket] = useState(() => io(URL_MATCH_SVC_MATCH_NAMESPACE));

  const intervalId = 0;
  const intervalIdRef = React.useRef(intervalId);

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const sessionContext = useContext(SessionContext);

  useEffect(() => {
    if (timer === 0) {
      clearInterval(intervalIdRef.current);
      setIsTimerOpen(false);
    }
  }, [timer]);

  useEffect(() => {
    const closeTimer = () => {
      // use a ref to get the current value of intervalId so that useEffect does not depend on intervalId!
      clearInterval(intervalIdRef.current);
      setIsTimerOpen(false);
    };

    socket.on('match success', (msg) => {
      closeTimer();
      // TODO: warn when leaving room page
      sessionContext.setSessionActive(true);
      navigate('/room', {
        state: {
          questionId: msg.data.questionId,
          roomId: msg.data.roomId,
        },
      });
    });

    socket.on('match failure', (resp) => {
      closeTimer();
      setDialogTitle('Match');
      setDialogMsg(resp.message);
      setIsDialogOpen(true);
    });

    socket.on('start waiting', () => {
      intervalIdRef.current = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      setTimer(DURATION);
      setIsTimerOpen(true);
    });

    return () => {
      console.log('Match page socket disconnect: ' + socket.id);
      // must ensure useEffect is only executed once at the start!
      socket.disconnect();
    };
  }, [navigate, sessionContext, socket]);

  const handleLogout = async () => {
    handleCloseMenu();
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
    })
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

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  if (isTimerOpen) {
    return (
      <Box>
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress 
            variant="determinate" 
            size={300}
            thickness={5}
            value={timer / 30 * 100} 
          />
        </Box>
        <Box
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2" component="div">{timer}</Typography>
        </Box>
      </Box>
    );
  } else {
    return (
      <Box>
        <Grid>
          <Grid container item xs={12} marginBottom={'5rem'}>
            <Grid item xs={10}>
              <Typography variant='h3'>Match with a Friend!</Typography>
            </Grid>

            <Grid item xs={2} alignItems="baseline">
              <Button
                variant="contained"
                fullWidth
                startIcon={<Person style={{fontSize:30}} />}
                aria-controls="simple-menu" 
                aria-haspopup="true" 
                onClick={handleOpenMenu}
              >
                User Service
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
              >
                <MenuItem variant='outlined' onClick={handleLogout}>Log out</MenuItem>
                <MenuItem variant='outlined' component={Link} to="/delete-account">Delete Account</MenuItem>
                <MenuItem variant='outlined' component={Link} to="/change-password">Change Password</MenuItem>
              </Menu>
            </Grid>
          </Grid>

          <Grid item xs={12} spacing={3} justifyContent="center">
            <Grid item xs={6}>
              <Button variant='outlined' fullWidth onClick={handleEasyMatch}>Match - Easy</Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant='outlined' fullWidth onClick={handleMediumMatch}>Match - Medium</Button>
            </Grid>
            <Grid item xs={6}>
              <Button variant='outlined' fullWidth onClick={handleHardMatch}>Match - Hard</Button>
            </Grid>
          </Grid>
        </Grid>
  
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
      </Box>
    );
  }
}

export default MatchPage;
