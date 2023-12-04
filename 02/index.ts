import { count } from 'console';
import { dayLogger, runDay, splitOnce, sum } from '../utils.js';
import { subscribe } from 'diagnostics_channel';

type Game = {
    id: number;
    subsets: Subset[];
};
type Color = 'red' | 'green' | 'blue';
type Subset = Record<Color, number | undefined>;

runDay(import.meta.url, {}, input => {

    const games: Game[] = input.map(line => {
        const [label, description] = splitOnce(': ')(line);
        const id = parseInt(label.slice(5));
        const subsets = description.split('; ').map(subsetStr => {
            const countsAndColors = subsetStr.split(', ').map(splitOnce(' '));
            return Object.fromEntries(countsAndColors.map(([count, color]) => [color, parseInt(count)])) as Subset;
        });
        return { id, subsets };
    });

    // games.forEach(game => dayLogger.debug(game));

    // only 12 red cubes, 13 green cubes, and 14 blue cubes
    const possibleGames = games.filter(game =>
        game.subsets.every(subset =>
            (subset.red ?? 0) <= 12
            && (subset.green ?? 0) <= 13
            && (subset.blue ?? 0) <= 14
        ));

    const idSum = sum(possibleGames.map(game => game.id));
    dayLogger.info(`Part 1: ${idSum}`);

    const powers = games.map(({ subsets }) => {
        const red = Math.max(...subsets.map(subset => subset.red ?? 0));
        const green = Math.max(...subsets.map(subset => subset.green ?? 0));
        const blue = Math.max(...subsets.map(subset => subset.blue ?? 0));
        return red * green * blue;
    });
    const powerSum = sum(powers);
    dayLogger.info(`Part 2: ${powerSum}`);

});
