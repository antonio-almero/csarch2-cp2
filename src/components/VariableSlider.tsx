import { useState } from 'react';

type Config = { values: number[]; unit: string };

const OPTIONS: Record<string, Config> = {
  "Block Size": { values: [2, 4, 8, 16], unit: "words" },
  "# Cache Blocks": { values: [4, 8, 16], unit: "blocks" },
};

export function VariableSlider({
  label,
  onChange,
}: {
  label: string;
  onChange?: (value: number) => void;
}) {
  const { values, unit } = OPTIONS[label] ?? { values: [0], unit: "" };
  const [index, setIndex] = useState(0);
  const last = values.length - 1;

  return (
    <div style={{ width: 260, fontFamily: "sans-serif", margin: "16px" }}>
      <div style={{ fontSize: 22, marginBottom: 8 }}>
        {label}: <b>{values[index]}</b>
      </div>

      <div style={{ position: "relative", height: 20 }}>
        {/* tick marks */}
        {values.map((_, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `${(i / last) * 100}%`,
              top: 3,
              width: 2,
              height: 14,
              background: "#3d3d8a",
              transform: "translateX(-1px)",
            }}
          />
        ))}
        <input
          type="range"
          min={0}
          max={last}
          step={1}
          value={index}
          onChange={(e) => {
            const i = Number(e.target.value);
            setIndex(i);
            onChange?.(values[i]);
          }}
          style={{ position: "absolute", left: 0, top: 0, width: "100%", margin: 0, accentColor: "#000080" }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, marginTop: 4 }}>
        <span>{values[0]}</span>
        <span>{unit}</span>
        <span>{values[last]}</span>
      </div>
    </div>
  );
}
