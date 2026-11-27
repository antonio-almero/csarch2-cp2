import { useState } from 'react';

export function TimeAccessInputs({
  name,
  onChange,
  onEdit,
  onValidChange,
}: {
  name: string;
  onChange?: (value: number) => void;
  onEdit?: () => void;
  onValidChange?: (valid: boolean) => void;
}) {
  const [value, setValue] = useState('');
  const n = Number(value);
  const valid = value !== '' && Number(n) && n >= 0;

  return (
    <div className="flex w-full flex-col items-stretch justify-between gap-2 p-4">
      <h2 className="text-xl font-semibold">{name}</h2>
      <input
        type="number"
        min={0}
        step={1}
        value={value}
        onChange={(e) => {
          const text = e.target.value;
          setValue(text);
          onEdit?.();

          const num = Number(text);
          const ok = text !== '' && Number.isInteger(num) && num >= 0;
          onValidChange?.(ok);
          if (ok) onChange?.(num);
        }}
        placeholder="ns"
        className="rounded border border-black p-2 font-mono text-sm"
      />
      {value !== '' && !valid && (
        <p className="text-sm text-red-600">Enter a valid decimal number</p>
      )}
    </div>
  );
}