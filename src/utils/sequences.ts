// Test case generators from the spec. n = number of cache blocks.
const MEMORY_BLOCKS = 1024;

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

export function sequential(n: number): number[] {
  const once = range(0, 2 * n - 1);
  return [...once, ...once];
}

export function midRepeat(n: number): number[] {
  const runs = [range(0, n - 1), range(0, 2 * n - 1), range(0, 2 * n - 1)];
  return [...runs.flat(), ...runs.map((r) => [...r].reverse()).flat()];
}

export function random(count = 64): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * MEMORY_BLOCKS));
}

export function parseCustom(text: string): number[] {
  return text
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number)
    .filter((v) => Number.isInteger(v) && v >= 0 && v < MEMORY_BLOCKS);
}

// Entries the custom input can't use: numbers outside 0..1023, and things that aren't whole numbers.
export function findInvalidCustom(text: string): { outOfRange: string[]; notNumbers: string[] } {
  const tokens = text.split(/[\s,]+/).filter(Boolean);
  const outOfRange: string[] = [];
  const notNumbers: string[] = [];
  for (const t of tokens) {
    const v = Number(t);
    if (!Number.isInteger(v)) notNumbers.push(t);
    else if (v < 0 || v >= MEMORY_BLOCKS) outOfRange.push(t);
  }
  return { outOfRange, notNumbers };
}
