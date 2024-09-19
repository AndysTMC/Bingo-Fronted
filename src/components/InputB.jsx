import React from 'react';
import './InputB.css';

const InputB = ({ type, placeholder,className, value, onChange }) => {
    return (
            <input className={`${className}`} type={type} value={value} placeholder={placeholder} onChange={onChange} />
    );
}

export default InputB;