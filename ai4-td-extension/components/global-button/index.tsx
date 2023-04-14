import { Box, CircularProgress, Fab } from "@mui/material";
import { green, purple, red } from "@mui/material/colors";
import { AiFillSecurityScan } from "react-icons/ai";

function GlobalButton({onClick, is}) {

  const buttonSx = {
      ...(is("success") && {
        bgcolor: green[500],
        '&:hover': {
          bgcolor: green[600],
        },
      }),
      ...(is("error") && {
        bgcolor: red[700],
        '&:hover': {
          bgcolor: red[800],
        },
      }),
  };  
  return (
      <Box sx={{ position: 'fixed', right: 30, bottom: 30 }}>
          <Fab
              aria-label="save"
              onClick={onClick}
              sx={{
              height: 60,
              width: 60,
              bgcolor: '#f1f1f1', // Set the background color of the Fab component
              boxShadow: "0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14), 0px 4px 18px 3px rgba(0, 0, 0, 0.12), 0px -4px 4px -3px rgba(0, 0, 0, 0.1)",
              ...buttonSx // Include any other styles from the buttonSx object
              }}
          >
          <AiFillSecurityScan size={35} color={is("success", "error") ? "#fff" : "#6a1b9a"} />
          </Fab>
          {is("loading") &&
          (<CircularProgress
              size={72}
              sx={{
                  color: purple[800],
                  position: 'absolute',
                  top: -6,
                  left: -6,
                  zIndex: 1,
              }}
          />)
          }
      </Box>
  )
}

export default GlobalButton
