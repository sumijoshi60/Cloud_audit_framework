/**
 * Calculate score for a single domain
 * @param {Object} domain - Domain from framework
 * @param {Object} responses - User responses for this domain
 * @returns {Object} { score: 85, answeredCount: 10, totalCount: 12, percentage: 85 }
 */
export function calculateDomainScore(domain, responses = {}) {
  const questions = domain.questions || [];
  const totalQuestions = questions.length;
  
  let totalPossibleScore = 0;
  let earnedScore = 0;
  let answeredCount = 0;

  questions.forEach((question) => {
    const userAnswer = responses[question.id];
    const answerOption = question.answerOptions.find(opt => opt.value === userAnswer);
    
    // Find max possible score for this question (excluding N/A)
    const maxScore = Math.max(
      ...question.answerOptions
        .filter(opt => opt.score !== null)
        .map(opt => opt.score)
    );
    
    if (userAnswer && answerOption) {
      answeredCount++;
      
      // Only count if answer is not N/A
      if (answerOption.score !== null) {
        totalPossibleScore += maxScore;
        earnedScore += answerOption.score;
      }
    }
  });

  const percentage = totalPossibleScore > 0 ? Math.round((earnedScore / totalPossibleScore) * 100) : 0;

  return {
    score: earnedScore,
    answeredCount,
    totalCount: totalQuestions,
    percentage,
    maxPossibleScore: totalPossibleScore
  };
}

/**
 * Calculate overall weighted score across all domains
 * @param {Array} domains - All domains from framework
 * @param {Object} allResponses - All user responses { domainId: { questionId: answer } }
 * @returns {Object} { overall: 78, domains: [...], totalAnswered: 20, totalQuestions: 26 }
 */
export function calculateOverallScore(domains, allResponses = {}) {
  let weightedScoreSum = 0;
  let totalAnswered = 0;
  let totalQuestions = 0;
  
  const domainScores = domains.map((domain) => {
    const domainResponses = allResponses[domain.id] || {};
    const result = calculateDomainScore(domain, domainResponses);
    
    totalAnswered += result.answeredCount;
    totalQuestions += result.totalCount;
    
    // Weight the percentage by domain weight
    const weightedScore = result.percentage * domain.weight;
    weightedScoreSum += weightedScore;
    
    return {
      ...domain,
      ...result,
      weightedContribution: weightedScore
    };
  });

  const overallScore = Math.round(weightedScoreSum);

  return {
    overall: overallScore,
    domains: domainScores,
    totalAnswered,
    totalQuestions,
    completionPercentage: Math.round((totalAnswered / totalQuestions) * 100)
  };
}

/**
 * Determine risk level based on score
 * @param {Number} score - 0-100
 * @returns {String} "Critical" | "High" | "Medium" | "Low"
 */
export function getRiskLevel(score) {
  if (score >= 80) return 'Low';
  if (score >= 60) return 'Medium';
  if (score >= 40) return 'High';
  return 'Critical';
}

/**
 * Get color for risk level
 * @param {String} riskLevel
 * @returns {String} CSS color
 */
export function getRiskColor(riskLevel) {
  const colors = {
    'Low': '#10b981',      // green
    'Medium': '#f59e0b',   // orange
    'High': '#ef4444',     // red
    'Critical': '#991b1b'   // dark red
  };
  return colors[riskLevel] || '#6b7280';
}

/**
 * Generate recommendations based on low-scoring areas
 * @param {Array} domainScores - Array of domain scores with details
 * @param {Object} allResponses - User responses to pull specific recommendations
 * @returns {Array} Prioritized recommendations
 */
export function generateRecommendations(domainScores, allResponses = {}) {
  const recommendations = [];

  domainScores.forEach((domain) => {
    const domainResponses = allResponses[domain.id] || {};
    
    domain.questions.forEach((question) => {
      const userAnswer = domainResponses[question.id];
      
      if (userAnswer && question.recommendations && question.recommendations[userAnswer]) {
        const answerOption = question.answerOptions.find(opt => opt.value === userAnswer);
        const priority = answerOption?.score === 0 ? 'High' : 
                        answerOption?.score === 50 ? 'Medium' : 'Low';
        
        // Only show recommendations for non-perfect answers
        if (answerOption?.score !== 100 && answerOption?.score !== null) {
          recommendations.push({
            domain: domain.name,
            domainId: domain.id,
            question: question.text,
            recommendation: question.recommendations[userAnswer],
            priority,
            score: answerOption?.score || 0
          });
        }
      }
    });
  });

  // Sort by priority: High > Medium > Low
  const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations;
}

/**
 * Get completion status for all domains
 * @param {Array} domains - All domains from framework
 * @param {Object} allResponses - All user responses
 * @returns {Object} { domainId: { completed: 5, total: 10, percentage: 50 } }
 */
export function getDomainProgress(domains, allResponses = {}) {
  const progress = {};

  domains.forEach((domain) => {
    const domainResponses = allResponses[domain.id] || {};
    const totalQuestions = domain.questions.length;
    const answeredQuestions = Object.keys(domainResponses).length;
    const percentage = Math.round((answeredQuestions / totalQuestions) * 100);

    progress[domain.id] = {
      completed: answeredQuestions,
      total: totalQuestions,
      percentage,
      isComplete: answeredQuestions === totalQuestions
    };
  });

  return progress;
}
