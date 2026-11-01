import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getClientAuth, clientLogout, getClientLabs, calcProgress, calcProgressDetail, getNotifications, markAllNotificationsRead } from "../data/store";
import { Laboratory } from "../data/types";
import LabWizard from "./LabWizard";
import logoImg from "@/imports/logo_symbol.png";

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
  flask: ["M8.5 2h7", "M8.5 2v5.5L4.5 17A2 2 0 0 0 6.38 20h11.24A2 2 0 0 0 19.5 17L15.5 7.5V2"],
  bell: ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  user: ["M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"],
  chevRight: "M9 18l6-6-6-6",
  home: ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  doc: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6"],
  clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 6v6l4 2"],
  check: "M20 6 9 17l-5-5",
};

function ProgressBar({ pct }: { pct: number }) {
  const color = pct >= 80 ? "bg-teal-500" : pct >= 50 ? "bg-blue-500" : pct >= 25 ? "bg-amber-500" : "bg-slate-300";
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <div className={`h-2 rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function LabCard({ lab, onClick }: { lab: Laboratory; onClick: () => void }) {
  const pct = calcProgress(lab);
  const { total, done } = calcProgressDetail(lab);
  const outstanding = total - done;
  const currentStage = lab.stages.find(s => s.active && s.items.some(i => i.status !== "completed" && i.status !== "not_applicable" && i.status !== "verified"));
  const statusMap: Record<string, string> = { active: "Active", on_hold: "On Hold", completed: "Completed", cancelled: "Cancelled" };
  const statusColor: Record<string, string> = { active: "bg-teal-100 text-teal-700", on_hold: "bg-amber-100 text-amber-700", completed: "bg-blue-100 text-blue-700", cancelled: "bg-slate-100 text-slate-500" };

  return (
    <div onClick={onClick} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-teal-300 transition-all cursor-pointer group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-3">
          <h3 className="font-bold text-slate-900 text-base truncate group-hover:text-teal-700 transition-colors">{lab.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{lab.company} · {lab.city}</p>
        </div>
        <span className={`shrink-0 text-xs font-semibold px-2 py-1 rounded-full ${statusColor[lab.status]}`}>{statusMap[lab.status]}</span>
      </div>
      <div className="mb-3">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Overall Progress</span>
          <span className="font-bold text-slate-700">{pct}%</span>
        </div>
        <ProgressBar pct={pct} />
        <p className="text-xs text-slate-500 mt-1">{done} of {total} requirements completed</p>
      </div>
      <div className="flex items-center justify-between text-xs">
        <div className="flex gap-3">
          {outstanding > 0 && (
            <span className="inline-flex items-center gap-1 text-orange-600 font-semibold">
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />{outstanding} outstanding
            </span>
          )}
          {currentStage && <span className="text-slate-500 truncate max-w-[160px]">Stage: {currentStage.name.split(" — ")[0]}</span>}
        </div>
        <span className="text-teal-600 font-semibold flex items-center gap-1">Open <Ico d={I.chevRight} size={13} /></span>
      </div>
    </div>
  );
}

export default function ClientDashboard() {
  const navigate = useNavigate();
  const client = getClientAuth();
  const [labs, setLabs] = useState<Laboratory[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState<ReturnType<typeof getNotifications>>([]);

  useEffect(() => {
    if (!client) return;
    const clientLabs = getClientLabs(client.id);
    setLabs(clientLabs);
    const n = getNotifications(client.id, "client");
    setNotifs(n);
    setNotifCount(n.filter(x => !x.read).length);
  }, [showWizard]);

  const handleLogout = () => { clientLogout(); navigate("/portal/login"); };

  const handleMarkRead = () => {
    if (!client) return;
    markAllNotificationsRead(client.id);
    setNotifCount(0);
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (!client) { navigate("/portal/login"); return null; }

  const totalActive = labs.filter(l => l.status === "active").length;
  const totalCompleted = labs.filter(l => l.status === "completed").length;
  const avgProgress = labs.length ? Math.round(labs.reduce((s, l) => s + calcProgress(l), 0) / labs.length) : 0;
  const totalOutstanding = labs.reduce((s, l) => {
    const { total, done } = calcProgressDetail(l);
    return s + (total - done);
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topbar */}
      <header className="bg-[#0b1f3a] sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg overflow-hidden bg-[#f5f0e8]">
              <img src={logoImg} alt="LabLaunch" className="h-9 w-auto object-contain block" />
            </div>
            <div className="hidden sm:block">
              <p className="text-white font-bold text-sm leading-tight">LabLaunch</p>
              <p className="text-slate-400 text-xs">Client Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setShowNotifs(!showNotifs)}
                className="relative p-2 text-slate-400 hover:text-white transition-colors">
                <Ico d={I.bell} size={20} />
                {notifCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{notifCount}</span>
                )}
              </button>
              {showNotifs && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <p className="font-semibold text-slate-800 text-sm">Notifications</p>
                    {notifCount > 0 && <button onClick={handleMarkRead} className="text-xs text-teal-600 hover:underline">Mark all read</button>}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                    {notifs.length === 0 ? (
                      <p className="px-4 py-6 text-sm text-slate-400 text-center">No notifications yet.</p>
                    ) : notifs.map(n => (
                      <div key={n.id} className={`px-4 py-3 ${!n.read ? "bg-teal-50" : ""}`}>
                        <p className="text-xs font-semibold text-slate-800">{n.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{new Date(n.timestamp).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link to="/portal/profile" className="flex items-center gap-2 px-3 py-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-sm transition-all">
              <Ico d={I.user} size={16} /><span className="hidden sm:inline">{client.name.split(" ")[0]}</span>
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-white text-sm transition-colors">
              <Ico d={I.logout} size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Welcome back, {client.name.split(" ")[0]}.</h1>
            <p className="text-slate-500 text-sm mt-1">{client.company} · {client.position}</p>
          </div>
          <button onClick={() => setShowWizard(true)}
            className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm">
            <Ico d={I.plus} size={16} /> Add Laboratory
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Projects", value: labs.length, icon: I.flask, color: "text-teal-600 bg-teal-50" },
            { label: "Active Projects", value: totalActive, icon: I.clock, color: "text-blue-600 bg-blue-50" },
            { label: "Avg. Progress", value: `${avgProgress}%`, icon: I.check, color: "text-amber-600 bg-amber-50" },
            { label: "Outstanding", value: totalOutstanding, icon: I.doc, color: "text-orange-600 bg-orange-50" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                <Ico d={s.icon} size={18} />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Labs */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">My Laboratories</h2>
          {totalCompleted > 0 && <span className="text-xs text-slate-500">{totalCompleted} completed</span>}
        </div>

        {labs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 border-dashed p-12 text-center">
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Ico d={I.flask} size={24} className="text-teal-600" />
            </div>
            <h3 className="font-bold text-slate-800 mb-2">No laboratory projects yet</h3>
            <p className="text-sm text-slate-500 mb-5 max-w-sm mx-auto">Start your first laboratory compliance project by clicking "Add Laboratory" above.</p>
            <button onClick={() => setShowWizard(true)}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors">
              <Ico d={I.plus} size={16} /> Add Your First Laboratory
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {labs.map(lab => (
              <LabCard key={lab.id} lab={lab} onClick={() => navigate(`/portal/lab/${lab.id}`)} />
            ))}
          </div>
        )}
      </div>

      {showWizard && <LabWizard onClose={() => setShowWizard(false)} />}
    </div>
  );
}
