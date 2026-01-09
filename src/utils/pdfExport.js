import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate PDF from HTML element
 * @param {string} elementId - ID of the HTML element to convert
 * @param {string} filename - Output filename
 * @returns {Promise<boolean>} Success status
 */
export async function generateExecutiveSummaryPDF(elementId, filename = null) {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error(`Element with ID "${elementId}" not found`);
        }

        // Set default filename
        const date = new Date().toISOString().split('T')[0];
        const pdfFilename = filename || `cloud-security-audit-summary-${date}.pdf`;

        // Configure html2canvas options
        const canvas = await html2canvas(element, {
            scale: 2, // Higher quality
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');

        // A4 dimensions in mm
        const pdfWidth = 210;
        const pdfHeight = 297;

        // Calculate image dimensions to fit A4
        const imgWidth = pdfWidth - 20; // 10mm margins on each side
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Create PDF
        const pdf = new jsPDF('p', 'mm', 'a4');

        let heightLeft = imgHeight;
        let position = 10; // Top margin

        // Add first page
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight - 20; // Account for margins

        // Add additional pages if content is long
        while (heightLeft > 0) {
            position = heightLeft - imgHeight + 10;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight - 20;
        }

        // Add page numbers
        const pageCount = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setFontSize(10);
            pdf.setTextColor(150);
            pdf.text(
                `Page ${i} of ${pageCount}`,
                pdfWidth / 2,
                pdfHeight - 10,
                { align: 'center' }
            );
        }

        // Save PDF
        pdf.save(pdfFilename);

        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        return false;
    }
}

/**
 * Get top N security risks from recommendations
 * @param {Array} domainScores - Domain scores with details
 * @param {Object} allResponses - User responses
 * @param {Object} framework - Framework data
 * @param {number} limit - Number of top risks to return
 * @returns {Array} Top risks
 */
export function getTopRisks(domainScores, allResponses, framework, limit = 5) {
    const risks = [];

    // Create a map for quick question lookup to access criticality
    const questionMap = {};
    framework.domains.forEach(d => {
        d.questions.forEach(q => {
            questionMap[q.id] = q;
        });
    });

    domainScores.forEach((domain) => {
        const domainData = framework.domains.find(d => d.id === domain.id);
        if (!domainData) return;

        const domainResponses = allResponses[domain.id] || {};

        domainData.questions.forEach((question) => {
            const userAnswer = domainResponses[question.id];
            const answerOption = question.answerOptions.find(opt => opt.value === userAnswer);

            // Only include issues (not perfect scores or N/A)
            if (answerOption && answerOption.score !== null && answerOption.score < 100) {
                const priority = answerOption.score === 0 ? 'High' : 'Medium';
                const recommendation = question.recommendations?.[userAnswer] || 'No specific recommendation available';

                risks.push({
                    domain: domain.name,
                    domainId: domain.id,
                    domainWeight: domain.weight,
                    question: question.text,
                    answer: answerOption.label,
                    score: answerOption.score,
                    priority,
                    recommendation,
                    riskImpact: getRiskImpact(question, answerOption.score),
                    questionId: question.id,
                    criticality: question.criticality || 'medium'
                });
            }
        });
    });

    // Sort by: criticality > priority > domain weight > score
    risks.sort((a, b) => {
        const critOrder = { 'critical': 0, 'high': 1, 'medium': 2 };
        const prioOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };

        // 1. Criticality first (if available, otherwise default to medium)
        const aCrit = questionMap[a.questionId]?.criticality || 'medium';
        const bCrit = questionMap[b.questionId]?.criticality || 'medium';

        if (critOrder[aCrit] !== critOrder[bCrit]) {
            return (critOrder[aCrit] || 2) - (critOrder[bCrit] || 2);
        }

        // 2. Then priority rating from score
        if (prioOrder[a.priority] !== prioOrder[b.priority]) {
            return prioOrder[a.priority] - prioOrder[b.priority];
        }

        // 3. Then domain weight
        if (a.domainWeight !== b.domainWeight) {
            return b.domainWeight - a.domainWeight;
        }

        // 4. Finally score (lower score = higher risk)
        return a.score - b.score;
    });

    return risks.slice(0, limit);
}

/**
 * Generate risk impact statement based on question and score
 * @param {Object} question - Question object
 * @param {number} score - Answer score
 * @returns {string} Risk impact statement
 */
function getRiskImpact(question, score) {
    const category = question.category?.toLowerCase() || 'security';

    if (score === 0) {
        return `Missing ${category} controls increase vulnerability to common attack vectors and may lead to security breaches or compliance violations.`;
    } else if (score === 50) {
        return `Partial ${category} implementation leaves gaps that attackers could exploit. Completion is necessary to achieve adequate protection.`;
    }

    return `Adequate ${category} controls are in place.`;
}
