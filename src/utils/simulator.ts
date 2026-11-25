import { Access } from "./accesses";

/**
 * Replacement policy used when the cache is full and a miss occurs.
 * - 'LRU': evict the Least Recently Used block (the one untouched the longest).
 * - 'MRU': evict the Most Recently Used block (the one touched most recently).
 */
type ReplacementPolicy = 'MRU' | 'LRU';


/**
 * Simulates a fully associative cache.
 *
 * Any memory block can be stored in any cache block (there is no index field),
 * so a lookup searches every cache block. When the cache is full, the
 * configured replacement policy (LRU or MRU) decides which block to evict.
 *
 * A Simulation instance is stateful: it keeps the current cache contents
 * between accesses, so create a new instance for each independent run.
 *
 * @example
 * const results = new Simulation(4, 'LRU').simulate([0, 1, 2, 3, 0, 4]);
 */
export class Simulation {
    /** Replacement policy applied when the cache is full. */
    private replacement  : ReplacementPolicy
    /** The cache lines. The array index is the cache block number. */
    private cache : CacheBlock[];
    /**
     * Indexes of cache blocks that have never been filled.
     * A block is removed from this list the first time it is loaded.
     * When this list is empty, the cache is full and replacement begins.
     */
    private availableCacheIndices : number[];

    /**
     * Creates an empty cache.
     *
     * @param cacheBlocks - Number of blocks (lines) in the cache.
     * @param replacement - Replacement policy to use ('LRU' or 'MRU').
     */
    constructor(cacheBlocks : number, replacement : ReplacementPolicy) {
        this.replacement = replacement;
        this.cache = [];
        this.availableCacheIndices = [];

        // initializing cache
        for (let i = 0; i < cacheBlocks; i++) {
            this.cache.push(new CacheBlock());
            this.availableCacheIndices.push(i);
        }
    }

    /**
     * Runs a full sequence of memory accesses through the cache, in order.
     * Each access sees the cache state left by the previous one.
     *
     * @param accessSequence - Memory block numbers to access, in order.
     * @returns One Access record per input, describing the block accessed,
     *          the cache block involved, and whether it was a hit, miss,
     *          or replace.
     */
    public simulate(accessSequence : number[]) : Access[] {
        return accessSequence.map((n) => {
            return this.access(n);
        })

    }
    
    /**
     * Performs a single access to the cache and updates its state.
     *
     * Outcomes:
     * - 'hit': the memory block is already cached. Its age is reset to 0.
     * - 'miss': the block is not cached and an empty cache block was
     *   available. A random empty block is chosen and loaded.
     * - 'replace': the block is not cached and the cache is full, so a victim
     *   chosen by the replacement policy is overwritten.
     *
     * Every access first ages all blocks by 1, so a block's age equals the
     * number of accesses since it was last used.
     *
     * @param memoryBlock - The memory block number being accessed.
     * @returns The result of the access, including which cache block was used.
     */
    private access(memoryBlock : number) : Access  {
        // Every block becomes one access older before this access is handled.
        this.incrementAges();
        const accessResults : Access = {
            memoryBlock : memoryBlock, 
            cacheBlock : 0,
            status : 'hit'
        };
        // Index of the cache block holding memoryBlock, or -1 if not cached.
        const cacheIdx = this.searchCache(memoryBlock);
        let victimIdx;

        if (cacheIdx == -1 && this.availableCacheIndices.length == 0) {
            // Miss with a full cache: evict a victim chosen by the policy.
            victimIdx = this.findVictim();
            this.cache[victimIdx].setMemoryBlock(memoryBlock);
            accessResults.cacheBlock = victimIdx;
            accessResults.status = 'replace';
        } else if (cacheIdx == -1) {
            // Miss with free space: pick a random empty block and remove it
            // from the list of available blocks.
            victimIdx = this.availableCacheIndices.splice(
                Math.floor(Math.random() * this.availableCacheIndices.length), 1)[0];
            this.cache[victimIdx].setMemoryBlock(memoryBlock);
            accessResults.cacheBlock = victimIdx;
            accessResults.status = 'miss';

        } else {
            // Hit: the block counts as just used, so its age resets to 0.
            accessResults.cacheBlock = cacheIdx;
            this.cache[cacheIdx].resetAge();
        }
        return accessResults;
    } 

    /**
     * Looks for a memory block in the cache.
     *
     * @param memoryBlock - The memory block number to find.
     * @returns The index of the cache block holding it, or -1 if it is not cached.
     */
    private searchCache(memoryBlock : number) : number {
        return this.cache.findIndex(
            block => block.getMemoryBlock() === memoryBlock)
    }

    /**
     * Chooses which cache block to evict, based on the replacement policy.
     * Only called when the cache is full.
     *
     * Scans all blocks and keeps the best candidate so far:
     * - LRU: the block with the largest age (used longest ago).
     * - MRU: the block with the smallest age (used most recently).
     * Ties go to the lowest index, since the comparison is strict.
     *
     * @returns The index of the cache block to replace.
     */
    private findVictim(): number {
    let victimIdx = 0;

        for (let i = 1; i < this.cache.length; i++) {
            const age = this.cache[i].getAge();
            const best = this.cache[victimIdx].getAge();

            const isBetter = this.replacement === 'LRU'
                 ? age > best   // LRU: largest age = used longest ago
    :              age < best;  // MRU: smallest age = used most recently

                if (isBetter) victimIdx = i;
        }
    return victimIdx;
    }

    /**
     * Increases the age of every cache block by 1.
     * Called at the start of each access so ages track recency of use.
     */
    private incrementAges() {
        this.cache.forEach((cb : CacheBlock) => {
            cb.incrementAge();
        })
    }
}

/**
 * A single line of the cache.
 *
 * Holds which memory block is currently stored (or null if empty) and its
 * age: the number of accesses since this block was last loaded or used.
 */
class CacheBlock {
    /** Accesses since this block was last loaded or hit. Lower = more recent. */
    private age : number;
    /** The memory block number stored here, or null if the line is empty. */
    private memoryBlock: number | null;

    /** Creates an empty cache block with age 0. */
    constructor() {
        this.age = 0;
        this.memoryBlock = null;
    }

    /**
     * @returns The memory block number stored here, or null if empty.
     */
    getMemoryBlock() : number | null {
        return this.memoryBlock
    }

    /**
     * Loads a memory block into this cache block and resets its age to 0,
     * since loading counts as a use.
     *
     * @param memoryBlock - The memory block number to store.
     */
    setMemoryBlock(memoryBlock : number) {
        this.memoryBlock  = memoryBlock;
        this.age = 0;
    }

    /**
     * @returns Number of accesses since this block was last loaded or used.
     */
    getAge() : number {
        return this.age;
    }

    /** Increases the age by 1 (one more access has happened without using this block). */
    incrementAge() : void {
        this.age += 1;
    }

    /** Resets the age to 0, marking this block as just used (e.g. on a hit). */
    resetAge() : void {
        this.age = 0;
    }

}