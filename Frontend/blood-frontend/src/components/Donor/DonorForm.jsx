import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createDonorProfile } from "../../services/api";
import Card from "../ui/Card";
import Input from "../ui/Input";
import Button from "../ui/Button";

const bloodGroups = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];

export default function DonorForm() {
  const [form, setForm] = useState({
    blood_group: "",
    city: "",
    age: "",
    last_donation_date: ""
  });

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  function updateField(name, value) {
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  }

  function validateCurrentStep() {
    const nextErrors = {};

    if (step === 1) {
      if (!form.city.trim()) nextErrors.city = "City is required.";
      if (!form.age) nextErrors.age = "Age is required.";
      if (form.age && (Number(form.age) < 18 || Number(form.age) > 65)) {
        nextErrors.age = "Age should be between 18 and 65.";
      }
    }

    if (step === 2) {
      if (!form.blood_group) nextErrors.blood_group = "Please select a blood group.";
      if (!form.last_donation_date) {
        nextErrors.last_donation_date = "Last donation date is required (or pick today's date).";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const result = await createDonorProfile(token, form);
      console.log(result);
      alert("Donor profile created");
    } finally {
      setSubmitting(false);
    }
  }

  function handleNext() {
    if (!validateCurrentStep()) return;
    setStep(prev => prev + 1);
  }

  function handleBack() {
    setStep(prev => Math.max(1, prev - 1));
  }

  return (
    <div className="flex items-center justify-center px-4 py-10">
      <Card
        title="Become a Lifesaving Donor"
        description="Share a few details so we can match you safely and quickly with patients in need."
        className="w-full max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[0.75rem] ${
                  step >= 1 ? "bg-brand-red text-white" : "bg-slate-100 text-slate-400"
                }`}
              >
                1
              </span>
              <span className={step >= 1 ? "text-slate-900" : ""}>Basic Details</span>
            </div>
            <div className="h-px flex-1 bg-slate-200 mx-3" />
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-[0.75rem] ${
                  step >= 2 ? "bg-brand-red text-white" : "bg-slate-100 text-slate-400"
                }`}
              >
                2
              </span>
              <span className={step >= 2 ? "text-slate-900" : ""}>Donation Profile</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
                className="grid gap-4 md:grid-cols-2"
              >
                <Input
                  label="City"
                  placeholder="e.g. Lahore"
                  value={form.city}
                  onChange={e => updateField("city", e.target.value)}
                />
                <div>
                  <Input
                    label="Age"
                    type="number"
                    min="18"
                    max="65"
                    placeholder="18 – 65"
                    value={form.age}
                    onChange={e => updateField("age", e.target.value)}
                  />
                  {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="flex flex-col text-sm font-medium text-slate-600">
                      <span className="mb-1">Blood Group</span>
                      <select
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-950 outline-none transition-all duration-200 focus:border-brand-red focus:ring-2 focus:ring-brand-light"
                        value={form.blood_group}
                        onChange={e => updateField("blood_group", e.target.value)}
                      >
                        <option value="">Select blood group</option>
                        {bloodGroups.map(group => (
                          <option key={group} value={group}>
                            {group}
                          </option>
                        ))}
                      </select>
                    </label>
                    {errors.blood_group && (
                      <p className="mt-1 text-xs text-red-500">{errors.blood_group}</p>
                    )}
                  </div>

                  <div>
                    <Input
                      label="Last Donation Date"
                      type="date"
                      value={form.last_donation_date}
                      onChange={e => updateField("last_donation_date", e.target.value)}
                    />
                    {errors.last_donation_date && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.last_donation_date}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  We use this information only to ensure your safety and to match you with the
                  right patients. Your details are protected and never shared without consent.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between pt-2">
            <Button
              type="button"
              variant="subtle"
              className="text-xs"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>

            {step === 1 && (
              <Button type="button" onClick={handleNext}>
                Continue
              </Button>
            )}

            {step === 2 && (
              <Button type="submit" disabled={submitting}>
                {submitting ? "Saving..." : "Save Donor Profile"}
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
