import { ListItem, ListItemText } from "@mui/material";
import { useRef } from "react";
import { useStorage } from "@plasmohq/storage/hook"
import SketchExample from "~components/color-picker/sketch-picker";

function ListItemColorPicker(props) {
  const [color, setColor] = useStorage<string>(props.id, v => (v && (v.length == 4 || v.length == 7)) ? v : props.default);
  const colorPickerRef = useRef(null);
    
  function handleListItemClick() {
    if (colorPickerRef.current) {
      colorPickerRef.current.togglePicker();
    }
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
      <SketchExample color={color} onColorChange={setColor} ref={colorPickerRef} />
    </ListItem>
  );
}

export default ListItemColorPicker