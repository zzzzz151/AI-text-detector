import { ListItem, ListItemText } from "@mui/material";
import Select from "~components/select";
import { useStorage } from "@plasmohq/storage/hook";

function ListItemSelect({options, ...props}) { 
    const [selectedOption, setSelectedOption] = useStorage<string>(props.id, v => v ?? options[0]);

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