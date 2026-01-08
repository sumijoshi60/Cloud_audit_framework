import React from 'react';
import './QuestionCard.css';

export default function QuestionCard({ question, selectedAnswer, onAnswerChange, questionNumber, totalQuestions }) {
    return (
        <div className="question-card">
            <div className="question-header">
                <span className="question-number">Question {questionNumber} of {totalQuestions}</span>
                {question.category && (
                    <span className="question-category">{question.category}</span>
                )}
            </div>

            <h3 className="question-text">{question.text}</h3>

            <div className="answer-options">
                {question.answerOptions.map((option) => (
                    <button
                        key={option.value}
                        className={`answer-option ${selectedAnswer === option.value ? 'selected' : ''}`}
                        onClick={() => onAnswerChange(option.value)}
                    >
                        <span className="option-label">{option.label}</span>
                        {option.score !== null && (
                            <span className="option-score">{option.score} pts</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
