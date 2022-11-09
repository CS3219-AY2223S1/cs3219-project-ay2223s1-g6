import {
  Button,
  Grid,
  List,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import {
  CHAT_SVC_SOCKETIO_PATH,
  EDITOR_SVC_SOCKETIO_PATH,
  MATCHING_SVC_SOCKETIO_PATH,
  URL_CHAT_SVC,
  URL_EDITOR_SVC,
  URL_MATCHING_SVC_ROOM_NAMESPACE,
  URL_QUESTION_SVC,
} from '../../configs';
import { SessionContext } from '../contexts/SessionContext';
import ReceivedMsg from '../elements/ReceivedMsg';
import SentMsg from '../elements/SentMsg';

function RoomPage() {
  const [question, setQuestion] = useState(null);
  const [content, setContent] = useState('');
  const [chat, setChat] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const [matchSocket] = useState(() => io(URL_MATCHING_SVC_ROOM_NAMESPACE, { path: MATCHING_SVC_SOCKETIO_PATH }));
  const [editorSocket] = useState(() => io(URL_EDITOR_SVC, { path: EDITOR_SVC_SOCKETIO_PATH }));
  const [chatSocket] = useState(() => io(URL_CHAT_SVC, { path: CHAT_SVC_SOCKETIO_PATH }));

  const navigate = useNavigate();
  const location = useLocation();
  const sessionContext = useContext(SessionContext);

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

    const loadQuestion = async (questionId) => {
      const resp = await axios.get(`${URL_QUESTION_SVC}/${questionId}`);
      return resp.data.question;
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
      if (msg.data.sender !== Cookies.get('username')) {
        setContent(msg.data.newContent);
      }
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

    chatSocket.on('message failure', (msg) => {
      console.log(msg.message);
      handleFailure();
    });

    chatSocket.on('new message', (msg) => {
      if (msg.data.sender !== Cookies.get('username')) {
        setChat(prevChat => ([...prevChat, {
          sender: msg.data.sender, 
          chatMessage: msg.data.messageContent
        }]));
      }
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
      console.log('Room page match socket disconnecting: ' + matchSocket.id);
      console.log('Room page editor socket disconnecting: ' + editorSocket.id);
      console.log('Room page chat socket disconnecting: ' + chatSocket.id);
      // must ensure useEffect is only executed once at the start!
      matchSocket.disconnect();
      editorSocket.disconnect();
      chatSocket.disconnect();
    };
  }, [navigate, sessionContext, location, matchSocket, editorSocket, chatSocket]);

  const handleLeaveRoom = () => {
    matchSocket.emit('leave room', {
      token: Cookies.get('auth'),
      username: Cookies.get('username'),
    });
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
    editorSocket.emit('change', {
      token: Cookies.get('auth'),
      username: Cookies.get('username'),
      newContent: event.target.value
    });
  }

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  }

  const handleSendMessage = () => {
    if (newMessage === '') {
      return;
    }

    chatSocket.emit('message', {
      token: Cookies.get('auth'),
      username: Cookies.get('username'),
      message: newMessage
    })
    setChat(prevChat => ([...prevChat, {
      sender: Cookies.get('username'), 
      chatMessage: newMessage
    }]));
    setNewMessage('');
  }

  // TODO: Should handle loading and loading question fail
  if (!question) return <></>;

  return (
    <Grid>

      <Grid container spacing={3} marginBottom={'2rem'} alignItems="baseline">
        <Grid item xs={10}>
          <Typography variant={'h3'}>This is your room</Typography>
        </Grid>

        <Grid item xs={2}>
          <Button 
            color='warning'
            variant='contained'
            fullWidth
            onClick={handleLeaveRoom}
          >
            End Session
          </Button>
        </Grid>
      </Grid>

      <Grid item xs={12} marginBottom={'2rem'}>
        <Typography variant={'h4'} marginBottom={'1rem'}>{question.title}</Typography>
        <Typography variant={'h5'} marginBottom={'1rem'}>{question.description}</Typography>
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
      </Grid>
      
      <Grid item xs={12} marginBottom={'2rem'}>
        <TextField
          id="collaboration"
          marginTop={'2rem'}
          multiline
          fullWidth
          minRows={10}
          maxRows={50}
          placeholder="Type your answers and work with your friend here ..."
          value={content}
          onChange={handleContentChange}
        />
      </Grid>
      
      <Grid item xs={12} marginBottom={'2rem'}>
        <Typography variant={'h5'}>Chat History</Typography>
        <List>
          {
            chat.map((msgInfo) => (
              msgInfo.sender === Cookies.get('username')
              ? <SentMsg sender={msgInfo.sender} message={msgInfo.chatMessage} />
              : <ReceivedMsg sender={msgInfo.sender} message={msgInfo.chatMessage} />
            ))
          }
        </List>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={10}>
          <TextField
            id="new chat message"
            multiline
            fullWidth
            maxRows={4}
            placeholder="Send a message here ..."
            value={newMessage}
            onChange={handleNewMessageChange}
          />
        </Grid>
        <Grid item xs={2}>
          <Button variant="outlined" fullWidth onClick={handleSendMessage}>Send</Button>
        </Grid>
      </Grid>
      
    </Grid>
  );
}

export default RoomPage;
