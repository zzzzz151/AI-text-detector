import { InputAdornment, TextField } from "@mui/material";
import { forwardRef, useState } from "react";
import "~components/color-picker/color-picker-v3.css"

interface ColorPickerProps {
    onColorChange: (color: string) => void;
  }

const ColorPickerV3 = forwardRef<HTMLInputElement, ColorPickerProps>((props, ref) => {
    const [color, setColor] = useState("FF0000");
  
    function handleColorChange(e: React.ChangeEvent<HTMLInputElement>) {
      let newColor = e.target.value.replace(/[^A-Fa-f0-9]/g, ""); // remove non-hex characters
      setColor(newColor);
      props.onColorChange(newColor);
    }
  
    return (
      <div className="color-picker-wrapper">
        <div className="color" style={{ backgroundColor: `#${color}` }}></div>
        <TextField
          id="outlined-start-adornment"
          size="small"
          value={color}
          onChange={handleColorChange}
          className='without-padding'
          inputProps={{maxlength: 6,}}
          InputProps={{
            style: {
                caretColor: 'initial',
                color: 'rgb(102, 102, 102)',
                borderRadius: 0,
                width: '100px',
                fontSize: '14px',
                height: "30px",
                paddingLeft: '10px'
            },
            inputRef: ref,
            startAdornment: <InputAdornment position="start">#</InputAdornment>,
          }}
        />
      </div>
    );
  });
  
  export default ColorPickerV3;