import { useEffect, useMemo, useRef, useState } from 'react';
import SelectItem from '~components/select-item';
import '~/components/select/styles.css';
import { ClickAwayListener } from '@mui/material';
import buildTrie from '~resources/buildTrie';

function Select({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef(null);
  const trie = useMemo(() => buildTrie(options), [options]);

  useEffect(() => {
    if (value) {
      setInputValue(value)
    }
  }, [value])

  const filteredOptions = trie.search(inputValue ?? '');

  function toggleSelectOptions() {
    setIsOpen(true);
    setInputValue("");
    inputRef.current.focus();
  }

  function handleSelectOption(option) {
    setInputValue(option);
    setIsOpen(false);
    onChange(option);
  }

  function handleClickAway() {
    setIsOpen(false);
    setInputValue(value);
  }

  function handleInputChange(event) {
    setInputValue(event.target.value);
  }

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div className="select-box">
        <div className="select-preview" onClick={toggleSelectOptions}>
          <input
            type="text"
            value={inputValue}
            placeholder='Search'
            className="select-value-preview"
            onChange={handleInputChange}
            ref={inputRef}
          />
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.9207 13L12.5 15.2562L14.0793 13H10.9207Z"
              stroke="#6D758D"
              strokeWidth="2"
            ></path>
          </svg>
        </div>
        {isOpen && (
        <div className="select-options">
          {filteredOptions.length > 0 && (
            filteredOptions.map((option, index) => (
              <SelectItem
                key={index}
                title={option}
                onClick={() => handleSelectOption(option)}
              />
            ))
          )}
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
}

export default Select;


