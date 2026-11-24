export type AccessStatus = "miss" | "hit" | "replace";
export type Access = { memoryBlock: number; cacheBlock: number; status: AccessStatus };

// TO DO: REPLACE THIS ACCESSES DATA WITH THE ACTUAL OUTPUT BASED FROM THE INPUTS OF THE USERS FOR BACKEND DEVS
// Use the inputs from app.jsx to make build the array of objects
// memoryBlock: block in main memory being accessed
// cacheBlock: block in cache it goes to
// status: if its hit (green), miss (yellow), replace (red)

export const ACCESSES: Access[] = [
  { memoryBlock: 0, cacheBlock: 0, status: "miss" },
  { memoryBlock: 1, cacheBlock: 1, status: "miss" },
  { memoryBlock: 2, cacheBlock: 2, status: "miss" }, 
  { memoryBlock: 0, cacheBlock: 0, status: "hit" },
  { memoryBlock: 3, cacheBlock: 3, status: "miss" },
  { memoryBlock: 5, cacheBlock: 1, status: "replace" },
  { memoryBlock: 0, cacheBlock: 0, status: "hit" },
  { memoryBlock: 8, cacheBlock: 2, status: "replace" },
  { memoryBlock: 5, cacheBlock: 1, status: "hit" },
  { memoryBlock: 12, cacheBlock: 3, status: "replace" },
];

export const STATUS_COLORS: Record<AccessStatus, { row: string; arrow: string }> = {
  miss: { row: "bg-yellow-200", arrow: "#ca8a04" },
  hit: { row: "bg-green-200", arrow: "#16a34a" },
  replace: { row: "bg-red-200", arrow: "#dc2626" },
};
