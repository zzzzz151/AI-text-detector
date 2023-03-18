import { useState } from 'react';
import "~popup/switchers/switcher.css"

function Switcher() {
  const [checked, setChecked] = useState(false);
  
  function handleToggle(e) {
    e.preventDefault;

    let animation = checked? "pulseOFF" : "pulseON"

    setChecked((prevChecked) => !prevChecked); // toggle checked state

    e.target.classList.remove("pulseON", "pulseOFF");
    
    void e.target.offsetWidth;
    
    e.target.classList.add(animation);
  }

  return (
      <div
        className="ui-switcher"
        aria-checked={checked}
        onClick={handleToggle}
        role="switch"
      >
        <span className="ui-switcher-thumb"></span>
      </div>
  );
}

export default Switcher