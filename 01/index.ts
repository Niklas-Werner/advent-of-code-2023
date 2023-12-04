import { dayLogger, reverseString, runDay, sum } from '../utils.js';

const translations: Record<string, number> = {
    'one': 1,
    'two': 2,
    'three': 3,
    'four': 4,
    'five': 5,
    'six': 6,
    'seven': 7,
    'eight': 8,
    'nine': 9
};

runDay(import.meta.url, {}, input => {

    const cleanedLines = input.map(line => line.replace(/\D/g, ''));
    const numbers = cleanedLines.map(line => parseInt(line.at(0)! + line.at(-1)!));
    dayLogger.debug({ cleanedLines, numbers });

    const sum1 = sum(numbers);
    dayLogger.info(`Part 1: ${sum1}`);

    const findFirstRegex = RegExp([...Object.keys(translations), '\\d'].join('|'));
    const findLastRegex = RegExp([...Object.keys(translations).map(reverseString), '\\d'].join('|'));

    let sum2 = 0;

    for (const line of input) {
        const first = findFirstRegex.exec(line)![0];
        const last = reverseString(findLastRegex.exec(reverseString(line))![0]);
        const firstDigit = String(translations[first] ?? first);
        const lastDigit = String(translations[last] ?? last);
        sum2 += parseInt(firstDigit + lastDigit);
    }

    dayLogger.info(`Part 2: ${sum2}`);
});
