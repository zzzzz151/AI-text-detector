import { ListItem, ListItemText } from "@mui/material";

function ListItemMessage() {
    return (
        <ListItem sx={{paddingTop: "20px!important"}}>
            <ListItemText secondary="Outlined buttons are also a lower emphasis alternative to contained buttons"/>
        </ListItem>
    );
}

export default ListItemMessage