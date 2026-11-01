export type ItemStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "under_review"
  | "pending"
  | "for_revision"
  | "verified"
  | "completed"
  | "not_applicable";

export type DocStatus =
  | "missing"
  | "uploaded"
  | "under_review"
  | "approved"
  | "for_revision"
  | "expired";

export type LabStatus = "active" | "on_hold" | "completed" | "cancelled";

export type FindingSeverity = "minor" | "major" | "critical";
export type FindingStatus = "open" | "for_action" | "closed";

export interface LabDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  expirationDate: string;
  version: string;
  status: DocStatus;
  uploadedBy: string;
  uploadedByRole: "client" | "admin";
  notes: string;
  adminRemarks: string;
  stageId: string;
  itemId: string;
}

export type RequirementType =
  | "mandatory_doh"
  | "mandatory_other"
  | "mandatory_accreditation"
  | "facility_policy"
  | "good_practice"
  | "conditional";

export interface ChecklistItem {
  id: string;
  requirement: string;
  description: string;
  required: boolean;
  requirementType: RequirementType;
  status: ItemStatus;
  assignedTo: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  completionDate: string;
  verifiedBy: string;
  verifiedDate: string;
  notes: string;
  adminRemarks: string;
  clientRemarks: string;
  lastUpdated: string;
  documentIds: string[];
}

export interface Stage {
  id: string;
  number: number;
  name: string;
  moduleKey?: string;
  active: boolean;
  items: ChecklistItem[];
}

export interface Finding {
  id: string;
  description: string;
  category: string;
  severity: FindingSeverity;
  correctiveAction: string;
  responsiblePerson: string;
  dueDate: string;
  documentIds: string[];
  status: FindingStatus;
  closureDate: string;
}

export interface Activity {
  id: string;
  timestamp: string;
  description: string;
  user: string;
  prevStatus?: string;
  newStatus?: string;
}

export interface Note {
  id: string;
  timestamp: string;
  text: string;
  author: string;
  isInternal: boolean;
}

export interface Notification {
  id: string;
  recipientId: string;
  recipientRole: "client" | "admin";
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  type: "info" | "warning" | "success" | "action_required";
  labId?: string;
}

export interface ClientUser {
  id: string;
  email: string;
  password: string;
  name: string;
  mobile: string;
  company: string;
  position: string;
  role: "client";
  createdAt: string;
}

export interface Laboratory {
  id: string;
  name: string;
  company: string;
  contactPerson: string;
  contactNumber: string;
  email: string;
  address: string;
  region: string;
  province: string;
  city: string;
  labType: string;
  classification: string;
  ownershipType: string;
  institutionalType: string;
  facilityType: string;
  intendedServices: string;
  proposedHours: string;
  targetOpeningDate: string;
  consultant: string;
  projectNotes: string;
  status: LabStatus;
  startDate: string;
  clientId: string;
  selectedServices: string[];
  stages: Stage[];
  documents: LabDocument[];
  findings: Finding[];
  activityLog: Activity[];
  notes: Note[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: "admin" | "super_admin";
}
