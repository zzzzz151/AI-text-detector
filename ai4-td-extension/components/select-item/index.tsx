import { ButtonBase, keyframes } from "@mui/material";

const enterKeyframe = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;

function SelectItem(props) {
  return (
    <ButtonBase 
      component="div" 
      className="select-option" 
      onClick={props.onClick} // Add onClick prop
      sx={{
        padding: '0 8px',
        justifyContent: 'unset',
        '&& .MuiTouchRipple-rippleVisible': {
          animationDuration: '200ms',
          animationName: enterKeyframe,
          opacity: 0.1,
          animationTimingFunction: "ease-in-out"
        }
      }}
    >
      <span className="select-option-text">{props.title}</span>
    </ButtonBase>
  );
}

export default SelectItem;
