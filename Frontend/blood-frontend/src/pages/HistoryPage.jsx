import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getHistory } from "../services/api";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function HistoryPage() {
  const [filters, setFilters] = useState({
    entry_type: "",
    start_date: "",
    end_date: ""
  });
  const [history, setHistory] = useState({ donations: [], received: [] });
  const [status, setStatus] = useState("idle");

  async function loadHistory() {
    const token = localStorage.getItem("token");
    if (!token) return;
    setStatus("loading");
    const data = await getHistory(token, filters);
    setHistory(data);
    setStatus("idle");
  }

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto flex max-w-6xl flex-col gap-6"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-dark">
            My history
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Donations & received blood
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Review your past activity, filter by date or type, and keep track of impact.
          </p>
        </div>

        <Card>
          <div className="flex flex-wrap items-end gap-4 text-sm">
            <label className="flex flex-col text-sm font-medium text-slate-600">
              <span className="mb-1">Type</span>
              <select
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-950 outline-none transition-all duration-200 focus:border-brand-red focus:ring-2 focus:ring-brand-light"
                value={filters.entry_type}
                onChange={e => setFilters({ ...filters, entry_type: e.target.value })}
              >
                <option value="">All</option>
                <option value="donation">Donations</option>
                <option value="received">Received</option>
              </select>
            </label>
            <Input
              label="From"
              type="date"
              value={filters.start_date}
              onChange={e => setFilters({ ...filters, start_date: e.target.value })}
            />
            <Input
              label="To"
              type="date"
              value={filters.end_date}
              onChange={e => setFilters({ ...filters, end_date: e.target.value })}
            />
            <div className="ml-auto flex gap-2">
              <Button
                variant="subtle"
                onClick={() => {
                  setFilters({ entry_type: "", start_date: "", end_date: "" });
                  loadHistory();
                }}
              >
                Reset
              </Button>
              <Button onClick={loadHistory} disabled={status === "loading"}>
                {status === "loading" ? "Loading..." : "Apply"}
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Donations" description="Every time you donated blood.">
            {history.donations.length === 0 ? (
              <p className="text-xs text-slate-500">No donation records yet.</p>
            ) : (
              <div className="space-y-3 text-sm">
                {history.donations.map(entry => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{entry.hospital}</p>
                      <p className="text-xs text-slate-500">{entry.date}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <p>Donated</p>
                      <p className="mt-1 rounded-full bg-brand-light px-2 py-0.5 text-brand-dark">
                        {entry.blood_group}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card title="Received" description="Transfusions you have received.">
            {history.received.length === 0 ? (
              <p className="text-xs text-slate-500">No received blood records yet.</p>
            ) : (
              <div className="space-y-3 text-sm">
                {history.received.map(entry => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-100"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{entry.hospital}</p>
                      <p className="text-xs text-slate-500">{entry.date}</p>
                    </div>
                    <div className="text-right text-xs text-slate-500">
                      <p>Received</p>
                      <p className="mt-1 rounded-full bg-brand-light px-2 py-0.5 text-brand-dark">
                        {entry.blood_group}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </motion.div>
    </div>
  );
}


