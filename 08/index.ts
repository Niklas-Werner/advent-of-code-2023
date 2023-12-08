import { dayLogger, logResult, runDay } from '../utils.js';

runDay(import.meta.url, { blankLines: 'group' }, (input, { test }) => {

    const [[instructionsLine], networkLines] = input;

    const instructions = instructionsLine.split('').map(ch => ch === 'R');

    const network = new Map(networkLines.map(line => {
        const [from, left, right] = line.split(/\W+/g);
        return [from, [left, right]];
    }));

    dayLogger.trace({ instructions, network });

    if (!test || test < 3) {
        let count = 0;
        let i = 0;
        let current = 'AAA';

        while (true) {
            const instruction = instructions[i % instructions.length];
            current = network.get(current)![instruction ? 1 : 0];
            count++;
            if (current === 'ZZZ')
                break;
            i++;
        }

        logResult(count);
    }

    if (!test || test >= 3) {

        const aNodes = [...network.keys()].filter(node => node.endsWith('A'));
        const zNodes = [...network.values()].flat().filter(node => node.endsWith('Z'));

        function stepsToAllZs(startNode: string, startI: number) {
            const remainingZs = new Set(zNodes);
            const result: Record<string, number> = {};

            let count = 0;
            let i = startI;
            let current = startNode;

            while (true) {
                const instruction = instructions[i % instructions.length];
                current = network.get(current)![instruction ? 1 : 0];
                count++;
                if (current.endsWith('Z')) {
                    if (remainingZs.delete(current)) {
                        result[current] = count;
                        if (remainingZs.size === 0)
                            break;
                    }
                    else {
                        break;
                    }
                }
                i++;
            }

            dayLogger.verbose({ startNode, startI, result });
            return result;
        }

        for (const a of aNodes)
            stepsToAllZs(a, 0);

        // using some online calculator for least common multiple
        // LCM(19241, 18157, 19783, 16531, 21409, 14363) = 24035773251517
    }

});
