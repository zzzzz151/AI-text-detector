import { ListItem, ListItemText } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ColorPickerV2 from "~popup/color-picker/color-picker-v2";

function ListItemColorPicker(props) {
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
          id={props.id}
          primary={props.text}
          primaryTypographyProps={{
            fontSize: 14,
            fontWeight: "medium"
          }}
        />
        <ColorPickerV2 onColorChange={handleColorChange} ref={colorPickerRef} />
      </ListItem>
    );
}

export default ListItemColorPicker