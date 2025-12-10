import Input from "../ui/Input";
import Button from "../ui/Button";

export default function Navbar({ onNewRequest = () => {} }) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-100 bg-white/80 px-6 py-4 backdrop-blur-xl">
      <div className="flex-1 pr-4">
        <Input
          type="search"
          placeholder="Search donors, requests, cities..."
          className="w-full"
          aria-label="Search"
        />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="secondary" onClick={onNewRequest}>
          New Request
        </Button>
        <div className="flex items-center gap-3 rounded-full bg-slate-50 px-4 py-2">
          <div>
            <p className="text-sm font-semibold text-slate-900">Dr. Ayesha Khan</p>
            <p className="text-xs text-slate-500">Admin</p>
          </div>
          <span className="h-10 w-10 rounded-full bg-brand-light text-center text-sm font-bold leading-10 text-brand-red">
            AK
          </span>
        </div>
      </div>
    </header>
  );
}

