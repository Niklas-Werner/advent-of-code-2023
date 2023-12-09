import { dayLogger, logResult, parseDecimalInt, runDay } from '../utils.js';

runDay(import.meta.url, {}, input => {

    const sequences = input.map(line => line.split(' ').map(parseDecimalInt));

    const getDifferenceSequence = (s: number[]) => s.slice(1).map((v, i) => v - s[i]);
    const isAllZeros = (s: number[]) => s.every(v => v === 0);

    let sum = 0;
    let sum2 = 0;

    for (const sequence of sequences) {
        const diffSequences = [];
        let current = sequence;
        while (!isAllZeros(current)) {
            diffSequences.push(current);
            current = getDifferenceSequence(current);
        }
        diffSequences.reverse();
        let next = 0;
        let next2 = 0;
        for (const diffSequence of diffSequences) {
            next = diffSequence.at(-1)! + next;
            next2 = diffSequence.at(0)! - next2;
        }
        sum += next;
        sum2 += next2;
        dayLogger.debug({ next, next2 });
    }

    logResult(sum);
    logResult(sum2);

});
