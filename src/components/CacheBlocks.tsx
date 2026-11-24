import { useEffect } from "react";
import { Block } from "./Block";
import { STATUS_COLORS, type AccessStatus } from "../utils/accesses";

export type CacheBlockData = { tag?: string; words?: string[]; age?: string }; // tag = memory block number held

// Cache table: Block | Data | Age. Each cache block is one group of blockSize word cells.
export function CacheBlocks({
  blockSize,
  numBlocks,
  data = [],
  highlight,
}: {
  blockSize: number;
  numBlocks: number;
  data?: CacheBlockData[]; // data[i] = contents of cache block i; blank when missing
  highlight?: { line: number; status: AccessStatus }; // cache block touched by the current step
}) {

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col">
      <div className="flex text-sm font-semibold">
        <span className="w-14 text-center">Block</span>
        <span className="flex-1 text-center">Data</span>
        <span className="w-14 text-center">Age</span>
      </div>
      <div className="overflow-hidden rounded-xl border-2 border-black">
        {Array.from({ length: numBlocks }, (_, b) => (
          <div
            key={b}
            data-cache-line={b} // used by AccessArrow to find this row
            className={`flex border-t-2 border-black transition-colors duration-500 first:border-t-0 ${
              highlight?.line === b ? STATUS_COLORS[highlight.status].row : ""
            }`}
          >
            <div className="flex w-14 items-center justify-center text-lg">{b}</div>
            <div className="flex flex-1 flex-col border-x-2 border-black">
              {Array.from({ length: blockSize }, (_, i) => (
                <Block key={i} value={data[b]?.words?.[i] ?? ""} />
              ))}
            </div>
            <div className="flex w-14 items-center justify-center text-lg">{data[b]?.age ?? ""}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
