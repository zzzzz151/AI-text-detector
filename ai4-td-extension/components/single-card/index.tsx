import { Box } from "@mui/material";

function SingleCard(props) {

    const probability = props.element.getAttribute("probability");;
    
    return (
        <Box sx={{
            backgroundColor: 'background.paper',
            color: 'rgba(0, 0, 0, 0.87)',
            transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            borderRadius: '4px',
            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px',
            overflow: 'hidden auto',
            outline: '0px',
            padding: '16px',
            fontSize: '14px',
            minWidth: "120px",
            width: "max-content",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
            <span>Text is <span style={{fontWeight: 700}}>{probability}%</span> AI generated</span>
        </Box>
    );
}

export default SingleCard;