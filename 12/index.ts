import { dayLogger, logResult, parseDecimalInt, runDay } from '../utils.js';

runDay(import.meta.url, {}, async input => {

    function isValidArrangementUntilFirstUnknown(springs: string[], groupSizes: number[]) {
        let nextGroup = 0;
        let remainingInGroup = 0;
        let expectSeparator = false;
        for (const spring of springs) {
            if (spring === '#') {
                if (remainingInGroup > 0) {
                    // found # in group as expected
                    remainingInGroup--;
                }
                else if (expectSeparator) {
                    // need . between #s
                    return false;
                }
                else if (nextGroup >= groupSizes.length) {
                    // no group left
                    return false;
                }
                else {
                    // start next group
                    remainingInGroup = groupSizes[nextGroup] - 1;
                }
                if (remainingInGroup === 0) {
                    // group complete
                    expectSeparator = true;
                    nextGroup++;
                }
            }
            else if (spring === '.') {
                if (remainingInGroup > 0) {
                    // found . but expected #
                    return false;
                }
                // found a valid separator
                expectSeparator = false;
            }
            else {
                // reached first unknown
                return true;
            }
        }
        // reached end
        return nextGroup === groupSizes.length && remainingInGroup === 0;
    }

    function countValidArrangements(springs: string[], springsPos: number, groupSizes: number[]): number {
        if (!isValidArrangementUntilFirstUnknown(springs, groupSizes))
            return 0;

        if (springsPos >= springs.length)
            return 1;

        if (springs[springsPos] !== '?')
            return countValidArrangements(springs, springsPos + 1, groupSizes);

        let result = 0;

        springs[springsPos] = '#';
        result += countValidArrangements(springs, springsPos + 1, groupSizes);

        springs[springsPos] = '.';
        result += countValidArrangements(springs, springsPos + 1, groupSizes);

        springs[springsPos] = '?';
        return result;
    }

    function runPart(input: string[]) {
        let sum = 0;

        for (const line of input) {
            const [springsStr, groupSizesStr] = line.split(' ');
            const springs = springsStr.split('');
            const groupSizes = groupSizesStr.split(',').map(parseDecimalInt);
            const count = countValidArrangements(springs, 0, groupSizes);
            sum += count;
            dayLogger.debug({ springs: springsStr, groupSizes: groupSizesStr, count });
        }

        logResult(sum);
    }

    runPart(input);

    const input2 = input.map(line => line.replace(/(\S+) (\S+)/, '$1?$1?$1?$1?$1 $2,$2,$2,$2,$2'));

    runPart(input2);

});
