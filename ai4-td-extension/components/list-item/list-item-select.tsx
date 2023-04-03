import { ListItem, ListItemText } from "@mui/material";
import Select from "~components/select";
import { useState } from "react";

const options = [
    'Option 1',
    "best-language-model-1",
    "long-text-to-see-what-happens-maybe-it-overflows-idk",
    "wtf am I doing",
];

function ListItemSelect(props) {
    const [selectedOption, setSelectedOption] = useState(options[0]);

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
            <Select options={options} value={options[0]} onChange={handleOptionChange}/>
      </ListItem>
    );
}

export default ListItemSelect