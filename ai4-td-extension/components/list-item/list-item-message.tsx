import { ListItem, ListItemText } from "@mui/material";

function ListItemMessage({text, ...props}) {
    return (
        <ListItem>
            <ListItemText sx={{textAlign: 'center'}} secondary={text}/>
        </ListItem>
    );
}

export default ListItemMessage