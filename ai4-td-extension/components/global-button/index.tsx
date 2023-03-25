import { Box, CircularProgress, Fab } from "@mui/material";
import { green, purple, red } from "@mui/material/colors";
import { AiFillSecurityScan } from "react-icons/ai";
import { callApi } from "~resources/utils";

function GlobalButton({setData, success, setSuccess, error, setError, loading, setLoading, setAnchor}) {

    const handleClick = () => {
        setAnchor(prevState => !prevState);
        if (!(loading || success)) {
          setLoading(true);
          callApi(process.env.PLASMO_PUBLIC_API_URL, { "type": "text", "text": "hello" })
          .then(data => {
            setSuccess(true);
            setLoading(false);
            setData(data)
            console.log(data);
          })
          .catch(error => {
            setError(true);
            setLoading(false);
          });
        }
    };
      
    const buttonSx = {
        ...(success && {
          bgcolor: green[500],
          '&:hover': {
            bgcolor: green[600],
          },
        }),
        ...(error && {
          bgcolor: red[500],
          '&:hover': {
            bgcolor: red[600],
          },
        }),
    };

    return (
        <Box sx={{ position: 'fixed', right: 30, bottom: 30 }}>
            <Fab
                aria-label="save"
                onClick={handleClick}
                sx={{
                height: 60,
                width: 60,
                bgcolor: '#f1f1f1', // Set the background color of the Fab component
                boxShadow: "0px 6px 6px -3px rgba(0, 0, 0, 0.2), 0px 10px 14px 1px rgba(0, 0, 0, 0.14), 0px 4px 18px 3px rgba(0, 0, 0, 0.12), 0px -4px 4px -3px rgba(0, 0, 0, 0.1)",
                ...buttonSx // Include any other styles from the buttonSx object
                }}
            >
            {success || error ?
            (<AiFillSecurityScan size={35} color={"#fff"} />)
            :
            (<AiFillSecurityScan size={35} color={"#6a1b9a"} />)
            }
            </Fab>
            {loading &&
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
