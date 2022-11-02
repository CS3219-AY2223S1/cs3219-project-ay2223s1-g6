import { 
    Grid, 
    ListItem, 
    ListItemText
} from "@mui/material";

function SentMsg(props) {
    const {sender, message} = props;

    return (
        <ListItem divider>
            <Grid container>
                <Grid item xs={12}>
                    <ListItemText align="right" secondary={sender}></ListItemText>
                </Grid>
                <Grid item xs={12}>
                    <ListItemText align="right" primary={message}></ListItemText>
                </Grid>
            </Grid>
        </ListItem>
    );
}

export default SentMsg;
