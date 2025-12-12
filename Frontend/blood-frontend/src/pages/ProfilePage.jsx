import { useState, useEffect } from "react";
import { getProfile, updateUserProfile } from "../services/api";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    age: "",
    blood_group: "",
    city: "",
    role: "",
  });

  // 1. Fetch current details on load
  useEffect(() => {
    async function loadData() {
      const token = localStorage.getItem("token");
      try {
        const user = await getProfile(token);
        // Fill form with existing data (handle nulls with "")
        setForm({
          full_name: user.full_name || "",
          email: user.email || "",
          phone_number: user.phone_number || "",
          age: user.age || "",
          blood_group: user.blood_group || "",
          city: user.city || "",
          role: user.role || "donor"
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 2. Handle Update
  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    // Convert Age to number for backend
    const payload = { ...form };
    if (payload.age) payload.age = parseInt(payload.age);

    try {
      await updateUserProfile(token, payload);
      alert("Profile updated successfully! ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  }

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500">Manage your personal and donor details.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Input 
              label="Full Name" 
              value={form.full_name} 
              onChange={e => setForm({...form, full_name: e.target.value})} 
            />
            <div className="flex flex-col gap-1">
               <label className="text-sm font-medium text-slate-600">Email (Cannot change)</label>
               <input 
                 disabled 
                 value={form.email} 
                 className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-2 text-slate-500"
               />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Input 
              label="Phone Number" 
              value={form.phone_number} 
              onChange={e => setForm({...form, phone_number: e.target.value})} 
            />
            <Input 
              label="Age" 
              type="number"
              value={form.age} 
              onChange={e => setForm({...form, age: e.target.value})} 
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="flex flex-col text-sm font-medium text-slate-600">
                <span className="mb-1">Blood Group</span>
                <select
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-light"
                  value={form.blood_group}
                  onChange={e => setForm({ ...form, blood_group: e.target.value })}
                >
                  <option value="">Select Group</option>
                  {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
            </label>

            <Input 
              label="City" 
              value={form.city} 
              onChange={e => setForm({...form, city: e.target.value})} 
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button size="lg" type="submit">Save Changes</Button>
          </div>
        </form>
      </Card>
    </section>
  );
}