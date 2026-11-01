export interface ServiceOption {
  id: string;
  label: string;
  description: string;
  activatesPhases: string[];
  note?: string;
}

export interface ServiceGroup {
  id: string;
  label: string;
  services: ServiceOption[];
}

/* Phase IDs from CHECKLIST_TEMPLATE in checklist.ts */
const CORE = ["p01","p02","p03","p04","p05","p06","p07","p08","p09","p10","p11","p12","p13","p14","p15","p16","p17","p18","p19","p20","p21","p22","p23","p24","p25","p26","p27","p28","p29","p30","p31","p32","p33","p35"];
const ACC  = ["p34","p35"];

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    id: "establishment",
    label: "Laboratory Establishment",
    services: [
      { id: "new_lab_setup", label: "New Laboratory Setup", description: "Complete end-to-end setup assistance from project intake through licensing.", activatesPhases: CORE },
      { id: "facility_planning", label: "Facility Planning", description: "Space planning, layout design, and workflow optimization.", activatesPhases: ["p04","p13"] },
      { id: "floor_plan", label: "Floor Plan / Space Planning", description: "Preparation and DOH review of laboratory architectural floor plans.", activatesPhases: ["p04","p13"] },
      { id: "ptc", label: "Permit to Construct Assistance", description: "Preparation and submission of the DOH Permit to Construct application.", activatesPhases: ["p04"] },
      { id: "doh_lto", label: "DOH LTO Application", description: "Complete assistance with the DOH License to Operate application and inspection.", activatesPhases: ["p27","p28","p29","p30","p31","p32","p33"] },
    ],
  },
  {
    id: "quality",
    label: "Quality & Compliance",
    services: [
      { id: "doh_licensing", label: "DOH Licensing Preparation", description: "Comprehensive preparation for all DOH licensing requirements per AO 2021-0037.", activatesPhases: CORE },
      { id: "doh_assessment", label: "DOH Assessment Preparation", description: "Preparation and readiness review for DOH on-site assessment (Annex B1).", activatesPhases: ["p27","p28","p31"] },
      { id: "qms", label: "Quality Management System", description: "Development and implementation of a laboratory Quality Management System.", activatesPhases: ["p16","p17","p18","p19","p20","p21","p25","p26"] },
      { id: "sop_dev", label: "SOP Development", description: "Development of all required Standard Operating Procedures.", activatesPhases: ["p17"] },
      { id: "doc_control", label: "Document Control", description: "Implementation of a document control and record management system.", activatesPhases: ["p18","p19"] },
      { id: "iqc", label: "Internal Quality Control", description: "Setup of IQC procedures, Levey-Jennings charts, and review processes.", activatesPhases: ["p20"] },
      { id: "neqas", label: "NEQAS / EQA Preparation", description: "Enrollment and preparation for external quality assessment programs.", activatesPhases: ["p21"] },
      { id: "mock_inspection", label: "Mock DOH Inspection", description: "Simulated DOH inspection to identify and address gaps before the actual assessment.", activatesPhases: ["p28"] },
      { id: "capa", label: "Corrective Action / CAPA", description: "Assistance with corrective and preventive action documentation and implementation.", activatesPhases: ["p32"] },
    ],
  },
  {
    id: "personnel",
    label: "Personnel",
    services: [
      { id: "hol_compliance", label: "Head of Laboratory Compliance", description: "Verification and documentation of Head of Laboratory qualifications.", activatesPhases: ["p06"] },
      { id: "personnel_docs", label: "Personnel Documentation", description: "Compilation of credentials, health records, and vaccination records for all personnel.", activatesPhases: ["p06","p07","p08","p09","p10","p11","p12"] },
      { id: "personnel_training", label: "Personnel Training", description: "Arrangement and documentation of required laboratory safety and quality training.", activatesPhases: ["p10"] },
      { id: "competency", label: "Competency Assessment", description: "Design and implementation of personnel competency assessment programs.", activatesPhases: ["p11"] },
      { id: "occ_health", label: "Occupational Health Documentation", description: "Coordination of pre-employment health examinations and vaccination records.", activatesPhases: ["p08","p09"] },
    ],
  },
  {
    id: "equipment",
    label: "Equipment & Operations",
    services: [
      { id: "equip_selection", label: "Equipment Selection", description: "Advisory on instrument selection per DOH requirements and intended test menu.", activatesPhases: ["p14","p15"] },
      { id: "equip_commission", label: "Equipment Installation / Commissioning", description: "Documentation and coordination of equipment installation and acceptance testing.", activatesPhases: ["p14"] },
      { id: "calibration", label: "Calibration & Maintenance System", description: "Setup of calibration schedules, preventive maintenance programs, and records.", activatesPhases: ["p14","p35"] },
      { id: "reagent_mgmt", label: "Reagent / Supply Management", description: "Setup of reagent and supply inventory, tracking, and control systems.", activatesPhases: ["p15"] },
      { id: "lab_workflow", label: "Laboratory Workflow Development", description: "Design and documentation of pre-analytical, analytical, and post-analytical workflows.", activatesPhases: ["p13","p17"] },
    ],
  },
  {
    id: "special",
    label: "Special Services",
    services: [
      { id: "remote_collection", label: "Remote Collection Permit", description: "Assistance with DOH permit application for remote specimen collection sites.", activatesPhases: ["p02","p03","p29"], note: "Activates Remote Collection module" },
      { id: "molecular", label: "Molecular Pathology", description: "Setup assistance for molecular diagnostic services including PCR-based testing.", activatesPhases: ["p02","p04","p14","p17","p22"], note: "Activates Molecular Pathology module" },
      { id: "anatomic", label: "Anatomic Pathology", description: "Setup assistance for histopathology and cytology laboratory services.", activatesPhases: ["p02","p04","p14","p17","p23"], note: "Activates Anatomic Pathology module" },
      { id: "hiv_testing", label: "HIV Testing / Confirmatory Testing", description: "Compliance assistance for HIV testing and confirmatory testing authorization.", activatesPhases: ["p02","p17","p22"], note: "Activates HIV Testing module" },
      { id: "drug_testing", label: "Drug Testing Laboratory", description: "Setup and compliance for PDEA-accredited drug testing laboratories.", activatesPhases: ["p01","p02","p05"], note: "Separate regulatory track from DOH GCL" },
      { id: "limited_service", label: "Limited-Service Laboratory", description: "Setup assistance for limited-service laboratory authorization.", activatesPhases: ["p02","p29"] },
    ],
  },
  {
    id: "accreditation",
    label: "Accreditation",
    services: [
      { id: "philhealth_accreditation", label: "PhilHealth Accreditation", description: "Assistance with PhilHealth accreditation application and requirements.", activatesPhases: ACC },
      { id: "other_accreditation", label: "Other Accreditation", description: "Assistance with other applicable accreditation programs.", activatesPhases: ACC },
      { id: "accreditation_readiness", label: "Accreditation Readiness Assessment", description: "Pre-accreditation gap assessment to identify outstanding requirements.", activatesPhases: ["p34"] },
    ],
  },
];

