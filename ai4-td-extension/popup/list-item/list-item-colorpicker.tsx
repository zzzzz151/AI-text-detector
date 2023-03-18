import { ListItem, ListItemText } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ColorPicker from "~popup/color-picker";
import "~popup/color-picker/style.css"

function ListItemColorPicker() {
    const colorPickerRef = useRef<HTMLInputElement>(null);
    const [focused, setFocused] = useState(false);
  
    useEffect(() => {
      if (focused && colorPickerRef.current) {
        colorPickerRef.current.focus();
        setFocused(false);
      }
    }, [focused]);
  
    function handleListItemClick() {
      setFocused(true);
    }
  
    function handleColorChange(color: string) {
      console.log("New color:", color);
    }
  
    return (
      <ListItem sx={{cursor: "pointer"}} onClick={handleListItemClick}>
        <ListItemText
          id="switch-list-label-bluetooth"
          primary="Bluetooth"
          primaryTypographyProps={{
            fontSize: 14,
            fontWeight: "medium"
          }}
        />
        <ColorPicker onColorChange={handleColorChange} ref={colorPickerRef} />
      </ListItem>
    );
}

export default ListItemColorPicker