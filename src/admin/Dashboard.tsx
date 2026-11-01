import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLabs, createLab, deleteLab, calcProgress, getAuth, logout, STATUS_LABELS } from "../data/store";
import { Laboratory } from "../data/types";
import logoImg from "@/imports/I_want_it_sophisticated_and_professional.png";

const LOCATION_DATA: Record<string, Record<string, string[]>> = {
  "Region IX – Zamboanga Peninsula": { "Zamboanga del Norte": ["Dapitan City", "Dipolog City", "Sindangan"], "Zamboanga del Sur": ["Pagadian City", "Zamboanga City"], "Zamboanga Sibugay": ["Ipil", "Kabasalan"] },
  "Region X – Northern Mindanao": { "Bukidnon": ["Malaybalay City", "Valencia City"], "Camiguin": ["Mambajao"], "Lanao del Norte": ["Iligan City", "Tubod"], "Misamis Occidental": ["Oroquieta City", "Ozamiz City", "Tangub City", "Jimenez"], "Misamis Oriental": ["Cagayan de Oro City", "Gingoog City", "El Salvador City"] },
  "Region XI – Davao Region": { "Davao del Norte": ["Tagum City", "Panabo City"], "Davao del Sur": ["Davao City", "Digos City"], "Davao Oriental": ["Mati City"] },
  "Region XII – SOCCSKSARGEN": { "Cotabato (North Cotabato)": ["Kidapawan City"], "South Cotabato": ["General Santos City", "Koronadal City"], "Sultan Kudarat": ["Isulan", "Tacurong City"] },
  "Region XIII – CARAGA": { "Agusan del Norte": ["Butuan City", "Cabadbaran City"], "Surigao del Norte": ["Surigao City"], "Surigao del Sur": ["Tandag City", "Bislig City"] },
  "BARMM – Bangsamoro": { "Lanao del Sur": ["Marawi City"], "Maguindanao del Sur": ["Cotabato City"], "Basilan": ["Isabela City", "Lamitan City"] },
  "Other": { "Other Location": ["Other City/Municipality"] },
};

