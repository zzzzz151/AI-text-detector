import { Box } from "@mui/material";

function GlobalCard({data, success, anchor, setAnchor}) {

    return (
        <Box sx={{
            display: (success && anchor)? "initial": "none",
            position: 'fixed',
            right: 30,
            bottom: 100,
            backgroundColor: 'background.paper',
            color: 'rgba(0, 0, 0, 0.87)',
            transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
            borderRadius: '4px',
            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px',
            overflow: 'hidden auto',
            outline: '0px',
            padding: '16px',
            fontSize: '14px',
        }}>
            {`Overall evaluation ${data}%`}
        </Box>
    )
}

export default GlobalCard