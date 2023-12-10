import { UnexpectedError } from '@nw55/common';
import { writeTextFile } from '@nw55/node-utils';
import { dayLogger, logResult, runDay } from '../utils.js';

runDay(import.meta.url, {}, async input => {

    const start = 'S';

    const stepMap = {
        'n': [0, -1],
        'e': [1, 0],
        's': [0, 1],
        'w': [-1, 0]
    };

    type Direction = keyof typeof stepMap;

    const directionMap: Record<Direction, Direction> = {
        'n': 's',
        's': 'n',
        'e': 'w',
        'w': 'e'
    };

    const pipeMap: Record<string, Partial<Record<Direction, Direction>>> = {
        '|': { 'n': 's', 's': 'n' },
        '-': { 'e': 'w', 'w': 'e' },
        'L': { 'n': 'e', 'e': 'n' },
        'J': { 'n': 'w', 'w': 'n' },
        '7': { 's': 'w', 'w': 's' },
        'F': { 's': 'e', 'e': 's' }
    };

    const h = input.length;
    const w = input[0].length;

    const startY = input.findIndex(line => line.includes(start));
    const startX = input[startY].indexOf(start);

    const tiles = input.map(line => line.split(''));
    const tiles2 = Array.from({ length: h }, () => Array.from({ length: w }, () => '.'));

    function markTile(x: number, y: number, tile: string) {
        tiles2[y][x] = tile;
    }

    function init() {
        let x;
        let y;
        let tile;
        let inDir;

        let result;

        let allDirections: string[] = [];

        for (const direction of Object.keys(directionMap) as Direction[]) {
            const [dx, dy] = stepMap[direction];
            x = startX + dx;
            y = startY + dy;
            if (x < 0 || x >= w || y < 0 || y >= h)
                continue;
            tile = tiles[y][x];
            if (tile === '.')
                continue;
            inDir = directionMap[direction];
            if (pipeMap[tile][inDir]) {
                allDirections.push(direction);
                result = { x, y, tile, inDir };
            }
        }

        if (!result)
            throw new UnexpectedError();

        const startShape = Object.entries(pipeMap)
            .find(([pipe, directions]) =>
                Object.keys(directions).
                    every(direction => allDirections.includes(direction))
            )![0];

        markTile(startX, startY, startShape);

        return result;
    }

    let { x, y, tile, inDir } = init();

    dayLogger.verbose({ x, y, tile, inDir });

    let steps = 1;

    while (x !== startX || y !== startY) {
        markTile(x, y, tile);
        const outDir = pipeMap[tile][inDir]!;
        const [dx, dy] = stepMap[outDir];
        x += dx;
        y += dy;
        tile = tiles[y][x];
        inDir = directionMap[outDir];
        steps++;
    }

    logResult(steps / 2);

    let count = 0;
    for (const row of tiles2) {
        let inside = false;
        let lastCorner = '.';
        for (let x = 0; x < w; x++) {
            const tile = row[x];
            if (tile === '|') {
                inside = !inside;
            }
            else if (tile === 'F' || tile === 'L') {
                lastCorner = tile;
            }
            else if (tile === '7') {
                if (lastCorner === 'L')
                    inside = !inside;
            }
            else if (tile === 'J') {
                if (lastCorner === 'F')
                    inside = !inside;
            }
            else if (tile !== '-') {
                if (inside)
                    count++;
                row[x] = inside ? 'I' : 'O';
            }
        }
    }

    if (dayLogger.shouldLog('trace')) {
        const output = tiles2.map(row => row.join('')).join('\n');
        await writeTextFile('log', output);
    }

    logResult(count);

});
