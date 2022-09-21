import { Box, Button, Typography } from "@mui/material";
import {Link} from "react-router-dom";

function RoomPage() {
    return (
        <Box display={"flex"} flexDirection={"column"}>
            <Typography variant={"h3"} marginBottom={"2rem"}>This is your room</Typography>
            <Box display={"flex"} flexDirection={"row"}>
                <Button variant={"outlined"} component={Link} to="/logout">Log Out</Button>
                <Button variant={"outlined"} component={Link} to="/deleteacc">Delete Account</Button>
                <Button variant={"outlined"} component={Link} to="/updateacc">Change Password</Button>
            </Box>
            <Box display={"flex"} flexDirection={"row"}>
                <Button variant={"outlined"} component={Link} to="/match">Back to home</Button>
            </Box>
        </Box>
    )
}

export default RoomPage;
