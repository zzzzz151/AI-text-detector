import { ListItem, ListItemText } from "@mui/material";
import Select from "~components/select";

function ListItemSelect({hook, ...props}) { 
    const [selectedOption, setSelectedOption, options] = hook();

    function handleOptionChange(option) {
        setSelectedOption(option);
    }

    return (
        <ListItem>
            <ListItemText
            id={props.id}
            primary={props.text}
            primaryTypographyProps={{
                fontSize: 14,
                color: '#1f243c',
                lineHeight: '20px'
            }}
            />
            <Select options={options} value={selectedOption} onChange={handleOptionChange}/>
      </ListItem>
    );
}

export default ListItemSelect