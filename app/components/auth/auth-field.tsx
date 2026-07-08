type AuthFieldProps = {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
};

export function AuthField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete,
}: AuthFieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/35"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-2xl border border-surface-border bg-black/30 px-5 py-3.5 text-sm text-white placeholder:text-white/25 backdrop-blur-xl transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
      />
    </div>
  );
}

type AuthSelectProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
};

export function AuthSelect({
  id,
  label,
  value,
  onChange,
  options,
  required = false,
}: AuthSelectProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/35"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full appearance-none rounded-2xl border border-surface-border bg-black/30 px-5 py-3.5 text-sm text-white backdrop-blur-xl transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
      >
        <option value="" disabled className="bg-black text-white/50">
          Select…
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-black text-white"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

type AuthTextareaProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
};

export function AuthTextarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  rows = 4,
}: AuthTextareaProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[10px] font-medium uppercase tracking-wider text-white/35"
      >
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full resize-none rounded-2xl border border-surface-border bg-black/30 px-5 py-3.5 text-sm leading-relaxed text-white placeholder:text-white/25 backdrop-blur-xl transition-colors focus:border-gold/40 focus:outline-none focus:ring-1 focus:ring-gold/20"
      />
    </div>
  );
}

type AuthCheckboxProps = {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
};

export function AuthCheckbox({
  id,
  label,
  checked,
  onChange,
  required = false,
}: AuthCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/6 bg-white/2 px-4 py-3.5 transition-colors hover:border-gold/15"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required={required}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-black/40 accent-[#c9a962]"
      />
      <span className="text-sm leading-relaxed text-white/50">{label}</span>
    </label>
  );
}
