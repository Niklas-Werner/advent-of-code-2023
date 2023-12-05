import { dayLogger, logResult, parseDecimalInt, runDay, sum } from '../utils.js';

runDay(import.meta.url, {}, input => {

    const cards = input.map(line => {
        const segments = line.split(/[:|]/g).map(str => str.trim());
        const winning = segments[1].split(/\s+/g).map(parseDecimalInt);
        const have = segments[2].split(/\s+/g).map(parseDecimalInt);
        return { winning, have };
    });

    cards.forEach(card => dayLogger.trace(card));

    const matchedNumbersCount = cards.map(card => card.have.filter(num => card.winning.includes(num)).length);
    const points = matchedNumbersCount.map(count => count === 0 ? 0 : 2 ** (count - 1));
    dayLogger.trace({ matchedNumbersCount, points });

    const pointsSum = sum(points);
    logResult(pointsSum);

    const cardCounts = Array.from({ length: cards.length }, () => 1);

    for (let i = 0; i < cards.length; i++) {
        const cardCount = cardCounts[i];
        const matchedNumbers = matchedNumbersCount[i];
        for (let j = i + 1; j <= i + matchedNumbers && j < cards.length; j++)
            cardCounts[j] += cardCount;
    }

    dayLogger.trace({ cardCounts });

    const countsSum = sum(cardCounts);
    logResult(countsSum);

});
