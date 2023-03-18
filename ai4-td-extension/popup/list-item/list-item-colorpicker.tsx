import { ListItem, ListItemText } from "@mui/material";
import ColorPicker from "~popup/color-picker";
import "~popup/color-picker/style.css"

function ListItemColorPicker() {
    return (
        <ListItem>
            <ListItemText id="switch-list-label-bluetooth" primary="Bluetooth" primaryTypographyProps={{
                fontSize: 14,
                fontWeight: 'medium',
            }} 
            />
            <ColorPicker />
        </ListItem>
    );
}

export default ListItemColorPicker