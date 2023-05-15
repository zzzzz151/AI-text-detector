import { ButtonBase } from "@mui/material";

function SelectItem({title, onClick}) {
  return (
    <ButtonBase 
      component="div" 
      className="select-option" 
      onClick={onClick}
      sx={{
        padding: '0 8px',
        justifyContent: 'unset',
        '&& .MuiTouchRipple-rippleVisible': {
          animationDuration: '200ms',
          opacity: 0.1,
          animationName: 'rippleEffect',
          animationTimingFunction: "ease-in-out"
        },
        "@keyframes rippleEffect": {
          "0%": {
            transform: "scale(0)",
          },
          "100%": {
            transform: "scale(1)",
          }
        }
      }}
    >
      <span className="select-option-text">{title}</span>
    </ButtonBase>
  );
}


export default SelectItem;
