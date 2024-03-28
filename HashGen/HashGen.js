const crypto = require('crypto');
const fs = require('fs').promises;

const hashValue = val =>
    new Promise(resolve =>
        setTimeout(
            () => resolve(crypto.createHash('sha256').update(val).digest('hex')),
            0
        )
    );

const writeToFile = async (filename, data) => {
    try {
        await fs.writeFile(filename, data);
        console.log(`Hashes have been written to ${filename}`);
    } catch (error) {
        console.error(`Error writing to ${filename}:`, error);
    }
};

const generateUniqueData = () => {
    return JSON.stringify({
        a: Math.random().toString(36).substring(2), // Random string
        b: [Math.random(), Math.random(), Math.random(), Math.random()], // Random array
        foo: { c: Math.random().toString(36).substring(2) } // Random object
    });
};

const generateHashes = async (count) => {
    const hashes = [];
    for (let i = 0; i < count; i++) {
        const data = generateUniqueData();
        const hash = await hashValue(data);
        hashes.push(hash);
    }
    return hashes;
};

const numberOfHashes = 20;
const filename = 'hashes.txt';

generateHashes(numberOfHashes)
    .then(hashes => writeToFile(filename, hashes.join('\n')))
    .catch(error => console.error('Error generating hashes:', error));
