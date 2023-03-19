import { forwardRef, useState } from "react";
import "~popup/color-picker/color-picker-v2.css"

interface ColorPickerProps {
    onColorChange: (color: string) => void;
  }

const ColorPickerV2 = forwardRef<HTMLInputElement, ColorPickerProps>((props, ref) => {
    const [color, setColor] = useState("FF0000");
  
    function handleColorChange(e: React.ChangeEvent<HTMLInputElement>) {
      let newColor = e.target.value.replace(/[^A-Fa-f0-9]/g, ""); // remove non-hex characters
      setColor(newColor);
      props.onColorChange(newColor);
    }
  
    return (
      <div className="color-picker-wrapper">
        <div className="color" style={{ backgroundColor: `#${color}` }}></div>
        <span className="hex">#</span>
        <input 
          maxLength={6}
          pattern="[A-Fa-f0-9]{6}"
          type="text"
          value={color}
          onChange={handleColorChange}
          ref={ref}
        />
      </div>
    );
  });
  
  export default ColorPickerV2;