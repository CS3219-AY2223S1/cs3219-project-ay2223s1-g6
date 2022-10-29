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
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { URL_MATCH_SVC, URL_QUESTION_SVC } from '../../configs';

const matchSocket = io(URL_MATCH_SVC);

// TODO: add editorSocket and chatSocket

function RoomPage() {
  const [question, setQuestion] = useState(null);

  const navigate = useNavigate();

  const loadQuestion = useCallback(async () => {
    // TODO: Refine - add session_id, backend returns roomId as session_id
    const questionId = Cookies.get('question_id');
    const resp = await axios.get(`${URL_QUESTION_SVC}/${questionId}`);
    return resp.data.question;
  }, []);

  useEffect(() => {
    matchSocket.on('join room failure', (msg) => {
      console.log(msg.message);
    });

    matchSocket.on('leave room failure', (msg) => {
      console.log(msg.message);
    });

    matchSocket.on('room closing', (msg) => {
      console.log(msg.message);
      Cookies.remove('question_id');
      Cookies.remove('room_id');
      // There's no need to set session context here as there's no way to go back to room page without refreshing
      // sessionActive in session context is always initialized to false
      navigate('/match', { replace: true });
    });

    matchSocket.emit('join room', {
      token: Cookies.get('auth'),
      username: Cookies.get('username'),
    });

    loadQuestion().then((question) => {
      setQuestion({
        title: question.question_title,
        description: question.question_description,
        examples: question.question_examples,
      });
    }).catch((err) => {
      console.log('cannot load question', err);
    });

    return () => {
      matchSocket.off('join room failure');
      matchSocket.off('leave room failure');
      matchSocket.off('room closing');
    };
  }, [navigate, loadQuestion]);

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
