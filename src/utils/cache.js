// Cache simulation logic for Machine 6: Fully Associative + LRU vs. Fully Associative + MRU.

export const MEMORY_BLOCKS = 1024
export const BLOCK_SIZES = [2, 4, 8, 16, 32]
export const CACHE_SIZES = [4, 8, 16, 32, 64]

export const SEQUENCE_TYPES = [
  { id: "sequential", label: "Sequential" },
  { id: "midrepeat", label: "Mid-repeat" },
  { id: "random", label: "Random" },
  { id: "custom", label: "Custom" },
]

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i)

// a. Sequential: 0..2n-1, repeated twice.
export function sequentialSequence(n) {
  const once = range(0, 2 * n - 1)
  return [...once, ...once]
}

// b. Mid-repeat: 0..n-1, then 0..2n-1 twice; afterward the same pattern with each run reversed.
// n = 4: 0-3, 0-7, 0-7, 3-0, 7-0, 7-0
export function midRepeatSequence(n) {
  const runs = [range(0, n - 1), range(0, 2 * n - 1), range(0, 2 * n - 1)]
  return [...runs.flat(), ...runs.map((r) => [...r].reverse()).flat()]
}

// c. Random: 64 accesses within 0..1023.
export function randomSequence(count = 64) {
  return Array.from({ length: count }, () => Math.floor(Math.random() * MEMORY_BLOCKS))
}

// Parses "0, 1, 2 3\n4" into block numbers. Returns { blocks, errors }.
export function parseCustomSequence(text) {
  const tokens = text.split(/[\s,]+/).filter(Boolean)
  const blocks = []
  const errors = []
  for (const t of tokens) {
    const v = Number(t)
    if (!Number.isInteger(v) || v < 0 || v >= MEMORY_BLOCKS) errors.push(t)
    else blocks.push(v)
  }
  return { blocks, errors }
}

export function generateSequence(type, n, customText = "") {
  switch (type) {
    case "sequential":
      return sequentialSequence(n)
    case "midrepeat":
      return midRepeatSequence(n)
    case "random":
      return randomSequence()
    default:
      return parseCustomSequence(customText).blocks
  }
}

/**
 * Runs a fully associative cache over the sequence of main memory block numbers.
 *
 * policy: "LRU" evicts the least recently used block, "MRU" evicts the most recently used.
 * Returns one step per access, each with a snapshot of the cache after the access.
 */
export function simulate({ sequence, cacheBlocks, policy }) {
  // Each line: { tag: mm block | null, lastUsed: step index | null, loadedAt }
  let lines = Array.from({ length: cacheBlocks }, () => ({ tag: null, lastUsed: null, loadedAt: null }))
  const steps = []
  let hits = 0
  let misses = 0

  sequence.forEach((block, i) => {
    const next = lines.map((l) => ({ ...l }))
    let line = next.findIndex((l) => l.tag === block)
    let hit = line !== -1
    let evicted = null
    let reason

    if (hit) {
      hits++
      reason = `Block ${block} found in cache line ${line}`
    } else {
      misses++
      const empty = next.findIndex((l) => l.tag === null)
      if (empty !== -1) {
        line = empty
        reason = `Cache line ${line} was empty, block ${block} loaded`
      } else {
        // Pick the victim by recency.
        line = 0
        for (let j = 1; j < next.length; j++) {
          const better =
            policy === "LRU" ? next[j].lastUsed < next[line].lastUsed : next[j].lastUsed > next[line].lastUsed
          if (better) line = j
        }
        evicted = next[line].tag
        reason = `Cache full, ${policy} victim is block ${evicted} in line ${line}; replaced with block ${block}`
      }
      next[line].tag = block
      next[line].loadedAt = i
    }
    next[line].lastUsed = i
    lines = next

    steps.push({
      index: i,
      block,
      hit,
      line,
      evicted,
      reason,
      hits,
      misses,
      cache: lines,
    })
  })

  return steps
}

/**
 * Statistics for a finished (or partial) run.
 *
 * c: cache access time (ns), m: main memory access time per word (ns), k: block size (words).
 * Load-through:      miss penalty = c + m          (word is forwarded to the CPU while the block loads)
 * Non-load-through:  miss penalty = c + k*m + c    (check cache, load whole block, then read from cache)
 * AMAT = h*c + (1-h)*missPenalty
 * Total memory access time = hits*c + misses*missPenalty
 */
export function computeStats({ hits, misses, blockSize, cacheTime, memoryTime, loadThrough }) {
  const total = hits + misses
  const hitRate = total ? hits / total : 0
  const missRate = total ? misses / total : 0
  const missPenalty = loadThrough ? cacheTime + memoryTime : cacheTime + blockSize * memoryTime + cacheTime
  const amat = total ? hitRate * cacheTime + missRate * missPenalty : 0
  const totalTime = hits * cacheTime + misses * missPenalty
  return { total, hits, misses, hitRate, missRate, missPenalty, amat, totalTime }
}

// A word is 2 bytes, so word values are shown as 4 hex digits (16 bits), e.g. 0x001A.
export const toHexWord = (n) => "0x" + (n & 0xffff).toString(16).toUpperCase().padStart(4, "0")
