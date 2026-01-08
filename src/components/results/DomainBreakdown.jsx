import React, { useState } from 'react';
import { getRiskLevel, getRiskColor } from '../../utils/scoring';
import './DomainBreakdown.css';

export default function DomainBreakdown({ domains }) {
    const [expandedDomain, setExpandedDomain] = useState(null);

    const toggleDomain = (domainId) => {
        setExpandedDomain(expandedDomain === domainId ? null : domainId);
    };

    // Sort domains by percentage (lowest first to highlight issues)
    const sortedDomains = [...domains].sort((a, b) => a.percentage - b.percentage);

    return (
        <div className="domain-breakdown">
            <h2 className="breakdown-title">Domain Analysis</h2>

            <div className="domains-list">
                {sortedDomains.map((domain) => {
                    const riskLevel = getRiskLevel(domain.percentage);
                    const color = getRiskColor(riskLevel);
                    const isExpanded = expandedDomain === domain.id;

                    return (
                        <div key={domain.id} className="domain-item">
                            <div
                                className="domain-summary"
                                onClick={() => toggleDomain(domain.id)}
                            >
                                <div className="domain-header">
                                    <span className="domain-icon">{domain.icon}</span>
                                    <div className="domain-title-group">
                                        <h3 className="domain-title">{domain.name}</h3>
                                        <p className="domain-desc">{domain.description}</p>
                                    </div>
                                </div>

                                <div className="domain-metrics">
                                    <div className="metric">
                                        <span className="metric-label">Score</span>
                                        <span className="metric-value" style={{ color }}>
                                            {domain.percentage}%
                                        </span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-label">Answered</span>
                                        <span className="metric-value">
                                            {domain.answeredCount}/{domain.totalCount}
                                        </span>
                                    </div>
                                    <div className="metric">
                                        <span className="metric-label">Weight</span>
                                        <span className="metric-value">
                                            {Math.round(domain.weight * 100)}%
                                        </span>
                                    </div>
                                </div>

                                <div className="domain-bar-container">
                                    <div
                                        className="domain-bar"
                                        style={{
                                            width: `${domain.percentage}%`,
                                            background: color
                                        }}
                                    />
                                </div>

                                <button className="expand-button">
                                    {isExpanded ? '▼' : '▶'}
                                </button>
                            </div>

                            {isExpanded && (
                                <div className="domain-details">
                                    <h4>Questions Breakdown</h4>
                                    <p className="detail-info">
                                        Answered {domain.answeredCount} of {domain.totalCount} questions
                                    </p>
                                    <p className="detail-info">
                                        Weighted contribution to overall score: {domain.weightedContribution.toFixed(1)} points
                                    </p>
                                    <div className="risk-indicator" style={{ background: color, color: '#fff' }}>
                                        Risk Level: {riskLevel}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
