import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { URL_MATCH_SVC, URL_QUESTION_SVC } from '../../configs';
import { SessionContext } from '../contexts/SessionContext';

// TODO: add editorSocket and chatSocket

function RoomPage() {
  const [question, setQuestion] = useState(null);
  const [matchSocket, setMatchSocket] = useState(null);

  // console.log('new socket connection');
  // const matchSocket = io(URL_MATCH_SVC);

  if (matchSocket === null) {
    console.log('new socket connection');
    setMatchSocket(io(URL_MATCH_SVC));
  }

  if (matchSocket !== null) {
    console.log('render room page ' + matchSocket.id);
  }

  const navigate = useNavigate();
  const location = useLocation();
  const sessionContext = useContext(SessionContext);

  window.onbeforeunload = () => true;

  const loadQuestion = useCallback(async (questionId) => {
    // TODO: Refine - add session_id, backend returns roomId as session_id
    const resp = await axios.get(`${URL_QUESTION_SVC}/${questionId}`);
    return resp.data.question;
  }, []);

  useEffect(() => {
    const questionId = location.state.questionId;
    const roomId = location.state.roomId;

    console.log(questionId, roomId);

    matchSocket.on('join room failure', (msg) => {
      console.log(msg.message);
      matchSocket.disconnect();
      sessionContext.setSessionActive(false);
      toast.error('An error occurred. You may not have a valid match.');
      navigate('/match', { replace: true });
    });

    matchSocket.on('leave room failure', (msg) => {
      console.log(msg.message);
    });

    matchSocket.on('room closing', (msg) => {
      console.log(msg.message);
      // There's no need to set session context here as there's no way to go back to room page without refreshing
      // sessionActive in session context is always initialized to false
      navigate('/match', { replace: true });
    });

    matchSocket.emit('join room', {
      token: Cookies.get('auth'),
      username: Cookies.get('username'),
    });

    loadQuestion(questionId).then((question) => {
      setQuestion({
        title: question.question_title,
        description: question.question_description,
        examples: question.question_examples,
      });
    }).catch((err) => {
      console.log('cannot load question', err);
    });

    return () => {
      console.log('return');
      window.onbeforeunload = () => {};

      // matchSocket.off('join room failure');
      // matchSocket.off('leave room failure');
      // matchSocket.off('room closing');

      console.log('socket should disconnect: ' + matchSocket.id);
      matchSocket.disconnect();
    };
  }, [navigate, sessionContext, loadQuestion, location, matchSocket]);

  const handleLeaveRoom = () => {
    matchSocket.emit('leave room', {
      token: Cookies.get('auth'),
      username: Cookies.get('username'),
    });
  };

  // TODO: Should handle loading and loading question fail
  if (!question) return <></>;

  return (
    <Box display={'flex'} flexDirection={'column'}>
      <Typography variant={'h3'} marginBottom={'2rem'}>This is your room</Typography>
      <Box display={'flex'} flexDirection={'row'}>
        <Button color={'warning'} variant={'contained'} onClick={handleLeaveRoom}>End session</Button>
      </Box>
      <Typography variant={'h4'} marginBottom={'2rem'}>{question.title}</Typography>
      <Typography variant={'h5'} marginBottom={'2rem'}>{question.description}</Typography>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Input</TableCell>
              <TableCell>Output</TableCell>
              <TableCell>Explanation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {question.examples.map((example) => (
              <TableRow key={example._id}>
                <TableCell>{example.example_input}</TableCell>
                <TableCell>{example.example_output}</TableCell>
                <TableCell>{example.example_explanation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default RoomPage;
