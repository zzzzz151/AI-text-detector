import { Box, Button, ButtonGroup, Divider} from "@mui/material";

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
                    borderRadius: 0,
                    height: "50px",
                }}
            >
            <Button 
                color="primary" 
                sx={{
                    fontWeight: 400,
                    borderRadius: 0,
                    borderRightColor: "rgba(0, 0, 0, .12)!important",
                    textTransform: 'none',
                    fontSize: '12px',
                    color: '#6d758d',
                    ":hover": {
                        color: "black"
                    }
                }}
                component="a"
                href={process.env.PLASMO_PUBLIC_HUB_URL}
                target="_blank"
            >
                <svg style={{marginRight: '4px', paddingBottom: '2px'}} stroke="currentColor" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.563 21.438v-9.625L14 5.686l7.438 6.125v9.626m-9.625 0v-4.813c0-1.208.979-2.188 2.187-2.188v0c1.208 0 2.188.98 2.188 2.188v4.813" strokeWidth=".875" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                LM Hub
            </Button>
            <Button 
                color="primary" 
                sx={{
                    fontWeight: 400,
                    borderRadius: 0,
                    textTransform: 'none',
                    color: '#6d758d',
                    fontSize: '12px',
                    ":hover": {
                        color: "black"
                    }
                }}
                component="a"
                href={process.env.PLASMO_PUBLIC_PDF_VIEWER_URL}
                target="_blank"
            >
                <svg style={{marginRight: '4px', paddingBottom: '2px'}} stroke= "currentColor" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.438 10.063v8.75m4.374-4.375h-8.75m13.126 0a8.75 8.75 0 1 1-17.5 0 8.75 8.75 0 0 1 17.5 0z" strokeWidth=".875" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                PDF Viewer
            </Button>
        </ButtonGroup>
      </Box>
    );
}

export default PopupFooter