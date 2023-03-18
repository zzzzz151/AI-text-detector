import { ListItem, ListItemText } from "@mui/material";
import "~popup/color-picker/style.css"
import Switcher from "~popup/switchers/switcher";

function ListItemSwitcher() {
  
    return (
      <ListItem sx={{cursor: "pointer"}}>
        <ListItemText
          id="switch-list-label-bluetooth"
          primary="Bluetooth"
          primaryTypographyProps={{
            fontSize: 14,
            fontWeight: "medium",
          }}
        />
        <Switcher />
      </ListItem>
    );
}

export default ListItemSwitcher