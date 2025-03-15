import React from 'react';

export default function Button({ name, onClick, className }) {
    return (
        <>
        <button
            onClick={onClick}
            className={`transition-colors ${className}`}
        >
            {name}
        </button>
        <br />
        </>
    );
}