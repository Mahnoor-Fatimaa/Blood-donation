export default function Input({
  label,
  hint,
  className = "",
  ...props
}) {
  return (
    <label className={`flex flex-col text-sm font-medium text-slate-600 ${className}`}>
      {label && <span className="mb-1">{label}</span>}
      <input
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-950 outline-none transition-all duration-200 focus:border-brand-red focus:ring-2 focus:ring-brand-light"
        {...props}
      />
      {hint && <span className="mt-1 text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

