import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar
} from "recharts";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import DonorDashboard from "../components/Donor/DonorDashboard";
import RequestForm from "../components/Recipient/RequestForm";
import LogDonationForm from "../components/Donor/LogDonationForm"; 
import ProfilePage from "./ProfilePage";

import { getProfile, getDashboardStats, getAllRequests } from "../services/api";

export default function AdminDashboard({ onLogout }) {
  // --- STATE ---
  const [openDonationModal, setOpenDonationModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null); // Controls the Success Card
  
  const [activeView, setActiveView] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total_donors: 0, pending_requests: 0, recent_donations_count: 0, stock_levels: [], recent_activity: [] });
  const [requestsList, setRequestsList] = useState([]);

  // --- DATA LOADING (Reused) ---
  async function loadDashboardData() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const [profileData, statsData, requestsData] = await Promise.all([
            getProfile(token),
            getDashboardStats(token),
            getAllRequests(token)
        ]);

        setUser(profileData);
        setStats(statsData);
        setRequestsList(requestsData);
    } catch (err) {
        console.error("Dashboard Load Error:", err);
    } finally {
        setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, [activeView]);

  // --- HANDLERS ---
  function handleDonationSuccess() {
    setOpenDonationModal(false); // Close Form
    loadDashboardData();         // Refresh Data (No Reload!)
    setSuccessMessage("Donation logged successfully! Your contribution saves lives. ❤️"); // Show Card
  }

  function handleRequestSuccess() {
    loadDashboardData();         // Refresh Data
    setSuccessMessage("Request posted successfully! We will notify donors nearby. 🩸"); // Show Card
  }

  const filteredRequests = requestsList.filter(r => 
    r.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.blood_group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const metricCards = [
    { label: "Total Donors", value: stats.total_donors, change: "Registered Users" },
    { label: "Pending Requests", value: stats.pending_requests, change: "People in Need" }, 
    { label: "Available Blood Units", value: stats.stock_levels.reduce((a,b)=>a+b.units,0), change: "Total Capacity" },
    { label: "Recent Donations", value: stats.recent_donations_count, change: "Last 30 Days" }
  ];

  const chartData = stats.stock_levels.length > 0 ? stats.stock_levels : [{group: "No Data", units: 0}];

  function renderContent() {
    if (activeView === "Donor List") {
        return <section className="p-6"><Card><DonorDashboard searchTerm={searchTerm} /></Card></section>;
    }

    if (activeView === "Profile") return <ProfilePage />;
    
    if (activeView === "Blood Stock") {
      return (
        <section className="space-y-6 px-6 py-8">
          <h1 className="text-3xl font-bold">Live Blood Stock</h1>
          <p className="text-slate-500">Real-time inventory based on registered donors.</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
             {stats.stock_levels.map((stock) => (
                <div key={stock.group} className="flex flex-col items-center justify-center rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl font-bold text-brand-red">
                        {stock.group}
                    </div>
                    <p className="mt-4 text-3xl font-bold text-slate-900">{stock.units}</p>
                    <p className="text-xs text-slate-400">Available Donors</p>
                </div>
             ))}
          </div>
          <Card title="Inventory Distribution">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="group" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="units" fill="#D61F26" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>
      );
    }

    if (activeView === "Requests") {
        return (
            <section className="space-y-6 px-6 py-8">
              <h1 className="text-3xl font-bold">Blood Requests (People in Need)</h1>
              <div className="grid gap-6 lg:grid-cols-2">
                <Card title="Create New Request">
                    {/* Pass the Success Handler */}
                    <RequestForm onSuccess={handleRequestSuccess} />
                </Card>
                <Card title="Current Needs List">
                  <div className="space-y-4 max-h-[500px] overflow-y-auto">
                    {filteredRequests.length > 0 ? filteredRequests.map(req => (
                        <div key={req.id} className="flex items-center justify-between border-b pb-3">
                            <div>
                                <p className="font-bold text-slate-900">{req.patient_name}</p>
                                <p className="text-sm text-slate-500">{req.city}</p>
                            </div>
                            <div className="text-right">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${req.urgency === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {req.blood_group} ({req.urgency})
                                </span>
                                <p className="text-xs text-slate-400 mt-1">{req.created_at}</p>
                            </div>
                        </div>
                    )) : <p className="text-slate-500">No active requests found.</p>}
                  </div>
                </Card>
              </div>
            </section>
        );
    }

    return (
      <section className="space-y-8 px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-slate-400">Overview</p>
            <h1 className="text-3xl font-bold text-slate-900">
                Welcome, {user ? user.full_name.split(" ")[0] : "User"}
            </h1>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setOpenDonationModal(true)}>Log Donation</Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {metricCards.map(card => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="space-y-2">
                <p className="text-sm font-semibold text-slate-400">{card.label}</p>
                <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                <p className="text-xs text-brand-dark">{card.change}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card title="Donor Distribution" className="lg:col-span-2">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="group" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="units" fill="#99151A" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Recent Activity">
            <div className="space-y-4">
              {stats.recent_activity.map((act, i) => (
                  <div key={i} className="flex justify-between border-b pb-2">
                    <div>
                        <p className="font-semibold text-sm">{act.donor}</p>
                        <p className="text-xs text-slate-500">{act.city}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-brand-red font-bold text-sm">{act.group}</span>
                        <p className="text-xs text-slate-400">{act.time}</p>
                    </div>
                  </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    );
  }

  if (loading) return <div className="flex h-screen items-center justify-center">Loading PulseCare...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-950">
      <div className="flex">
        <Sidebar active={activeView} onSelect={setActiveView} onLogout={onLogout} />
        <main className="flex-1">
          <Navbar 
            user={user} 
            onNewRequest={() => setActiveView("Requests")} 
            onSearch={setSearchTerm}
            onLogout={onLogout}
            onOpenProfile={() => setActiveView("Profile")} 
          />
          {renderContent()}
        </main>
      </div>

       {/* LOG DONATION MODAL */}
       <Modal open={openDonationModal} onClose={() => setOpenDonationModal(false)} title="Log New Donation">
        <LogDonationForm 
            onClose={() => setOpenDonationModal(false)} 
            onSuccess={handleDonationSuccess} 
        />
      </Modal>

      {/* SUCCESS MESSAGE MODAL (The Nice Card!) */}
      {successMessage && (
        <Modal open={true} onClose={() => setSuccessMessage(null)} title="Success">
            <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                    ✅
                </div>
                <h2 className="mb-2 text-xl font-bold text-slate-900">Success!</h2>
                <p className="text-slate-500">{successMessage}</p>
                <div className="mt-6">
                    <Button onClick={() => setSuccessMessage(null)}>Awesome, Continue</Button>
                </div>
            </div>
        </Modal>
      )}
    </div>
  );
}