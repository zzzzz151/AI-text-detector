import { Box, Button, ButtonGroup, Divider, ThemeProvider, createTheme } from "@mui/material";
const mutedTheme = createTheme({ palette: { primary: {main:'#6d758d'} } })

function PopupFooter() {
    return (
        <Box position={"sticky"} bottom={0} bgcolor={'background.paper'}>
            <Divider />
            <ButtonGroup
                disableElevation
                variant="text"
                aria-label="text button group"
                fullWidth
                sx={{
                    height: "50px",
                }}
            >
            <ThemeProvider theme={mutedTheme}>
                <Button 
                    color="primary" 
                    sx={{
                        borderRightColor: "rgba(0, 0, 0, .12)!important",
                        textTransform: 'none',
                        fontSize: '12px',
                    }}
                    component="a"
                    href="https://www.youtube.com/"
                    target="_blank"
                >
                    <svg style={{marginRight: '4px', paddingBottom: '2px'}} stroke= "#6d758d" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.563 21.438v-9.625L14 5.686l7.438 6.125v9.626m-9.625 0v-4.813c0-1.208.979-2.188 2.187-2.188v0c1.208 0 2.188.98 2.188 2.188v4.813" stroke-width=".875" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    LM Hub
                </Button>
                <Button 
                    color="primary" 
                    sx={{
                        textTransform: 'none',
                        fontSize: '12px',
                    }}
                    component="a"
                    href="https://www.twitch.tv/"
                    target="_blank"
                >
                    <svg style={{marginRight: '4px', paddingBottom: '2px'}} stroke= "#6d758d" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.438 10.063v8.75m4.374-4.375h-8.75m13.126 0a8.75 8.75 0 1 1-17.5 0 8.75 8.75 0 0 1 17.5 0z" stroke-width=".875" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    PDF Viewer
                </Button>
            </ThemeProvider>
        </ButtonGroup>
      </Box>
    );
}

export default PopupFooter