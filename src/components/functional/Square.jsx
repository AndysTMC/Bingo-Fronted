import React from "react"

const Square = ({ value, isMarked, onClick }) => {
    return (
        <div className={`square${isMarked ? " marked" : ""}`} onClick={onClick}>
            {isMarked ? value : null}
        </div>
    )
}