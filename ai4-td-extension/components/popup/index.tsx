import { Box, Divider, List, ListSubheader } from "@mui/material";
import React from "react";
import PopupFooter from "~components/popup-footer";
import ListItemColorPicker from "~components/list-item/list-item-colorpicker";
import ListItemMessage from "~components/list-item/list-item-message";
import ListItemSettings from "~components/list-item/list-item-settings";
import ListItemSwitcher from "~components/list-item/list-item-switcher";
import ListItemSelect from "~components/list-item/list-item-select";
import useLanguageModelOptions from "~components/hooks/language-models";

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
            <Box flexDirection="column" display="flex" alignItems="center" justifyContent="flex-start" padding="0" maxHeight="485px" overflow="hidden auto">
                <ListItemSettings />
                <Box width="100%">
                    <ListItemSwitcher default={false} id="scan-page-automatically" text="Scan page automatically" />
                    <Divider light variant="middle" sx={{width: "100%"}}/>
                    <ListItemColorPicker default="#FFFF00" id="highlight-color-regular" text="Highlight color (50-75)"/>
                    <Divider light variant="middle" sx={{width: "100%"}}/>
                    <ListItemColorPicker default="#FF0000" id="highlight-color-strong" text="Highlight color (75-100)"/>
                    <Divider light variant="middle" sx={{width: "100%"}}/>
                    <ListItemSelect hook={useLanguageModelOptions} id="model" text="Model"/>
                    <Divider light variant="middle" sx={{width: "100%"}}/>
                </Box>
                <ListItemMessage text={"AI Text Detector v1.0.0"}/>
            </Box>
            <PopupFooter />
        </List>
    )
}; 

export default Popup