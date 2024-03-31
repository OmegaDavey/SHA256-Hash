const crypto = require('crypto');
const fs = require('fs').promises;
const { Worker } = require('worker_threads');
var startTime = performance.now()
const hashValue = val => {
    return new Promise(resolve => {
        setTimeout(() => resolve(crypto.createHash('sha256').update(val).digest('hex')), 0);
    });
};

const generateUniqueData = () => {
    return JSON.stringify({
        a: Math.random().toString(36).substring(2), // Random string
        b: [Math.random(), Math.random(), Math.random(), Math.random()], // Random array
        foo: { c: Math.random().toString(36).substring(2) } // Random object
    });
};

const generateHashes = async (filename, count, numberOfThreads) => {
    let totalLetters = 0;
    let totalNumbers = 0;

    try {
        const promises = [];
        for (let i = 0; i < numberOfThreads; i++) {
            promises.push(new Promise(async (resolve, reject) => {
                const hashes = [];
                for (let j = 0; j < count / numberOfThreads; j++) {
                    try {
                        const data = generateUniqueData();
                        const hash = await hashValue(data);
                        hashes.push(hash);

                        const { letters, numbers } = hashCompare(hash);
                        totalLetters += letters;
                        totalNumbers += numbers;
                    } catch (error) {
                        reject(error);
                    }
                }
                resolve(hashes);
            }));
        }

        const results = await Promise.all(promises);

        const hashes = results.flat();

        const averageLetters = totalLetters / count;
        const averageNumbers = totalNumbers / count;

        const hashInfo = hashes.map(hash => {
            const { letters, numbers } = hashCompare(hash);
            return `${hash} - Letters: ${letters}, Numbers: ${numbers}`;
        });

        const summary = `Average Letters: ${averageLetters.toFixed(2)}, Average Numbers: ${averageNumbers.toFixed(2)}`;

        await fs.writeFile(filename, `${hashInfo.join('\n')}\n\n${summary}\n\n`);
    
        console.log(`Data has been written to ${filename}`);
        var endTime = performance.now()

    console.log(`Runtime: ${endTime - startTime} milliseconds`)
    } catch (error) {
        console.error(`Error generating hashes or writing to ${filename}:`, error);
    }
};

const hashCompare = (hash) => {
    const letters = hash.match(/[a-zA-Z]/g);
    const numbers = hash.match(/\d/g);
    return {
        letters: letters ? letters.length : 0,
        numbers: numbers ? numbers.length : 0
    };
};
const numberOfHashes = 2000;
const numberOfThreads = 4; 
const filename = 'hashes.txt';

generateHashes(filename, numberOfHashes, numberOfThreads);