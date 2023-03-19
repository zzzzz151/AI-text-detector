import { ListItem, ListItemText } from "@mui/material";
import { useRef, useState } from "react";
import Switcher from "~popup/switchers/switcher";

function ListItemSwitcher(props) {
  const [checked, setChecked] = useState(false);
  const switcherRef = useRef(null);

  function handleClick(e) {
    e.preventDefault;
    let animation = checked? "pulseOFF" : "pulseON"
    setChecked((prevChecked) => !prevChecked); // toggle checked state
    switcherRef.current.classList.remove("pulseON", "pulseOFF"); 
    void switcherRef.current.offsetWidth;
    switcherRef.current.classList.add(animation);
  }
  
  return (
    <ListItem sx={{cursor: "pointer"}} onClick={handleClick}>
      <ListItemText
        id={props.id}
        primary={props.text}
        primaryTypographyProps={{
          fontSize: 14,
          color: '#1f243c',
          fontFamily: 'Inter,sans-serif',
          lineHeight: '20px'
        }}
      />
      <Switcher checked={checked} ref={switcherRef} />
    </ListItem>
  );
}

export default ListItemSwitcher