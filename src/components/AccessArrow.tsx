import { useLayoutEffect, useRef, useState } from "react";
import { STATUS_COLORS, type AccessStatus } from "../utils/accesses";

// Animated arrow from the accessed memory block to the cache block it maps to.
// Render it inside a `relative` box that contains both <CacheBlocks> and <MemoryBlocks>.
// It finds the rows through their data-mem-block / data-cache-line attributes.
// Give it key={step} so it remounts, and the animation replays, on every step.
export function AccessArrow({ block, cacheLine, status }: { block: number; cacheLine: number; status: AccessStatus }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [path, setPath] = useState("");

  useLayoutEffect(() => {
    const box = svgRef.current?.parentElement;
    if (!box) return;
    const scroller = box.querySelector<HTMLElement>("[data-mem-scroll]");
    const memRow = box.querySelector<HTMLElement>(`[data-mem-block="${block}"]`);
    const cacheRow = box.querySelector<HTMLElement>(`[data-cache-line="${cacheLine}"]`);
    if (!scroller || !memRow || !cacheRow) return;

    // Scroll main memory so the accessed block sits in the middle.
    const s = scroller.getBoundingClientRect();
    const r = memRow.getBoundingClientRect();
    scroller.scrollTop += r.top - s.top - s.height / 2 + r.height / 2;

    // Path from the memory row's left edge to the cache row's right edge, kept on screen while scrolling.
    const draw = () => {
      const b = box.getBoundingClientRect();
      const sc = scroller.getBoundingClientRect();
      const m = memRow.getBoundingClientRect();
      const c = cacheRow.getBoundingClientRect();
      const x1 = m.left - b.left;
      const y1 = Math.min(Math.max(m.top + m.height / 2, sc.top), sc.bottom) - b.top;
      const x2 = c.right - b.left;
      const y2 = c.top + c.height / 2 - b.top;
      const bend = (x1 - x2) / 2;
      setPath(`M ${x1} ${y1} C ${x1 - bend} ${y1}, ${x2 + bend} ${y2}, ${x2} ${y2}`);
    };
    draw();
    scroller.addEventListener("scroll", draw);
    window.addEventListener("resize", draw);
    return () => {
      scroller.removeEventListener("scroll", draw);
      window.removeEventListener("resize", draw);
    };
  }, [block, cacheLine]);

  const color = STATUS_COLORS[status].arrow;
  return (
    <svg ref={svgRef} className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
      <defs>
        <marker id="access-arrow-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      </defs>
      {path && (
        <g>
          <path d={path} fill="none" stroke={color} strokeWidth="3" pathLength={1} strokeDasharray="1" markerEnd="url(#access-arrow-head)">
            <animate attributeName="stroke-dashoffset" from="1" to="0" dur="0.6s" fill="freeze" />
          </path>
          {/* the block number travelling along the arrow */}
          <g>
            <rect x="-14" y="-10" width="28" height="20" rx="4" fill={color} />
            <text textAnchor="middle" dominantBaseline="central" fill="white" fontSize="12" fontWeight="bold">
              {block}
            </text>
            <animateMotion dur="0.6s" fill="freeze" path={path} />
          </g>
        </g>
      )}
    </svg>
  );
}
