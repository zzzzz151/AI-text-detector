import type { PlasmoCSConfig } from 'plasmo';
import React, { useState }  from 'react';
import cssText from "data-text:~/contents/global-button-v1/style.css"
import { AiFillSecurityScan } from 'react-icons/ai';

export const config: PlasmoCSConfig = {
    matches: ["https://example.org/"]
}

// Inject into the ShadowDOM
export const getStyle = () => {
    const style = document.createElement("style")
    style.textContent = cssText
    return style
}

function GlobalButtonV1() {
  const [showLoader, setShowLoader] = useState(false);

  const handleButtonClick = () => {
    setShowLoader(!showLoader);
  };

  return (
    <button className="ai4td-globalbutton-box" onClick={handleButtonClick}>
      {showLoader ? (
        <div className="ai4td-loader-wrapper">
          <div className="ai4td-spin-1"></div>
          <div className="ai4td-spin-2"></div>
        </div>
      ) : (
        <div className="ai4td-loader-wrapper">
          <AiFillSecurityScan size={35} color={"#6a1b9a"}/>
        </div>
      )}
    </button>
  );
}


export default GlobalButtonV1