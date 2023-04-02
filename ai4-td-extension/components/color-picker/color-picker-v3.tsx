import { InputAdornment, TextField } from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import "~components/color-picker/color-picker-v3.css"

interface ColorPickerProps {
  onColorChange: (color: string) => void;
  defaultColor: string;
}

const ColorPickerV3 = forwardRef<HTMLInputElement, ColorPickerProps>((props, ref) => {
    const [color, setColor] = useState(props.defaultColor);
    const [isValidColor, setIsValidColor] = useState(true);

    useEffect(() => {
      setColor(props.defaultColor);
    }, [props.defaultColor]);
    
    function handleColorChange(e: React.ChangeEvent<HTMLInputElement>) {
      let newColor = e.target.value.replace(/[^A-Fa-f0-9]/g, ""); // remove non-hex characters
      setColor(newColor);

      if (newColor.length == 3 || newColor.length == 6) {
        props.onColorChange(newColor);
        setIsValidColor(true);
      }
      else {
        setIsValidColor(false);
      }
    }
  
    const backgroundColor = isValidColor ? `#${color}` : '#fff';

    return (
      <div className="color-picker-wrapper">
        <div className="color" style={{ backgroundColor }}></div>
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