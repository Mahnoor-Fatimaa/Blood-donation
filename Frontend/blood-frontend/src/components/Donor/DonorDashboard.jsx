import { useState, useEffect } from "react";
import { getDonors } from "../../services/api";
import Modal from "../ui/Modal"; 
import Button from "../ui/Button"; // Assuming you have this standard button component

export default function DonorDashboard({ searchTerm = "" }) {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDonor, setSelectedDonor] = useState(null); // Track which donor is clicked

  useEffect(() => {
    async function loadDonors() {
      const token = localStorage.getItem("token");
      try {
        const data = await getDonors(token);
        setDonors(data);
      } catch (err) {
        console.error("Failed to load donors", err);
      } finally {
        setLoading(false);
      }
    }
    loadDonors();
  }, []);

  const filteredDonors = donors.filter((d) => {
    const search = searchTerm.toLowerCase();
    return (
      d.full_name.toLowerCase().includes(search) ||
      d.city.toLowerCase().includes(search) ||
      d.blood_group.toLowerCase().includes(search)
    );
  });

  if (loading) return <div className="p-4 text-center text-slate-500">Loading directory...</div>;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-700">Registered Donors</h2>
          <span className="text-xs font-medium text-slate-400">
            {filteredDonors.length} found
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDonors.map((donor) => (
            <div
              key={donor.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:border-brand-light hover:shadow-md"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{donor.full_name}</h3>
                  <p className="text-xs text-slate-500">{donor.city}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-brand-red">
                  {donor.blood_group}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                  <div className="text-xs">
                      <p className="text-slate-400">Age</p>
                      <p className="font-medium text-slate-700">{donor.age} yrs</p>
                  </div>
                  <div className="text-xs text-right">
                      <p className="text-slate-400">Last Donation</p>
                      <p className="font-medium text-slate-700">
                          {donor.last_donation_date || "Never"}
                      </p>
                  </div>
              </div>
              
              {/* BUTTON: Opens the Modal instead of Alert */}
              <button 
                onClick={() => setSelectedDonor(donor)}
                className="mt-4 w-full rounded-xl bg-slate-900 py-2 text-xs font-semibold text-white transition hover:bg-brand-red active:scale-95"
              >
                Contact Donor
              </button>
            </div>
          ))}
        </div>

        {filteredDonors.length === 0 && (
          <div className="py-10 text-center text-slate-400">
            No donors found matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* --- CONTACT MODAL --- */}
      {selectedDonor && (
        <Modal 
            open={true} 
            onClose={() => setSelectedDonor(null)} 
            title="Donor Contact Details"
        >
            <div className="space-y-6 p-2">
                {/* Header Section */}
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-light text-2xl font-bold text-brand-red">
                        {selectedDonor.blood_group}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">{selectedDonor.full_name}</h2>
                        <p className="text-sm text-slate-500">{selectedDonor.city}</p>
                    </div>
                </div>

                {/* Contact Info Rows */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                        <div>
                            <p className="text-xs font-medium text-slate-400">Phone Number</p>
                            <p className="font-semibold text-slate-900">{selectedDonor.phone_number || "Not Provided"}</p>
                        </div>
                        {selectedDonor.phone_number && (
                            <a href={`tel:${selectedDonor.phone_number}`} className="rounded-lg bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700 hover:bg-green-200">
                                📞 Call
                            </a>
                        )}
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
                        <div>
                            <p className="text-xs font-medium text-slate-400">Email Address</p>
                            <p className="font-semibold text-slate-900">{selectedDonor.email}</p>
                        </div>
                        <a href={`mailto:${selectedDonor.email}`} className="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-200">
                            ✉️ Email
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end pt-2">
                    <Button variant="secondary" onClick={() => setSelectedDonor(null)}>
                        Close
                    </Button>
                </div>
            </div>
        </Modal>
      )}
    </>
  );
}