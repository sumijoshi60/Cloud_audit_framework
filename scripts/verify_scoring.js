import { calculateDomainScore, getRiskLevel } from '../src/utils/scoring.js';
import { getTopRisks } from '../src/utils/pdfExport.js'; // Note: importing from pdfExport as logic was moved there? 
// Wait, getTopRisks is in pdfExport.js, but I need to make sure I can import it. 
// Also need to Mock framework data for tests.

const mockDomain = {
    id: 'test-domain',
    weight: 1.0,
    questions: [
        { id: 'q1', questionWeight: 0.5, criticality: 'high', answerOptions: [{ value: 'yes', score: 100 }, { value: 'no', score: 0 }, { value: 'na', score: null }] },
        { id: 'q2', questionWeight: 0.3, criticality: 'medium', answerOptions: [{ value: 'yes', score: 100 }, { value: 'no', score: 0 }, { value: 'na', score: null }] },
        { id: 'q3', questionWeight: 0.2, criticality: 'low', answerOptions: [{ value: 'yes', score: 100 }, { value: 'no', score: 0 }, { value: 'na', score: null }] }
    ]
};

const mockFramework = {
    domains: [mockDomain]
};

let hasErrors = false;

function assert(condition, message) {
    if (!condition) {
        console.error(`❌ FAIL: ${message}`);
        hasErrors = true;
    } else {
        console.log(`✅ PASS: ${message}`);
    }
}

console.log('Verifying Scoring Logic...\n');

// Test 1: Perfect Score
const res1 = calculateDomainScore(mockDomain, { q1: 'yes', q2: 'yes', q3: 'yes' });
assert(res1.score === 100 * 0.5 + 100 * 0.3 + 100 * 0.2, 'Perfect score calculation'); // Should be 100

// Test 2: Weighted Score
const res2 = calculateDomainScore(mockDomain, { q1: 'no', q2: 'yes', q3: 'yes' });
// 0 * 0.5 + 100 * 0.3 + 100 * 0.2 = 50
assert(Math.abs(res2.score - 50) < 0.1, `Weighted score (actual: ${res2.score}, expected: 50)`);

// Test 3: N/A Handling (Renormalization)
// If q1 (weight 0.5) is N/A, remaining weights are 0.3 and 0.2 (Sum 0.5).
// Normalized weights: q2 = 0.3/0.5 = 0.6, q3 = 0.2/0.5 = 0.4
// If q2=yes (100), q3=yes (100) -> Score should be 100
const res3 = calculateDomainScore(mockDomain, { q1: 'na', q2: 'yes', q3: 'yes' });
assert(res3.percentage === 100, `N/A Renormalization - All others Yes (score: ${res3.percentage})`);

// If q1=NA, q2=No (0), q3=Yes (100) -> Score = 0*0.6 + 100*0.4 = 40
const res4 = calculateDomainScore(mockDomain, { q1: 'na', q2: 'no', q3: 'yes' });
assert(Math.abs(res4.percentage - 40) < 1, `N/A Renormalization - Mixed (score: ${res4.percentage}, expected: 40)`);


console.log('\nVerifying Risk Prioritization...\n');
// We need to implement a mini getTopRisks check or just trust the logic if we verified it manually. 
// But let's try to test the sorting if we can run it.
// Note: getTopRisks depends on framework structure. 

const risks = getTopRisks([mockDomain], { 'test-domain': { q1: 'no', q2: 'no', q3: 'no' } }, mockFramework, 3);
// q1: Criticality High, Priority High (Score 0)
// q2: Criticality Medium, Priority High (Score 0)
// q3: Criticality Low, Priority High (Score 0)

// Expect order: q1, q2, q3 based on criticality
if (risks.length >= 2) {
    assert(risks[0].questionId === 'q1', 'Highest criticality first');
    assert(risks[1].questionId === 'q2', 'Medium criticality second');
} else {
    console.error('❌ FAIL: Not enough risks returned');
    hasErrors = true;
}

if (hasErrors) {
    console.error('\n❌ Logic Verification FAILED');
    process.exit(1);
} else {
    console.log('\n✅ Logic Verification PASSED');
}
