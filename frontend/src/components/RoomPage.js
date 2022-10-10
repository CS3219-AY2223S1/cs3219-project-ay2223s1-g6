import { 
    Box, 
    Button, 
    Typography, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper
} from "@mui/material";
import React from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { URL_QUESTION_SVC } from "../configs";
import { STATUS_CODE_SUCCESS } from "../constants";
import { Link } from "react-router-dom";

class RoomPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Sample Question Title",
            description: "Sample question description", 
            examples: [
                {
                    example_input: "Example 1 input",
                    example_output: "Example 1 output",
                    example_explanation: "Example 1 explanation"
                }, 
                {
                    example_input: "Example 2 input",
                    example_output: "Example 2 output",
                    example_explanation: "Example 2 explanation"
                }
            ],  
            socket: io(URL_QUESTION_SVC)
        };

        this.state.socket.on('enter room failure', (msg) => {
            console.log(msg.message);
        });
        this.state.socket.on('leave room failure', (msg) => {
            console.log(msg.message);
        });
        this.state.socket.on('room closing', (msg) => {
            console.log(msg.message);
        });
        this.state.socket.emit("enter room", { 
            token: document.cookie, 
            username: this.props.username
        });
    }

    componentDidMount() {
        const res = axios.post(URL_QUESTION_SVC, this.props.questionID)
        .catch((err) => {
            console.log('cannot load question');
        })
        if (res && res.status === STATUS_CODE_SUCCESS) {
            this.setState((state, props) => ({
                title: res.data.question_title, 
                description: res.data.question_description, 
                examples: res.data.question_examples
            }));
        }
    }

    handleLeaveRoom = () => {
        this.state.socket.emit("enter room", { 
            token: document.cookie, 
            username: this.props.username
        });
    }

    render() {
        return (
            <Box display={"flex"} flexDirection={"column"}>
                <Typography variant={"h3"} marginBottom={"2rem"}>This is your room</Typography>
                <Box display={"flex"} flexDirection={"row"}>
                    <Button variant={"outlined"} component={Link} to="/updateacc">Change Password</Button>
                    <Button variant={"outlined"} onClick={this.handleLeaveRoom}>Leave Room</Button>
                </Box>
                <Typography variant={"h4"} marginBottom={"2rem"}>{this.state.title}</Typography>
                <Typography variant={"h5"} marginBottom={"2rem"}>{this.state.description}</Typography>
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
                          <TableRow>
                            <TableCell>{example.example_input}</TableCell>
                            <TableCell>{example.example_output}</TableCell>
                            <TableCell>{example.example_explanation}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        )
    }
}

export default RoomPage;
