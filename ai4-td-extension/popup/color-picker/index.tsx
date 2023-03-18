import { useState } from "react";
import "~popup/color-picker/style.css"

function ColorPicker() {
    const [color, setColor] = useState("FF0000");

    function handleColorChange(e): void {
        const newColor = e.target.value;
        setColor(newColor);
    }

    return (
        <>
            <div className="hex">#</div>
            <input maxLength={6} type="text" value={color} onChange={handleColorChange}/>
            <div className="color" style={{backgroundColor: `#${color}`}}></div>
        </>
      );
}

export default ColorPicker