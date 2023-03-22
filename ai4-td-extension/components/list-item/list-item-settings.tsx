import { ListItem, ListItemText } from "@mui/material";
import AllSettingsButton from "~components/buttons/all-settings-button";

function ListItemSettings() {
    return (
        <ListItem>
            <ListItemText primary="Quick Settings" primaryTypographyProps={{
                fontStyle: "normal",
                fontWeight: 700,
                fontSize: "16px",
                color: "#0e101a",
                lineHeight: "24px"
            }} 
            />
            <AllSettingsButton />
        </ListItem>
    );
}

export default ListItemSettings