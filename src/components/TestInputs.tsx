import { useEffect, useMemo, useState } from 'react';
import { sequential, midRepeat, random, parseCustom, findInvalidCustom } from '../utils/sequences';

export function TestInputs({
  numBlocks,
  onChange,
  onTypeChange,
  onEdit,
  onValidChange,
}: {
  numBlocks: number;
  onChange?: (sequence: number[]) => void;
  onTypeChange?: (type: string) => void;
  onEdit?: () => void; // called on any user edit (dropdown, Regenerate, custom text)
  onValidChange?: (valid: boolean) => void; // false when Custom has bad entries or is empty
}) {
  const [selectedOption, setSelectedOption] = useState('S');
  const [customText, setCustomText] = useState('');
  const [randomSeq, setRandomSeq] = useState(() => random());

  const options = [
    { label: 'Sequential', value: 'S' },
    { label: 'Mid-Repeat', value: 'M' },
    { label: 'Random', value: 'R' },
    { label: 'Custom', value: 'C' },
  ];

  const sequence = useMemo(() => {
    if (selectedOption === 'S') return sequential(numBlocks);
    if (selectedOption === 'M') return midRepeat(numBlocks);
    if (selectedOption === 'R') return randomSeq;
    return parseCustom(customText);
  }, [selectedOption, numBlocks, randomSeq, customText]);

  const { outOfRange, notNumbers } = findInvalidCustom(customText);
  const valid =
    selectedOption !== 'C' ||
    (outOfRange.length === 0 && notNumbers.length === 0 && sequence.length > 0);

  useEffect(() => {
    onValidChange?.(valid);
  }, [valid, onValidChange]);

  useEffect(() => {
    onChange?.(sequence);
  }, [sequence, onChange]);

  return (
    <div className="flex w-full flex-col gap-2 justify-between items-stretch">
      <h2 className="text-xl font-semibold">Sequence Input</h2>
      <div className="flex gap-2 items-center justify-center">
        <select
          id="option-select"
          value={selectedOption}
          onChange={(e) => {
            setSelectedOption(e.target.value);
            onTypeChange?.(options.find((o) => o.value === e.target.value)?.label ?? e.target.value);
            onEdit?.();
            if (e.target.value === 'R') setRandomSeq(random());
          }}
          className="flex-1 items-center justify-center rounded border border-black px-2 py-1"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {selectedOption === 'R' && (
          <button
            type="button"
            onClick={() => {
              setRandomSeq(random());
              onEdit?.();
            }}
            className="rounded border border-black px-2 py-1 hover:bg-gray-100">
            Regenerate
          </button>
        )}
      </div>

      {selectedOption === 'C' && (
        <textarea
          rows={4}
          value={customText}
          onChange={(e) => {
            setCustomText(e.target.value);
            onEdit?.();
          }}
          placeholder="Manual input: block numbers 0-1023, e.g. 0, 1, 2, 3"
          className="rounded border border-black p-2 font-mono text-sm"
        />
      )}
      {selectedOption === 'C' && outOfRange.length > 0 && (
        <p className="text-sm text-red-600">Out of range (0–1023): {outOfRange.join(', ')}</p>
      )}
      {selectedOption === 'C' && notNumbers.length > 0 && (
        <p className="text-sm text-red-600">Not a block number: {notNumbers.join(', ')}</p>
      )}
    </div>
  );
}
