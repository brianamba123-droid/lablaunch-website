import { ClientUser, ClientProject, ClientDocument, ClientNotification } from "./clientTypes";
import { createLabChecklist } from "./checklist";
import { getAllPhaseIds } from "./serviceModules";
import { ItemStatus } from "./types";

const CLIENT_AUTH_KEY = "ll_client_auth_v1";
const CLIENTS_KEY    = "ll_clients_v1";
const PROJECTS_KEY   = "ll_client_projects_v1";

/* ─── Client Users ─────────────────────────────────────────────── */
function loadClients(): ClientUser[] {
  try { return JSON.parse(localStorage.getItem(CLIENTS_KEY) || "[]"); } catch { return []; }
}
function saveClients(list: ClientUser[]) {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(list));
}

export function clientRegister(data: Omit<ClientUser, "id" | "createdAt">): { ok: boolean; error?: string } {
  const clients = loadClients();
  if (clients.find(c => c.email.toLowerCase() === data.email.toLowerCase())) {
    return { ok: false, error: "An account with this email already exists." };
  }
  const now = new Date().toISOString();
  const user: ClientUser = { ...data, id: `client-${Date.now()}`, createdAt: now };
  clients.push(user);
  saveClients(clients);
  return { ok: true };
}

export function clientLogin(email: string, password: string): boolean {
  const user = loadClients().find(c => c.email.toLowerCase() === email.toLowerCase() && c.password === password);
  if (!user) return false;
  localStorage.setItem(CLIENT_AUTH_KEY, JSON.stringify({ id: user.id, email: user.email, name: user.name, company: user.company }));
  return true;
}

export function clientLogout() {
  localStorage.removeItem(CLIENT_AUTH_KEY);
}

