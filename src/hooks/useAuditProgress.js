import { useContext } from 'react';
import { AuditContext } from '../context/AuditContext';
import { getDomainProgress } from '../utils/scoring';

/**
 * Custom hook for audit progress tracking
 * @returns {Object} Progress information
 */
export function useAuditProgress() {
    const { framework, responses } = useContext(AuditContext);

    if (!framework || !framework.domains) {
        return {
            domainProgress: {},
            totalAnswered: 0,
            totalQuestions: 0,
            overallPercentage: 0,
            isComplete: false
        };
    }

    const domainProgress = getDomainProgress(framework.domains, responses);

    const totalQuestions = framework.domains.reduce((sum, domain) => sum + domain.questions.length, 0);
    const totalAnswered = Object.values(domainProgress).reduce((sum, prog) => sum + prog.completed, 0);
    const overallPercentage = Math.round((totalAnswered / totalQuestions) * 100);
    const isComplete = totalAnswered === totalQuestions;

    return {
        domainProgress,
        totalAnswered,
        totalQuestions,
        overallPercentage,
        isComplete
    };
}
