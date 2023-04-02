import { ListItem, ListItemText } from "@mui/material";
import { useRef } from "react";
import { useStorage } from "@plasmohq/storage/hook"
import SketchExample from "~components/color-picker/sketch-picker";

function ListItemColorPicker(props) {
  const [color, setColor] = useStorage<string>('highlight-color', v => (v && (v.length == 4 || v.length == 7)) ? v.toUpperCase() : "#FF0000");
  const colorPickerRef = useRef(null);
    
  function handleListItemClick() {
    if (colorPickerRef.current) {
      colorPickerRef.current.togglePicker();
    }
  }
    
  function handleColorChange(color: string) {
    setColor(color)
  }
    
  return (
    <ListItem sx={{cursor: "pointer"}} onClick={handleListItemClick}>
      <ListItemText
        id={props.id}
        primary={props.text}
        primaryTypographyProps={{
          fontSize: 14,
          color: '#1f243c',
          lineHeight: '20px'
        }}
      />
      <SketchExample defaultColor={color} onColorChange={handleColorChange} ref={colorPickerRef} />
    </ListItem>
  );
}

export default ListItemColorPicker