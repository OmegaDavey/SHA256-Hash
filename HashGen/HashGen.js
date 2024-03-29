const crypto = require('crypto');
const fs = require('fs').promises;

const hashValue = val =>
    new Promise(resolve =>
        setTimeout(
            () => resolve(crypto.createHash('sha256').update(val).digest('hex')),
            0
        )
    );

const generateUniqueData = () => {
    return JSON.stringify({
        a: Math.random().toString(36).substring(2), // Random string
        b: [Math.random(), Math.random(), Math.random(), Math.random()], // Random array
        foo: { c: Math.random().toString(36).substring(2) } // Random object
    });
};

const hashCompare = (hash) => {
    const letters = hash.match(/[a-zA-Z]/g); //Match for all letters upper & lower case
    const numbers = hash.match(/\d/g); //Match for all numbers
    return {
        letters: letters ? letters.length : 0,
        numbers: numbers ? numbers.length : 0
    };
};

const generateHashes = async (filename, count) => {
    let totalLetters = 0;
    let totalNumbers = 0;

    try {
        const hashes = [];
        for (let i = 0; i < count; i++) {
            const data = generateUniqueData();
            const hash = await hashValue(data);
            hashes.push(hash);

            const { letters, numbers } = hashCompare(hash);
            totalLetters += letters;
            totalNumbers += numbers;
        }

        const averageLetters = totalLetters / count;
        const averageNumbers = totalNumbers / count;

        const hashInfo = hashes.map(hash => {
            const { letters, numbers } = hashCompare(hash);
            return `${hash} - Letters: ${letters}, Numbers: ${numbers}`;
        });

        const summary = `Average Letters: ${averageLetters.toFixed(2)}, Average Numbers: ${averageNumbers.toFixed(2)}`;

        await fs.writeFile(filename, `${hashInfo.join('\n')}\n\n${summary}\n\n`);

        // Check for duplicates
        const uniqueHashes = new Set(hashes);
        if (uniqueHashes.size !== hashes.length) {
            const duplicates = {};
            hashes.forEach(hash => {
                if (duplicates[hash]) {
                    duplicates[hash]++;
                } else {
                    duplicates[hash] = 1;
                }
            });
            let result = 'Duplicate hashes found:\n';
            Object.entries(duplicates).forEach(([hash, count]) => {
                if (count > 1) {
                    result += `${hash} - Count: ${count}\n`;
                }
            });
            await fs.appendFile(filename, result);
        } else {
            await fs.appendFile(filename, 'No duplicate hashes found.\n');
        }

        console.log(`Data has been written to ${filename}`);
    } catch (error) {
        console.error(`Error generating hashes or writing to ${filename}:`, error);
    }
};

const numberOfHashes = 2000;
const filename = 'hashes.txt';

generateHashes(filename, numberOfHashes);
