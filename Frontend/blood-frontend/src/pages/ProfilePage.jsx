import { useState, useEffect } from "react";
import { getProfile, updateUserProfile } from "../services/api";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // Controls the Success Card
  
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    age: "",
    blood_group: "",
    city: ""
  });

  // 1. Fetch Data on Load
  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem("token");
      try {
        const data = await getProfile(token);
        setForm({
            full_name: data.full_name || "",
            email: data.email || "",
            phone_number: data.phone_number || "",
            age: data.age || "",
            blood_group: data.blood_group || "",
            city: data.city || ""
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  // 2. Handle Update
  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem("token");

    try {
      await updateUserProfile(token, form);
      setShowSuccess(true); // <--- SHOW MODAL INSTEAD OF ALERT
    } catch (err) {
      console.error(err);
      // Optional: You could add an error modal state here too
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <section className="mx-auto max-w-4xl p-6">
      <Card title="My Profile" description="Manage your personal information and contact details.">
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          
          <div className="grid gap-6 md:grid-cols-2">
            <Input 
                label="Full Name" 
                value={form.full_name} 
                onChange={e => setForm({...form, full_name: e.target.value})} 
            />
            <Input 
                label="Email (Read Only)" 
                value={form.email} 
                disabled 
                className="bg-slate-50 text-slate-500 cursor-not-allowed" 
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Input 
                label="Phone Number" 
                placeholder="0300..." 
                value={form.phone_number} 
                onChange={e => setForm({...form, phone_number: e.target.value})} 
            />
            <Input 
                label="City" 
                value={form.city} 
                onChange={e => setForm({...form, city: e.target.value})} 
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Input 
                label="Age" 
                type="number" 
                value={form.age} 
                onChange={e => setForm({...form, age: e.target.value})} 
            />
            
            <label className="flex flex-col text-sm font-medium text-slate-600">
                <span className="mb-1">Blood Group</span>
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
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={saving}>
                {saving ? "Saving Changes..." : "Save Profile"}
            </Button>
          </div>
        </form>
      </Card>

      {/* --- SUCCESS MODAL --- */}
      {showSuccess && (
        <Modal open={true} onClose={() => setShowSuccess(false)} title="Success">
            <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                    ✅
                </div>
                <h2 className="mb-2 text-xl font-bold text-slate-900">Profile Updated!</h2>
                <p className="text-slate-500">Your details have been saved successfully.</p>
                <div className="mt-6">
                    <Button onClick={() => setShowSuccess(false)}>OK, Thanks</Button>
                </div>
            </div>
        </Modal>
      )}
    </section>
  );
}