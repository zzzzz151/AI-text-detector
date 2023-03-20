import { ListItem, ListItemText } from "@mui/material";

function ListItemMultiSelect({ props }) {

    function handleClick() {
        throw new Error("Function not implemented.");
    }

    return (
        <ListItem sx={{cursor: "pointer"}} onClick={handleClick}>
        <ListItemText
          id={props.id}
          primary={props.text}
          primaryTypographyProps={{
            fontSize: 14,
            color: '#1f243c',
            fontFamily: 'Inter, sans-serif',
            lineHeight: '20px'
          }}
        />
      </ListItem>
    );
}

export default ListItemMultiSelect