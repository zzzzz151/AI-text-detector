import { Box, Divider, List, ListSubheader } from "@mui/material";
import React from "react";
import "~popup/base.css";
import Footer from "~popup/footer";
import ListItemColorPicker from "~popup/list-item/list-item-colorpicker";
import ListItemMessage from "~popup/list-item/list-item-message";
import ListItemSettings from "~popup/list-item/list-item-settings";
import ListItemSwitcher from "~popup/list-item/list-item-switcher";

function IndexPopupV2() {

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
                    <ListItemSwitcher id="list-item-option1" text="option1" />
                    <Divider light variant="middle" sx={{width: "100%"}}/>
                    <ListItemSwitcher id="list-item-option2" text="option2" />
                    <Divider light variant="middle" sx={{width: "100%"}}/>
                    <ListItemColorPicker id="list-item-option3" text="option3" />
                    <Divider light variant="middle" sx={{width: "100%"}}/>
                </Box>
                <ListItemMessage />
            </Box>
            <Divider />
            <Footer />
        </List>
    )
}; 

export default IndexPopupV2