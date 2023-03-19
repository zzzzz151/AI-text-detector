import { forwardRef, useState } from 'react';
import "~popup/switchers/switcher.css"

function Switcher({checked}, ref) {

  return (
      <div
        className="ui-switcher"
        aria-checked={checked}
        role="switch"
        ref={ref}
      >
        <span className="ui-switcher-thumb"></span>
      </div>
  );
}

export default forwardRef(Switcher)