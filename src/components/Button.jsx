import React from 'react';
import './Button.css';
function Button({ id, name , onClick, className = "btn" }) {
  return (
    <button className = {className} id={id} onClick={onClick}>
      {name}
    </button>
  );
}

export default Button;