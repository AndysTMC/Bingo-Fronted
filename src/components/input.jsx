import React from 'react';
import './input.css';

function Input({ type, placeholder, value, onChange }) {
    return (

        <div className="oddboxinner">
            <input className="evenboxinner" type={type} value={value} placeholder={placeholder} onChange={onChange} />

        </div>
    );
}

export default Input;