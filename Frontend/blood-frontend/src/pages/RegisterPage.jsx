import { useState } from "react";
import { registerUser } from "../services/api";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function RegisterPage({ onSwitchToLogin }) {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_number: "",
    role: "donor",
    age: "", 
    blood_group: "O+",
    city: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Added local error state

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // --- FIX: Clean Data for Backend ---
    const payload = { 
        ...form,
        // Convert empty strings to null for optional string fields
        phone_number: form.phone_number || null,
        city: form.city || null,
        blood_group: form.blood_group || null
    };

    // Convert Age to Integer or null
    if (payload.age) {
        payload.age = parseInt(payload.age);
    } else {
        payload.age = null; // Send null if age is empty
    }
    // ----------------------------------

    try {
      await registerUser(payload);
      alert("Registration Successful! Please log in.");
      onSwitchToLogin();
    } catch (err) {
      console.error("Registration Error:", err);
      // Display error from backend if available
      setError(err.message || "Registration failed. Please try again.");
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 py-10 px-4">
      <Card className="w-full max-w-lg shadow-xl">
        <h1 className="mb-6 text-2xl font-bold text-center text-slate-900">Create Account</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full Name" required value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} />
          
          <Input label="Email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Password" type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            <Input label="Phone (Optional)" value={form.phone_number} onChange={e => setForm({...form, phone_number: e.target.value})} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
             <Input label="Age (Optional)" type="number" value={form.age} onChange={e => setForm({...form, age: e.target.value})} />
             <Input label="City (Optional)" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
          </div>

          <label className="flex flex-col text-sm font-medium text-slate-600">
            <span className="mb-1">Blood Group</span>
            <select className="rounded-xl border border-slate-200 bg-white px-4 py-2" value={form.blood_group} onChange={e => setForm({ ...form, blood_group: e.target.value })}>
              {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </label>

          {error && <p className="text-center text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-500">
            Already have an account? <button onClick={onSwitchToLogin} className="font-bold text-brand-red hover:underline">Log in</button>
        </p>
      </Card>
    </div>
  );
}