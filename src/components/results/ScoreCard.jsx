import React from 'react';
import { getRiskLevel, getRiskColor } from '../../utils/scoring';
import './ScoreCard.css';

export default function ScoreCard({ score, completedDomains, totalDomains }) {
    const riskLevel = getRiskLevel(score);
    const color = getRiskColor(riskLevel);
    const percentage = score;

    // Calculate stroke dashoffset for circular progress
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="score-card">
            <h2 className="score-card-title">Overall Security Score</h2>

            <div className="score-visual">
                <svg width="200" height="200" viewBox="0 0 200 200">
                    {/* Background circle */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="12"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        transform="rotate(-90 100 100)"
                        className="progress-circle"
                    />
                </svg>
                <div className="score-center">
                    <div className="score-number">{score}</div>
                    <div className="score-max">/ 100</div>
                </div>
            </div>

            <div className="risk-badge" style={{ background: color }}>
                {riskLevel} Risk
            </div>

            <div className="score-stats">
                <div className="stat">
                    <span className="stat-value">{completedDomains}</span>
                    <span className="stat-label">of {totalDomains} Domains</span>
                </div>
            </div>
        </div>
    );
}
