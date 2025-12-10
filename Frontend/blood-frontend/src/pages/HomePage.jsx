import { motion } from "framer-motion";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-brand-light via-white to-slate-50 px-4 py-16">
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-red-100 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-brand-light blur-3xl" />

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 lg:flex-row">
        <motion.div
          className="flex-1 space-y-6"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-dark">
            Blood Donation & Matching System
          </p>
          <h1 className="text-balance text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Connect donors and patients
            <span className="block text-brand-red">in minutes, not hours.</span>
          </h1>
          <p className="max-w-xl text-sm text-slate-600 sm:text-base">
            A centralized platform for hospitals, donors, and recipients to coordinate safe and
            timely blood donations with smart matching and real-time visibility.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button size="lg">Get started as donor</Button>
            <Button size="lg" variant="secondary">
              View blood requests
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 space-y-4"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card title="Today&apos;s snapshot" className="backdrop-blur">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1 rounded-2xl bg-brand-light/60 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-brand-dark">
                  Active donors
                </p>
                <p className="text-2xl font-semibold text-slate-950">2,458</p>
                <p className="text-xs text-slate-500">Verified and ready to donate</p>
              </div>
              <div className="space-y-1 rounded-2xl bg-slate-50 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Pending requests
                </p>
                <p className="text-2xl font-semibold text-slate-950">134</p>
                <p className="text-xs text-slate-500">18 marked as urgent</p>
              </div>
              <div className="space-y-1 rounded-2xl bg-slate-50 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Units available
                </p>
                <p className="text-2xl font-semibold text-slate-950">782</p>
                <p className="text-xs text-slate-500">Across 8 blood banks</p>
              </div>
              <div className="space-y-1 rounded-2xl bg-brand-light/60 p-3">
                <p className="text-xs font-medium uppercase tracking-wide text-brand-dark">
                  Matches today
                </p>
                <p className="text-2xl font-semibold text-slate-950">56</p>
                <p className="text-xs text-slate-500">Lives impacted in last 24 hours</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
