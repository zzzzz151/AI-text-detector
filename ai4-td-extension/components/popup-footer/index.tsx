import { Box, Button, ButtonGroup, Divider } from "@mui/material";
import RadarIcon from '@mui/icons-material/Radar';

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
                <Button startIcon={<RadarIcon />} sx={{
                    borderRightColor: "rgba(0, 0, 0, .12)!important"
                }}>
                    Scan Text
                </Button>
                <Button>Two</Button>
        </ButtonGroup>
      </Box>
    );
}

export default PopupFooter