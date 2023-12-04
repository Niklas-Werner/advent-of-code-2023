import { AnyRecord, Awaitable, TwoWayMap } from '@nw55/common';
import { Log, logFormat } from '@nw55/logging';
import { createConsoleLogWriter, startProgram, tryReadTextFile } from '@nw55/node-utils';
import chalk from 'chalk';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

Log.addGlobalLogWriter(createConsoleLogWriter({
    filter: true,
    colorStyler: chalk,
    logData: true,
    format: logFormat`[${'time'}] ${logFormat.level('symbol')}: ${'text'}`
}));

export const dayLogger = Log.createLogger('day');

export function logResult(result: unknown) {
    dayLogger.info('result', typeof result === 'object' && result !== null ? result as AnyRecord : { value: result });
}

export async function readNonEmptyLines(...pathSegments: string[]) {
    const file = resolve(...pathSegments);
    const content = await tryReadTextFile(file);
    if (content === null)
        throw new Error('file not found');
    const lines = content.split(/\r?\n/g);
    return lines.filter(line => line !== '');
}

export function isNonNullable<T>(x: T): x is NonNullable<T> {
    return x !== null && x !== undefined;
}

export interface DayOptions {
    readonly blankLines?: false | 'keep' | 'group';
}

type InputType<Options extends DayOptions> = Options['blankLines'] extends 'group' ? string[][] : string[];

interface FnOptions {
    test: number;
}

export function runDay<O extends DayOptions>(moduleUrl: string, options: O, fn: (input: InputType<O>, options: FnOptions) => Awaitable<void>) {
    startProgram(async ([param]) => {
        const test = param && param.startsWith('test') ? param.length === 4 ? 1 : parseInt(param.slice(4)) : 0;
        const dir = dirname(fileURLToPath(moduleUrl));
        const file = resolve(dir, test > 0 ? `test-input${test === 1 ? '' : test}` : 'input');
        const fnOptions: FnOptions = { test };
        let content = await tryReadTextFile(file);
        if (content === null)
            throw new Error('file not found');
        content = content.replace(/(?:\r?\n)+$/, '');
        switch (options.blankLines) {
            case 'keep': {
                const lines = content.split(/\r?\n/g);
                await fn(lines as InputType<typeof options>, fnOptions);
                break;
            }
            case 'group': {
                const groups = content.split(/(?:\r?\n){2}/g);
                const input = groups.map(group => group.split(/\r?\n/g));
                await fn(input as InputType<typeof options>, fnOptions);
                break;
            }
            default: {
                const lines = content.split(/\r?\n/g);
                const input = options.blankLines ? lines : lines.filter(line => line !== '');
                await fn(input as InputType<typeof options>, fnOptions);
                break;
            }
        }
    });
}

function backtrackMatchHelper<K, V>(candidates: Iterable<readonly [K, Iterable<V>]>, target: number, matches: TwoWayMap<K, V>): boolean {
    if (matches.size >= target)
        return true;

    const filteredMatchCandidates = [...candidates]
        .filter(([key, values]) => !matches!.hasKey(key))
        .map(([key, values]) => [key, [...values].filter(value => !matches!.hasValue(value))] as const)
        .filter(([key, values]) => values.length > 0)
        .sort((a, b) => a[1].length - b[1].length);

    if (filteredMatchCandidates.length === 0)
        return false;

    const [allergen, currentIngredients] = filteredMatchCandidates[0];

    for (const ingredient of currentIngredients) {
        if (!matches.hasValue(ingredient)) {
            matches.set(allergen, ingredient);
            if (backtrackMatchHelper(candidates, target, matches))
                return true;
            matches.delete(allergen);
        }
    }

    return false;
}

export function backtrackMatch<K, V>(candidates: Iterable<readonly [K, Iterable<V>]>) {
    const matches = new TwoWayMap<K, V>();
    const target = [...candidates].length;
    const success = backtrackMatchHelper(candidates, target, matches);
    return success ? matches : null;
}

export const compareStrings = (a: string, b: string) => a > b ? 1 : b > a ? -1 : 0;

export const parseDecimalInt = (x: string) => parseInt(x.trim());

export const splitOnce = (separator: string) => (str: string) => {
    const index = str.indexOf(separator);
    if (index < 0)
        return [str, ''] as const;
    return [
        str.slice(0, index),
        str.slice(index + separator.length)
    ] as const;
};

export const notNull = <T>(value: T | null): value is T => value !== null;

export function jsonClone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

export function cached<A extends unknown[], R>(fn: (...args: A) => R, getKey: (...args: A) => string): (...args: A) => R {
    const cache = new Map<string, R>();
    return (...args) => {
        const key = getKey(...args);
        let value = cache.get(key);
        if (value === undefined) {
            value = fn(...args);
            cache.set(key, value);
        }
        return value;
    };
}
