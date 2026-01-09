import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuditContext } from '../context/AuditContext';
import { generateRecommendations } from '../utils/scoring';
import { exportAuditData } from '../utils/storage';
import { generateExecutiveSummaryPDF, getTopRisks } from '../utils/pdfExport';
import Layout from '../components/common/Layout';
import Button from '../components/common/Button';
import ScoreCard from '../components/results/ScoreCard';
import DomainBreakdown from '../components/results/DomainBreakdown';
import RecommendationList from '../components/results/RecommendationList';
import ExecutiveSummary from '../components/results/ExecutiveSummary';
import './Results.css';

export default function Results() {
    const navigate = useNavigate();
    const { framework, calculateScores, responses, clearAllResponses } = useContext(AuditContext);
    const [activeTab, setActiveTab] = useState('results');
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    const scores = calculateScores();
    const recommendations = generateRecommendations(scores.domains, responses);
    const topRisks = getTopRisks(scores.domains, responses, framework, 5);

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

    const handleDownloadPDF = async () => {
        setIsGeneratingPDF(true);
        try {
            const success = await generateExecutiveSummaryPDF('executive-summary');
            if (success) {
                alert('PDF generated successfully!');
            } else {
                alert('Failed to generate PDF. Please try again.');
            }
        } catch (error) {
            console.error('PDF generation error:', error);
            alert('An error occurred while generating the PDF.');
        } finally {
            setIsGeneratingPDF(false);
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

                {/* Tab Navigation */}
                <div className="results-tabs">
                    <button
                        className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
                        onClick={() => setActiveTab('results')}
                    >
                        📊 Detailed Results
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
                        onClick={() => setActiveTab('summary')}
                    >
                        📄 Executive Summary
                    </button>
                </div>

                {/* Results Tab */}
                <div className={`results-grid ${activeTab !== 'results' ? 'hidden' : ''}`}>
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
                                💾 Export JSON
                            </Button>
                            <Button
                                onClick={handleDownloadPDF}
                                variant="secondary"
                                disabled={isGeneratingPDF}
                            >
                                {isGeneratingPDF ? '⏳ Generating PDF...' : '📥 Download PDF'}
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

                {/* Executive Summary Tab */}
                <div className={`summary-tab-content ${activeTab !== 'summary' ? 'hidden' : ''}`}>
                    <div className="summary-actions">
                        <Button
                            onClick={handleDownloadPDF}
                            variant="primary"
                            disabled={isGeneratingPDF}
                        >
                            {isGeneratingPDF ? '⏳ Generating PDF...' : '📥 Download PDF Report'}
                        </Button>
                    </div>

                    <ExecutiveSummary
                        scores={scores}
                        recommendations={recommendations}
                        framework={framework}
                        responses={responses}
                        topRisks={topRisks}
                        isPrintMode={false}
                    />
                </div>
            </div>
        </Layout>
    );
}
