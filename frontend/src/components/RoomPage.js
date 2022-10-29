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
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { URL_MATCH_SVC, URL_QUESTION_SVC } from '../configs';
import { STATUS_CODE_SUCCESS } from '../constants';

class MyRoomPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: 'Sample Question Title',
            description: 'Sample question description',
            examples: [
                {
                    example_input: 'Example 1 input',
                    example_output: 'Example 1 output',
                    example_explanation: 'Example 1 explanation',
                    _id: '1',
                },
                {
                    example_input: 'Example 2 input',
                    example_output: 'Example 2 output',
                    example_explanation: 'Example 2 explanation',
                    _id: '2',
                },
            ],  
            socket: io(URL_MATCH_SVC)
        };

        this.state.socket.on('enter room failure', (msg) => {
            console.log(msg.message);
        });
        this.state.socket.on('leave room failure', (msg) => {
            console.log(msg.message);
        });
        this.state.socket.on('room closing', (msg) => {
            console.log(msg.message);
            Cookies.remove('question_id');
            // There's no need to set session context here as there's no way to go back to room page without refreshing
            // sessionActive in session context is always initialized to false
            this.props.navigate('/match', { replace: true });
        });
        this.state.socket.emit('enter room', {
            token: Cookies.get('auth'),
            username: Cookies.get('username'),
        });
    }

    async componentDidMount() {
        // TODO: Refine
        const questionId = Cookies.get('question_id');
        const res = await axios.get(`${URL_QUESTION_SVC}/${questionId}`).catch((err) => {
            console.log('cannot load question');
        });
        if (res && res.status === STATUS_CODE_SUCCESS) {
            this.setState(() => ({
                title: res.data.question.question_title,
                description: res.data.question.question_description,
                examples: res.data.question.question_examples,
            }));
        }
    }

    handleLeaveRoom = () => {
        this.state.socket.emit("leave room", {
            token: Cookies.get('auth'),
            username: Cookies.get('username'),
        });
    }

    render() {
        return (
          <Box display={'flex'} flexDirection={'column'}>
              <Typography variant={'h3'} marginBottom={'2rem'}>This is your room</Typography>
              <Box display={'flex'} flexDirection={'row'}>
                  <Button color={'warning'} variant={'contained'} onClick={this.handleLeaveRoom}>End session</Button>
              </Box>
              <Typography variant={'h4'} marginBottom={'2rem'}>{this.state.title}</Typography>
              <Typography variant={'h5'} marginBottom={'2rem'}>{this.state.description}</Typography>
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
                          {this.state.examples.map((example) => (
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
}

export default function RoomPage(props) {
    const navigate = useNavigate();
    return <MyRoomPage {...props} navigate={navigate}/>;
}
