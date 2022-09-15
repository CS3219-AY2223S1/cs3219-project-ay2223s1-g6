import {Button} from "@mui/material";
import {Link} from "react-router-dom";

function LoginPage() {
    return (
        <div>
            <h1>This is a dummy Login Page.</h1>
            <Button variant={"outlined"} component={Link} to="/match">Move on to match</Button>
        </div>
    )
}

export default LoginPage;
