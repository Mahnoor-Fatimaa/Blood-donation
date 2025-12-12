import { useState } from "react";
import { motion } from "framer-motion";
import { registerUser } from "../services/api";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

// Accept 'onSwitchToLogin' prop from App.jsx
export default function RegisterPage({ onSwitchToLogin }) {
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

  // UPDATED: Handle Submit with Data Cleaning
  async function handleSubmit(e) {
    e.preventDefault();
    
    // 1. Create a clean copy of the form data
    const payload = { ...form };

    // 2. Fix Empty Age: Convert "" to null
    if (!payload.age) {
        payload.age = null;
    } else {
        // Ensure it is sent as a number, not a string "25"
        payload.age = parseInt(payload.age);
    }

    // 3. Fix Empty Date: Convert "" to null
    if (!payload.last_donation_date) {
        payload.last_donation_date = null;
    }

    // 4. Fix Empty Phone: Convert "" to null
    if (!payload.phone_number) {
        payload.phone_number = null;
    }

    try {
      // 5. Send the CLEAN payload, not the raw form
      await registerUser(payload);
      alert("Registered successfully! Please log in.");
      onSwitchToLogin(); // Switch to login page automatically
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please check your inputs or email might be taken.");
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-brand-light px-4 py-10">
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
            <h1 className="text-2xl font-semibold text-slate-950">
              Create Account
            </h1>
            <p className="text-xs text-slate-500">
              Join the network to donate or request blood.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full name"
              required
              value={form.full_name}
              onChange={e => setForm({ ...form, full_name: e.target.value })}
            />
            <Input
              label="Email address"
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Phone"
                value={form.phone_number}
                onChange={e => setForm({ ...form, phone_number: e.target.value })}
              />
              <Input
                label="Age"
                type="number"
                value={form.age}
                onChange={e => setForm({ ...form, age: e.target.value })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col text-sm font-medium text-slate-600">
                <span className="mb-1">Blood group</span>
                <select
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-light"
                  value={form.blood_group}
                  onChange={e => setForm({ ...form, blood_group: e.target.value })}
                >
                  <option value="">Select</option>
                  {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </label>
              <Input
                label="City"
                value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
              />
            </div>

            {/* Optional: Last Donation Date Field (Only if Donor) */}
            {form.role === 'donor' && (
               <Input
                 label="Last Donation Date (Optional)"
                 type="date"
                 value={form.last_donation_date}
                 onChange={e => setForm({ ...form, last_donation_date: e.target.value })}
               />
            )}

            <label className="flex flex-col text-sm font-medium text-slate-600">
              <span className="mb-1">I want to be a:</span>
              <select
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-light"
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
              >
                <option value="donor">Donor (I want to donate)</option>
                <option value="recipient">Recipient (I need blood)</option>
              </select>
            </label>

            <Button type="submit" className="w-full" size="lg">
              Create account
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Already registered?{" "}
            <button 
              onClick={onSwitchToLogin}
              className="font-semibold text-brand-red hover:underline"
            >
              Log in instead
            </button>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}