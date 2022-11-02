import { 
    Grid, 
    ListItem, 
    ListItemText
} from "@mui/material";

function ReceivedMsg(props) {
    const {sender, message} = props;

    return (
        <ListItem divider>
            <Grid container>
                <Grid item xs={12}>
                    <ListItemText align="left" secondary={sender}></ListItemText>
                </Grid>
                <Grid item xs={12}>
                    <ListItemText align="left" primary={message}></ListItemText>
                </Grid>
            </Grid>
        </ListItem>
    );
}

export default ReceivedMsg;
