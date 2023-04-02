import { forwardRef } from 'react';
import "~components/switchers/switcher.css"

function Switcher({checked}, ref) {

  return (
      <div
        className="ui-switcher"
        aria-checked={checked}
        role="switch"
        ref={ref}
      >
      </div>
  );
}

export default forwardRef(Switcher)