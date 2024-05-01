
const HashTest = require('HashGen/HashGen');
const { generateHashes } = require('../HashGen');
const fs = require('fs').promises;

describe('HashGen', () => {
    test('Generate 2000 hash values w/ 4 threads', async () => {
        const filename = 'hashes.txt';
        const count = 2000;
        const numberOfThreads = 4;
        await generateHashes(filename, count, numberOfThreads);
        const fileContents = await fs.readFile(filename, 'utf8');
        const hashes = fileContents.split('\n');
        let hashes_count = 0;
        for (const hash of hashes) {
            if (hash === '') { break; }
            hashes_count++;
        }
        expect(hashes_count).toBe(count);
    });

    test('Generate 1000 hash values w/ 4 threads', async () => {
        const filename = 'hashes.txt';
        const count = 1000;
        const numberOfThreads = 4;
        await generateHashes(filename, count, numberOfThreads);
        const fileContents = await fs.readFile(filename, 'utf8');
        const hashes = fileContents.split('\n');
        let hashes_count = 0;
        for (const hash of hashes) {
            if (hash === '') { break; }
            hashes_count++;
        }
        expect(hashes_count).toBe(count);
    });
    
    test('Generate 1026 hash values w/ 3 threads', async () => {
        const filename = 'hashes.txt';
        const count = 1026;
        const numberOfThreads = 3;
        await generateHashes(filename, count, numberOfThreads);
        const fileContents = await fs.readFile(filename, 'utf8');
        const hashes = fileContents.split('\n');
        let hashes_count = 0;
        for (const hash of hashes) {
            if (hash === '') { break; }
            hashes_count++;
        }
        expect(hashes_count).toBe(count);
    });

    test('Generate 1 hash value w/ 1 thread', async () => {
        const filename = 'hashes.txt';
        const count = 1;
        const numberOfThreads = 1;
        await generateHashes(filename, count, numberOfThreads);
        const fileContents = await fs.readFile(filename, 'utf8');
        const hashes = fileContents.split('\n');
        let hashes_count = 0;
        for (const hash of hashes) {
            if (hash === '') { break; }
            hashes_count++;
        }
        expect(hashes_count).toBe(count);
    });
});

