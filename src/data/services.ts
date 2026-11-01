export interface ServiceItem {
  id: string;
  label: string;
  description: string;
  activatesModule?: string;
}

export interface ServiceCategory {
  id: string;
  label: string;
  services: ServiceItem[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "laboratory_establishment",
    label: "Laboratory Establishment",
    services: [
      { id: "new_lab_setup", label: "New Laboratory Setup", description: "End-to-end guidance for setting up a new laboratory from concept to operation." },
      { id: "facility_planning", label: "Facility Planning", description: "Space planning, layout design, and facility requirements assessment." },
      { id: "floor_plan", label: "Floor Plan / Space Planning", description: "Preparation and review of laboratory floor plans per DOH Annex D1 and D2." },
      { id: "ptc_assistance", label: "Permit to Construct Assistance", description: "Preparation and submission support for the DOH Permit to Construct." },
      { id: "doh_lto", label: "DOH LTO Application", description: "Guidance through the complete DOH License to Operate application process." },
    ],
  },
  {
    id: "quality_compliance",
    label: "Quality & Compliance",
    services: [
      { id: "doh_licensing", label: "DOH Licensing Preparation", description: "Preparation of all documentation required for DOH licensing." },
      { id: "doh_assessment", label: "DOH Assessment Preparation", description: "Preparation for the DOH on-site assessment using Annex B1." },
      { id: "qms", label: "Quality Management System", description: "Development and implementation of a laboratory QMS." },
      { id: "sop_dev", label: "SOP Development", description: "Development of all required Standard Operating Procedures." },
      { id: "doc_control", label: "Document Control", description: "Implementation of a document and record control system." },
      { id: "iqc", label: "Internal Quality Control", description: "IQC program development, including QC materials, charting, and review." },
      { id: "neqas", label: "NEQAS / EQA Preparation", description: "External Quality Assessment program enrollment and participation support." },
      { id: "mock_inspection", label: "Mock DOH Inspection", description: "LabLaunch-conducted simulated DOH inspection prior to the actual assessment." },
      { id: "capa", label: "Corrective Action / CAPA", description: "Corrective and preventive action system development and support." },
    ],
  },
  {
    id: "personnel",
    label: "Personnel",
    services: [
      { id: "head_lab_compliance", label: "Head of Laboratory Compliance", description: "Documentation and compliance support for the Head of Laboratory." },
      { id: "personnel_docs", label: "Personnel Documentation", description: "Preparation of all personnel document files." },
      { id: "personnel_training", label: "Personnel Training", description: "Training coordination for laboratory personnel." },
      { id: "competency_assessment", label: "Competency Assessment", description: "Development and implementation of competency assessment tools and records." },
      { id: "occupational_health", label: "Occupational Health Documentation", description: "Medical certificates, vaccination records, and occupational health documentation." },
    ],
  },
  {
    id: "equipment_operations",
    label: "Equipment & Operations",
    services: [
      { id: "equipment_selection", label: "Equipment Selection", description: "Guidance on appropriate equipment selection per service capability and budget." },
      { id: "equipment_install", label: "Equipment Installation / Commissioning", description: "Coordination of equipment installation, commissioning, and acceptance testing." },
      { id: "calibration", label: "Calibration & Maintenance System", description: "Development of preventive maintenance and calibration systems." },
      { id: "reagent_mgmt", label: "Reagent / Supply Management", description: "Reagent master lists, receiving procedures, and inventory management." },
      { id: "lab_workflow", label: "Laboratory Workflow Development", description: "Pre-analytical, analytical, and post-analytical workflow design." },
      { id: "lis", label: "LIS / IT Setup", description: "Laboratory Information System and IT infrastructure guidance." },
    ],
  },
  {
    id: "special_services",
    label: "Special Services",
    services: [
      { id: "remote_collection", label: "Remote Collection Permit", description: "Assistance with DOH permit for a remote collection site.", activatesModule: "remote_collection" },
      { id: "molecular_pathology", label: "Molecular Pathology", description: "Compliance and setup requirements for molecular pathology services.", activatesModule: "molecular_pathology" },
      { id: "anatomic_pathology", label: "Anatomic Pathology", description: "Compliance and setup requirements for anatomic pathology services.", activatesModule: "anatomic_pathology" },
      { id: "hiv_testing", label: "HIV Testing / Confirmatory Testing", description: "Applicable DOH requirements for HIV and confirmatory testing.", activatesModule: "hiv_testing" },
      { id: "drug_testing", label: "Drug Testing Laboratory", description: "Drug testing laboratory requirements (distinct from GCL LTO workflow).", activatesModule: "drug_testing" },
    ],
  },
  {
    id: "accreditation",
    label: "Accreditation",
    services: [
      { id: "philhealth_accreditation", label: "PhilHealth Accreditation", description: "Preparation and support for PhilHealth accreditation application.", activatesModule: "accreditation" },
      { id: "other_accreditation", label: "Other Accreditation", description: "Support for other applicable accreditation programs.", activatesModule: "accreditation" },
      { id: "accreditation_readiness", label: "Accreditation Readiness Assessment", description: "Assessment of the laboratory's readiness for accreditation.", activatesModule: "accreditation" },
    ],
  },
];

export const ALL_SERVICES: ServiceItem[] = SERVICE_CATEGORIES.flatMap(c => c.services);

export function getServiceById(id: string): ServiceItem | undefined {
  return ALL_SERVICES.find(s => s.id === id);
}

export function getModulesForServices(selectedServices: string[]): Set<string> {
  const modules = new Set<string>();
  for (const sid of selectedServices) {
    const svc = getServiceById(sid);
    if (svc?.activatesModule) modules.add(svc.activatesModule);
  }
  return modules;
}

export const CORE_MODULE_STAGES = [
  "p01","p02","p03","p04","p05","p06","p07","p08","p09","p10",
  "p11","p12","p13","p14","p15","p16","p17","p18","p19","p20",
  "p21","p22","p23","p24","p25","p26","p27","p28","p29","p30",
  "p31","p32","p33","p35",
];
