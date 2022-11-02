import { 
    Grid, 
    ListItem, 
    ListItemText
} from "@mui/material/core";

function SentMsg(props) {
    [sender, message] = props;

    return (
        <ListItem>
            <Grid container>
                <Grid item xs={12}>
                    <ListItemText align="right" primary={sender}></ListItemText>
                </Grid>
                <Grid item xs={12}>
                    <ListItemText align="right" secondary={message}></ListItemText>
                </Grid>
            </Grid>
        </ListItem>
    );
}

export default SentMsg;
