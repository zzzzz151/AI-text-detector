import { Button } from "@mui/material";
import { useStorage } from "@plasmohq/storage/hook";
import { LegacyRef, useRef, useState } from "react";
import "~/components/textarea/styles.css"
import { callApi } from "~resources/utils";

const URL = process.env.PLASMO_PUBLIC_API_URL;
const characterLimit = 5000;

function TextArea() {
    const [languageModel] = useStorage<string>("model", v => v ?? process.env.PLASMO_PUBLIC_DEFAULT_MODEL);
    const [textareaValue, setTextareaValue] = useState("");
    const taElement: LegacyRef<HTMLTextAreaElement> = useRef();
    const [colorRegular] = useStorage<string>("highlight-color-regular", v => v ?? "#FFFF00")
    const [colorStrong] = useStorage<string>("highlight-color-strong", v => v ?? "#FF0000")
    const [score, setScore] = useState(null);

    const scoreColor = (score > 75)? colorStrong : ((score > 50)? colorRegular : "#04ae18");

    function analyseBlock() {
        if (textareaValue.trim() === "") {
          // Textarea is empty, display an error message or handle it accordingly
          return;
        }
    
        callApi(URL, { model: languageModel, text: textareaValue }).then((data) => {
            setScore(data.probability_AI_generated)
        });
    }

    const handleTextareaChange = (e) => {
        if (score != null) {
            setScore(null);
        }
        const value = e.target.value;
        if (value.length <= characterLimit) {
          setTextareaValue(value);
        }
    };

    const clearTextarea = () => {
        setTextareaValue("");
        setScore(null);
        if (taElement.current) {
            taElement.current.focus();
        }
    }

    const characterCount = textareaValue.length;

    return (
        <div className="scanned-text-container">
            <div className="scanned-text-wrapper" style={{outline: score != null && `2px solid ${scoreColor}`}}>
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
                    {score != null && <span className="scanned-text-score" style={{color: scoreColor}}>{score}%</span>}
                    {characterCount > 0 && <span className="scanned-text-clear" onClick={clearTextarea}>Clear</span>}
                </div>
            </div>
            <span className="error-msg"></span>
            <Button onClick={analyseBlock} color="primary" variant="contained" sx={{
                padding: 0,
                margin: '8px 0',
                cursor: 'pointer',
                fontStyle: 'normal',
                backgroundColor: '#181b21',
                fontWeight: 700,
                fontSize: '14px',
                lineHeight: '32px',
                color: '#fff',
                ':hover': {
                    backgroundColor: '#1a1c1f',
                }
            }}>Scan text</Button>
        </div>
    );
}

export default TextArea;