export default function Card({ title, description, children, className = "" }) {
  return (
    <div className={`rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-100 ${className}`}>
      {(title || description) && (
        <div className="mb-4 space-y-1">
          {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
}

