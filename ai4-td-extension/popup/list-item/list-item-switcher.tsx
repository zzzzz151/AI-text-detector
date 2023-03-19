import { ListItem, ListItemText } from "@mui/material";
import { useRef, useState } from "react";
import Switcher from "~popup/switchers/switcher";

function ListItemSwitcher(props) {
  const [checked, setChecked] = useState(false);
  const switcherRef = useRef(null);

  function handleClick(e) {
    e.preventDefault;
    console.log(switcherRef)
    let animation = checked? "pulseOFF" : "pulseON"
    setChecked((prevChecked) => !prevChecked); // toggle checked state
    switcherRef.current.classList.remove("pulseON", "pulseOFF"); // FIX ME: Uncaught TypeError: Cannot read properties of null (reading 'classList')
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
          fontWeight: "medium",
        }}
      />
      <Switcher checked={checked} ref={switcherRef} />
    </ListItem>
  );
}

export default ListItemSwitcher