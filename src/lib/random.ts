export function hashString(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i)
  }
  return hash >>> 0
}

export function createSeededRandom(seed: number) {
  let state = seed || 1
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }
}

export function randomInRange(
  rand: () => number,
  min: number,
  max: number,
  decimals = 1,
): number {
  const value = min + rand() * (max - min)
  const factor = 10 ** decimals
  return Math.round(value * factor) / factor
}

export function pickOne<T>(rand: () => number, items: T[]): T {
  return items[Math.floor(rand() * items.length)]
}
