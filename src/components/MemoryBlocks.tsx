import { Block } from "./Block";

// Hex word address, e.g. 5 -> "0x0005" (a word is 2 bytes, so 4 hex digits).
export const hexWord = (n: number) => "0x" + n.toString(16).toUpperCase().padStart(4, "0");

// Main memory: Block | Data, with w0..wN labels on the right. Scrolls since there are 1024 blocks.
export function MemoryBlocks({
  blockSize,
  numBlocks = 1024,
  data,
  highlight,
}: {
  blockSize: number;
  numBlocks?: number;
  data?: string[][]; // optional override per block/word; defaults to each word's hex address
  highlight?: number; // memory block accessed by the current step
}) {
  return (
    <div className="flex w-full min-w-0 flex-1 flex-col self-stretch">
      <div className="flex pr-8 text-sm font-semibold">
        <span className="w-14 text-center">Block</span>
        <span className="flex-1 text-center">Data</span>
      </div>
      <div className="relative min-h-0 flex-1">
      <div data-mem-scroll className="absolute inset-0 overflow-y-auto pr-8">
        <div className="rounded-xl border-2 border-black">
          {Array.from({ length: numBlocks }, (_, b) => (
            <div
              key={b}
              data-mem-block={b} // used by AccessArrow to find this row
              className={`relative flex border-t-2 border-black first:border-t-0 ${highlight === b ? "bg-blue-200" : ""}`}
            >
              <div className="flex w-14 items-center justify-center text-lg">{b}</div>
              <div className="flex flex-1 flex-col border-l-2 border-black">
                {Array.from({ length: blockSize }, (_, i) => (
                  <Block key={i} value={data?.[b]?.[i] ?? hexWord(b * blockSize + i)} />
                ))}
              </div>
              {/* word labels outside the box */}
              <div className="absolute left-full flex flex-col pl-1">
                {Array.from({ length: blockSize }, (_, i) => (
                  <span key={i} className="flex h-7 items-center text-xs text-gray-600">
                    w{i}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
