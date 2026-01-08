import React from 'react';
import './ProgressBar.css';

export default function ProgressBar({
    current,
    total,
    showPercentage = true,
    color = '#667eea',
    label = ''
}) {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

    return (
        <div className="progress-bar-container">
            {label && (
                <div className="progress-label">
                    <span>{label}</span>
                    {showPercentage && <span className="progress-percentage">{percentage}%</span>}
                </div>
            )}
            <div className="progress-bar-track">
                <div
                    className="progress-bar-fill"
                    style={{
                        width: `${percentage}%`,
                        background: color
                    }}
                >
                    {!label && showPercentage && percentage > 10 && (
                        <span className="progress-text">{percentage}%</span>
                    )}
                </div>
            </div>
            {!label && (
                <div className="progress-info">
                    <span>{current} of {total} completed</span>
                </div>
            )}
        </div>
    );
}
