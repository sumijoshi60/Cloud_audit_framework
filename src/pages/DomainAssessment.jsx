import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuditContext } from '../context/AuditContext';
import Layout from '../components/common/Layout';
import DomainSelector from '../components/assessment/DomainSelector';
import QuestionCard from '../components/assessment/QuestionCard';
import ProgressBar from '../components/common/ProgressBar';
import Button from '../components/common/Button';
import './DomainAssessment.css';

export default function DomainAssessment() {
    const { domainId } = useParams();
    const navigate = useNavigate();
    const { framework, responses, updateResponse, getCompletionStatus } = useContext(AuditContext);

    const [currentDomainId, setCurrentDomainId] = useState(domainId || framework.domains[0]?.id);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const currentDomain = framework.domains.find(d => d.id === currentDomainId);
    const completionStatus = getCompletionStatus();

    useEffect(() => {
        if (domainId && domainId !== currentDomainId) {
            setCurrentDomainId(domainId);
            setCurrentQuestionIndex(0);
        }
    }, [domainId]);

    const handleDomainChange = (newDomainId) => {
        setCurrentDomainId(newDomainId);
        setCurrentQuestionIndex(0);
        navigate(`/assessment/${newDomainId}`);
    };

    const handleAnswerChange = (answer) => {
        updateResponse(currentDomainId, currentDomain.questions[currentQuestionIndex].id, answer);
    };

    const handleNext = () => {
        if (currentQuestionIndex < currentDomain.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Move to next domain
            const currentDomainIndex = framework.domains.findIndex(d => d.id === currentDomainId);
            if (currentDomainIndex < framework.domains.length - 1) {
                const nextDomain = framework.domains[currentDomainIndex + 1];
                handleDomainChange(nextDomain.id);
            } else {
                // All domains completed, go to results
                navigate('/results');
            }
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleViewResults = () => {
        navigate('/results');
    };

    if (!currentDomain) {
        return <Layout><div>Loading...</div></Layout>;
    }

    const currentQuestion = currentDomain.questions[currentQuestionIndex];
    const selectedAnswer = responses[currentDomainId]?.[currentQuestion.id];

    const totalQuestions = framework.domains.reduce((sum, d) => sum + d.questions.length, 0);
    const answeredQuestions = Object.values(responses).reduce(
        (sum, domainResponses) => sum + Object.keys(domainResponses).length,
        0
    );

    return (
        <Layout showBackButton backTo="/">
            <div className="assessment-container">
                <div className="assessment-header">
                    <h1 className="assessment-title">Security Assessment</h1>
                    <ProgressBar
                        current={answeredQuestions}
                        total={totalQuestions}
                        label="Overall Progress"
                    />
                </div>

                <DomainSelector
                    domains={framework.domains}
                    currentDomain={currentDomainId}
                    onDomainChange={handleDomainChange}
                    completionStatus={completionStatus}
                />

                <div className="current-domain-info">
                    <div className="domain-badge">
                        <span className="domain-icon">{currentDomain.icon}</span>
                        <span className="domain-name">{currentDomain.name}</span>
                    </div>
                    <ProgressBar
                        current={responses[currentDomainId] ? Object.keys(responses[currentDomainId]).length : 0}
                        total={currentDomain.questions.length}
                        label="Domain Progress"
                        color="#764ba2"
                    />
                </div>

                <QuestionCard
                    question={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    onAnswerChange={handleAnswerChange}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={currentDomain.questions.length}
                />

                <div className="navigation-buttons">
                    <Button
                        onClick={handlePrevious}
                        variant="secondary"
                        disabled={currentQuestionIndex === 0}
                    >
                        ← Previous
                    </Button>

                    <Button
                        onClick={handleViewResults}
                        variant="secondary"
                    >
                        📊 View Results
                    </Button>

                    <Button
                        onClick={handleNext}
                        variant="primary"
                    >
                        {currentQuestionIndex === currentDomain.questions.length - 1 &&
                            framework.domains.findIndex(d => d.id === currentDomainId) === framework.domains.length - 1
                            ? 'Finish ✓'
                            : 'Next →'}
                    </Button>
                </div>
            </div>
        </Layout>
    );
}
