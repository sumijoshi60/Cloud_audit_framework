import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuditContext } from '../context/AuditContext';
import { generateRecommendations } from '../utils/scoring';
import { exportAuditData } from '../utils/storage';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import ScoreCard from '../components/results/ScoreCard';
import DomainBreakdown from '../components/results/DomainBreakdown';
import RecommendationList from '../components/results/RecommendationList';
import './Results.css';

export default function Results() {
    const navigate = useNavigate();
    const { calculateScores, responses, clearAllResponses } = useContext(AuditContext);

    const scores = calculateScores();
    const recommendations = generateRecommendations(scores.domains, responses);

    const handleRetakeAssessment = () => {
        if (window.confirm('Are you sure you want to clear all responses and start over?')) {
            clearAllResponses();
            navigate('/');
        }
    };

    const handleReviewAnswers = () => {
        navigate('/assessment');
    };

    const handleExport = () => {
        const exportData = {
            timestamp: new Date().toISOString(),
            scores,
            responses,
            recommendations
        };
        const success = exportAuditData(exportData);
        if (success) {
            alert('Audit data exported successfully!');
        } else {
            alert('Failed to export data. Please try again.');
        }
    };

    // Redirect if no responses
    if (scores.totalAnswered === 0) {
        return (
            <Layout>
                <div className="results-empty">
                    <h2>No Assessment Data</h2>
                    <p>You haven't completed any questions yet.</p>
                    <Button onClick={() => navigate('/assessment')} variant="primary">
                        Start Assessment
                    </Button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout showBackButton backTo="/assessment">
            <div className="results-container">
                <div className="results-header">
                    <h1 className="results-title">Audit Results</h1>
                    <p className="results-subtitle">
                        Based on {scores.totalAnswered} of {scores.totalQuestions} questions answered
                        ({scores.completionPercentage}% complete)
                    </p>
                </div>

                <div className="results-grid">
                    <div className="results-main">
                        <ScoreCard
                            score={scores.overall}
                            completedDomains={scores.domains.filter(d => d.answeredCount === d.totalCount).length}
                            totalDomains={scores.domains.length}
                        />

                        <div className="action-buttons">
                            <Button onClick={handleReviewAnswers} variant="primary">
                                📝 Review Answers
                            </Button>
                            <Button onClick={handleExport} variant="secondary">
                                💾 Export Data
                            </Button>
                            <Button onClick={handleRetakeAssessment} variant="danger">
                                🔄 Retake Assessment
                            </Button>
                        </div>
                    </div>

                    <div className="results-details">
                        <DomainBreakdown domains={scores.domains} />
                        <div style={{ marginTop: '2rem' }}>
                            <RecommendationList recommendations={recommendations} />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
