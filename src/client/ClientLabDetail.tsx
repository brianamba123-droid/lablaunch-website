import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getClientAuth, getClientProject, saveClientProject,
  updateClientItemStatus, addClientDocument, updateClientDocStatus,
  markNotificationsRead, calcClientProgress, getOutstandingCount,
  getCurrentStageName, updateClientServices,
} from "../data/clientStore";
import { ClientProject, ClientDocument } from "../data/clientTypes";
import { ItemStatus } from "../data/types";
import { SERVICE_GROUPS, getServiceLabel } from "../data/serviceModules";
import logoImg from "@/imports/logo_symbol.png";

function Ico({ d, size = 18, className = "" }: { d: string | string[]; size?: number; className?: string }) {
  const arr = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {arr.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}
const I = {
  arrowLeft: "M19 12H5M12 19l-7-7 7-7",
  check:     "M20 6 9 17l-5-5",
  upload:    ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M17 8l-5-5-5 5", "M12 3v12"],
  file:      ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6"],
  activity:  ["M22 12h-4l-3 9L9 3l-3 9H2"],
  list:      ["M8 6h13", "M8 12h13", "M8 18h13", "M3 6h.01", "M3 12h.01", "M3 18h.01"],
  chevDown:  "M6 9l6 6 6-6",
  chevUp:    "M18 15l-6-6-6 6",
  bell:      ["M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9", "M13.73 21a2 2 0 0 1-3.46 0"],
  info:      ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 8v4", "M12 16h.01"],
  edit:      ["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"],
  home:      ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  logout:    ["M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", "M16 17l5-5-5-5", "M21 12H9"],
  x:         "M18 6 6 18M6 6l12 12",
  settings:  ["M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z", "M12 8v4", "M12 16h.01"],
};

const STATUS_OPTIONS: { value: ItemStatus; label: string; color: string }[] = [
  { value: "not_started",   label: "Not Started",    color: "bg-slate-100 text-slate-600" },
  { value: "in_progress",   label: "In Progress",    color: "bg-blue-100 text-blue-700" },
  { value: "submitted",     label: "Submitted",      color: "bg-violet-100 text-violet-700" },
  { value: "completed",     label: "Completed",      color: "bg-teal-100 text-teal-700" },
  { value: "not_applicable","label": "N/A",           color: "bg-slate-100 text-slate-400" },
];

const REQTYPE_BADGE: Record<string, { label: string; cls: string }> = {
  mandatory_doh:          { label: "DOH-MANDATORY",   cls: "bg-red-100 text-red-700" },
  mandatory_other:        { label: "OTHER GOV",        cls: "bg-orange-100 text-orange-700" },
  mandatory_accreditation:{ label: "ACCREDITATION",   cls: "bg-purple-100 text-purple-700" },
  facility_policy:        { label: "FACILITY POLICY",  cls: "bg-blue-100 text-blue-700" },
  good_practice:          { label: "GOOD PRACTICE",    cls: "bg-green-100 text-green-700" },
  conditional:            { label: "CONDITIONAL",      cls: "bg-amber-100 text-amber-700" },
};

const DOC_STATUS_STYLE: Record<string, string> = {
  pending:          "bg-slate-100 text-slate-600",
  under_review:     "bg-amber-100 text-amber-700",
  approved:         "bg-teal-100 text-teal-700",
  revision_required:"bg-red-100 text-red-700",
};
const DOC_STATUS_LABEL: Record<string, string> = {
  pending: "Pending", under_review: "Under Review", approved: "Approved", revision_required: "Revision Required",
};

type Tab = "overview" | "checklist" | "documents" | "activity" | "services";

export default function ClientLabDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = getClientAuth();
  const [project, setProject] = useState<ClientProject | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
  const [showUpload, setShowUpload] = useState(false);
  const [showEditServices, setShowEditServices] = useState(false);

  const reload = useCallback(() => {
    if (id) setProject(getClientProject(id) || null);
  }, [id]);

  useEffect(() => { reload(); }, [reload]);

  useEffect(() => {
    if (id) markNotificationsRead(id);
  }, [id]);

  const handleLogout = () => { navigate("/client/login"); };

  if (!project) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <p className="text-slate-500">Project not found.</p>
    </div>
  );

  const progress = calcClientProgress(project);
  const outstanding = getOutstandingCount(project);
  const currentStage = getCurrentStageName(project);
  const activeSet = new Set(project.activePhaseIds);
  const activeStages = project.checklist.filter(s => activeSet.has(s.id));

  const toggleStage = (id: string) => {
    setExpandedStages(s => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleStatusChange = (stageId: string, itemId: string, status: ItemStatus) => {
    const updated = updateClientItemStatus(project.id, stageId, itemId, status, auth?.name ?? "Client");
    if (updated) setProject(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#0b1f3a] text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/client/dashboard" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors mr-1">
              <Ico d={I.arrowLeft} size={20} />
            </Link>
            <div className="rounded-lg overflow-hidden bg-[#f5f0e8] hidden sm:block">
              <img src={logoImg} alt="LabLaunch" className="h-9 w-auto object-contain block" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm truncate max-w-[200px] sm:max-w-none">{project.name}</div>
              <div className="text-slate-400 text-xs">{project.owner}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-white/10 transition-colors" title="Sign Out">
            <Ico d={I.logout} size={18} />
          </button>
        </div>
      </header>

      {/* Tab bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto scrollbar-none">
          {(["overview","checklist","documents","activity","services"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors capitalize ${tab === t ? "border-teal-500 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-700"}`}>
              {t === "services" ? "My Services" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Overall Progress", value: `${progress}%`, color: "text-teal-700" },
                { label: "Outstanding", value: outstanding, color: "text-amber-700" },
                { label: "Active Phases", value: activeStages.length, color: "text-[#0b1f3a]" },
                { label: "Documents", value: project.documents.length, color: "text-violet-700" },
              ].map(s => (
                <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="font-semibold text-[#0b1f3a]">Project Progress</span>
                <span className="font-bold text-teal-700">{progress}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-600 to-teal-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-slate-500 mt-2">Current Phase: <span className="font-medium text-slate-700">{currentStage}</span></p>
            </div>

            {/* Lab info */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-[#0b1f3a] text-sm mb-4">Laboratory Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-sm">
                {[
                  ["Laboratory Name", project.name],
                  ["Owner / Entity", project.owner],
                  ["Address", project.address],
                  ["Region", project.region],
                  ["Province", project.province],
                  ["City / Municipality", project.city],
                  ["Lab Type", project.labType],
                  ["Classification", project.classification],
                  ["Service Capability", project.capability],
                  ["Institution Type", project.institutionType],
                  ["Ownership", project.ownershipType],
                  ["Facility Type", project.facilityType === "new" ? "New Facility" : "Existing Facility"],
                  ["Target Opening Date", project.targetOpeningDate || "—"],
                  ["Operating Hours", project.operatingHours || "—"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-xs text-slate-500 font-medium">{k}</div>
                    <div className="text-slate-800 mt-0.5 leading-snug">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase overview */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-[#0b1f3a] text-sm mb-4">Phase Progress</h3>
              <div className="space-y-3">
                {activeStages.slice(0, 10).map(stage => {
                  const total = stage.items.filter(i => i.status !== "not_applicable").length;
                  const done  = stage.items.filter(i => i.status === "completed" || i.status === "submitted").length;
                  const pct   = total === 0 ? 0 : Math.round((done / total) * 100);
                  return (
                    <div key={stage.id}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-600 font-medium truncate pr-4">{stage.number}. {stage.name}</span>
                        <span className="text-slate-500 shrink-0">{done}/{total}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
                {activeStages.length > 10 && (
                  <button onClick={() => setTab("checklist")} className="text-xs text-teal-600 hover:underline font-medium pt-1">
                    View all {activeStages.length} phases →
                  </button>
                )}
              </div>
            </div>

            {/* Recent notifications */}
            {project.notifications.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-[#0b1f3a] text-sm mb-4">Notifications</h3>
                <div className="space-y-3">
                  {project.notifications.slice(0, 5).map(n => (
                    <div key={n.id} className={`flex items-start gap-3 text-sm px-4 py-3 rounded-xl ${n.type === "success" ? "bg-teal-50 text-teal-800" : n.type === "warning" ? "bg-amber-50 text-amber-800" : n.type === "error" ? "bg-red-50 text-red-800" : "bg-slate-50 text-slate-700"}`}>
                      <Ico d={I.bell} size={15} className="shrink-0 mt-0.5" />
                      <span>{n.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CHECKLIST ── */}
        {tab === "checklist" && (
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3">
              <Ico d={I.info} size={16} className="text-teal-600 shrink-0" />
              <p className="text-sm text-teal-800">
                Only phases applicable to your selected services are shown. Click a phase to expand its requirements.
              </p>
            </div>

            {activeStages.map(stage => {
              const isOpen = expandedStages.has(stage.id);
              const done = stage.items.filter(i => i.status === "completed" || i.status === "submitted").length;
              const total = stage.items.filter(i => i.status !== "not_applicable").length;
              const pct = total === 0 ? 0 : Math.round((done / total) * 100);
              return (
                <div key={stage.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleStage(stage.id)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors text-left">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${pct === 100 ? "bg-teal-600 text-white" : pct > 0 ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
                        {pct === 100 ? <Ico d={I.check} size={13} /> : stage.number}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-[#0b1f3a] truncate">Phase {stage.number}: {stage.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{done} / {total} completed</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="hidden sm:block w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-teal-400 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{pct}%</span>
                      <Ico d={isOpen ? I.chevUp : I.chevDown} size={16} className="text-slate-400" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100">
                      {stage.items.map(item => {
                        const rtBadge = REQTYPE_BADGE[item.requirementType] ?? REQTYPE_BADGE.good_practice;
                        const statusOpt = STATUS_OPTIONS.find(o => o.value === item.status) ?? STATUS_OPTIONS[0];
                        return (
                          <div key={item.id} className={`px-5 py-4 border-b border-slate-50 last:border-0 ${item.status === "not_applicable" ? "opacity-50" : ""}`}>
                            <div className="flex items-start gap-3">
                              <div className="shrink-0 mt-0.5">
                                <button
                                  onClick={() => handleStatusChange(stage.id, item.id, item.status === "completed" ? "not_started" : "completed")}
                                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${item.status === "completed" ? "bg-teal-600 border-teal-600 text-white" : item.status === "submitted" ? "bg-violet-600 border-violet-600 text-white" : "border-slate-300 hover:border-teal-400"}`}>
                                  {(item.status === "completed" || item.status === "submitted") && <Ico d={I.check} size={10} />}
                                </button>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="min-w-0">
                                    <div className="text-sm font-semibold text-[#0b1f3a] leading-snug">{item.requirement}</div>
                                    <div className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</div>
                                  </div>
                                  <select
                                    value={item.status}
                                    onChange={e => handleStatusChange(stage.id, item.id, e.target.value as ItemStatus)}
                                    className="shrink-0 text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white">
                                    {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                  </select>
                                </div>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${rtBadge.cls}`}>{rtBadge.label}</span>
                                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusOpt.color}`}>{statusOpt.label}</span>
                                  {!item.required && <span className="text-[10px] text-slate-400 font-medium">Optional</span>}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── DOCUMENTS ── */}
        {tab === "documents" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0b1f3a]">Documents</h2>
              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                <Ico d={I.upload} size={15} /> Upload Document
              </button>
            </div>

            {/* Upload modal */}
            {showUpload && (
              <UploadModal
                projectId={project.id}
                clientName={auth?.name ?? "Client"}
                onClose={() => setShowUpload(false)}
                onUploaded={reload}
              />
            )}

            {project.documents.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl py-14 text-center">
                <Ico d={I.file} size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">No documents uploaded yet.</p>
                <button onClick={() => setShowUpload(true)} className="mt-4 text-sm text-teal-600 font-semibold hover:underline">Upload your first document</button>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-semibold text-slate-500 text-left">
                      <th className="px-5 py-3">Document</th>
                      <th className="px-5 py-3 hidden md:table-cell">Uploaded</th>
                      <th className="px-5 py-3 hidden lg:table-cell">Version</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3 hidden md:table-cell">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {project.documents.map((doc, idx) => (
                      <tr key={doc.id} className={`border-t border-slate-100 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}>
                        <td className="px-5 py-3">
                          <div className="font-semibold text-[#0b1f3a]">{doc.name}</div>
                          <div className="text-xs text-slate-400">{doc.fileName}</div>
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell text-slate-500 text-xs">{doc.uploadDate}</td>
                        <td className="px-5 py-3 hidden lg:table-cell text-slate-500 text-xs">v{doc.version}</td>
                        <td className="px-5 py-3">
                          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${DOC_STATUS_STYLE[doc.status]}`}>
                            {DOC_STATUS_LABEL[doc.status]}
                          </span>
                        </td>
                        <td className="px-5 py-3 hidden md:table-cell text-slate-500 text-xs max-w-xs truncate">{doc.remarks || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── ACTIVITY ── */}
        {tab === "activity" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#0b1f3a]">Activity Log</h2>
            {project.activityLog.length === 0 ? (
              <p className="text-slate-500 text-sm">No activity recorded yet.</p>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                {project.activityLog.map((act, idx) => (
                  <div key={act.id} className={`flex items-start gap-4 px-5 py-4 ${idx < project.activityLog.length - 1 ? "border-b border-slate-100" : ""}`}>
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Ico d={I.activity} size={13} className="text-slate-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800">{act.description}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {act.user} · {new Date(act.timestamp).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SERVICES ── */}
        {tab === "services" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0b1f3a]">Selected Services</h2>
              <button
                onClick={() => setShowEditServices(!showEditServices)}
                className="flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-500 transition-colors">
                <Ico d={I.edit} size={15} /> {showEditServices ? "Cancel Edit" : "Edit Services"}
              </button>
            </div>

            {!showEditServices ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.selectedServices.map(id => (
                    <div key={id} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
                      <Ico d={I.check} size={16} className="text-teal-600 shrink-0" />
                      <span className="text-sm font-medium text-slate-700">{getServiceLabel(id)}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-4">
                  Adding or removing services will adjust your compliance checklist. Contact LabLaunch if you need assistance selecting the right services.
                </p>
              </div>
            ) : (
              <EditServicesPanel
                project={project}
                clientName={auth?.name ?? "Client"}
                onSaved={(updated) => { setProject(updated); setShowEditServices(false); }}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

/* ── Upload Modal ── */
function UploadModal({ projectId, clientName, onClose, onUploaded }: {
  projectId: string; clientName: string; onClose: () => void; onUploaded: () => void;
}) {
  const [form, setForm] = useState({ name: "", fileName: "", stageId: "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    addClientDocument(projectId, {
      name: form.name,
      fileName: form.fileName || `${form.name}.pdf`,
      uploadDate: new Date().toISOString().split("T")[0],
      version: 1,
      status: "pending",
      uploadedBy: clientName,
      reviewedBy: "",
      reviewDate: "",
      remarks: "",
      stageId: form.stageId,
      itemId: "",
    }, clientName);
    setSaving(false);
    onUploaded();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-[#0b1f3a]">Upload Document</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M18 6 6 18M6 6l12 12"/></svg></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Document Name <span className="text-red-500">*</span></label>
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. PRC License — Juan dela Cruz"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">File Name</label>
            <input value={form.fileName} onChange={e => setForm(f => ({ ...f, fileName: e.target.value }))}
              placeholder="e.g. prc-license-juandelaCruz.pdf"
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
            <p className="text-xs text-slate-400 mt-1">Note: Actual file upload requires backend integration. This registers the document for tracking.</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-lg transition-colors">
              {saving ? "Uploading…" : "Submit Document"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Edit Services Panel ── */
function EditServicesPanel({ project, clientName, onSaved }: {
  project: ClientProject; clientName: string;
  onSaved: (updated: ClientProject) => void;
}) {
  const [selected, setSelected] = useState<string[]>([...project.selectedServices]);
  const [saving, setSaving] = useState(false);

  const toggle = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 300));
    const updated = updateClientServices(project.id, selected, clientName);
    setSaving(false);
    if (updated) onSaved(updated);
  };

  const added   = selected.filter(s => !project.selectedServices.includes(s));
  const removed = project.selectedServices.filter(s => !selected.includes(s));

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="text-amber-600 shrink-0 mt-0.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>
        <p className="text-sm text-amber-800">
          Adding services will activate additional checklist phases. Removing services will deactivate phases but <strong>will not delete</strong> any uploaded documents or completed requirements.
        </p>
      </div>

      {SERVICE_GROUPS.map(group => (
        <div key={group.id}>
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{group.label}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {group.services.map(svc => {
              const sel = selected.includes(svc.id);
              return (
                <label key={svc.id} className={`flex items-start gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${sel ? "border-teal-400 bg-teal-50" : "border-slate-200 hover:border-slate-300"}`}>
                  <input type="checkbox" className="w-4 h-4 text-teal-600 rounded shrink-0 mt-0.5" checked={sel} onChange={() => toggle(svc.id)} />
                  <div>
                    <div className={`text-sm font-semibold leading-snug ${sel ? "text-teal-800" : "text-slate-700"}`}>{svc.label}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{svc.description}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {(added.length > 0 || removed.length > 0) && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm">
          {added.length > 0 && <p className="text-teal-700">+ Adding: {added.map(getServiceLabel).join(", ")}</p>}
          {removed.length > 0 && <p className="text-amber-700">- Removing: {removed.map(getServiceLabel).join(", ")}</p>}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={handleSave}
          disabled={saving || selected.length === 0}
          className="px-6 py-2.5 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold rounded-lg transition-colors">
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
