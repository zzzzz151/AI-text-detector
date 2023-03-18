import type { PlasmoCSConfig } from 'plasmo';
import React, { useState, useEffect, useRef, MutableRefObject }  from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { green, purple } from '@mui/material/colors';
import Fab from '@mui/material/Fab';
import { AiFillSecurityScan } from 'react-icons/ai';
import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import { callApi } from './utils';

export const config: PlasmoCSConfig = {
    matches: ["<all_urls>"]
}
const styleElement = document.createElement("style")

const styleCache = createCache({
  key: "plasmo-mui-cache",
  prepend: true,
  container: styleElement
})

export const getStyle = () => styleElement

function GlobalButtonV2() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const timer = useRef() as MutableRefObject<number>;

    useEffect(() => {
      return () => {
        clearTimeout(timer.current);
      };
    }, []);

    const mockButtonClick = () => {
      if (!loading) {
        setSuccess(false);
        setLoading(true);
        timer.current = window.setTimeout(() => {
          setSuccess(true);
          setLoading(false);
        }, 2000);
      }
    };
    const buttonSx = {
      ...(success && {
        bgcolor: green[500],
        '&:hover': {
          bgcolor: green[600],
        },
      }),
    };

    const handleButtonClick = () => {
      if (!loading) {
        setSuccess(false);
        setLoading(true);
        callApi(process.env.PLASMO_PUBLIC_API_URL, { "type": "text", "text": "hello" })
          .then(data => {
            setSuccess(true);
            setLoading(false);
            console.log(data);
          })
          .catch(error => {
            setLoading(false);
          });
      }
    };    
    

    return (
      <CacheProvider value={styleCache}>
        <Box sx={{ position: 'fixed', right: "2rem", bottom: "2rem" }}>
          <Fab
              aria-label="save"
              onClick={handleButtonClick}
              sx={{
                height: "60px",
                width: "60px",
                bgcolor: '#e1e1e1', // Set the background color of the Fab component
                ...buttonSx // Include any other styles from the buttonSx object
              }}
          >
            {success ?
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
      </CacheProvider>
    );
}


export default GlobalButtonV2


/*
<Draggable onDrag={() => setIsDragging(true)} onStop={() => {
  if (!isDragging) {
        handleButtonClick()
      }
      setIsDragging(false)
  }}
>
  <Box sx={{ position: 'fixed', right: "2rem", bottom: "2rem" }}>
    <Fab
      aria-label="save"
      sx={{
        height: "60px",
        width: "60px",
        bgcolor: '#e1e1e1', // Set the background color of the Fab component
        ...buttonSx // Include any other styles from the buttonSx object
      }}
    >
      {success ?
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
</Draggable>
*/