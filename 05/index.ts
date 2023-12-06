import { compare, dayLogger, logResult, parseDecimalInt, runDay } from '../utils.js';

runDay(import.meta.url, { blankLines: 'group' }, input => {

    const seeds = input[0][0].split(':')[1].trim().split(' ').map(parseDecimalInt);
    dayLogger.trace({ seeds });

    const maps = input.slice(1).map(block =>
        block.slice(1).map(line => {
            const [dest, source, length] = line.split(' ').map(parseDecimalInt);
            dayLogger.trace(block[0], { dest, source, length });
            return { dest, source, length };
        })
    );

    let numbers = seeds;

    for (const map of maps) {
        numbers = numbers.map(num => {
            const mapping = map.find(mapping => mapping.source <= num && num < mapping.source + mapping.length);
            if (mapping)
                return num - mapping.source + mapping.dest;
            return num;
        });
        dayLogger.trace({ numbers });
    }

    const minLocation = Math.min(...numbers);
    logResult(minLocation);

    let ranges = Array.from({ length: seeds.length / 2 }, (_, i) => seeds.slice(2 * i, 2 * i + 2));
    dayLogger.trace({ ranges });

    for (const map of maps) {
        ranges = ranges.flatMap(([rangeStart, rangeLength]) => {
            const mappings = map.filter(mapping => mapping.source < rangeStart + rangeLength && rangeStart < mapping.source + mapping.length);
            if (mappings.length === 0)
                return [[rangeStart, rangeLength]];
            const splits = mappings.flatMap(mapping => [mapping.source, mapping.source + mapping.length])
                .filter(split => split > rangeStart && split < rangeStart + rangeLength);
            const subrangeSplits = [... new Set([...splits, rangeStart, rangeStart + rangeLength])].sort(compare);
            const subranges = [];
            for (let i = 0; i < subrangeSplits.length - 1; i++)
                subranges.push([subrangeSplits[i], subrangeSplits[i + 1] - subrangeSplits[i]]);
            return subranges.map(([subrangeStart, subrangeLength]) => {
                const mapping = map.find(mapping => mapping.source <= subrangeStart && subrangeStart + subrangeLength <= mapping.source + mapping.length);
                if (mapping)
                    return [subrangeStart - mapping.source + mapping.dest, subrangeLength];
                return [subrangeStart, subrangeLength];
            });
        });
        dayLogger.trace({ ranges });
    }

    const minLocation2 = Math.min(...ranges.map(([start]) => start));
    logResult(minLocation2);

});
