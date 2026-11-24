import { useState } from 'react';

export function VariableSwitches({ left, right, onChange }: { left: string; right: string; onChange?: (value: string) => void; }) {
  const [isOn, setIsOn] = useState(false);

  const handleToggle = () => {
    const next = !isOn;
    setIsOn(next);
    onChange?.(next ? right : left);
  };

  return (
    <div className="flex items-center gap-3 text-xl">
      <span className={`w-12 text-right ${isOn ? "text-gray-400" : "font-bold"}`}>{left}</span>
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-label={`${left} / ${right}`}
        onClick={handleToggle}
        className={`relative h-7 w-12 rounded-full border-2 border-black transition-colors ${isOn ? "bg-[#000080]" : "bg-white"}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full border-2 border-black transition-all ${isOn ? "left-6 bg-white" : "left-0.5 bg-black"}`}
        />
      </button>
      <span className={`w-12 ${isOn ? "font-bold" : "text-gray-400"}`}>{right}</span>
    </div>
  );
}
