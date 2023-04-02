import { Box, Divider, List, ListSubheader } from "@mui/material";
import React from "react";
import PopupFooter from "~components/popup-footer";
import ListItemColorPicker from "~components/list-item/list-item-colorpicker";
import ListItemMessage from "~components/list-item/list-item-message";
import ListItemSettings from "~components/list-item/list-item-settings";
import ListItemSwitcher from "~components/list-item/list-item-switcher";

function Popup() {

    return (
        <List
            sx={{ width: 348, bgcolor: 'background.paper', padding: 0 }}
            subheader={
                <ListSubheader sx={{
                    textAlign: "center",
                    fontFamily: "Roboto, Inter,sans-serif",
                    fontStyle: "normal",
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "#0e101a",
                }}>
                    AI TEXT DETECTOR
                </ListSubheader>}
        >
            <Divider />
            <Box flexDirection="column" display="flex" alignItems="center" justifyContent="center" padding="18px" maxHeight="485px" overflow="auto">
                <ListItemSettings />
                <Box width="100%">
                    <ListItemSwitcher id="list-item-scan-page-automatically" text="Scan page automatically" />
                    <Divider light variant="middle" sx={{width: "100%"}}/>
                    <ListItemSwitcher id="list-item-option2" text="option2" />
                    <Divider light variant="middle" sx={{width: "100%"}}/>
                    <ListItemColorPicker id="list-item-highlight-color" text="Highlight color"/>
                    <Divider light variant="middle" sx={{width: "100%"}}/>
                </Box>
                <ListItemMessage />
            </Box>
            <Divider />
            <PopupFooter />
        </List>
    )
}; 

export default Popup