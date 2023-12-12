import { cached, dayLogger, logResult, parseDecimalInt, runDay } from '../utils.js';

runDay(import.meta.url, {}, async input => {

    type ValidationState = {
        nextGroup: number;
        remainingInGroup: number;
        expectSeparator: boolean;
    };

    function initValidation(): ValidationState {
        return {
            nextGroup: 0,
            remainingInGroup: 0,
            expectSeparator: false
        };
    }

    function validationStep(state: ValidationState, spring: string | null, groupSizes: number[]): ValidationState | false {
        let { nextGroup, remainingInGroup, expectSeparator } = state;
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
            // reached end or unknown
            if (!endValidation(state, groupSizes))
                return false;
        }
        return { remainingInGroup, expectSeparator, nextGroup };
    }

    function endValidation(state: ValidationState | false, groupSizes: number[]) {
        if (state === false)
            return false;
        return state.nextGroup === groupSizes.length && state.remainingInGroup === 0;
    }

    function getCacheKey(springsPos: number, validationState: ValidationState | false) {
        if (validationState === false)
            return String(springsPos);
        else
            return springsPos + ',' + validationState.nextGroup + ',' + validationState.remainingInGroup + ',' + validationState.expectSeparator;
    }

    function runPart(input: string[]) {
        let sum = 0;

        for (const line of input) {
            const [springsStr, groupSizesStr] = line.split(' ');
            const springs = springsStr.split('');
            const groupSizes = groupSizesStr.split(',').map(parseDecimalInt);

            function countValidArrangements(springsPos: number, validationState: ValidationState | false): number {
                if (!validationState)
                    return 0;

                if (springsPos >= springs.length && endValidation(validationState, groupSizes))
                    return 1;

                if (springs[springsPos] !== '?')
                    return cachedCount(springsPos + 1, validationStep(validationState, springs[springsPos], groupSizes));

                let result = 0;

                springs[springsPos] = '#';
                result += cachedCount(springsPos + 1, validationStep(validationState, '#', groupSizes));

                springs[springsPos] = '.';
                result += cachedCount(springsPos + 1, validationStep(validationState, '.', groupSizes));

                springs[springsPos] = '?';
                return result;
            }

            const cachedCount = cached(countValidArrangements, getCacheKey);

            const count = cachedCount(0, initValidation());
            sum += count;
            dayLogger.debug({ springs: springsStr, groupSizes: groupSizesStr, count });
        }

        logResult(sum);
    }

    runPart(input);

    const input2 = input.map(line => line.replace(/(\S+) (\S+)/, '$1?$1?$1?$1?$1 $2,$2,$2,$2,$2'));

    runPart(input2);

});
