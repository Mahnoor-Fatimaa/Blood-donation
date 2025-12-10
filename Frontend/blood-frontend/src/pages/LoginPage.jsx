import { useState } from "react";
import { motion } from "framer-motion";
import { loginUser } from "../services/api";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await loginUser(form);
    localStorage.setItem("token", result.access_token);
    window.location.href = "/";
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-brand-light via-white to-slate-100 px-4">
      <div className="pointer-events-none absolute -left-40 -top-40 h-80 w-80 rounded-full bg-brand-light blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-red-100 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="space-y-6 rounded-3xl">
          <div className="space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-dark">
              Welcome back
            </p>
            <h1 className="text-2xl font-semibold text-slate-950">
              Log in to Blood Donation System
            </h1>
            <p className="text-xs text-slate-500">
              Access your dashboard, manage requests, and stay connected with donors.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />

            <div className="flex items-center justify-between text-xs text-slate-500">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-3 w-3 rounded border-slate-300" />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="font-medium text-brand-red hover:text-brand-dark"
              >
                Forgot password?
              </button>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Continue
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <span className="font-semibold text-brand-red">Create one</span>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
