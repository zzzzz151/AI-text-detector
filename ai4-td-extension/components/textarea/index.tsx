import { Button, ThemeProvider, createTheme } from "@mui/material";
import { useStorage } from "@plasmohq/storage/hook";
import { LegacyRef, useRef, useState } from "react";
import "~/components/textarea/styles.css"
import { callApi } from "~resources/utils";
const blueTheme = createTheme({ palette: { primary: {main:'#181b21'} } })

const URL = "http://127.0.0.1:8000/api/v1";
const characterLimit = 5000;

function TextArea() {
    const [languageModel] = useStorage<string>("model", v => v ?? 'openai-roberta-base');
    const [textareaValue, setTextareaValue] = useState("");
    const taElement: LegacyRef<HTMLTextAreaElement> = useRef();

    function analyseBlock() {
        if (textareaValue.trim() === "") {
          // Textarea is empty, display an error message or handle it accordingly
          return;
        }
    
        callApi(URL, { language_model: languageModel, text: textareaValue }).then((data) => {
          alert(data.probability_AI_generated)
        });
    }

    const handleTextareaChange = (e) => {
        const value = e.target.value;
        if (value.length <= characterLimit) {
          setTextareaValue(value);
        }
    };

    const clearTextarea = () => {
        setTextareaValue("")
        if (taElement.current) {
            taElement.current.focus();
        }
    }

    const characterCount = textareaValue.length;

    return (
        <ThemeProvider theme={blueTheme}>
            <div className="scanned-text-container">
                <textarea
                    ref={taElement}
                    className="scanned-text"
                    name="message" 
                    placeholder="Paste text here" 
                    autoFocus
                    value={textareaValue}
                    onChange={handleTextareaChange}
                ></textarea>
                <div className="scanned-text-footer">
                    <span className="scanned-text-limit">{characterCount}/{characterLimit} characters</span>
                    {characterCount > 0 && <span className="scanned-text-clear" onClick={clearTextarea}>Clear</span>}
                </div>
                <span className="error-msg"></span>
                <Button onClick={analyseBlock} color="primary" variant="contained" sx={{
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