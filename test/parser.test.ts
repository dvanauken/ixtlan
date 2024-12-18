// test/parser.test.ts
import { DiagramParser } from './parser';
import { DiagramData } from './types';

// Simple test runner
function runTests() {
    let passCount = 0;
    let failCount = 0;
    
    function assert(condition: boolean, message: string) {
        if (condition) {
            console.log(`✓ ${message}`);
            passCount++;
        } else {
            console.log(`✗ ${message}`);
            failCount++;
        }
    }

    function assertEqual(actual: any, expected: any, message: string) {
        const pass = JSON.stringify(actual) === JSON.stringify(expected);
        assert(pass, message);
        if (!pass) {
            console.log('  Expected:', expected);
            console.log('  Got:', actual);
        }
    }

    const parser = new DiagramParser();

    // Test 1: Basic actor parsing
    {
        const input = `
            actor User
            actor Customer
        `;
        const result = parser.parse(input);
        assertEqual(
            result.participants,
            [
                { type: 'actor', name: 'User' },
                { type: 'actor', name: 'Customer' }
            ],
            'Should parse multiple actors'
        );
    }

    // [Rest of test cases remain the same]

    // Print summary
    console.log('\nTest Summary:');
    console.log(`Passed: ${passCount}`);
    console.log(`Failed: ${failCount}`);
    
    // Exit with appropriate code
    process.exit(failCount > 0 ? 1 : 0);
}

// Run the tests
runTests();