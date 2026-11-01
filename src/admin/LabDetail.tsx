import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getLab, saveLab, updateItem, updateItemStatus, addFinding, updateFinding,
  addNote, addDocument, updateDocStatus,
  calcProgress, calcStageProgress,
  STATUS_LABELS, STATUS_COLORS, DOC_STATUS_COLORS,
  getAuth, logout,
} from "../data/store";
import { Laboratory, Stage, ChecklistItem, Finding, ItemStatus, DocStatus, FindingSeverity, FindingStatus } from "../data/types";
import logoImg from "@/imports/I_want_it_sophisticated_and_professional.png";

function Ico({ d, size = 18, className = "" }: { d: string | string[]; size?: number; className?: string }) {
  const arr = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {arr.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

const I = {
  back: "M19 12H5M12 5l-7 7 7 7",
  home: ["M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "M9 22V12h6v10"],
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  check: "M20 6 9 17l-5-5",
  chevDown: "M6 9l6 6 6-6",
  chevUp: "M18 15l-6-6-6 6",
  plus: "M12 5v14M5 12h14",
  edit: ["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"],
  doc: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6"],
  clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 6v6l4 2"],
  alert: ["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "M12 9v4", "M12 17h.01"],
  close: "M18 6 6 18M6 6l12 12",
  save: ["M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z", "M17 21v-8H7v8", "M7 3v5h8"],
  zap: "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
  note: ["M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7", "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"],
  activity: ["M22 12h-4l-3 9L9 3l-3 9H2"],
  finding: ["M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z", "M12 9v4", "M12 17h.01"],
  timeline: "M5 12h14M12 5l7 7-7 7",
  upload: ["M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", "M17 8l-5-5-5 5", "M12 3v12"],
};

function ProgressBar({ pct, label }: { pct: number; label?: string }) {
  const color = pct >= 80 ? "bg-teal-500" : pct >= 50 ? "bg-blue-500" : pct >= 25 ? "bg-amber-500" : "bg-slate-300";
  return (
    <div className="flex items-center gap-2">
      {label && <span className="text-xs text-slate-500 w-36 truncate">{label}</span>}
      <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
        <div className={`h-2 rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-700 w-8 text-right">{pct}%</span>
    </div>
  );
}

function Badge({ label, className = "" }: { label: string; className?: string }) {
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${className}`}>{label}</span>;
}

const TABS = [
  { id: "overview", label: "Overview", icon: I.home },
  { id: "checklist", label: "Checklist", icon: I.check },
  { id: "documents", label: "Documents", icon: I.doc },
  { id: "findings", label: "Findings", icon: I.finding },
  { id: "timeline", label: "Timeline", icon: I.timeline },
  { id: "notes", label: "Notes", icon: I.note },
  { id: "activity", label: "Activity", icon: I.activity },
];

/* ─── Checklist Tab ────────────────────────────────────────────── */
function ChecklistTab({ lab, onChange }: { lab: Laboratory; onChange: (l: Laboratory) => void }) {
  const [openStages, setOpenStages] = useState<Set<string>>(new Set([lab.stages[0]?.id]));
  const [editingItem, setEditingItem] = useState<{ stageId: string; item: ChecklistItem } | null>(null);

  const toggleStage = (id: string) => setOpenStages(prev => {
    const s = new Set(prev);
    if (s.has(id)) s.delete(id); else s.add(id);
    return s;
  });

  const handleStatusChange = (stageId: string, itemId: string, status: ItemStatus) => {
    const updated = updateItemStatus(lab.id, stageId, itemId, status);
    if (updated) onChange(updated);
  };

  const handleSaveItem = (stageId: string, item: ChecklistItem) => {
    const updated = updateItem(lab.id, stageId, item);
    if (updated) { onChange(updated); setEditingItem(null); }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-slate-500">{lab.stages.length} stages &bull; {lab.stages.reduce((n, s) => n + s.items.length, 0)} requirements</p>
        <button onClick={() => setOpenStages(new Set(lab.stages.map(s => s.id)))} className="text-xs text-teal-600 hover:underline">Expand all</button>
      </div>
      {lab.stages.map(stage => {
        const pct = calcStageProgress(stage);
        const isOpen = openStages.has(stage.id);
        const completedCount = stage.items.filter(i => i.status === "completed").length;
        const naCount = stage.items.filter(i => i.status === "not_applicable").length;
        return (
          <div key={stage.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <button className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left" onClick={() => toggleStage(stage.id)}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${pct === 100 ? "bg-teal-100 text-teal-700" : "bg-slate-100 text-slate-600"}`}>
                {pct === 100 ? <Ico d={I.check} size={12} /> : stage.number}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-[#0b1f3a] text-sm">Stage {stage.number}: {stage.name}</span>
                  {pct === 100 && <Badge label="Complete" className="bg-teal-100 text-teal-700" />}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden max-w-xs">
                    <div className={`h-1.5 rounded-full transition-all ${pct >= 80 ? "bg-teal-500" : pct >= 50 ? "bg-blue-500" : pct >= 25 ? "bg-amber-500" : "bg-slate-300"}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-slate-500">{completedCount}/{stage.items.length - naCount} done</span>
                </div>
              </div>
              <Ico d={isOpen ? I.chevUp : I.chevDown} size={16} className="text-slate-400 flex-shrink-0" />
            </button>
            {isOpen && (
              <div className="border-t border-slate-100 divide-y divide-slate-50">
                {stage.items.map(itm => (
                  <div key={itm.id} className={`px-5 py-3 ${itm.status === "completed" ? "bg-teal-50/30" : itm.status === "not_applicable" ? "bg-slate-50 opacity-60" : "bg-white"}`}>
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleStatusChange(stage.id, itm.id, itm.status === "completed" ? "not_started" : "completed")}
                        className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${itm.status === "completed" ? "bg-teal-600 border-teal-600" : "border-slate-300 hover:border-teal-400"}`}>
                        {itm.status === "completed" && <Ico d={I.check} size={10} className="text-white" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2 flex-wrap">
                          <span className={`text-sm font-medium ${itm.status === "completed" ? "line-through text-slate-400" : "text-[#0b1f3a]"}`}>{itm.requirement}</span>
                          {!itm.required && <Badge label="Optional" className="bg-slate-100 text-slate-500" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{itm.description}</p>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <select value={itm.status} onChange={e => handleStatusChange(stage.id, itm.id, e.target.value as ItemStatus)}
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-teal-400 ${STATUS_COLORS[itm.status]}`}>
                            {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                          </select>
                          {itm.assignedTo && <span className="text-xs text-slate-400">→ {itm.assignedTo}</span>}
                          {itm.dueDate && <span className="text-xs text-slate-400">Due: {itm.dueDate}</span>}
                          {itm.completionDate && <span className="text-xs text-teal-600">✓ {itm.completionDate}</span>}
                          {itm.notes && <span className="text-xs text-slate-400 italic truncate max-w-48">"{itm.notes}"</span>}
                        </div>
                      </div>
                      <button onClick={() => setEditingItem({ stageId: stage.id, item: { ...itm } })} className="text-slate-300 hover:text-teal-600 transition-colors flex-shrink-0 mt-0.5">
                        <Ico d={I.edit} size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Edit item modal */}
      {editingItem && (
        <ItemEditModal
          stageId={editingItem.stageId}
          item={editingItem.item}
          onSave={handleSaveItem}
          onClose={() => setEditingItem(null)}
        />
      )}
    </div>
  );
}

function ItemEditModal({ stageId, item, onSave, onClose }: {
  stageId: string; item: ChecklistItem;
  onSave: (stageId: string, item: ChecklistItem) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState(item);
  const set = (k: keyof ChecklistItem) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setLocal(prev => ({ ...prev, [k]: e.target.value }));
  const f = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-800";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white">
          <h3 className="font-bold text-[#0b1f3a] text-base">Edit Checklist Item</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><Ico d={I.close} size={18} /></button>
        </div>
        <div className="p-6 space-y-3">
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">Requirement</label><input className={f} value={local.requirement} onChange={set("requirement")} /></div>
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">Description</label><textarea rows={2} className={f} value={local.description} onChange={set("description")} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <select className={f} value={local.status} onChange={set("status")}>
                {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Assigned To</label><input className={f} value={local.assignedTo} onChange={set("assignedTo")} placeholder="Person responsible" /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Due Date</label><input type="date" className={f} value={local.dueDate} onChange={set("dueDate")} /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Completion Date</label><input type="date" className={f} value={local.completionDate} onChange={set("completionDate")} /></div>
          </div>
          <div><label className="block text-xs font-semibold text-slate-600 mb-1">Notes</label><textarea rows={2} className={f} value={local.notes} onChange={set("notes")} placeholder="Additional notes..." /></div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-lg text-sm hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={() => onSave(stageId, local)} className="flex-1 bg-teal-600 hover:bg-teal-500 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">Save Changes</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Overview Tab ─────────────────────────────────────────────── */
function OverviewTab({ lab }: { lab: Laboratory }) {
  const pct = calcProgress(lab);
  const totalDocs = lab.documents.length;
  const approvedDocs = lab.documents.filter(d => d.status === "approved").length;
  const openFindings = lab.findings.filter(f => f.status === "open" || f.status === "for_action").length;

  return (
    <div className="space-y-6">
      {/* Overall progress */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-[#0b1f3a] text-base">Overall Progress</h3>
          <span className="text-3xl font-extrabold text-teal-600">{pct}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden mb-4">
          <div className={`h-4 rounded-full transition-all duration-700 ${pct >= 80 ? "bg-teal-500" : pct >= 50 ? "bg-blue-500" : pct >= 25 ? "bg-amber-500" : "bg-slate-300"}`} style={{ width: `${pct}%` }} />
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><div className="text-xl font-bold text-[#0b1f3a]">{lab.stages.reduce((n, s) => n + s.items.filter(i => i.status === "completed").length, 0)}</div><div className="text-xs text-slate-500">Completed</div></div>
          <div><div className="text-xl font-bold text-[#0b1f3a]">{lab.stages.reduce((n, s) => n + s.items.filter(i => i.status !== "completed" && i.status !== "not_applicable").length, 0)}</div><div className="text-xs text-slate-500">Pending</div></div>
          <div><div className="text-xl font-bold text-[#0b1f3a]">{lab.stages.reduce((n, s) => n + s.items.length, 0)}</div><div className="text-xs text-slate-500">Total Items</div></div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center"><div className="text-2xl font-bold text-teal-600">{totalDocs}</div><div className="text-xs text-slate-500">Documents</div></div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center"><div className="text-2xl font-bold text-blue-600">{approvedDocs}</div><div className="text-xs text-slate-500">Approved Docs</div></div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center"><div className={`text-2xl font-bold ${openFindings > 0 ? "text-amber-600" : "text-emerald-600"}`}>{openFindings}</div><div className="text-xs text-slate-500">Open Findings</div></div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-center"><div className="text-2xl font-bold text-slate-700">{lab.notes.length}</div><div className="text-xs text-slate-500">Notes</div></div>
      </div>

      {/* Stage breakdown */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="font-bold text-[#0b1f3a] text-base mb-4">Progress by Stage</h3>
        <div className="space-y-2.5">
          {lab.stages.map(stage => (
            <ProgressBar key={stage.id} pct={calcStageProgress(stage)} label={`S${stage.number}. ${stage.name}`} />
          ))}
        </div>
      </div>

      {/* Lab Info */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <h3 className="font-bold text-[#0b1f3a] text-base mb-4">Laboratory Information</h3>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
          {[
            ["Client / Company", lab.company],
            ["Contact Person", lab.contactPerson],
            ["Contact Number", lab.contactNumber],
            ["Email", lab.email],
            ["Location", [lab.city, lab.province, lab.region].filter(Boolean).join(", ")],
            ["Laboratory Type", lab.labType],
            ["Classification", lab.classification],
            ["Assigned Consultant", lab.consultant],
            ["Project Start", lab.startDate],
            ["Target Opening", lab.targetOpeningDate],
            ["Status", lab.status.replace("_", " ")],
          ].map(([label, value]) => value ? (
            <div key={label}>
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</div>
              <div className="text-sm text-[#0b1f3a] font-medium mt-0.5">{value}</div>
            </div>
          ) : null)}
          {lab.intendedServices && (
            <div className="sm:col-span-2">
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Intended Services</div>
              <div className="text-sm text-[#0b1f3a] font-medium mt-0.5">{lab.intendedServices}</div>
            </div>
          )}
          {lab.projectNotes && (
            <div className="sm:col-span-2">
              <div className="text-xs text-slate-400 font-medium uppercase tracking-wide">Project Notes</div>
              <div className="text-sm text-slate-600 mt-0.5">{lab.projectNotes}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Documents Tab ────────────────────────────────────────────── */
function DocumentsTab({ lab, onChange }: { lab: Laboratory; onChange: (l: Laboratory) => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [newDoc, setNewDoc] = useState({ name: "", type: "", uploadDate: new Date().toISOString().split("T")[0], expirationDate: "", version: "1.0", status: "uploaded" as DocStatus, uploadedBy: "Admin", notes: "", stageId: "", itemId: "" });
  const f = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-800";

  const totalDocs = lab.documents.length;
  const approvedDocs = lab.documents.filter(d => d.status === "approved").length;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = addDocument(lab.id, newDoc);
    if (updated) { onChange(updated); setShowAdd(false); setNewDoc(prev => ({ ...prev, name: "", type: "", notes: "" })); }
  };

  const handleStatusChange = (docId: string, status: DocStatus) => {
    const updated = updateDocStatus(lab.id, docId, status);
    if (updated) onChange(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-[#0b1f3a]">Project Documents</h3>
          <p className="text-xs text-slate-500 mt-0.5">{approvedDocs} / {totalDocs} approved</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
          <Ico d={I.plus} size={15} /> Add Document
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-teal-50 border border-teal-200 rounded-xl p-5 mb-5 space-y-3">
          <p className="text-xs font-semibold text-teal-700 uppercase tracking-widest">New Document</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Document Name *</label><input required className={f} placeholder="Document name" value={newDoc.name} onChange={e => setNewDoc(p => ({ ...p, name: e.target.value }))} /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Document Type</label><input className={f} placeholder="e.g. Application, Legal, SOP..." value={newDoc.type} onChange={e => setNewDoc(p => ({ ...p, type: e.target.value }))} /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Upload Date</label><input type="date" className={f} value={newDoc.uploadDate} onChange={e => setNewDoc(p => ({ ...p, uploadDate: e.target.value }))} /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Expiration Date</label><input type="date" className={f} value={newDoc.expirationDate} onChange={e => setNewDoc(p => ({ ...p, expirationDate: e.target.value }))} /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Version</label><input className={f} value={newDoc.version} onChange={e => setNewDoc(p => ({ ...p, version: e.target.value }))} /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <select className={f} value={newDoc.status} onChange={e => setNewDoc(p => ({ ...p, status: e.target.value as DocStatus }))}>
                <option value="uploaded">Uploaded</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="for_revision">For Revision</option>
                <option value="missing">Missing</option>
              </select>
            </div>
            <div className="sm:col-span-2"><label className="block text-xs font-semibold text-slate-600 mb-1">Notes</label><input className={f} placeholder="Notes about this document..." value={newDoc.notes} onChange={e => setNewDoc(p => ({ ...p, notes: e.target.value }))} /></div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowAdd(false)} className="border border-slate-200 text-slate-600 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">Save Document</button>
          </div>
        </form>
      )}

      {lab.documents.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Ico d={I.doc} size={32} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">No documents added yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {lab.documents.map(doc => (
            <div key={doc.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Ico d={I.doc} size={16} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap">
                  <span className="font-semibold text-[#0b1f3a] text-sm">{doc.name}</span>
                  <select value={doc.status} onChange={e => handleStatusChange(doc.id, e.target.value as DocStatus)}
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-teal-400 ${DOC_STATUS_COLORS[doc.status]}`}>
                    <option value="missing">Missing</option>
                    <option value="uploaded">Uploaded</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="for_revision">For Revision</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500">
                  {doc.type && <span>{doc.type}</span>}
                  <span>v{doc.version}</span>
                  <span>Uploaded: {doc.uploadDate}</span>
                  {doc.expirationDate && <span>Expires: {doc.expirationDate}</span>}
                  <span>By: {doc.uploadedBy}</span>
                </div>
                {doc.notes && <p className="text-xs text-slate-400 italic mt-0.5">{doc.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Findings Tab ─────────────────────────────────────────────── */
function FindingsTab({ lab, onChange }: { lab: Laboratory; onChange: (l: Laboratory) => void }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const blank = { description: "", category: "", severity: "minor" as FindingSeverity, correctiveAction: "", responsiblePerson: "", dueDate: "", documentIds: [] as string[], status: "open" as FindingStatus, closureDate: "" };
  const [form, setForm] = useState<typeof blank>(blank);

  const f = "w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-slate-800";
  const set = (k: keyof typeof blank) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: Laboratory | undefined;
    if (editingId) {
      const existing = lab.findings.find(f => f.id === editingId);
      if (existing) updated = updateFinding(lab.id, { ...existing, ...form });
    } else {
      updated = addFinding(lab.id, form);
    }
    if (updated) { onChange(updated); setShowAdd(false); setEditingId(null); setForm(blank); }
  };

  const startEdit = (finding: Finding) => {
    setForm({ description: finding.description, category: finding.category, severity: finding.severity, correctiveAction: finding.correctiveAction, responsiblePerson: finding.responsiblePerson, dueDate: finding.dueDate, documentIds: finding.documentIds, status: finding.status, closureDate: finding.closureDate });
    setEditingId(finding.id);
    setShowAdd(true);
  };

  const sevColor = { minor: "bg-amber-100 text-amber-700", major: "bg-orange-100 text-orange-700", critical: "bg-red-100 text-red-700" };
  const statColor = { open: "bg-red-100 text-red-700", for_action: "bg-amber-100 text-amber-700", closed: "bg-teal-100 text-teal-700" };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-[#0b1f3a]">Inspection Findings</h3>
          <p className="text-xs text-slate-500 mt-0.5">{lab.findings.filter(f => f.status !== "closed").length} open &bull; {lab.findings.length} total</p>
        </div>
        <button onClick={() => { setShowAdd(!showAdd); setEditingId(null); setForm(blank); }}
          className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
          <Ico d={I.plus} size={15} /> Add Finding
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSave} className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-5 space-y-3">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest">{editingId ? "Edit Finding" : "New Finding"}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2"><label className="block text-xs font-semibold text-slate-600 mb-1">Finding Description *</label><textarea required rows={2} className={f} value={form.description} onChange={set("description")} placeholder="Describe the inspection finding..." /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Category</label><input className={f} value={form.category} onChange={set("category")} placeholder="e.g. Documentation, Facility, Equipment..." /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Severity</label>
              <select className={f} value={form.severity} onChange={set("severity")}>
                <option value="minor">Minor</option>
                <option value="major">Major</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div className="sm:col-span-2"><label className="block text-xs font-semibold text-slate-600 mb-1">Corrective Action Required</label><textarea rows={2} className={f} value={form.correctiveAction} onChange={set("correctiveAction")} placeholder="Describe the required corrective action..." /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Responsible Person</label><input className={f} value={form.responsiblePerson} onChange={set("responsiblePerson")} /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Due Date</label><input type="date" className={f} value={form.dueDate} onChange={set("dueDate")} /></div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Status</label>
              <select className={f} value={form.status} onChange={set("status")}>
                <option value="open">Open</option>
                <option value="for_action">For Action</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div><label className="block text-xs font-semibold text-slate-600 mb-1">Closure Date</label><input type="date" className={f} value={form.closureDate} onChange={set("closureDate")} /></div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => { setShowAdd(false); setEditingId(null); setForm(blank); }} className="border border-slate-200 text-slate-600 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors">{editingId ? "Update" : "Save"} Finding</button>
          </div>
        </form>
      )}

      {lab.findings.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Ico d={I.finding} size={32} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">No inspection findings recorded.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lab.findings.map(finding => (
            <div key={finding.id} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sevColor[finding.severity]}`}>{finding.severity.charAt(0).toUpperCase() + finding.severity.slice(1)}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statColor[finding.status]}`}>{finding.status === "for_action" ? "For Action" : finding.status.charAt(0).toUpperCase() + finding.status.slice(1)}</span>
                    {finding.category && <span className="text-xs text-slate-400">{finding.category}</span>}
                  </div>
                  <p className="text-sm text-[#0b1f3a] font-medium mb-2">{finding.description}</p>
                  {finding.correctiveAction && <p className="text-xs text-slate-500 mb-2"><span className="font-medium">Action: </span>{finding.correctiveAction}</p>}
                  <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                    {finding.responsiblePerson && <span>Person: {finding.responsiblePerson}</span>}
                    {finding.dueDate && <span>Due: {finding.dueDate}</span>}
                    {finding.closureDate && <span className="text-teal-600">Closed: {finding.closureDate}</span>}
                  </div>
                </div>
                <button onClick={() => startEdit(finding)} className="text-slate-300 hover:text-teal-600 transition-colors flex-shrink-0">
                  <Ico d={I.edit} size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Timeline Tab ─────────────────────────────────────────────── */
function TimelineTab({ lab }: { lab: Laboratory }) {
  const stages = lab.stages.map(stage => {
    const pct = calcStageProgress(stage);
    const done = pct === 100;
    const started = stage.items.some(i => i.status !== "not_started" && i.status !== "not_applicable");
    return { stage, pct, done, started };
  });
  return (
    <div className="space-y-0">
      <h3 className="font-bold text-[#0b1f3a] mb-5">Laboratory Development Timeline</h3>
      {stages.map(({ stage, pct, done, started }, idx) => (
        <div key={stage.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${done ? "bg-teal-600 text-white" : started ? "bg-blue-100 border-2 border-blue-400 text-blue-600" : "bg-slate-100 border-2 border-slate-300 text-slate-400"}`}>
              {done ? <Ico d={I.check} size={14} /> : <span className="text-xs font-bold">{stage.number}</span>}
            </div>
            {idx < stages.length - 1 && <div className={`w-0.5 flex-1 min-h-[32px] my-1 ${done ? "bg-teal-300" : "bg-slate-200"}`} />}
          </div>
          <div className="pb-6 pt-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-sm font-semibold ${done ? "text-teal-700" : started ? "text-[#0b1f3a]" : "text-slate-400"}`}>
                {stage.name}
              </span>
              {done && <Badge label="Complete" className="bg-teal-100 text-teal-700" />}
              {!done && started && <Badge label="In Progress" className="bg-blue-100 text-blue-700" />}
              {!done && !started && <Badge label="Not Started" className="bg-slate-100 text-slate-500" />}
            </div>
            {started && !done && (
              <div className="mt-1.5 max-w-xs">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="h-1.5 rounded-full bg-blue-400 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-slate-500">{pct}%</span>
                </div>
              </div>
            )}
            {done && stage.items.find(i => i.completionDate) && (
              <p className="text-xs text-slate-400 mt-0.5">Completed {stage.items.find(i => i.completionDate)?.completionDate}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Notes & Activity Tab ─────────────────────────────────────── */
function NotesTab({ lab, onChange }: { lab: Laboratory; onChange: (l: Laboratory) => void }) {
  const [text, setText] = useState("");
  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    const updated = addNote(lab.id, text.trim());
    if (updated) { onChange(updated); setText(""); }
  };
  return (
    <div className="space-y-5">
      <form onSubmit={handleAdd} className="flex gap-2">
        <textarea rows={2} value={text} onChange={e => setText(e.target.value)} placeholder="Add a project note..."
          className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none" />
        <button type="submit" disabled={!text.trim()} className="bg-teal-600 hover:bg-teal-500 disabled:bg-teal-300 text-white font-semibold px-4 rounded-xl text-sm transition-colors self-stretch flex items-center">
          <Ico d={I.save} size={16} />
        </button>
      </form>
      {lab.notes.length === 0 ? (
        <p className="text-center text-slate-400 text-sm py-8">No notes yet.</p>
      ) : (
        <div className="space-y-3">
          {lab.notes.map(note => (
            <div key={note.id} className="bg-white border border-slate-200 rounded-xl p-4">
              <p className="text-sm text-slate-700 leading-relaxed">{note.text}</p>
              <p className="text-xs text-slate-400 mt-2">{note.author} &bull; {new Date(note.timestamp).toLocaleString("en-PH", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ActivityTab({ lab }: { lab: Laboratory }) {
  return (
    <div className="space-y-2">
      <h3 className="font-bold text-[#0b1f3a] mb-4">Activity Log</h3>
      {lab.activityLog.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-8">No activity recorded.</p>
      ) : (
        <div className="space-y-2">
          {lab.activityLog.map(act => (
            <div key={act.id} className="flex items-start gap-3 p-3 bg-white border border-slate-100 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Ico d={I.zap} size={10} className="text-teal-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-700">{act.description}</p>
                <p className="text-xs text-slate-400 mt-0.5">{act.user} &bull; {new Date(act.timestamp).toLocaleString("en-PH", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Lab Detail Page ──────────────────────────────────────────── */
export default function LabDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = getAuth();
  const [lab, setLab] = useState<Laboratory | null>(null);
  const [tab, setTab] = useState("overview");

  useEffect(() => {
    if (!auth) { navigate("/admin/login"); return; }
    if (!id) { navigate("/admin/dashboard"); return; }
    const found = getLab(id);
    if (!found) { navigate("/admin/dashboard"); return; }
    setLab(found);
  }, [id]);

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  const onLabChange = (updated: Laboratory) => setLab(updated);

  if (!lab) return null;

  const pct = calcProgress(lab);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <header className="bg-[#0b1f3a] sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg overflow-hidden bg-[#f5f0e8]">
              <img src={logoImg} alt="LabLaunch" className="h-8 w-auto object-contain block" />
            </div>
            <div className="hidden sm:flex items-center gap-2 text-slate-400 text-xs">
              <button onClick={() => navigate("/admin/dashboard")} className="hover:text-white transition-colors">Dashboard</button>
              <span>/</span>
              <span className="text-white font-medium truncate max-w-48">{lab.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="hidden sm:flex items-center gap-1.5 text-slate-400 hover:text-white text-xs transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10">Website</a>
            <button onClick={() => navigate("/admin/dashboard")} className="hidden sm:flex items-center gap-1.5 text-slate-400 hover:text-white text-xs transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10">
              <Ico d={I.back} size={13} /> Dashboard
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 text-xs transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10">
              <Ico d={I.logout} size={13} /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Lab Header */}
      <div className="bg-[#0b1f3a] border-b border-white/10 pb-6">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl font-extrabold text-white leading-tight">{lab.name}</h1>
              <p className="text-slate-400 text-sm mt-1">{lab.company} &bull; {[lab.city, lab.province].filter(Boolean).join(", ")} &bull; {lab.labType}</p>
              {lab.consultant && <p className="text-slate-500 text-xs mt-0.5">Consultant: {lab.consultant}</p>}
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="text-4xl font-extrabold text-teal-400">{pct}%</div>
              <div className="text-slate-400 text-xs mt-0.5">Overall Progress</div>
            </div>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
            <div className={`h-3 rounded-full transition-all duration-700 ${pct >= 80 ? "bg-teal-400" : pct >= 50 ? "bg-blue-400" : pct >= 25 ? "bg-amber-400" : "bg-slate-400"}`} style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 mt-5">
          <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap flex-shrink-0 ${tab === t.id ? "bg-white text-[#0b1f3a]" : "text-slate-400 hover:text-white hover:bg-white/10"}`}>
                <Ico d={t.icon} size={13} /> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        {tab === "overview" && <OverviewTab lab={lab} />}
        {tab === "checklist" && <ChecklistTab lab={lab} onChange={onLabChange} />}
        {tab === "documents" && <DocumentsTab lab={lab} onChange={onLabChange} />}
        {tab === "findings" && <FindingsTab lab={lab} onChange={onLabChange} />}
        {tab === "timeline" && <TimelineTab lab={lab} />}
        {tab === "notes" && <NotesTab lab={lab} onChange={onLabChange} />}
        {tab === "activity" && <ActivityTab lab={lab} />}
      </main>
    </div>
  );
}
