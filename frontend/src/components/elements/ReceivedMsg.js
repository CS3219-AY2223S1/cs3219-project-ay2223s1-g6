import { 
    Grid, 
    ListItem, 
    ListItemText
} from "@mui/material/core";

function ReceivedMsg(props) {
    [sender, message] = props;

    return (
        <ListItem>
            <Grid container>
                <Grid item xs={12}>
                    <ListItemText align="left" primary={sender}></ListItemText>
                </Grid>
                <Grid item xs={12}>
                    <ListItemText align="left" secondary={message}></ListItemText>
                </Grid>
            </Grid>
        </ListItem>
    );
}

export default ReceivedMsg;
