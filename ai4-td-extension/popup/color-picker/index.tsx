import { forwardRef, useState } from "react";
import "~popup/color-picker/style.css"

interface ColorPickerProps {
    onColorChange: (color: string) => void;
  }

const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>((props, ref) => {
    const [color, setColor] = useState("FF0000");
  
    function handleColorChange(e: React.ChangeEvent<HTMLInputElement>) {
      const newColor = e.target.value;
      setColor(newColor);
      props.onColorChange(newColor);
    }
  
    return (
      <div className="color-picker-wrapper">
        <div className="hex">#</div>
        <input
          maxLength={6}
          type="text"
          value={color}
          onChange={handleColorChange}
          ref={ref}
        />
        <div className="color" style={{ backgroundColor: `#${color}` }}></div>
      </div>
    );
  });
  
  export default ColorPicker;