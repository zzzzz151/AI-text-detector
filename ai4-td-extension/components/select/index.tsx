import { useState } from 'react';
import SelectItem from '~components/select-item';
import './select.css';

function Select({ options, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleSelectOptions() {
    setIsOpen(!isOpen);
  }

  return (
    <div className="select-box">
      <div className="select-preview" onClick={toggleSelectOptions}>
        <span className="select-value-preview">{value}</span>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.9207 13L12.5 15.2562L14.0793 13H10.9207Z" stroke="#6D758D" strokeWidth="2"></path>
        </svg>
      </div>
      {isOpen && (
        <div className="select-options">
          {options.map((option, index) => (
            <SelectItem key={index} title={option} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Select;
