import { Stage, Activity } from "./types";

export type ClientProjectStatus = "setup" | "active" | "on_hold" | "completed";
export type ClientDocStatus = "pending" | "under_review" | "approved" | "revision_required";

export interface ClientUser {
  id: string;
  email: string;
  password: string;
  name: string;
  mobile: string;
  company: string;
  position: string;
  agreedToTerms: boolean;
  createdAt: string;
}

export interface ClientDocument {
  id: string;
  name: string;
  fileName: string;
  uploadDate: string;
  version: number;
  status: ClientDocStatus;
  uploadedBy: string;
  reviewedBy: string;
  reviewDate: string;
  remarks: string;
  stageId: string;
  itemId: string;
}

export interface ClientNotification {
  id: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
  createdAt: string;
}

export interface ClientProject {
  id: string;
  clientId: string;
  name: string;
  address: string;
  region: string;
  province: string;
  city: string;
  owner: string;
  ownershipType: string;
  institutionType: string;
  facilityType: "new" | "existing";
  targetOpeningDate: string;
  operatingHours: string;
  labType: string;
  classification: string;
  capability: string;
  selectedServices: string[];
  activePhaseIds: string[];
  checklist: Stage[];
  documents: ClientDocument[];
  activityLog: Activity[];
  notifications: ClientNotification[];
  status: ClientProjectStatus;
  createdAt: string;
  updatedAt: string;
}
