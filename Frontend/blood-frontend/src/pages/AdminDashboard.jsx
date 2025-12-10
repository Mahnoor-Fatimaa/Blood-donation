import { useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import DonorDashboard from "../components/Donor/DonorDashboard";
import RecipientDashboard from "../components/Recipient/RecipientDashboard";
import RequestForm from "../components/Recipient/RequestForm";

const metricCards = [
  { label: "Total Donors", value: "2,458", change: "+12% vs last month" },
  { label: "Pending Requests", value: "134", change: "18 urgent cases" },
  { label: "Available Blood Units", value: "782", change: "Across 8 blood banks" },
  { label: "Recent Donations", value: "56", change: "Last 24 hours" }
];

const donationTrend = [
  { day: "Mon", units: 68 },
  { day: "Tue", units: 52 },
  { day: "Wed", units: 75 },
  { day: "Thu", units: 61 },
  { day: "Fri", units: 88 },
  { day: "Sat", units: 95 },
  { day: "Sun", units: 70 }
];

const stockLevels = [
  { group: "O+", units: 210 },
  { group: "A+", units: 165 },
  { group: "B+", units: 140 },
  { group: "AB+", units: 80 },
  { group: "O-", units: 65 },
  { group: "A-", units: 52 }
];

const recentDonations = [
  { donor: "Ali Raza", group: "O+", city: "Lahore", time: "12 min ago" },
  { donor: "Sana Tariq", group: "A-", city: "Karachi", time: "22 min ago" },
  { donor: "Hamza Shah", group: "B+", city: "Islamabad", time: "45 min ago" },
  { donor: "Zara Khan", group: "O-", city: "Peshawar", time: "1 hr ago" }
];

const urgentRequests = [
  { patient: "Fatima Ali", hospital: "City Care", need: "O-", status: "Matching" },
  { patient: "Bilal Ahmed", hospital: "Hope Clinic", need: "A+", status: "Searching" },
  { patient: "Noor Hassan", hospital: "Metro Hospital", need: "B+", status: "Verifying" }
];

export default function AdminDashboard() {
  const [openModal, setOpenModal] = useState(false);
  const [activeView, setActiveView] = useState("Dashboard");

  function handleExportStats() {
    const data = { metricCards, donationTrend, stockLevels, recentDonations, urgentRequests };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blood-dashboard-stats.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function renderContent() {
    if (activeView === "Donor List") {
      return (
        <section className="space-y-6 px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-widest text-slate-400">Directory</p>
              <h1 className="text-3xl font-bold text-slate-900">Donor List</h1>
              <p className="text-sm text-slate-500">
                Browse and filter registered donors across your network.
              </p>
            </div>
          </div>

          <Card>
            <DonorDashboard />
          </Card>
        </section>
      );
    }

    if (activeView === "Requests") {
      return (
        <section className="space-y-6 px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-widest text-slate-400">Cases</p>
              <h1 className="text-3xl font-bold text-slate-900">Blood Requests</h1>
              <p className="text-sm text-slate-500">
                Post new requests and monitor urgent cases in one place.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Create New Request">
              <RequestForm />
            </Card>
            <Card title="Urgent Requests" description="Prioritized cases from partner hospitals.">
              <div className="space-y-4">
                {urgentRequests.map(request => (
                  <div
                    key={request.patient}
                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{request.patient}</p>
                      <p className="text-sm text-slate-500">{request.hospital}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark">
                        {request.need}
                      </span>
                      <span className="text-xs text-slate-400">{request.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>
      );
    }

    if (activeView === "Blood Stock") {
      return (
        <section className="space-y-6 px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-widest text-slate-400">Inventory</p>
              <h1 className="text-3xl font-bold text-slate-900">Blood Stock</h1>
              <p className="text-sm text-slate-500">
                Visualize available units by blood group across storage centers.
              </p>
            </div>
          </div>

          <Card title="Blood Stock Levels" description="Unit distribution by blood type.">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockLevels}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="group" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="units" fill="#99151A" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>
      );
    }

    if (activeView === "Analytics") {
      return (
        <section className="space-y-6 px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-widest text-slate-400">Insights</p>
              <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
              <p className="text-sm text-slate-500">
                Track donation trends and stock movement over time.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card
              title="Weekly Donation Trend"
              description="Live tracking of donation inflow versus baseline."
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={donationTrend}>
                    <defs>
                      <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D61F26" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#D61F26" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="units"
                      stroke="#D61F26"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorUnits)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card title="Recent Donations" description="Latest verified donor activity.">
              <div className="space-y-4">
                <RecipientDashboard />
                {recentDonations.map(donation => (
                  <div
                    key={donation.donor}
                    className="flex items-center justify-between rounded-2xl border border-transparent bg-white px-4 py-3 transition hover:border-brand-light hover:bg-brand-light/40"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{donation.donor}</p>
                      <p className="text-sm text-slate-500">{donation.city}</p>
                    </div>
                    <div className="text-right">
                      <span className="mr-3 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {donation.group}
                      </span>
                      <p className="text-xs text-slate-400">{donation.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>
      );
    }

    if (activeView === "Settings") {
      return (
        <section className="space-y-6 px-6 py-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-widest text-slate-400">Configuration</p>
              <h1 className="text-3xl font-bold text-slate-900">Admin Settings</h1>
              <p className="text-sm text-slate-500">
                Manage notification preferences and organization details.
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card title="Notification Preferences">
              <div className="space-y-3 text-sm text-slate-600">
                <label className="flex items-center justify-between">
                  <span>Urgent request alerts</span>
                  <input type="checkbox" className="h-4 w-7 rounded-full" defaultChecked />
                </label>
                <label className="flex items-center justify-between">
                  <span>Daily summary email</span>
                  <input type="checkbox" className="h-4 w-7 rounded-full" defaultChecked />
                </label>
                <label className="flex items-center justify-between">
                  <span>Weekly analytics report</span>
                  <input type="checkbox" className="h-4 w-7 rounded-full" />
                </label>
              </div>
            </Card>

            <Card title="Organization Profile">
              <div className="space-y-3 text-sm text-slate-600">
                <Input label="Organization name" placeholder="PulseCare Network" />
                <Input label="Primary hospital" placeholder="City Care Hospital" />
                <Input label="Contact email" placeholder="support@example.com" />
                <div className="flex justify-end pt-1">
                  <Button size="md">Save changes</Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      );
    }

    // Default dashboard overview
    return (
      <section className="space-y-8 px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-slate-400">Overview</p>
            <h1 className="text-3xl font-bold text-slate-900">Admin Command Center</h1>
            <p className="text-sm text-slate-500">
              Monitor donors, requests and stock levels in real-time.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleExportStats}>
              Export Stats
            </Button>
            <Button onClick={() => setOpenModal(true)}>Log Donation</Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {metricCards.map(card => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="space-y-2">
                <p className="text-sm font-semibold text-slate-400">{card.label}</p>
                <p className="text-3xl font-bold text-slate-900">{card.value}</p>
                <p className="text-xs text-brand-dark">{card.change}</p>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card
            title="Weekly Donation Trend"
            description="Live tracking of donation inflow versus baseline."
            className="lg:col-span-2"
          >
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={donationTrend}>
                  <defs>
                    <linearGradient id="colorUnits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D61F26" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#D61F26" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="units"
                    stroke="#D61F26"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorUnits)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Blood Stock Levels" description="Unit distribution by blood type.">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stockLevels}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="group" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="units" fill="#99151A" radius={[12, 12, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Urgent Requests" description="Prioritized cases from partner hospitals.">
            <div className="space-y-4">
              {urgentRequests.map(request => (
                <div
                  key={request.patient}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{request.patient}</p>
                    <p className="text-sm text-slate-500">{request.hospital}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark">
                      {request.need}
                    </span>
                    <span className="text-xs text-slate-400">{request.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Recent Donations" description="Latest verified donor activity.">
            <div className="space-y-4">
              {recentDonations.map(donation => (
                <div
                  key={donation.donor}
                  className="flex items-center justify-between rounded-2xl border border-transparent bg-white px-4 py-3 transition hover:border-brand-light hover:bg-brand-light/40"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{donation.donor}</p>
                    <p className="text-sm text-slate-500">{donation.city}</p>
                  </div>
                  <div className="text-right">
                    <span className="mr-3 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {donation.group}
                    </span>
                    <p className="text-xs text-slate-400">{donation.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-950">
      <div className="flex">
        <Sidebar active={activeView} onSelect={setActiveView} />
        <main className="flex-1">
          <Navbar onNewRequest={() => setActiveView("Requests")} />
          {renderContent()}
        </main>
      </div>

      <Modal open={openModal} onClose={() => setOpenModal(false)} title="Log New Donation">
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Donor Name" placeholder="Enter full name" />
            <Input label="Blood Group" placeholder="O+, A-, ..." />
          </div>
          <Input label="Hospital / Camp" placeholder="Where was the donation collected?" />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpenModal(false)}>Save Donation</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

