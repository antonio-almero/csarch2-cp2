import type { Access } from "./accesses";

// TO DO: actually replace hitrate, missrate, totaltime, and averagetime with the actual formulas. rmmbr to base it on the read policies
export function computeStats(accesses: Access[], blockSize: number, readPolicy: string) {
  const total = accesses.length;
  const hits = accesses.filter((a) => a.status === "hit").length;
  const misses = total - hits;
  const hitRate = total > 0 ? hits / total : 0;
  const missRate = total > 0 ? misses / total : 0;
  const totalTime = 0; //replace this with the actual formula
  const averageTime = 0; //replace this with the actual formula

  return {
    total: total,
    hits: hits,
    misses: misses,
    hitRate: hitRate, 
    missRate: missRate, 
    averageTime: averageTime,
    totalTime: totalTime
  };
}
