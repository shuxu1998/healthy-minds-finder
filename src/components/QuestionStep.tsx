interface QuestionStepProps<T extends string> {
  labelledBy: string;
  options: readonly T[];
  labels: Record<T, string>;
  selected: T | null;
  onSelect: (id: T) => void;
}

export function QuestionStep<T extends string>({
  labelledBy,
  options,
  labels,
  selected,
  onSelect,
}: QuestionStepProps<T>) {
  return (
    <div className="hmp-options" role="group" aria-labelledby={labelledBy}>
      {options.map((id) => (
        <button
          key={id}
          type="button"
          className="hmp-option"
          aria-pressed={selected === id}
          onClick={() => onSelect(id)}
        >
          <span>{labels[id]}</span>
          <span className="hmp-option__check" aria-hidden="true">
            ✓
          </span>
        </button>
      ))}
    </div>
  );
}
