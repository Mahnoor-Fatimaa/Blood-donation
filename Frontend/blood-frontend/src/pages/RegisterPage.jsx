import { useState } from "react";
import { motion } from "framer-motion";
import { registerUser } from "../services/api";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "donor",
    phone_number: "",
    age: "",
    blood_group: "",
    city: "",
    last_donation_date: ""
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const result = await registerUser(form);
    console.log(result);
    alert("Registered successfully");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-brand-light px-4">
      <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-red-100 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 -top-40 h-80 w-80 rounded-full bg-brand-light blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-lg"
      >
        <Card className="space-y-6 rounded-3xl">
          <div className="space-y-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-dark">
              Join the network
            </p>
            <h1 className="text-2xl font-semibold text-slate-950">
              Create your Blood Donation account
            </h1>
            <p className="text-xs text-slate-500">
              One account for donors and recipients to manage profiles and requests.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              placeholder="e.g. Mahnoor Fatima"
              value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })}
            />

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
              placeholder="Create a strong password"
              autoComplete="new-password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Phone number"
                placeholder="+92..."
                value={form.phone_number}
                onChange={e => setForm({ ...form, phone_number: e.target.value })}
              />
              <Input
                label="Age"
                type="number"
                min="18"
                max="80"
                placeholder="e.g. 28"
                value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col text-sm font-medium text-slate-600">
                <span className="mb-1">Blood group</span>
                <select
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-950 outline-none transition-all duration-200 focus:border-brand-red focus:ring-2 focus:ring-brand-light"
                  value={form.blood_group}
                  onChange={e => setForm({ ...form, blood_group: e.target.value })}
                >
                  <option value="">Select blood group</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </label>

              <Input
                label="City"
                placeholder="e.g. Lahore"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
              />
            </div>

            <Input
              label="Last donation date (optional)"
              type="date"
              value={form.last_donation_date}
              onChange={e => setForm({ ...form, last_donation_date: e.target.value })}
            />

            <label className="flex flex-col text-sm font-medium text-slate-600">
              <span className="mb-1">Account type</span>
              <select
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-950 outline-none transition-all duration-200 focus:border-brand-red focus:ring-2 focus:ring-brand-light"
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
              >
                <option value="donor">Donor</option>
                <option value="recipient">Recipient</option>
              </select>
            </label>

            <div className="text-xs text-slate-500">
              By creating an account, you agree to our{" "}
              <span className="font-semibold text-brand-red">terms</span> and{" "}
              <span className="font-semibold text-brand-red">privacy policy</span>.
            </div>

            <Button type="submit" className="w-full" size="lg">
              Create account
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Already registered?{" "}
            <span className="font-semibold text-brand-red">Log in instead</span>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
