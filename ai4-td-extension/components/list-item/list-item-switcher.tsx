import { ListItem, ListItemText } from "@mui/material";
import { useStorage } from "@plasmohq/storage/hook";
import { useRef } from "react";
import Switcher from "~components/switchers/switcher";

function ListItemSwitcher(props) {
  const [checked, setChecked] = useStorage<boolean>(props.id, v => v === undefined ? props.default : v);
  const switcherRef = useRef(null);

  function handleClick(e) {
    e.preventDefault;
    if (checked !== undefined) {
      let animation = checked? "pulseOFF" : "pulseON"
      switcherRef.current.classList.remove("pulseON", "pulseOFF"); 
      void switcherRef.current.offsetWidth;
      switcherRef.current.classList.add(animation);
    }
    setChecked((prevChecked) => !prevChecked);
  }
  
  return (
    <ListItem sx={{cursor: "pointer"}} onClick={handleClick}>
      <ListItemText
        id={props.id}
        primary={props.text}
        primaryTypographyProps={{
          fontSize: 14,
          color: '#1f243c',
          lineHeight: '20px'
        }}
      />
      <Switcher checked={checked} ref={switcherRef} />
    </ListItem>
  );
}

export default ListItemSwitcher