function Ico({ d, size = 18, className = "" }: { d: string | string[]; size?: number; className?: string }) {
  const arr = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {arr.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

const I = {
  plus: "M12 5v14M5 12h14",
  search: ["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z", "M21 21l-4.35-4.35"],
  flask: ["M8.5 2h7", "M8.5 2v5.5L4.5 17A2 2 0 0 0 6.38 20h11.24A2 2 0 0 0 19.5 17L15.5 7.5V2"],
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  home: ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  chevRight: "M9 18l6-6-6-6",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  trash: ["M3 6h18", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"],
  close: "M18 6 6 18M6 6l12 12",
  check: "M20 6 9 17l-5-5",
  mapPin: ["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z", "M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"],
  calendar: ["M8 2v4", "M16 2v4", "M3 10h18", "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z"],
  user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
};

const LAB_TYPES = ["Clinical Laboratory", "Diagnostic Laboratory", "Hospital Laboratory", "Standalone Laboratory", "Pathology Laboratory", "Other"];
const CLASSIFICATIONS = ["Level 1", "Level 2", "Level 3", "Primary", "Secondary", "Tertiary", "Other"];
const CONSULTANTS = ["Brian Amba", "LabLaunch Admin", "Other"];

function ProgressBar({ pct, size = "md" }: { pct: number; size?: "sm" | "md" }) {
  const h = size === "sm" ? "h-1.5" : "h-2.5";
  const color = pct >= 80 ? "bg-teal-500" : pct >= 50 ? "bg-blue-500" : pct >= 25 ? "bg-amber-500" : "bg-slate-300";
  return (
    <div className={`w-full bg-slate-100 rounded-full ${h} overflow-hidden`}>
      <div className={`${h} rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function StatusBadge({ status }: { status: Laboratory["status"] }) {
  const map = {
    active: "bg-teal-100 text-teal-700",
    on_hold: "bg-amber-100 text-amber-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-600",
  };
  const labels = { active: "Active", on_hold: "On Hold", completed: "Completed", cancelled: "Cancelled" };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[status]}`}>{labels[status]}</span>;
}

function currentStageName(lab: Laboratory): string {
  for (const stage of lab.stages) {
    const anyActive = stage.items.some(i => i.status !== "completed" && i.status !== "not_applicable");
    if (anyActive) return stage.name;
  }
  return lab.stages[lab.stages.length - 1].name;
}

/* ─── Add Lab Modal ─────────────────────────────────────────────── */
function AddLabModal({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: "", company: "", contactPerson: "", contactNumber: "", email: "",
    address: "", region: "", province: "", city: "", labType: "", classification: "",
    ownershipType: "Private", institutionalType: "Non-Institutional", facilityType: "New Facility",
    intendedServices: "", proposedHours: "", targetOpeningDate: "", consultant: "",
    projectNotes: "", status: "active" as const,
    clientId: "", selectedServices: [] as string[],
    startDate: new Date().toISOString().split("T")[0],
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const onRegion = (e: React.ChangeEvent<HTMLSelectElement>) => setForm(p => ({ ...p, region: e.target.value, province: "", city: "" }));
  const onProvince = (e: React.ChangeEvent<HTMLSelectElement>) => setForm(p => ({ ...p, province: e.target.value, city: "" }));

  const provinces = form.region ? Object.keys(LOCATION_DATA[form.region] || {}) : [];
  const cities = form.region && form.province ? LOCATION_DATA[form.region]?.[form.province] || [] : [];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    createLab(form);
    onSaved();
    onClose();
  };

  const f = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all disabled:bg-slate-50 disabled:cursor-not-allowed";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-[#0b1f3a]">Add New Laboratory</h2>
            <p className="text-slate-500 text-xs mt-0.5">Create a new laboratory project</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1"><Ico d={I.close} size={20} /></button>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest">Laboratory Information</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Laboratory Name *</label><input required className={f} value={form.name} onChange={set("name")} placeholder="e.g. ABC Diagnostic Laboratory" /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Company / Owner *</label><input required className={f} value={form.company} onChange={set("company")} placeholder="Company or owner name" /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Contact Person</label><input className={f} value={form.contactPerson} onChange={set("contactPerson")} placeholder="Contact person name" /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Contact Number</label><input className={f} value={form.contactNumber} onChange={set("contactNumber")} placeholder="0900-000-0000" /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Email Address</label><input type="email" className={f} value={form.email} onChange={set("email")} placeholder="lab@example.com" /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Laboratory Type *</label>
              <select required className={f} value={form.labType} onChange={set("labType")}>
                <option value="">Select type</option>
                {LAB_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2"><label className="block text-xs font-semibold text-slate-600 mb-1">Complete Address</label><input className={f} value={form.address} onChange={set("address")} placeholder="Street address" /></div>
          </div>

          <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest pt-2">Location</p>
          <div className="grid sm:grid-cols-3 gap-3">
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Region</label>
              <select className={f} value={form.region} onChange={onRegion}>
                <option value="">Select region</option>
                {Object.keys(LOCATION_DATA).map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Province</label>
              <select className={f} value={form.province} onChange={onProvince} disabled={!form.region}>
                <option value="">{form.region ? "Select province" : "Region first"}</option>
                {provinces.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">City / Municipality</label>
              <select className={f} value={form.city} onChange={set("city")} disabled={!form.province}>
                <option value="">{form.province ? "Select city" : "Province first"}</option>
                {cities.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <p className="text-xs font-semibold text-teal-600 uppercase tracking-widest pt-2">Project Details</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Proposed Classification</label>
              <select className={f} value={form.classification} onChange={set("classification")}>
                <option value="">Select classification</option>
                {CLASSIFICATIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Assigned Consultant</label>
              <select className={f} value={form.consultant} onChange={set("consultant")}>
                <option value="">Select consultant</option>
                {CONSULTANTS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Project Start Date</label><input type="date" className={f} value={form.startDate} onChange={set("startDate")} /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Target Opening Date</label><input type="date" className={f} value={form.targetOpeningDate} onChange={set("targetOpeningDate")} /></div>
            <div className="sm:col-span-2"><label className="block text-xs font-semibold text-slate-600 mb-1">Intended Services / Test Menu</label><textarea rows={2} className={f} value={form.intendedServices} onChange={set("intendedServices")} placeholder="e.g. Hematology, Clinical Chemistry, Urinalysis, Microbiology" /></div>
            <div className="sm:col-span-2"><label className="block text-xs font-semibold text-slate-600 mb-1">Project Notes</label><textarea rows={2} className={f} value={form.projectNotes} onChange={set("projectNotes")} placeholder="Additional notes about this project..." /></div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-lg text-sm hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">Save Laboratory</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Dashboard ─────────────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [labs, setLabs] = useState<Laboratory[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    if (!auth) navigate("/admin/login");
    else refresh();
  }, []);

  const refresh = () => setLabs(getLabs());

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  const filtered = labs.filter(l => {
    const q = search.toLowerCase();
    if (q && !l.name.toLowerCase().includes(q) && !l.company.toLowerCase().includes(q) && !l.city.toLowerCase().includes(q)) return false;
    if (filterStatus && l.status !== filterStatus) return false;
    if (filterType && l.labType !== filterType) return false;
    return true;
  });

  const stats = {
    total: labs.length,
    active: labs.filter(l => l.status === "active").length,
    application: labs.filter(l => calcProgress(l) < 20).length,
    setup: labs.filter(l => { const p = calcProgress(l); return p >= 20 && p < 70; }).length,
    inspection: labs.filter(l => { const p = calcProgress(l); return p >= 70 && p < 90; }).length,
    completed: labs.filter(l => calcProgress(l) >= 90 || l.status === "completed").length,
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Delete this laboratory project? This cannot be undone.")) {
      deleteLab(id);
      refresh();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      <header className="bg-[#0b1f3a] shadow-sm sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg overflow-hidden bg-[#f5f0e8]">
              <img src={logoImg} alt="LabLaunch" className="h-8 w-auto object-contain block" />
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-bold text-sm leading-none">LabLaunch Admin</div>
              <div className="text-slate-400 text-xs">Laboratory Management System</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="hidden sm:flex items-center gap-1.5 text-slate-400 hover:text-white text-xs transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10">
              <Ico d={I.home} size={14} /> Website
            </a>
            <span className="text-slate-500 text-xs hidden sm:block">|</span>
            <span className="text-slate-300 text-xs hidden sm:block">{auth?.name}</span>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 text-xs transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10">
              <Ico d={I.logout} size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0b1f3a]">Laboratory Projects</h1>
            <p className="text-slate-500 text-sm mt-0.5">{labs.length} projects under management</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors shadow-sm">
            <Ico d={I.plus} size={16} /> Add Laboratory
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {[
            { label: "Total Projects", value: stats.total, color: "text-[#0b1f3a]" },
            { label: "Active", value: stats.active, color: "text-teal-600" },
            { label: "Application Stage", value: stats.application, color: "text-violet-600" },
            { label: "Setup & Compliance", value: stats.setup, color: "text-blue-600" },
            { label: "Pre-Inspection", value: stats.inspection, color: "text-amber-600" },
            { label: "Completed", value: stats.completed, color: "text-emerald-600" },
          ].map(s => (
            <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-center">
              <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-slate-500 text-xs mt-0.5 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Ico d={I.search} size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, company, city..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-slate-700">
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={filterType} onChange={e => setFilterType(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white text-slate-700">
            <option value="">All Types</option>
            {LAB_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Lab Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Ico d={I.flask} size={28} className="text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">{search || filterStatus || filterType ? "No laboratories match your filters." : "No laboratory projects yet."}</p>
            {!search && !filterStatus && !filterType && (
              <button onClick={() => setShowAdd(true)} className="mt-4 text-teal-600 text-sm font-medium hover:underline">Add your first laboratory →</button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(lab => {
              const pct = calcProgress(lab);
              const stage = currentStageName(lab);
              return (
                <div key={lab.id} onClick={() => navigate(`/admin/lab/${lab.id}`)}
                  className="bg-white border border-slate-200 hover:border-teal-300 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md group">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 pr-2">
                      <h3 className="font-bold text-[#0b1f3a] text-base leading-tight group-hover:text-teal-700 transition-colors line-clamp-1">{lab.name}</h3>
                      <p className="text-slate-500 text-xs mt-0.5">{lab.company}</p>
                    </div>
                    <StatusBadge status={lab.status} />
                  </div>
                  <div className="space-y-1.5 mb-3 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5"><Ico d={I.mapPin} size={12} className="text-teal-500 flex-shrink-0" />{[lab.city, lab.province].filter(Boolean).join(", ") || lab.region}</div>
                    <div className="flex items-center gap-1.5"><Ico d={I.flask} size={12} className="text-teal-500 flex-shrink-0" />{lab.labType || "Laboratory"}</div>
                    {lab.consultant && <div className="flex items-center gap-1.5"><Ico d={I.user} size={12} className="text-teal-500 flex-shrink-0" />{lab.consultant}</div>}
                    <div className="flex items-center gap-1.5"><Ico d={I.calendar} size={12} className="text-teal-500 flex-shrink-0" />Updated {new Date(lab.updatedAt).toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" })}</div>
                  </div>
                  <div className="text-xs text-slate-500 mb-1.5 truncate">
                    <span className="font-medium text-slate-700">Stage: </span>{stage}
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">Overall Progress</span>
                    <span className="text-xs font-bold text-teal-700">{pct}%</span>
                  </div>
                  <ProgressBar pct={pct} />
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                    <span className="text-xs text-teal-600 font-medium group-hover:underline">View Project →</span>
                    <button onClick={e => handleDelete(e, lab.id)} className="text-slate-300 hover:text-red-400 transition-colors">
                      <Ico d={I.trash} size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {showAdd && <AddLabModal onClose={() => setShowAdd(false)} onSaved={refresh} />}
    </div>
  );
}
