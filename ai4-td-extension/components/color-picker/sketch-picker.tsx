import ClickAwayListener from '@mui/material/ClickAwayListener'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { TwitterPicker } from 'react-color'

interface ColorPickerProps {
  onColorChange: (color: string) => void;
  color: string;
}

const SketchExample = forwardRef<void, ColorPickerProps>((props, ref) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false)

  const handleClose = () => {
    setDisplayColorPicker(false)
  }

  const handleChange = (newColor) => {
    if (newColor.hex !== props.color) {
      props.onColorChange(newColor.hex);
    }
  }

  // const presets = ['#FF0000', '#00FF00', '#3d55ff', '#ffdb00', '#697689', '#2CCCE4', '#000000', '#ff8a65', '#ba68c8']

  const styles = {
    color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: props.color,
    } as React.CSSProperties,
    swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
    } as React.CSSProperties,
    popover: {
        position: 'absolute',
        zIndex: 2,
        left: '50%',
        marginLeft: '8px', // while scrollbar open
        transform: 'translateX(-50%)',
    } as React.CSSProperties,
  }

  useImperativeHandle(ref, () => ({
    togglePicker() {
      if (!displayColorPicker) {
        setDisplayColorPicker(true)
      }
    }
  }))

  return (
    <div>
      <div style={ styles.swatch }>
        <div style={ styles.color } />
      </div>
      { displayColorPicker ? 
      <ClickAwayListener onClickAway={ handleClose }>
        <div style={ styles.popover }>
        <TwitterPicker
          triangle='top-right'
          color={props.color}
          onChange={handleChange}
        />
        </div>
      </ClickAwayListener>
       : null }
    </div>
  )
});

/*
        <BlockPicker
          styles={{
            default: {
              card: {
                boxShadow: '0 1px 5px rgba(0, 0, 0, 0.15)',
              },
            },
          }}
          colors={presets}
          width={200}
          triangle='hide'
          disableAlpha={true}
          color={color}
          onChange={handleChange}
        />
        </div>
*/

/*
  const styles = {
    color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: color,
    } as React.CSSProperties,
    swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
    } as React.CSSProperties,
    popover: {
        position: 'fixed',
        top: '5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 2,
    } as React.CSSProperties,
  }
*/

export default SketchExample
