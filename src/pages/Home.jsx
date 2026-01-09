import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuditContext } from '../context/AuditContext';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import './Home.css';

export default function Home() {
    const navigate = useNavigate();
    const { framework, hasExistingAudit, clearAllResponses } = useContext(AuditContext);
    const hasExisting = hasExistingAudit();

    const handleStartAssessment = () => {
        navigate('/assessment');
    };

    const handleViewResults = () => {
        navigate('/results');
    };

    const handleNewAssessment = () => {
        if (window.confirm('Are you sure you want to start a new assessment? This will clear your current progress.')) {
            clearAllResponses();
            navigate('/assessment');
        }
    };

    return (
        <Layout>
            <div className="home-container">
                <section className="hero">
                    <h1 className="hero-title">Cloud Security Audit Framework</h1>
                    <p className="hero-subtitle">
                        Comprehensive assessment of your cloud security posture across 6 critical domains
                    </p>

                    <div className="cta-buttons">
                        <Button onClick={handleStartAssessment} variant="primary">
                            {hasExisting ? '📝 Continue Assessment' : '🚀 Start New Assessment'}
                        </Button>
                        {hasExisting && (
                            <>
                                <Button onClick={handleViewResults} variant="secondary">
                                    📊 View Results
                                </Button>
                                <Button onClick={handleNewAssessment} variant="danger">
                                    🔄 Start New Assessment
                                </Button>
                            </>
                        )}
                    </div>
                </section>

                <section className="domains-overview">
                    <h2 className="section-title">Audit Domains</h2>
                    <div className="domains-grid">
                        {framework.domains.map((domain) => (
                            <Card key={domain.id} className="domain-card">
                                <div className="domain-card-icon">{domain.icon}</div>
                                <h3 className="domain-card-title">{domain.name}</h3>
                                <p className="domain-card-description">{domain.description}</p>
                                <div className="domain-card-footer">
                                    <span className="domain-weight">
                                        Weight: {Math.round(domain.weight * 100)}%
                                    </span>
                                    <span className="domain-questions">
                                        {domain.questions.length} questions
                                    </span>
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="features">
                    <h2 className="section-title">Features</h2>
                    <div className="features-grid">
                        <div className="feature">
                            <div className="feature-icon">💾</div>
                            <h3>Auto-Save Progress</h3>
                            <p>Your responses are automatically saved locally. Resume anytime!</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">🔒</div>
                            <h3>100% Client-Side</h3>
                            <p>All data stays in your browser. No server, complete privacy.</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">📈</div>
                            <h3>Detailed Analysis</h3>
                            <p>Get actionable recommendations based on your security gaps.</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">⚡</div>
                            <h3>Quick Assessment</h3>
                            <p>26 targeted questions covering all critical security areas.</p>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}