const ACCREDITATION_SERVICE_IDS = new Set(["philhealth_accreditation","other_accreditation","accreditation_readiness"]);

export function getAllPhaseIds(selectedServices: string[]): string[] {
  const phaseSet = new Set<string>();

  // Core phases always present for a GCL project
  const coreAlways = ["p01","p02","p03","p04","p05","p06","p07","p08","p09","p10","p11","p12","p13","p14","p15","p16","p17","p18","p19","p20","p21","p22","p23","p24","p25","p26","p27","p28","p29","p30","p31","p32","p33","p35"];
  coreAlways.forEach(p => phaseSet.add(p));

  // Additional phases from selected services
  for (const group of SERVICE_GROUPS) {
    for (const svc of group.services) {
      if (selectedServices.includes(svc.id)) {
        svc.activatesPhases.forEach(p => phaseSet.add(p));
      }
    }
  }

  // Accreditation phases only if explicitly selected
  const hasAccreditation = selectedServices.some(s => ACCREDITATION_SERVICE_IDS.has(s));
  if (hasAccreditation) {
    phaseSet.add("p34");
  }

  return Array.from(phaseSet).sort((a, b) => {
    const na = parseInt(a.slice(1));
    const nb = parseInt(b.slice(1));
    return na - nb;
  });
}

export function getServiceLabel(serviceId: string): string {
  for (const group of SERVICE_GROUPS) {
    const svc = group.services.find(s => s.id === serviceId);
    if (svc) return svc.label;
  }
  return serviceId;
}
