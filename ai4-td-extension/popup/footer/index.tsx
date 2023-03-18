import { Button, ButtonGroup } from "@mui/material";
import RadarIcon from '@mui/icons-material/Radar';

function Footer() {
    return (
        <ButtonGroup
            disableElevation
            variant="text"
            aria-label="text button group"
            fullWidth
            sx={{
                height: "50px"
            }}
        >
            <Button startIcon={<RadarIcon />} sx={{
                borderRightColor: "rgba(0, 0, 0, .12)!important"
            }}>
                Scan Text
            </Button>
            <Button>Two</Button>
      </ButtonGroup>
    );
}

export default Footer