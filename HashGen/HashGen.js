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

const generateHashes = async (count, data) => {
    const hashes = [];
    for (let i = 0; i < count; i++) {
        const hash = await hashValue(data);
        hashes.push(hash);
    }
    return hashes;
};

const data = JSON.stringify({ a: 'a', b: [1, 2, 3, 4], foo: { c: 'bar' } });
const numberOfHashes = 5;
const filename = 'hashes.txt';

generateHashes(numberOfHashes, data)
    .then(hashes => writeToFile(filename, hashes.join('\n')))
    .catch(error => console.error('Error generating hashes:', error));
