import React from 'react';
import { getRiskLevel, getRiskColor } from '../../utils/scoring';
import './ExecutiveSummary.css';

export default function ExecutiveSummary({
    scores,
    recommendations,
    framework,
    responses,
    topRisks,
    isPrintMode = false
}) {
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const riskLevel = getRiskLevel(scores.overall);
    const riskColor = getRiskColor(riskLevel);

    // Get interpretation based on risk level
    const getInterpretation = (level) => {
        const interpretations = {
            'Low': 'The organization demonstrates a strong security posture with comprehensive controls in place. Focus should be on maintaining current practices and addressing remaining gaps.',
            'Medium': 'The organization has implemented foundational security controls but exhibits notable gaps that require attention. Prioritize addressing High priority findings to reduce risk exposure.',
            'High': 'The organization faces significant security risks due to incomplete control implementation. Immediate action is required to address critical gaps, particularly in high-weight domains.',
            'Critical': 'The organization\'s security posture presents severe risk exposure. Critical controls are missing or inadequate. Urgent remediation is required to protect against common attack vectors.'
        };
        return interpretations[level] || '';
    };

    // Get key findings for each domain
    const getDomainFinding = (domain) => {
        if (domain.percentage >= 80) {
            return {
                type: 'strength',
                text: `Strong controls in place (${domain.answeredCount}/${domain.totalCount} questions completed)`
            };
        } else {
            const domainRisks = topRisks.filter(r => r.domainId === domain.id);
            if (domainRisks.length > 0) {
                return {
                    type: 'gap',
                    text: `${domainRisks.length} critical gap${domainRisks.length > 1 ? 's' : ''} identified`
                };
            }
            return {
                type: 'gap',
                text: 'Improvement opportunities identified'
            };
        }
    };

    // Categorize recommendations by urgency
    const shortTermActions = topRisks.filter(r => r.priority === 'High').slice(0, 3);
    const mediumTermActions = topRisks.filter(r => r.priority === 'Medium').slice(0, 2);

    return (
        <div id="executive-summary" className={`executive-summary ${isPrintMode ? 'print-mode' : ''}`}>
            {/* Title Page / Header */}
            <div className="summary-header">
                <h1 className="summary-title">Cloud Security Audit</h1>
                <h2 className="summary-subtitle">Executive Summary Report</h2>
                <div className="summary-meta">
                    <p className="summary-date">Generated on {currentDate}</p>
                </div>

                <div className="summary-score-badge" style={{ borderColor: riskColor }}>
                    <div className="score-value" style={{ color: riskColor }}>
                        {scores.overall}
                    </div>
                    <div className="score-label">Overall Score</div>
                    <div className="risk-level" style={{ background: riskColor }}>
                        {riskLevel} Risk
                    </div>
                </div>
            </div>

            {/* Overview Section */}
            <section className="summary-section">
                <h3 className="section-title">1. Assessment Overview</h3>

                <div className="subsection">
                    <h4>Purpose</h4>
                    <p>
                        This assessment evaluates the organization's cloud security posture across six critical
                        security domains using a structured, question-based methodology.
                    </p>
                </div>

                <div className="subsection">
                    <h4>Scope</h4>
                    <ul className="scope-list">
                        {framework.domains.map(domain => (
                            <li key={domain.id}>
                                <strong>{domain.icon} {domain.name}</strong>
                                <span className="domain-weight-inline"> ({Math.round(domain.weight * 100)}% weight)</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="subsection">
                    <h4>Methodology</h4>
                    <p>
                        The assessment utilizes a weighted scoring system where each domain contributes
                        proportionally to the overall security score based on industry-standard risk priorities.
                        Responses are categorized as:
                    </p>
                    <ul>
                        <li><strong>Implemented</strong> (100 points) - Control is fully implemented and operational</li>
                        <li><strong>Partially Implemented</strong> (50 points) - Control exists but has gaps</li>
                        <li><strong>Not Implemented</strong> (0 points) - Control is absent or not functional</li>
                        <li><strong>Not Applicable</strong> - Control is not relevant (excluded from scoring)</li>
                    </ul>
                </div>
            </section>

            {/* Overall Security Posture */}
            <section className="summary-section">
                <h3 className="section-title">2. Overall Security Posture</h3>

                <div className="posture-summary">
                    <div className="posture-metrics">
                        <div className="metric-item">
                            <div className="metric-value">{scores.overall}/100</div>
                            <div className="metric-label">Overall Score</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-value" style={{ color: riskColor }}>{riskLevel}</div>
                            <div className="metric-label">Risk Level</div>
                        </div>
                        <div className="metric-item">
                            <div className="metric-value">{scores.completionPercentage}%</div>
                            <div className="metric-label">Completed</div>
                        </div>
                    </div>

                    <div className="posture-interpretation">
                        <h4>Interpretation</h4>
                        <p>{getInterpretation(riskLevel)}</p>
                    </div>
                </div>
            </section>

            {/* Domain-Level Summary */}
            <section className="summary-section">
                <h3 className="section-title">3. Domain-Level Summary</h3>

                <table className="domain-table">
                    <thead>
                        <tr>
                            <th>Domain</th>
                            <th>Score</th>
                            <th>Weight</th>
                            <th>Status</th>
                            <th>Key Finding</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scores.domains.map(domain => {
                            const finding = getDomainFinding(domain);
                            const domainRisk = getRiskLevel(domain.percentage);
                            const domainColor = getRiskColor(domainRisk);

                            return (
                                <tr key={domain.id}>
                                    <td>
                                        <span className="domain-icon-small">{domain.icon}</span>
                                        {domain.name}
                                    </td>
                                    <td className="score-cell">
                                        <strong style={{ color: domainColor }}>{domain.percentage}%</strong>
                                    </td>
                                    <td>{Math.round(domain.weight * 100)}%</td>
                                    <td>
                                        <span className="status-badge" style={{
                                            background: domainColor,
                                            color: '#fff'
                                        }}>
                                            {domainRisk}
                                        </span>
                                    </td>
                                    <td className={`finding-${finding.type}`}>
                                        {finding.text}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>

            {/* Top Security Risks */}
            <section className="summary-section">
                <h3 className="section-title">4. Top Security Risks</h3>

                {topRisks.length === 0 ? (
                    <p className="no-risks">No critical risks identified. Excellent security posture!</p>
                ) : (
                    <div className="risks-list">
                        {topRisks.map((risk, index) => (
                            <div key={index} className="risk-item">
                                <div className="risk-header">
                                    <span className="risk-number">{index + 1}</span>
                                    <span className={`risk-priority priority-${risk.priority.toLowerCase()}`}>
                                        {risk.priority} Priority
                                    </span>
                                    <span className="risk-domain">{risk.domain}</span>
                                </div>
                                <div className="risk-control">
                                    <strong>Control:</strong> {risk.question}
                                </div>
                                <div className="risk-impact">
                                    <strong>Risk Impact:</strong> {risk.riskImpact}
                                </div>
                                <div className="risk-action">
                                    <strong>Recommended Action:</strong> {risk.recommendation}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Recommended Next Steps */}
            <section className="summary-section">
                <h3 className="section-title">5. Recommended Next Steps</h3>

                {shortTermActions.length > 0 && (
                    <div className="actions-group">
                        <h4>Short-Term Actions (0-30 days)</h4>
                        <ol className="actions-list">
                            {shortTermActions.map((action, index) => (
                                <li key={index}>
                                    <strong>{action.domain}:</strong> {action.recommendation}
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {mediumTermActions.length > 0 && (
                    <div className="actions-group">
                        <h4>Medium-Term Actions (30-90 days)</h4>
                        <ol className="actions-list">
                            {mediumTermActions.map((action, index) => (
                                <li key={index}>
                                    <strong>{action.domain}:</strong> {action.recommendation}
                                </li>
                            ))}
                        </ol>
                    </div>
                )}

                {shortTermActions.length === 0 && mediumTermActions.length === 0 && (
                    <p>Continue monitoring and maintaining current security controls. Regular reassessment recommended.</p>
                )}
            </section>

            {/* Assessment Notes */}
            <section className="summary-section assessment-notes">
                <h3 className="section-title">6. Assessment Notes</h3>

                <div className="note-box">
                    <h4>Important Disclaimers</h4>
                    <ul>
                        <li>
                            <strong>Self-Reported Data:</strong> This assessment is based on self-reported responses
                            and has not been independently validated through technical testing or evidence review.
                        </li>
                        <li>
                            <strong>Control Presence vs. Effectiveness:</strong> Scores reflect the reported presence
                            of security controls, not their operational effectiveness or implementation quality.
                        </li>
                        <li>
                            <strong>Point-in-Time Assessment:</strong> Results represent the security posture at the
                            time of assessment and may not reflect recent changes or improvements.
                        </li>
                        <li>
                            <strong>Scope Limitations:</strong> This assessment covers {scores.totalQuestions} control
                            questions across {framework.domains.length} domains and does not constitute a comprehensive
                            security audit or penetration test.
                        </li>
                    </ul>
                </div>

                <div className="note-box">
                    <h4>Recommendations for Action</h4>
                    <ul>
                        <li>Prioritize remediation efforts based on risk level and domain weight</li>
                        <li>Conduct independent validation of implemented controls</li>
                        <li>Perform regular reassessments (quarterly recommended)</li>
                        <li>Engage security professionals for detailed gap analysis</li>
                    </ul>
                </div>
            </section>

            {/* Footer */}
            <div className="summary-footer">
                <p className="confidential">Confidential - Internal Use Only</p>
                <p className="generated-by">Generated by Cloud Security Audit Framework</p>
            </div>
        </div>
    );
}
