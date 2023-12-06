import { dayLogger, logResult, parseDecimalInt, runDay } from '../utils.js';

runDay(import.meta.url, {}, input => {

    const times = input[0].split(':')[1].trim().split(/\s+/g).map(parseDecimalInt);
    const distances = input[1].split(':')[1].trim().split(/\s+/g).map(parseDecimalInt);
    dayLogger.debug('input', { times, distances });

    function runPart(times: number[], distances: number[]) {
        let result = 1;
        for (let i = 0; i < times.length; i++) {
            const time = times[i];
            const targetDistance = distances[i];
            let options = 0;
            for (let t = 0; t <= time; t++) {
                const speed = t;
                const distance = (time - t) * speed;
                if (distance > targetDistance)
                    options++;
            }
            dayLogger.debug({ time, targetDistance, options });
            result *= options;
        }
        logResult(result);
    }

    runPart(times, distances);

    const time2 = parseInt(input[0].replace(/\D/g, ''));
    const distance2 = parseInt(input[1].replace(/\D/g, ''));

    runPart([time2], [distance2]);

});
