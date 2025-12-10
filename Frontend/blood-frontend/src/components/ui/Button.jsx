const variants = {
  primary:
    "bg-brand-red text-white hover:bg-brand-dark focus-visible:ring-brand-red",
  secondary:
    "bg-white text-brand-red border border-brand-light hover:bg-brand-light focus-visible:ring-brand-light",
  subtle:
    "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-300"
};

const sizes = {
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base"
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  return (
    <button
      className={`rounded-xl font-semibold shadow-soft transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