export function getClientAuth(): { id: string; email: string; name: string; company: string } | null {
  try {
    const raw = localStorage.getItem(CLIENT_AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
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
  // Refresh auth token if name changed
  if (updates.name) {
    const raw = localStorage.getItem(CLIENT_AUTH_KEY);
    if (raw) {
      const auth = JSON.parse(raw);
      auth.name = updates.name;
      localStorage.setItem(CLIENT_AUTH_KEY, JSON.stringify(auth));
    }
  }
  return true;
}

export function changeClientPassword(id: string, oldPass: string, newPass: string): { ok: boolean; error?: string } {
  const clients = loadClients();
  const idx = clients.findIndex(c => c.id === id);
  if (idx < 0) return { ok: false, error: "Account not found." };
  if (clients[idx].password !== oldPass) return { ok: false, error: "Current password is incorrect." };
  clients[idx].password = newPass;
  saveClients(clients);
  return { ok: true };
}

/* ─── Projects ─────────────────────────────────────────────────── */
function loadProjects(): ClientProject[] {
  try { return JSON.parse(localStorage.getItem(PROJECTS_KEY) || "[]"); } catch { return []; }
}
function saveProjects(list: ClientProject[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(list));
}

export function getClientProjects(clientId: string): ClientProject[] {
  return loadProjects().filter(p => p.clientId === clientId);
}

export function getClientProject(id: string): ClientProject | undefined {
  return loadProjects().find(p => p.id === id);
}

export function saveClientProject(project: ClientProject): ClientProject {
  const list = loadProjects();
  const idx = list.findIndex(p => p.id === project.id);
  if (idx >= 0) list[idx] = project;
  else list.unshift(project);
  saveProjects(list);
  return project;
}

export function createClientProject(data: {
  clientId: string;
  clientName: string;
  name: string; address: string; region: string; province: string; city: string;
  owner: string; ownershipType: string; institutionType: string;
  facilityType: "new" | "existing"; targetOpeningDate: string; operatingHours: string;
  labType: string; classification: string; capability: string;
  selectedServices: string[];
}): ClientProject {
  const now = new Date().toISOString();
  const activePhaseIds = getAllPhaseIds(data.selectedServices);
  const { clientName, ...projectData } = data;

  const project: ClientProject = {
    ...projectData,
    id: `cproj-${Date.now()}`,
    activePhaseIds,
    checklist: createLabChecklist(),
    documents: [],
    activityLog: [
      { id: `act-${Date.now()}`, timestamp: now, description: `Laboratory project "${data.name}" created by ${clientName}.`, user: clientName },
    ],
    notifications: [
      {
        id: `notif-${Date.now()}`,
        message: `Your laboratory project "${data.name}" has been created. Please review your personalized checklist and begin uploading required documents.`,
        type: "success",
        read: false,
        createdAt: now,
      },
    ],
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  const list = loadProjects();
  list.unshift(project);
  saveProjects(list);
  return project;
}

export function updateClientServices(
  projectId: string,
  selectedServices: string[],
  user: string
): ClientProject | undefined {
  const project = getClientProject(projectId);
  if (!project) return;
  const now = new Date().toISOString();
  project.selectedServices = selectedServices;
  project.activePhaseIds = getAllPhaseIds(selectedServices);
  project.updatedAt = now;
  project.activityLog.unshift({
    id: `act-${Date.now()}`,
    timestamp: now,
    description: `Selected services updated. Active checklist phases recalculated.`,
    user,
  });
  return saveClientProject(project);
}

/* ─── Checklist ────────────────────────────────────────────────── */
export function updateClientItemStatus(
  projectId: string, stageId: string, itemId: string,
  status: ItemStatus, user = "Client"
): ClientProject | undefined {
  const project = getClientProject(projectId);
  if (!project) return;
  const now = new Date().toISOString();
  for (const stage of project.checklist) {
    if (stage.id !== stageId) continue;
    for (const item of stage.items) {
      if (item.id !== itemId) continue;
      const prev = item.status;
      item.status = status;
      item.lastUpdated = now;
      if (status === "completed") item.completionDate = now.split("T")[0];
      project.activityLog.unshift({
        id: `act-${Date.now()}`,
        timestamp: now,
        description: `"${item.requirement}" changed from ${prev.replace(/_/g, " ")} to ${status.replace(/_/g, " ")}.`,
        user,
      });
    }
  }
  project.updatedAt = now;
  return saveClientProject(project);
}

/* ─── Documents ────────────────────────────────────────────────── */
export function addClientDocument(
  projectId: string, doc: Omit<ClientDocument, "id">, user = "Client"
): ClientProject | undefined {
  const project = getClientProject(projectId);
  if (!project) return;
  const now = new Date().toISOString();
  const newDoc: ClientDocument = { ...doc, id: `cdoc-${Date.now()}` };
  project.documents.unshift(newDoc);
  project.updatedAt = now;
  project.activityLog.unshift({ id: `act-${Date.now()}`, timestamp: now, description: `Document "${doc.name}" uploaded.`, user });
  addNotification(project, { message: `Your document "${doc.name}" has been submitted for review.`, type: "info" });
  return saveClientProject(project);
}

export function updateClientDocStatus(
  projectId: string, docId: string, status: import("./clientTypes").ClientDocStatus,
  remarks = "", reviewer = "Admin"
): ClientProject | undefined {
  const project = getClientProject(projectId);
  if (!project) return;
  const now = new Date().toISOString();
  const doc = project.documents.find(d => d.id === docId);
  if (!doc) return;
  doc.status = status;
  doc.remarks = remarks;
  doc.reviewedBy = reviewer;
  doc.reviewDate = now.split("T")[0];
  project.updatedAt = now;
  project.activityLog.unshift({ id: `act-${Date.now()}`, timestamp: now, description: `Document "${doc.name}" status updated to ${status.replace(/_/g, " ")} by ${reviewer}.`, user: reviewer });
  const msgMap: Record<string, string> = {
    approved: `Your document "${doc.name}" has been approved.`,
    revision_required: `Revision required for "${doc.name}". ${remarks ? `Note: ${remarks}` : ""}`,
    under_review: `"${doc.name}" is now under review.`,
  };
  if (msgMap[status]) addNotification(project, { message: msgMap[status], type: status === "approved" ? "success" : status === "revision_required" ? "warning" : "info" });
  return saveClientProject(project);
}

/* ─── Notifications ────────────────────────────────────────────── */
function addNotification(project: ClientProject, n: Pick<ClientNotification, "message" | "type">) {
  project.notifications.unshift({
    id: `notif-${Date.now()}`,
    message: n.message,
    type: n.type,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

export function markNotificationsRead(projectId: string) {
  const project = getClientProject(projectId);
  if (!project) return;
  project.notifications = project.notifications.map(n => ({ ...n, read: true }));
  saveClientProject(project);
}

/* ─── Progress ─────────────────────────────────────────────────── */
export function calcClientProgress(project: ClientProject): number {
  const activeSet = new Set(project.activePhaseIds);
  let total = 0, done = 0;
  for (const stage of project.checklist) {
    if (!activeSet.has(stage.id)) continue;
    for (const item of stage.items) {
      if (item.status === "not_applicable") continue;
      total++;
      if (item.status === "completed" || item.status === "submitted") done++;
    }
  }
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

export function getOutstandingCount(project: ClientProject): number {
  const activeSet = new Set(project.activePhaseIds);
  let count = 0;
  for (const stage of project.checklist) {
    if (!activeSet.has(stage.id)) continue;
    for (const item of stage.items) {
      if (item.status === "not_applicable" || item.status === "completed" || item.status === "submitted") continue;
      if (item.required) count++;
    }
  }
  return count;
}

export function getCurrentStageName(project: ClientProject): string {
  const activeSet = new Set(project.activePhaseIds);
  for (const stage of project.checklist) {
    if (!activeSet.has(stage.id)) continue;
    const allDone = stage.items.every(i => i.status === "completed" || i.status === "not_applicable");
    if (!allDone) return `Phase ${stage.number}: ${stage.name}`;
  }
  return "Completed";
}

/* ─── Admin helpers ─────────────────────────────────────────────── */
export function getAllClientProjects(): ClientProject[] {
  return loadProjects();
}

export function getAllClients(): ClientUser[] {
  return loadClients();
}
