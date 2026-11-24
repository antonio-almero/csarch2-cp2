// One cell: shows whatever string it's given (an access number, a hex word like 0x00, or an age).
export function Block({ value = "", className = "" }: { value?: string; className?: string }) {
  return (
    <div
      className={`flex h-7 items-center justify-center border-b border-black font-mono text-xs last:border-b-0 ${className}`}
    >
      {value}
    </div>
  );
}
