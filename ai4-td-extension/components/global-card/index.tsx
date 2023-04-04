import { Box, IconButton } from "@mui/material";
import { IoReloadCircle } from "react-icons/io5";

function GlobalCard({data, onReloadClick}) {

    return (
        <Box 
            width={'200px'} 
            fontSize={'14px'} 
            padding={'16px'} 
            borderRadius={'4px'} 
            overflow={'hidden auto'} 
            boxShadow={'rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.14) 0px 8px 10px 1px, rgba(0, 0, 0, 0.12) 0px 3px 14px 2px'} 
            color={'rgba(0, 0, 0, 0.87)'} 
            bgcolor={'background.paper'} 
            bottom={100} 
            right={30} 
            position={'fixed'} 
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
        >
            <span>{`Overall evaluation ${data}%`}</span>
            <IconButton onClick={onReloadClick} sx={{padding: 0}} children={<IoReloadCircle size={32} color="#8b8bec"/>} />
        </Box>
    )
}

export default GlobalCard