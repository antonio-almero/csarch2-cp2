export type AccessStatus = "miss" | "hit" | "replace";
export type Access = { memoryBlock: number; cacheBlock: number; status: AccessStatus };

export const STATUS_COLORS: Record<AccessStatus, { row: string; arrow: string }> = {
  miss: { row: "bg-yellow-200", arrow: "#ca8a04" },
  hit: { row: "bg-green-200", arrow: "#16a34a" },
  replace: { row: "bg-red-200", arrow: "#dc2626" },
};
