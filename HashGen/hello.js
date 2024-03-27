import { createHash } from 'crypto';

const hashValue = val =>
    new Promise(resolve =>
        setTimeout(
            () => resolve(createHash('sha256').update(val).digest('hex')),
            0
        )
    );

hashValue(JSON.stringify({ a: 'a', b: [1, 2, 3, 4], foo: { c: 'bar' } })).then(
    console.log
);