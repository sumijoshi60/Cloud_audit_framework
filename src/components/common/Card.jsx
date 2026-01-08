import React from 'react';
import './Card.css';

export default function Card({ title, children, variant = 'default', className = '' }) {
    return (
        <div className={`card card-${variant} ${className}`}>
            {title && <h3 className="card-title">{title}</h3>}
            <div className="card-content">
                {children}
            </div>
        </div>
    );
}
