import React, { createContext, useState, useEffect } from 'react';
import frameworkData from '../assets/framework.json';
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from '../utils/storage';
import { calculateOverallScore, getDomainProgress } from '../utils/scoring';

export const AuditContext = createContext();

export function AuditProvider({ children }) {
    const [framework] = useState(frameworkData);
    const [responses, setResponses] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = loadFromLocalStorage();
        if (stored && stored.responses) {
            setResponses(stored.responses);
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever responses change
    useEffect(() => {
        if (isLoaded) {
            saveToLocalStorage({ responses });
        }
    }, [responses, isLoaded]);

    /**
     * Update a single response
     * @param {String} domainId
     * @param {String} questionId
     * @param {String} answer
     */
    const updateResponse = (domainId, questionId, answer) => {
        setResponses((prev) => ({
            ...prev,
            [domainId]: {
                ...(prev[domainId] || {}),
                [questionId]: answer
            }
        }));
    };

    /**
     * Clear all responses
     */
    const clearAllResponses = () => {
        setResponses({});
        clearLocalStorage();
    };

    /**
     * Check if there's any existing audit data
     * @returns {Boolean}
     */
    const hasExistingAudit = () => {
        return Object.keys(responses).some(
            domainId => Object.keys(responses[domainId] || {}).length > 0
        );
    };

    /**
     * Get completion status
     * @returns {Object}
     */
    const getCompletionStatus = () => {
        return getDomainProgress(framework.domains, responses);
    };

    /**
     * Calculate scores
     * @returns {Object}
     */
    const calculateScores = () => {
        return calculateOverallScore(framework.domains, responses);
    };

    /**
     * Get response for a specific question
     * @param {String} domainId
     * @param {String} questionId
     * @returns {String|undefined}
     */
    const getResponse = (domainId, questionId) => {
        return responses[domainId]?.[questionId];
    };

    const value = {
        framework,
        responses,
        updateResponse,
        clearAllResponses,
        hasExistingAudit,
        getCompletionStatus,
        calculateScores,
        getResponse
    };

    return (
        <AuditContext.Provider value={value}>
            {children}
        </AuditContext.Provider>
    );
}
