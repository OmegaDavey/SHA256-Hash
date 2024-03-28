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
    let totalLetters = 0;
    let totalNumbers = 0;

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
    return { hashes, averageLetters, averageNumbers };
};

const hashCompare = (hash) => {
    const letters = hash.match(/[a-zA-Z]/g); //Match for all letters upper & lower case
    const numbers = hash.match(/\d/g); //Match for all numbers
    return {
        letters: letters ? letters.length : 0,
        numbers: numbers ? numbers.length : 0
    };
};

const numberOfHashes = 2000;
const filename = 'hashes.txt';

generateHashes(numberOfHashes)
    .then(async ({ hashes, averageLetters, averageNumbers }) => {
        const hashInfo = [];
        for(const hash of hashes){
            const {letters, numbers} = hashCompare(hash);
            hashInfo.push(`${hash} - Letters: ${letters}, Numbers: ${numbers}`);
        }
        const summary = `Average Letters: ${averageLetters.toFixed(2)}, Average Numbers: ${averageNumbers.toFixed(2)}`;
        await writeToFile(filename, `${hashInfo.join('\n')}\n\n${summary}`);
    })
    .catch(error => console.error('Error generating hashes:', error));
