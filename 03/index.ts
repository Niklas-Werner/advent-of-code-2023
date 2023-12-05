import { dayLogger, logResult, runDay, sum } from '../utils.js';

runDay(import.meta.url, {}, input => {

    const h = input.length;
    const w = input[0].length;

    const numbers = [];
    let currentNumber = null;
    let y = 0;
    for (const line of input) {
        let x = 0;
        for (const ch of line) {
            if (ch >= '0' && ch <= '9') {
                if (!currentNumber) {
                    currentNumber = { num: '', x, y };
                    numbers.push(currentNumber);
                }
                currentNumber.num += ch;
            }
            else {
                currentNumber = null;
            }
            x++;
        }
        currentNumber = null;
        y++;
    }

    dayLogger.trace({ numbers });

    const gearCandidates: Record<string, number[]> = {};

    const partNumbers = numbers.filter(({ num, x, y }) => {
        let isPart = false;
        for (let y2 = y - 1; y2 <= y + 1; y2++) {
            if (y2 >= 0 && y2 < h) {
                for (let x2 = x - 1; x2 < x + num.length + 1; x2++) {
                    if (x2 >= 0 && x2 < w) {
                        const ch = input[y2].at(x2)!;
                        if (!(ch >= '0' && ch <= '9') && ch !== '.') {
                            isPart = true;
                            if (ch === '*') {
                                const gearKey = `${x2}/${y2}`;
                                const gearCanidate = (gearCandidates[gearKey] ??= []);
                                gearCanidate.push(parseInt(num));
                            }
                        }
                    }
                }
            }
        }
        return isPart;
    });

    dayLogger.trace({ partNumbers, gearCandidates });

    const partSum = sum(partNumbers.map(({ num }) => parseInt(num)));

    logResult(partSum);

    const gearRatios = Object.values(gearCandidates)
        .filter(gearCandidate => gearCandidate.length === 2)
        .map(([num1, num2]) => num1 * num2);

    const gearRatioSum = sum(gearRatios);

    logResult(gearRatioSum);

});
