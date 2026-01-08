import React from 'react';
import './RecommendationList.css';

export default function RecommendationList({ recommendations }) {
    if (recommendations.length === 0) {
        return (
            <div className="recommendations-empty">
                <h3>🎉 Excellent Work!</h3>
                <p>No critical recommendations at this time. Keep maintaining your security posture!</p>
            </div>
        );
    }

    const priorityGroups = {
        High: recommendations.filter(r => r.priority === 'High'),
        Medium: recommendations.filter(r => r.priority === 'Medium'),
        Low: recommendations.filter(r => r.priority === 'Low')
    };

    return (
        <div className="recommendations-list">
            <h2 className="recommendations-title">Security Recommendations</h2>

            {Object.entries(priorityGroups).map(([priority, items]) => {
                if (items.length === 0) return null;

                return (
                    <div key={priority} className="priority-group">
                        <h3 className={`priority-header priority-${priority.toLowerCase()}`}>
                            {priority} Priority ({items.length})
                        </h3>

                        <div className="recommendations-items">
                            {items.map((rec, index) => (
                                <div key={index} className="recommendation-item">
                                    <div className="recommendation-header">
                                        <span className="recommendation-domain">{rec.domain}</span>
                                        <span className={`priority-badge priority-${priority.toLowerCase()}`}>
                                            {priority}
                                        </span>
                                    </div>
                                    <p className="recommendation-question">{rec.question}</p>
                                    <p className="recommendation-text">{rec.recommendation}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
