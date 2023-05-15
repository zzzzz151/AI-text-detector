import { Button, ThemeProvider, createTheme } from "@mui/material";
import { useStorage } from "@plasmohq/storage/hook";
import { useState } from "react";
import "~/components/textarea/styles.css"
import { callApi } from "~resources/utils";
const blueTheme = createTheme({ palette: { primary: {main:'#181b21'} } })

const URL = "http://127.0.0.1:8000/api/v1";
function TextArea() {
    const [languageModel] = useStorage<string>("model", v => v ?? 'openai-roberta-base');
    const [textareaValue, setTextareaValue] = useState("");

    function analyseBlock() {
        if (textareaValue.trim() === "") {
          // Textarea is empty, display an error message or handle it accordingly
          return;
        }
    
        callApi(URL, { languageModel, text: textareaValue }).then((data) => {
          alert(data.probability_AI_generated)
        });
    }

    return (
        <ThemeProvider theme={blueTheme}>
            <div className="scanned-text-container">
                <textarea 
                    className="scanned-text"
                    name="message" 
                    placeholder="Paste text here" 
                    autoFocus
                    value={textareaValue}
                    onChange={(e) => setTextareaValue(e.target.value)}
                ></textarea>
                <span className="error-msg"></span>
                <Button color="primary" variant="contained" sx={{
                    padding: 0,
                    margin: '8px 0',
                    cursor: 'pointer',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    fontSize: '14px',
                    lineHeight: '32px',
                    color: '#fff',
                }}>Scan text</Button>
            </div>
        </ThemeProvider>
    );
}

export default TextArea;