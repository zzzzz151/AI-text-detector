import { styled, Switch } from "@mui/material";

const OnOffSwitch = styled(Switch)(({ theme }) => ({
  width: 80,
  height: 48,
  padding: 8,
  '& .MuiSwitch-switchBase': {
    padding: 11,
    color: 'rgb(0, 0, 0, 0.5)',
    '&.Mui-checked': {
      color: '#185a9d',
      transform: 'translateX(32px)',
      '&:hover': {
        backgroundColor: 'rgba(24,90,257,0.08)',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 26,
    height: 26,
    backgroundColor: '#fff',
  },
  '& .MuiSwitch-track': {
    background: 'rgba(0, 0, 0, .5)',
    borderRadius: 20,
    position: 'relative',
    '&:before': {
      display: 'inline-block',
      content: '"ON"',
      position: 'absolute',
      top: '50%',
      left: 3,
      width: '50%',
      transform: 'translateY(-50%)',
      color: '#fff',
      textAlign: 'center',
    },
    '&:after': {
      display: 'inline-block',
      content: '"OFF"',
      position: 'absolute',
      top: '50%',
      right: 3,
      width: '50%',
      transform: 'translateY(-50%)',
      color: '#fff',
      textAlign: 'center',
    },
    '&.Mui-checked + .MuiSwitch-thumb': {
      backgroundColor: '#fff',
    },
    '&.Mui-checked': {
      background: 'rgb(25,118,210)',
    },
  },
}));

export default OnOffSwitch;
