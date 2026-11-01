import { Laboratory, Activity, Note, Finding, LabDocument, ItemStatus, DocStatus, ChecklistItem, ClientUser, Notification } from "./types";
import { createLabChecklist } from "./checklist";

const LAB_KEY = "ll_labs_v2";
const AUTH_KEY = "ll_auth_v1";
const CLIENT_KEY = "ll_clients_v1";
const CLIENT_AUTH_KEY = "ll_client_auth_v1";
const NOTIF_KEY = "ll_notifs_v1";

const SVC_TO_MODULE: Record<string, string> = {
  remote_collection: "remote_collection",
  molecular_pathology: "molecular_pathology",
  anatomic_pathology: "anatomic_pathology",
  hiv_testing: "hiv_testing",
  drug_testing: "drug_testing",
  philhealth_accreditation: "accreditation",
  other_accreditation: "accreditation",
  accreditation_readiness: "accreditation",
};

/* ─── Admin access ─────────────────────────────────────────────── */
export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function getAuth(): { email: string; name: string; role: "admin" } | null {
  localStorage.removeItem(AUTH_KEY);
  return null;
}

/* ─── Client Auth ────────────────────────────────────────────── */
function loadClients(): ClientUser[] {
  try { return JSON.parse(localStorage.getItem(CLIENT_KEY) || "[]"); } catch { return []; }
}
function saveClients(c: ClientUser[]) { localStorage.setItem(CLIENT_KEY, JSON.stringify(c)); }

export function registerClient(data: { name: string; email: string; password: string; mobile: string; company: string; position: string }): { ok: boolean; error?: string } {
  const clients = loadClients();
  if (clients.find(c => c.email.toLowerCase() === data.email.toLowerCase())) {
    return { ok: false, error: "An account with that email already exists." };
  }
  const client: ClientUser = { ...data, id: `client-${Date.now()}`, role: "client", createdAt: new Date().toISOString() };
  clients.push(client);
  saveClients(clients);
  return { ok: true };
}

export function clientLogin(email: string, password: string): boolean {
  const client = loadClients().find(c => c.email.toLowerCase() === email.toLowerCase() && c.password === password);
  if (client) {
    const { password: _pw, ...safe } = client;
    localStorage.setItem(CLIENT_AUTH_KEY, JSON.stringify(safe));
    return true;
  }
  return false;
}

export function clientLogout() { localStorage.removeItem(CLIENT_AUTH_KEY); }

