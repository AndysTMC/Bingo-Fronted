import React from 'react';
import './Button.css';
function Button({ id, name , onClick }) {
  return (
    <button className = "btn" id={id} onClick={onClick}>
      {name}
    </button>
  );
}

export default Button;