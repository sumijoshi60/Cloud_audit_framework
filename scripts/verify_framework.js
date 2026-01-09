import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frameworkPath = path.join(__dirname, '../src/assets/framework.json');

try {
    const framework = JSON.parse(fs.readFileSync(frameworkPath, 'utf8'));
    let hasErrors = false;

    console.log('Verifying Framework Data...\n');

    framework.domains.forEach(domain => {
        console.log(`Checking Domain: ${domain.name} (${domain.id})`);

        // Check weights sum
        const weightSum = domain.questions.reduce((sum, q) => sum + (q.questionWeight || 0), 0);
        // Floating point math: check if close to 1.0 (allow small epsilon)
        const isValidSum = Math.abs(weightSum - 1.0) < 0.001;

        if (!isValidSum) {
            console.error(`  ❌ Question weights sum to ${weightSum.toFixed(4)} (Expected 1.0)`);
            hasErrors = true;
        } else {
            console.log(`  ✅ Weights sum to 1.0`);
        }

        // Check individual questions
        domain.questions.forEach(q => {
            // Check criticality
            if (!['critical', 'high', 'medium', 'low'].includes((q.criticality || '').toLowerCase())) {
                console.error(`  ❌ Question ${q.id}: Invalid or missing criticality '${q.criticality}'`);
                hasErrors = true;
            }

            // Check weight existence
            if (typeof q.questionWeight !== 'number') {
                console.error(`  ❌ Question ${q.id}: Missing numeric questionWeight`);
                hasErrors = true;
            }
        });
    });

    if (hasErrors) {
        console.error('\n❌ Verification FAILED');
        process.exit(1);
    } else {
        console.log('\n✅ Verification PASSED');
    }

} catch (err) {
    console.error('Failed to read or parse framework.json', err);
    process.exit(1);
}
