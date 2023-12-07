import { compare, dayLogger, logResult, runDay } from '../utils.js';

runDay(import.meta.url, {}, input => {

    function runPart(part2: boolean) {
        const cardValues = part2 ? 'AKQT98765432J' : 'AKQJT98765432';
        const sortableValuesMap = Object.fromEntries(cardValues.split('').map((value, i) => [value, String.fromCharCode('a'.charCodeAt(0) + (cardValues.length - i - 1))]));

        dayLogger.debug({ cardValues, sortableValuesMap });

        function analyzeHand1(hand: string) {
            const counts: Record<string, number> = {};
            for (const card of hand)
                counts[card] = (counts[card] ?? 0) + 1;
            const countsOrdered = Object.values(counts).sort(compare).reverse();
            if (countsOrdered[0] === 5)
                return 7; // Five of a kind
            if (countsOrdered[0] === 4)
                return 6; // Four of a kind
            if (countsOrdered[0] === 3) {
                if (countsOrdered[1] == 2)
                    return 5; // Full house
                return 4; // Three of a kind
            }
            if (countsOrdered[0] === 2) {
                if (countsOrdered[1] === 2)
                    return 3; // Two pair
                return 2; // One pair
            }
            return 1; // High card
        }

        function analyzeHand2(hand: string) {
            if (!hand.includes('J'))
                return analyzeHand1(hand);
            let best = 0;
            for (const replacement of cardValues) {
                if (replacement === 'J')
                    continue;
                const score = analyzeHand1(hand.replaceAll('J', replacement));
                best = Math.max(best, score);
            }
            return best;
        }

        const analyzeHand = part2 ? analyzeHand2 : analyzeHand1;

        const hands = input.map(line => {
            const [hand, bidStr] = line.split(' ');
            const handSortable = hand.split('').map(ch => sortableValuesMap[ch]).join('');
            const bid = parseInt(bidStr);
            const typeScore = analyzeHand(hand);
            return { hand, handSortable, bid, typeScore };
        });

        hands.forEach(hand => dayLogger.trace(hand));

        hands.sort((a, b) => compare(a.typeScore, b.typeScore, compare(a.handSortable, b.handSortable)));

        dayLogger.trace({ order: hands.map(hand => hand.hand) });

        const result = hands.reduce((acc, hand, i) => acc + hand.bid * (i + 1), 0);

        logResult(result);
    }

    runPart(false);

    runPart(true);

});
