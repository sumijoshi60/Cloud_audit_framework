import React from 'react';
import './DomainSelector.css';

export default function DomainSelector({ domains, currentDomain, onDomainChange, completionStatus = {} }) {
    return (
        <div className="domain-selector">
            <h3 className="domain-selector-title">Select Domain</h3>
            <div className="domain-tabs">
                {domains.map((domain) => {
                    const progress = completionStatus[domain.id] || { completed: 0, total: 0, percentage: 0 };
                    const isActive = currentDomain === domain.id;
                    const isComplete = progress.percentage === 100;

                    return (
                        <button
                            key={domain.id}
                            className={`domain-tab ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}
                            onClick={() => onDomainChange(domain.id)}
                        >
                            <span className="domain-icon">{domain.icon}</span>
                            <div className="domain-info">
                                <span className="domain-name">{domain.name}</span>
                                <span className="domain-progress">{progress.completed}/{progress.total}</span>
                            </div>
                            {isComplete && <span className="checkmark">✓</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
