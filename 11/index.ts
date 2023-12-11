import { dayLogger, logResult, runDay } from '../utils.js';

runDay(import.meta.url, {}, async input => {

    const h = input.length;
    const w = input[0].length;

    const galaxies: [number, number][] = [];
    const emptyRows: number[] = [];
    const emptyColumns: number[] = [];

    for (let y = 0; y < h; y++) {
        const empty = !input[y].includes('#');
        if (empty)
            emptyRows.push(y);
        for (let x = 0; x < w; x++) {
            if (input[y].at(x) === '#')
                galaxies.push([x, y]);
        }
    }

    for (let x = 0; x < w; x++) {
        const empty = input.every(row => row.at(x) !== '#');
        if (empty)
            emptyColumns.push(x);
    }

    dayLogger.debug({ w, h, emptyRows, emptyColumns, galaxies });

    function isBetween(a: number, b: number) {
        const low = Math.min(a, b);
        const high = Math.max(a, b);
        return (v: number) => v >= low && v <= high;
    }

    function runPart(expansion: number) {
        let result = 0;

        for (let i = 0; i < galaxies.length; i++) {
            const [x1, y1] = galaxies[i];
            for (let j = i + 1; j < galaxies.length; j++) {
                const [x2, y2] = galaxies[j];
                const xSteps = Math.abs(x2 - x1) + emptyColumns.filter(isBetween(x1, x2)).length * expansion;
                const ySteps = Math.abs(y2 - y1) + emptyRows.filter(isBetween(y1, y2)).length * expansion;
                result += xSteps + ySteps;
                dayLogger.trace({
                    from: `${i + 1} (${x1}/${y1})`,
                    to: `${j + 1} (${x2}/${y2})`,
                    xSteps,
                    ySteps,
                    steps: xSteps + ySteps
                });
            }
        }

        logResult(result);
    }

    runPart(1);
    runPart(1000000 - 1);

});