export function getClientAuth(): Omit<ClientUser, "password"> | null {
  const raw = localStorage.getItem(CLIENT_AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function getClientById(id: string): ClientUser | undefined {
  return loadClients().find(c => c.id === id);
}

export function updateClientProfile(id: string, updates: Partial<Pick<ClientUser, "name" | "mobile" | "company" | "position">>): boolean {
  const clients = loadClients();
  const idx = clients.findIndex(c => c.id === id);
  if (idx < 0) return false;
  clients[idx] = { ...clients[idx], ...updates };
  saveClients(clients);
  // Update session
  const session = getClientAuth();
  if (session && session.id === id) {
    localStorage.setItem(CLIENT_AUTH_KEY, JSON.stringify({ ...session, ...updates }));
  }
  return true;
}

export function changeClientPassword(id: string, oldPw: string, newPw: string): { ok: boolean; error?: string } {
  const clients = loadClients();
  const idx = clients.findIndex(c => c.id === id);
  if (idx < 0) return { ok: false, error: "Account not found." };
  if (clients[idx].password !== oldPw) return { ok: false, error: "Current password is incorrect." };
  clients[idx].password = newPw;
  saveClients(clients);
  return { ok: true };
}

/* ─── Notifications ─────────────────────────────────────────── */
function loadNotifs(): Notification[] {
  try { return JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]"); } catch { return []; }
}
function saveNotifs(n: Notification[]) { localStorage.setItem(NOTIF_KEY, JSON.stringify(n)); }

export function addNotification(n: Omit<Notification, "id" | "read" | "timestamp">) {
  const notifs = loadNotifs();
  notifs.unshift({ ...n, id: `notif-${Date.now()}`, read: false, timestamp: new Date().toISOString() });
  saveNotifs(notifs.slice(0, 200));
}

export function getNotifications(recipientId: string, role: "client" | "admin"): Notification[] {
  return loadNotifs().filter(n => n.recipientId === recipientId && n.recipientRole === role);
}

export function markNotificationRead(id: string) {
  const notifs = loadNotifs();
  const n = notifs.find(x => x.id === id);
  if (n) { n.read = true; saveNotifs(notifs); }
}

export function markAllNotificationsRead(recipientId: string) {
  const notifs = loadNotifs();
  for (const n of notifs) { if (n.recipientId === recipientId) n.read = true; }
  saveNotifs(notifs);
}

/* ─── Labs ─────────────────────────────────────────────────────── */
function load(): Laboratory[] {
  try {
    const raw = localStorage.getItem(LAB_KEY);
    return raw ? JSON.parse(raw) : DEMO_LABS;
  } catch {
    return DEMO_LABS;
  }
}

function save(labs: Laboratory[]) {
  localStorage.setItem(LAB_KEY, JSON.stringify(labs));
}

export function getLabs(): Laboratory[] {
  return load();
}

export function getLab(id: string): Laboratory | undefined {
  return load().find(l => l.id === id);
}

export function saveLab(lab: Laboratory): Laboratory {
  const labs = load();
  const idx = labs.findIndex(l => l.id === lab.id);
  if (idx >= 0) labs[idx] = lab;
  else labs.unshift(lab);
  save(labs);
  return lab;
}

export function deleteLab(id: string) {
  save(load().filter(l => l.id !== id));
}

export function createLab(data: Omit<Laboratory, "id" | "stages" | "documents" | "findings" | "activityLog" | "notes" | "createdAt" | "updatedAt">): Laboratory {
  const now = new Date().toISOString();
  const lab: Laboratory = {
    ...data,
    id: `lab-${Date.now()}`,
    stages: createLabChecklist(data.selectedServices || []),
    documents: [],
    findings: [],
    activityLog: [
      { id: `act-${Date.now()}`, timestamp: now, description: "Laboratory project created.", user: data.clientId ? "Client" : "Admin", prevStatus: undefined, newStatus: undefined },
    ],
    notes: [],
    createdAt: now,
    updatedAt: now,
  };
  saveLab(lab);
  return lab;
}

export function getClientLabs(clientId: string): Laboratory[] {
  return load().filter(l => l.clientId === clientId);
}

export function activateLabService(labId: string, serviceId: string, user = "Admin"): Laboratory | undefined {
  const lab = getLab(labId);
  if (!lab) return;
  if (lab.selectedServices.includes(serviceId)) return lab;
  lab.selectedServices = [...lab.selectedServices, serviceId];
  const moduleKey = SVC_TO_MODULE[serviceId];
  if (moduleKey) {
    for (const stage of lab.stages) {
      if (stage.moduleKey === moduleKey) stage.active = true;
    }
  }
  const now = new Date().toISOString();
  lab.updatedAt = now;
  lab.activityLog.unshift({ id: `act-${Date.now()}`, timestamp: now, description: `Service activated: "${serviceId}".`, user, prevStatus: undefined, newStatus: undefined });
  saveLab(lab);
  return lab;
}

export function deactivateLabService(labId: string, serviceId: string, user = "Admin"): Laboratory | undefined {
  const lab = getLab(labId);
  if (!lab) return;
  lab.selectedServices = lab.selectedServices.filter(s => s !== serviceId);
  const moduleKey = SVC_TO_MODULE[serviceId];
  if (moduleKey) {
    // Only deactivate if no other selected service maps to the same module
    const stillActive = lab.selectedServices.some(s => SVC_TO_MODULE[s] === moduleKey);
    if (!stillActive) {
      for (const stage of lab.stages) {
        if (stage.moduleKey === moduleKey) stage.active = false;
      }
    }
  }
  const now = new Date().toISOString();
  lab.updatedAt = now;
  lab.activityLog.unshift({ id: `act-${Date.now()}`, timestamp: now, description: `Service deactivated: "${serviceId}". Associated checklist archived.`, user, prevStatus: undefined, newStatus: undefined });
  saveLab(lab);
  return lab;
}

/* ─── Progress calculation ─────────────────────────────────────── */
export function calcProgress(lab: Laboratory): number {
  let total = 0, done = 0;
  for (const stage of lab.stages) {
    if (!stage.active) continue;
    for (const item of stage.items) {
      if (item.status === "not_applicable") continue;
      total++;
      if (item.status === "completed" || item.status === "verified") done++;
    }
  }
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

export function calcStageProgress(stage: import("./types").Stage): number {
  let total = 0, done = 0;
  for (const item of stage.items) {
    if (item.status === "not_applicable") continue;
    total++;
    if (item.status === "completed" || item.status === "verified") done++;
  }
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

export function calcProgressDetail(lab: Laboratory): { total: number; done: number; pct: number } {
  let total = 0, done = 0;
  for (const stage of lab.stages) {
    if (!stage.active) continue;
    for (const item of stage.items) {
      if (item.status === "not_applicable") continue;
      total++;
      if (item.status === "completed" || item.status === "verified") done++;
    }
  }
  return { total, done, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

/* ─── Mutations ─────────────────────────────────────────────────── */
export function updateItemStatus(labId: string, stageId: string, itemId: string, status: ItemStatus, user = "Admin"): Laboratory | undefined {
  const lab = getLab(labId);
  if (!lab) return;
  const now = new Date().toISOString();
  for (const stage of lab.stages) {
    if (stage.id !== stageId) continue;
    for (const itm of stage.items) {
      if (itm.id !== itemId) continue;
      const prev = itm.status;
      itm.status = status;
      itm.lastUpdated = now;
      if (status === "completed") itm.completionDate = now.split("T")[0];
      lab.activityLog.unshift({
        id: `act-${Date.now()}`,
        timestamp: now,
        description: `"${itm.requirement}" status changed.`,
        user,
        prevStatus: STATUS_LABELS[prev],
        newStatus: STATUS_LABELS[status],
      });
    }
  }
  lab.updatedAt = now;
  saveLab(lab);
  return lab;
}

export function updateItem(labId: string, stageId: string, updated: ChecklistItem, user = "Admin"): Laboratory | undefined {
  const lab = getLab(labId);
  if (!lab) return;
  const now = new Date().toISOString();
  for (const stage of lab.stages) {
    if (stage.id !== stageId) continue;
    const idx = stage.items.findIndex(i => i.id === updated.id);
    if (idx >= 0) {
      stage.items[idx] = { ...updated, lastUpdated: now };
    }
  }
  lab.updatedAt = now;
  lab.activityLog.unshift({ id: `act-${Date.now()}`, timestamp: now, description: `Updated checklist item: "${updated.requirement}".`, user, prevStatus: undefined, newStatus: undefined });
  saveLab(lab);
  return lab;
}

export function addFinding(labId: string, finding: Omit<Finding, "id">, user = "Admin"): Laboratory | undefined {
  const lab = getLab(labId);
  if (!lab) return;
  const now = new Date().toISOString();
  const newFinding: Finding = { ...finding, id: `find-${Date.now()}` };
  lab.findings.push(newFinding);
  lab.updatedAt = now;
  lab.activityLog.unshift({ id: `act-${Date.now()}`, timestamp: now, description: `New inspection finding added: "${finding.description.slice(0, 60)}".`, user, prevStatus: undefined, newStatus: undefined });
  saveLab(lab);
  return lab;
}

export function updateFinding(labId: string, updated: Finding, user = "Admin"): Laboratory | undefined {
  const lab = getLab(labId);
  if (!lab) return;
  const now = new Date().toISOString();
  const idx = lab.findings.findIndex(f => f.id === updated.id);
  if (idx >= 0) lab.findings[idx] = updated;
  lab.updatedAt = now;
  lab.activityLog.unshift({ id: `act-${Date.now()}`, timestamp: now, description: `Finding updated: "${updated.description.slice(0, 60)}".`, user, prevStatus: undefined, newStatus: undefined });
  saveLab(lab);
  return lab;
}

export function addNote(labId: string, text: string, author = "Admin", isInternal = true): Laboratory | undefined {
  const lab = getLab(labId);
  if (!lab) return;
  const now = new Date().toISOString();
  const note: Note = { id: `note-${Date.now()}`, timestamp: now, text, author, isInternal };
  lab.notes.unshift(note);
  lab.updatedAt = now;
  lab.activityLog.unshift({ id: `act-${Date.now()}`, timestamp: now, description: `Note added.`, user: author, prevStatus: undefined, newStatus: undefined });
  saveLab(lab);
  return lab;
}

export function addDocument(labId: string, doc: Omit<LabDocument, "id" | "adminRemarks" | "uploadedByRole"> & { uploadedByRole?: "client" | "admin" }, user = "Admin"): Laboratory | undefined {
  const lab = getLab(labId);
  if (!lab) return;
  const now = new Date().toISOString();
  const newDoc: LabDocument = { ...doc, id: `doc-${Date.now()}`, adminRemarks: "", uploadedByRole: doc.uploadedByRole || "admin" };
  lab.documents.push(newDoc);
  lab.updatedAt = now;
  lab.activityLog.unshift({ id: `act-${Date.now()}`, timestamp: now, description: `Document added: "${doc.name}".`, user, prevStatus: undefined, newStatus: undefined });
  saveLab(lab);
  return lab;
}

export function updateDocStatus(labId: string, docId: string, status: DocStatus, user = "Admin"): Laboratory | undefined {
  const lab = getLab(labId);
  if (!lab) return;
  const now = new Date().toISOString();
  const doc = lab.documents.find(d => d.id === docId);
  if (doc) {
    doc.status = status;
    lab.activityLog.unshift({ id: `act-${Date.now()}`, timestamp: now, description: `Document "${doc.name}" status updated to ${status}.`, user, prevStatus: undefined, newStatus: undefined });
  }
  lab.updatedAt = now;
  saveLab(lab);
  return lab;
}

export const STATUS_LABELS: Record<string, string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  submitted: "Submitted",
  under_review: "Under Review",
  pending: "Pending",
  for_revision: "Revision Required",
  verified: "Verified",
  completed: "Completed",
  not_applicable: "Not Applicable",
};

export const STATUS_COLORS: Record<string, string> = {
  not_started: "bg-slate-100 text-slate-600",
  in_progress: "bg-blue-100 text-blue-700",
  submitted: "bg-violet-100 text-violet-700",
  under_review: "bg-indigo-100 text-indigo-700",
  pending: "bg-amber-100 text-amber-700",
  for_revision: "bg-orange-100 text-orange-700",
  verified: "bg-cyan-100 text-cyan-700",
  completed: "bg-teal-100 text-teal-700",
  not_applicable: "bg-slate-100 text-slate-400",
};

export const DOC_STATUS_COLORS: Record<string, string> = {
  missing: "bg-red-100 text-red-700",
  uploaded: "bg-blue-100 text-blue-700",
  under_review: "bg-amber-100 text-amber-700",
  approved: "bg-teal-100 text-teal-700",
  for_revision: "bg-orange-100 text-orange-700",
  expired: "bg-red-100 text-red-600",
};

/* ─── Demo labs ─────────────────────────────────────────────────── */
function makeDemoLab(id: string, name: string, company: string, city: string, labType: string, consultant: string, completedStages: number[], partialStage?: { stageIdx: number; pct: number }): Laboratory {
  const now = new Date().toISOString();
  const stages = createLabChecklist();
  for (let si = 0; si < stages.length; si++) {
    const stage = stages[si];
    if (completedStages.includes(si)) {
      for (const item of stage.items) {
        item.status = "completed";
        item.completionDate = "2026-08-15";
        item.lastUpdated = now;
      }
    } else if (partialStage && si === partialStage.stageIdx) {
      const count = Math.floor(stage.items.length * partialStage.pct);
      for (let ii = 0; ii < count; ii++) {
        stage.items[ii].status = "completed";
        stage.items[ii].completionDate = "2026-09-01";
        stage.items[ii].lastUpdated = now;
      }
      for (let ii = count; ii < stage.items.length; ii++) {
        stage.items[ii].status = "in_progress";
        stage.items[ii].lastUpdated = now;
      }
    }
  }
  return {
    id,
    name,
    company,
    contactPerson: "Contact Person",
    contactNumber: "0900-000-0000",
    email: "lab@example.com",
    address: `123 Main Street, ${city}`,
    region: "Region X – Northern Mindanao",
    province: "Misamis Oriental",
    city,
    labType,
    classification: "General Clinical Laboratory — Primary",
    ownershipType: "Private",
    institutionalType: "Non-Institutional",
    facilityType: "New Facility",
    intendedServices: "Hematology, Clinical Chemistry, Urinalysis, Microbiology",
    proposedHours: "Monday to Friday, 7:00 AM – 5:00 PM",
    targetOpeningDate: "2027-01-01",
    consultant,
    projectNotes: "Demo laboratory project.",
    status: "active",
    startDate: "2026-07-01",
    clientId: "",
    selectedServices: ["new_lab_setup", "doh_lto", "qms", "sop_dev"],
    stages,
    documents: [
      { id: `doc-${id}-1`, name: "Letter of Intent", type: "Application", uploadDate: "2026-07-10", expirationDate: "", version: "1.0", status: "approved", uploadedBy: "Admin", uploadedByRole: "admin" as const, adminRemarks: "", notes: "", stageId: "p03", itemId: "" },
      { id: `doc-${id}-2`, name: "DTI Certificate", type: "Legal", uploadDate: "2026-07-15", expirationDate: "2027-07-15", version: "1.0", status: "approved", uploadedBy: "Admin", uploadedByRole: "admin" as const, adminRemarks: "", notes: "", stageId: "p05", itemId: "" },
    ],
    findings: [],
    activityLog: [
      { id: `act-${id}-1`, timestamp: "2026-09-01T08:00:00Z", description: "Floor plan submitted for review.", user: "Admin", prevStatus: undefined, newStatus: undefined },
      { id: `act-${id}-2`, timestamp: "2026-08-20T10:00:00Z", description: "Letter of Intent approved by regulatory authority.", user: "Admin", prevStatus: undefined, newStatus: undefined },
      { id: `act-${id}-3`, timestamp: "2026-07-01T09:00:00Z", description: "Laboratory project created.", user: "Admin", prevStatus: undefined, newStatus: undefined },
    ],
    notes: [
      { id: `note-${id}-1`, timestamp: "2026-09-01T08:00:00Z", text: "Client confirmed floor plan dimensions. Awaiting contractor completion by end of September.", author: "Admin", isInternal: true },
    ],
    createdAt: "2026-07-01T09:00:00Z",
    updatedAt: "2026-09-01T08:00:00Z",
  };
}

const DEMO_LABS: Laboratory[] = [
  makeDemoLab("demo-1", "ABC Diagnostic Laboratory", "ABC Medical Clinic", "Cagayan de Oro City", "Clinical Laboratory", "Brian Amba", [0, 1, 2], { stageIdx: 3, pct: 0.65 }),
  makeDemoLab("demo-2", "XYZ Medical Laboratory", "XYZ Healthcare Inc.", "Ozamiz City", "Standalone Laboratory", "Brian Amba", [0, 1], { stageIdx: 2, pct: 0.40 }),
  makeDemoLab("demo-3", "Sunrise Clinical Laboratory", "Sunrise Medical Group", "Iligan City", "Clinical Laboratory", "Brian Amba", [0], { stageIdx: 1, pct: 0.18 }),
];
