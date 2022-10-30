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
import {
  URL_CHAT_SVC_DEFAULT_NAMESPACE,
  URL_EDITOR_SVC_DEFAULT_NAMESPACE,
  URL_MATCH_SVC_ROOM_NAMESPACE,
  URL_QUESTION_SVC,
} from '../../configs';
import { SessionContext } from '../contexts/SessionContext';

function RoomPage() {
  const [question, setQuestion] = useState(null);
  const [matchSocket] = useState(io(URL_MATCH_SVC_ROOM_NAMESPACE));
  const [editorSocket] = useState(io(URL_EDITOR_SVC_DEFAULT_NAMESPACE));
  const [chatSocket] = useState(io(URL_CHAT_SVC_DEFAULT_NAMESPACE));

  const navigate = useNavigate();
  const location = useLocation();
  const sessionContext = useContext(SessionContext);

  window.onbeforeunload = () => true;

  const loadQuestion = useCallback(async (questionId) => {
    const resp = await axios.get(`${URL_QUESTION_SVC}/${questionId}`);
    return resp.data.question;
  }, []);

  useEffect(() => {
    const questionId = location.state.questionId;
    const roomId = location.state.roomId;

    const handleFailure = (toastMsg) => {
      if (!toastMsg) {
        toastMsg = 'An error occurred. You may not have the permission to perform this action.';
      }
      sessionContext.setSessionActive(false);
      toast.error(toastMsg);
      navigate('/match', { replace: true });
    };

    /* match socket */

    matchSocket.on('join room failure', (msg) => {
      console.log(msg.message);
      handleFailure('An error occurred. You may not have a valid match.');
    });

    matchSocket.on('leave room failure', (msg) => {
      console.log(msg.message);
      handleFailure();
    });

    matchSocket.on('room closing', (msg) => {
      console.log(msg.message);
      // TODO: Ask user to choose to leave room or stay alone

      sessionContext.setSessionActive(false);
      navigate('/match', { replace: true });
    });

    matchSocket.emit('join room', {
      token: Cookies.get('auth'),
      username: Cookies.get('username'),
    });

    /* editor socket */

    editorSocket.on('join room failure', (msg) => {
      console.log(msg.message);
      handleFailure();
    });

    editorSocket.on('change failure', (msg) => {
      console.log(msg.message);
      handleFailure();
    });

    editorSocket.on('new content', (msg) => {
      // TODO: Overwrite editor content
      // msg.data.newContent
      // msg.data.sender
    });

    editorSocket.emit('join room', {
      token: Cookies.get('auth'),
      username: Cookies.get('username'),
      roomId: roomId,
    });

    /* chat socket */

    chatSocket.on('join room failure', (msg) => {
      console.log(msg.message);
      handleFailure();
    });

    editorSocket.on('message failure', (msg) => {
      console.log(msg.message);
      handleFailure();
    });

    editorSocket.on('new message', (msg) => {
      // TODO: Add message to list
      // msg.data.messageContent
      // msg.data.sender
    });

    chatSocket.emit('join room', {
      token: Cookies.get('auth'),
      username: Cookies.get('username'),
      roomId: roomId,
    });

    loadQuestion(questionId).then((question) => {
      setQuestion({
        title: question.question_title,
        description: question.question_description,
        examples: question.question_examples,
      });
    }).catch((err) => {
      console.log('failed to load question', err);
    });

    return () => {
      window.onbeforeunload = () => {};

      console.log('Room page match socket disconnecting: ' + matchSocket.id);
      console.log('Room page editor socket disconnecting: ' + editorSocket.id);
      console.log('Room page chat socket disconnecting: ' + chatSocket.id);
      // must ensure useEffect is only executed once at the start!
      matchSocket.disconnect();
    };
  }, [navigate, sessionContext, loadQuestion, location, matchSocket, editorSocket, chatSocket]);

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
