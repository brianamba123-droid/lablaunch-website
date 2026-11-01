import { Stage, RequirementType } from "./types";

let _counter = 0;

function item(
  requirement: string,
  description: string,
  requirementType: RequirementType = "mandatory_doh",
  required = true,
) {
  _counter++;
  return {
    id: `tpl-${_counter}`,
    requirement,
    description,
    required,
    requirementType,
    status: "not_started" as const,
    assignedTo: "",
    dueDate: "",
    priority: "medium" as const,
    completionDate: "",
    verifiedBy: "",
    verifiedDate: "",
    notes: "",
    adminRemarks: "",
    clientRemarks: "",
    lastUpdated: "",
    documentIds: [] as string[],
  };
}

/* Shorthand helpers */
const doh  = (req: string, desc: string, required = true) => item(req, desc, "mandatory_doh", required);
const gov  = (req: string, desc: string, required = true) => item(req, desc, "mandatory_other", required);
const cond = (req: string, desc: string, required = false) => item(req, desc, "conditional", required);
const acc  = (req: string, desc: string, required = false) => item(req, desc, "mandatory_accreditation", required);
const gp   = (req: string, desc: string, required = false) => item(req, desc, "good_practice", required);
const fp   = (req: string, desc: string, required = false) => item(req, desc, "facility_policy", required);

export const CHECKLIST_TEMPLATE: Stage[] = [

  // ──────────────────────────────────────────────────────────────────
  // PHASE 1 — Initial Project Documents
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p01", number: 1, name: "Initial Project Documents", active: true,
    items: [
      // A. Client information
      fp("Client Information Sheet", "Completed client profile containing owner and contact details."),
      fp("Owner Information Sheet", "Full legal name, address, and identification information of the owner or authorized representative."),
      fp("Authorized Representative Form", "Signed authorization for any representative acting on behalf of the owner."),
      fp("Contact Information", "Primary and secondary contact numbers and email addresses for the laboratory project."),
      fp("Proposed Laboratory Name", "Intended name of the laboratory as it will appear in all applications."),
      fp("Proposed Laboratory Address", "Complete address of the proposed laboratory site."),
      fp("Project Description", "Narrative describing the laboratory concept, rationale, and intended scope."),
      fp("Proposed Opening Date", "Target date for the laboratory to begin operations."),
      fp("Proposed Operating Hours", "Intended daily and weekly operating schedule."),
      fp("Proposed Laboratory Services", "List of intended diagnostic and testing services to be offered."),
      // B. Ownership
      doh("Proof of Ownership or Authority to Use Premises", "Land title, contract of lease, or other document establishing the right to occupy the laboratory site."),
      cond("Land Title", "Transfer Certificate of Title or other title document, if the premises are owned.", false),
      cond("Contract of Lease", "Signed lease contract with the lessor, if the premises are leased.", false),
      cond("Authority to Use Premises", "Written permission from the property owner if the premises are neither owned nor leased directly by the applicant.", false),
      cond("Corporation Documents", "Certificate of Incorporation, Articles of Incorporation, and By-Laws, if the applicant is a corporation.", false),
      cond("Partnership Documents", "Articles of Partnership, if the applicant is a partnership.", false),
      cond("DTI Certificate of Registration", "DTI Business Name Registration, if the applicant is a sole proprietorship.", false),
      cond("SEC Certificate of Registration", "SEC registration documents, if the applicant is a corporation or partnership.", false),
      cond("CDA Registration", "CDA registration documents, if the applicant is a cooperative.", false),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 2 — Regulatory Assessment
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p02", number: 2, name: "Regulatory Assessment & Applicability Review", active: true,
    items: [
      doh("AO 2021-0037 Applicability Assessment", "Confirm that AO 2021-0037 governs the intended laboratory and identify all applicable provisions."),
      doh("Service Capability Determination", "Determine the laboratory's intended service capability per Annex A of AO 2021-0037."),
      doh("Laboratory Classification Determination", "Classify the laboratory as Primary, Secondary, or Tertiary per AO 2021-0037."),
      doh("Institutional or Non-Institutional Determination", "Determine whether the laboratory is institutionally or non-institutionally based."),
      doh("Clinical / Anatomic / Molecular Determination", "Identify the applicable laboratory type(s): clinical, anatomic, molecular, or combinations."),
      cond("Special Service Determination", "Identify any special service or special authorization requirements applicable to the intended test menu.", false),
      doh("Applicable DOH Issuances Identified", "Compile all relevant DOH administrative orders, circulars, and memoranda applicable to the laboratory."),
      cond("Additional Permit Requirements Identified", "Identify requirements from other regulatory bodies beyond DOH (DENR, LGU, BFP, etc.).", false),
      // Regulatory Reference File
      doh("AO 2021-0037 on File", "Current copy of Administrative Order 2021-0037 obtained and filed."),
      doh("Annex A – Service Capability on File", "Official Annex A of AO 2021-0037 obtained and reviewed."),
      doh("Annex B1 – Assessment Tool on File", "Official 13-page DOH Assessment Tool for Licensing a General Clinical Laboratory obtained and filed."),
      doh("Annex D1 – Planning and Design Guidelines on File", "DOH Planning and Design Guidelines for clinical laboratories obtained and filed."),
      doh("Annex D2 – Checklist for Review of Floor Plans on File", "DOH Floor Plan Review Checklist obtained and filed."),
      doh("Equipment/Reagent Requirements Reference on File", "DOH equipment, instrument, glassware, supplies, and reagent requirements per service capability obtained and filed."),
      cond("Subsequent DOH Issuances Identified", "Any DOH issuances amending or supplementing AO 2021-0037 identified and filed.", false),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 3 — Letter of Intent
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p03", number: 3, name: "Letter of Intent (LOI) Document Package", active: true,
    items: [
      doh("Letter of Intent Drafted", "LOI addressed to the appropriate DOH Center for Health Development or Regional Office."),
      doh("Correct DOH Office Verified", "Confirmed the correct CHD/RO receiving the LOI based on the laboratory's region."),
      doh("Correct Signatory Verified", "LOI signed by the authorized owner or representative with correct designation."),
      doh("Facility Name Consistent", "Laboratory name in the LOI matches all other application documents."),
      doh("Address Consistent", "Laboratory address in the LOI matches all other application documents."),
      doh("Classification Consistent", "Proposed classification stated in the LOI is consistent with the regulatory assessment."),
      doh("Service Capability Consistent", "Proposed service capability stated in the LOI is consistent with the regulatory assessment."),
      doh("Proposed Laboratory Services Listed", "Intended diagnostic services listed in the LOI."),
      doh("Proposed Head of Laboratory Identified", "Name, qualification, and designation of the proposed Head of Laboratory stated in the LOI."),
      doh("Authorized Representative Documentation Attached", "Authorization letter or board resolution attached where applicable."),
      doh("Supporting Project Documents Attached", "Proof of ownership, business/entity documents, and other required attachments compiled."),
      doh("LOI Reviewed and Finalized", "Final review of the LOI package before submission."),
      doh("LOI Submitted", "Letter of Intent submitted to the appropriate DOH office."),
      doh("Proof of Submission Obtained", "Receiving stamp, acknowledgment receipt, or reference number obtained."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 4 — Permit to Construct
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p04", number: 4, name: "Permit to Construct & Facility Design Documents", active: true,
    items: [
      doh("Application for Permit to Construct Prepared", "DOH application for Permit to Construct completed and ready for submission."),
      doh("Letter of Intent Attached", "Copy of the previously submitted or approved LOI attached to the PTC application."),
      doh("Project Description Attached", "Detailed project description included in the PTC package."),
      doh("Architectural Plans Prepared", "Complete architectural plans by a licensed architect prepared and signed."),
      doh("General Floor Plan Prepared", "Overall laboratory floor plan prepared per DOH Planning and Design Guidelines (Annex D1)."),
      doh("Laboratory Working-Area Plan Prepared", "Detailed working-area layout showing all laboratory sections and benches."),
      cond("Collection Area Plan Prepared", "Phlebotomy/collection area plan prepared, where applicable.", false),
      doh("Equipment Layout Prepared", "Equipment and instrument placement shown on the floor plan."),
      cond("Furniture Layout Prepared", "Furniture and fixtures layout prepared.", false),
      cond("Plumbing Layout Prepared", "Plumbing plan prepared per applicable requirements.", false),
      cond("Electrical Layout Prepared", "Electrical plan prepared per applicable requirements.", false),
      cond("Ventilation/Airflow Design Prepared", "Ventilation and airflow design prepared for areas requiring controlled ventilation.", false),
      doh("Waste Management Area Designated on Plan", "Waste holding/management area clearly identified on the floor plan."),
      doh("Emergency Exits Indicated on Plan", "Emergency exits clearly marked on the floor plan."),
      doh("Fire Safety Provisions Indicated", "Fire safety features indicated on the plan (extinguisher locations, alarms, exits)."),
      doh("Site/Location Plan Attached", "Site plan showing the location of the laboratory within its surroundings."),
      doh("Proof of Ownership/Authority Attached", "Document establishing the right to occupy and construct within the premises attached."),
      doh("Floor Plan Review per Annex D2 Completed", "DOH Checklist for Review of Floor Plans (Annex D2) completed and used to verify the plan."),
      doh("Permit to Construct Submitted", "Complete PTC application package submitted to the DOH."),
      doh("Permit to Construct Received/Approved", "DOH Permit to Construct obtained and filed."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 5 — Business, LGU & Other Government Documents
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p05", number: 5, name: "Business Registration & LGU / Government Permits", active: true,
    items: [
      cond("DTI Certificate of Business Name Registration", "DTI registration obtained, if applicable.", false),
      cond("SEC Certificate of Registration", "SEC Certificate of Registration and Articles of Incorporation obtained, if applicable.", false),
      cond("Articles of Incorporation", "Certified copy of Articles of Incorporation filed.", false),
      cond("By-Laws", "Certified copy of the Corporation By-Laws filed.", false),
      gov("Mayor's Permit / Business Permit", "Local government unit business permit obtained for the laboratory."),
      gov("Barangay Clearance", "Barangay clearance for the laboratory location obtained."),
      gov("BIR Registration", "Bureau of Internal Revenue registration and Certificate of Registration obtained."),
      gov("Fire Safety Inspection Certificate (FSIC)", "Fire Safety Inspection Certificate issued by the Bureau of Fire Protection obtained."),
      cond("Building Permit", "Building permit from the LGU obtained, if required for construction or renovation.", false),
      cond("Certificate of Occupancy", "Certificate of Occupancy or Certificate of Completion obtained, as required.", false),
      gov("Sanitary Permit", "Sanitary permit issued by the local health authority obtained."),
      gov("Waste Management Documentation", "Waste management compliance documentation obtained per applicable requirements."),
      cond("DENR Documentation/Permit", "DENR permit or compliance certificate obtained, where applicable.", false),
      cond("Other LGU Permits", "Any other locally required permits identified and obtained.", false),
      cond("Other Agency Permits", "Any other national agency permits identified and obtained.", false),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 6 — Head of Laboratory Personnel File
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p06", number: 6, name: "Head of Laboratory — Personnel Documents", active: true,
    items: [
      doh("Curriculum Vitae", "Current CV of the Head of Laboratory."),
      doh("Diploma", "Copy of relevant academic diploma."),
      doh("PRC License", "Current valid PRC license of the Head of Laboratory."),
      doh("PRC ID", "Current PRC ID card of the Head of Laboratory."),
      doh("PRC Certificate of Registration", "PRC Certificate of Registration on file."),
      cond("Certificate of Good Standing (PRC)", "Certificate of Good Standing from PRC, if required.", false),
      cond("Specialty Certificate", "Board specialty certificate, if applicable.", false),
      gp("Relevant Training Certificates", "Certificates from relevant training, seminars, or continuing education."),
      doh("Appointment / Designation Letter", "Formal appointment or designation as Head of Laboratory."),
      fp("Employment Contract", "Signed employment contract or service agreement."),
      doh("Job Description", "Written job description for the Head of Laboratory."),
      fp("Work Schedule", "Documented work schedule showing days and hours of service."),
      doh("Organizational Chart — Position Indicated", "Organizational chart showing the Head of Laboratory's position and authority."),
      doh("Authority and Responsibility Document", "Document defining the authority and responsibilities of the Head of Laboratory."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 7 — Medical Technologist / RMT Personnel Files
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p07", number: 7, name: "Medical Technologist (RMT) — Personnel Documents", active: true,
    items: [
      doh("Curriculum Vitae (per RMT)", "Current CV for each Registered Medical Technologist on staff."),
      doh("Diploma (per RMT)", "Copy of the Medical Technology diploma for each RMT."),
      doh("PRC Certificate of Registration (per RMT)", "PRC Certificate of Registration for each RMT."),
      doh("PRC ID (per RMT)", "Current PRC ID card for each RMT."),
      doh("Current PRC License (per RMT)", "Current valid PRC license for each RMT on file."),
      cond("Board Certificate (per RMT)", "Board-issued certificate, where applicable.", false),
      fp("Employment Contract (per RMT)", "Signed employment contract for each RMT."),
      fp("Appointment Letter (per RMT)", "Formal appointment letter for each RMT."),
      doh("Job Description (per RMT)", "Written job description for each RMT position."),
      fp("Work Schedule (per RMT)", "Documented work schedule for each RMT."),
      cond("Assignment / Section Designation (per RMT)", "Documentation of laboratory section or testing area assignment.", false),
      gp("Relevant Training Certificates (per RMT)", "Certificates of relevant training or continuing education for each RMT."),
      doh("Competency Assessment Record (per RMT)", "Completed competency assessment for each RMT."),
      fp("Orientation Record (per RMT)", "Documentation of laboratory orientation completion for each RMT."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 8 — Personnel Health Documents
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p08", number: 8, name: "Personnel Health & Medical Certificates", active: true,
    items: [
      fp("Pre-Employment Medical Examination", "Pre-employment medical examination conducted and documented for each applicable laboratory worker."),
      fp("Medical Certificate / Fit-to-Work Certificate", "Valid medical certificate or fit-to-work certificate on file for each applicable laboratory worker."),
      fp("Health Assessment Documentation", "Health assessment results documented and filed."),
      fp("Physical Examination Record", "Physical examination record on file for each applicable worker."),
      fp("Occupational Health Record", "Occupational health records maintained for each laboratory worker."),
      fp("Required Health Screening (per applicable requirements)", "Health screening tests conducted per applicable regulatory, occupational health, LGU, or facility policy requirements. Specific panel to be determined per applicable issuance."),
      fp("Annual / Periodic Medical Examination", "Annual or periodic medical examination conducted and documented where required."),
      fp("Medical Clearance Following Illness / Exposure", "Medical clearance documented for personnel returning from illness or exposure-related leave, where applicable."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 9 — Vaccination & Immunization Records
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p09", number: 9, name: "Personnel Vaccination & Immunization Records", active: true,
    items: [
      fp("Immunization History Reviewed (per applicable worker)", "Immunization history reviewed for each applicable laboratory worker."),
      fp("Vaccination Record Available", "Vaccination records on file and accessible for each applicable worker."),
      fp("Vaccination Card / Certificate", "Original or certified vaccination card or certificate on file."),
      fp("Hepatitis B Vaccination Status Documented", "Hepatitis B vaccination status formally documented for each applicable worker."),
      fp("Hepatitis B Dose 1 Documented", "Hepatitis B Dose 1 date and lot number documented."),
      fp("Hepatitis B Dose 2 Documented", "Hepatitis B Dose 2 date and lot number documented."),
      fp("Hepatitis B Dose 3 Documented", "Hepatitis B Dose 3 date and lot number documented."),
      cond("Other Applicable Occupational Vaccines Documented", "Other vaccines required per applicable occupational health, DOH, or facility policy documented.", false),
      fp("Immunization Status Assessed and Documented", "Overall immunization status formally assessed and recorded for each worker."),
      cond("Serologic Evidence / Titer Documented", "Serologic evidence or antibody titer documented where required by policy or applicable regulation.", false),
      fp("Vaccination Referral for Incomplete Immunization", "Referral to vaccination program documented for workers with incomplete immunization."),
      cond("Post-Exposure Vaccination / Management Documented", "Post-exposure prophylaxis or vaccination documented where applicable.", false),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 10 — Personnel Safety & Health Training
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p10", number: 10, name: "Personnel Health & Safety Training Records", active: true,
    items: [
      doh("Occupational Health Orientation", "Occupational health orientation conducted and documented for all laboratory workers."),
      doh("Biosafety Training", "Biosafety training completed and documented for all applicable personnel."),
      doh("PPE Training", "Personal protective equipment selection, use, and disposal training documented."),
      doh("Infection Prevention and Control Training", "Infection prevention and control training completed and documented."),
      doh("Healthcare Waste Management Training", "Healthcare waste management and segregation training documented."),
      fp("Exposure Control Training", "Training on exposure prevention and control procedures documented."),
      doh("Sharps Injury Management Orientation", "Sharps injury prevention and post-exposure management orientation documented."),
      fp("Spill Response Training", "Biological and chemical spill response training documented."),
      fp("Emergency Response Training", "Emergency response procedures training documented."),
      fp("Incident Reporting Orientation", "Incident identification and reporting orientation documented."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 11 — Personnel Competency Documents
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p11", number: 11, name: "Personnel Competency Assessment", active: true,
    items: [
      doh("Initial Competency Assessment Completed", "Initial competency assessment conducted for all laboratory personnel prior to independent work."),
      doh("Section-Specific Competency Assessment", "Competency assessed for each laboratory section to which the personnel is assigned."),
      doh("Instrument Competency Assessment", "Competency assessed for each instrument or analyzer operated by the personnel."),
      doh("Test Method Competency Assessment", "Competency assessed for each test method performed by the personnel."),
      doh("Specimen Processing Competency Assessment", "Competency in specimen handling, processing, and rejection criteria assessed."),
      doh("Internal Quality Control Competency", "Competency in QC procedures, interpretation, and out-of-control response assessed."),
      doh("Result Reporting Competency", "Competency in result verification, authorization, and reporting assessed."),
      doh("Safety Competency Assessment", "Competency in biosafety, PPE use, and emergency response assessed."),
      doh("Periodic Competency Reassessment", "Periodic competency reassessment conducted at defined intervals."),
      fp("Corrective Training Documented", "Any corrective training provided following competency failures documented."),
      doh("Competency Reassessment After Training", "Competency reassessment conducted following corrective training and documented."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 12 — Organizational & Management Documents
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p12", number: 12, name: "Organizational & Management Documents", active: true,
    items: [
      doh("Organizational Chart", "Current laboratory organizational chart showing all positions, reporting lines, and authorities."),
      fp("Personnel Roster", "Complete list of all laboratory personnel with positions and license numbers."),
      doh("Head of Laboratory Designation Document", "Formal designation of the Head of Laboratory by the owner or governing body."),
      doh("Job Descriptions — All Positions", "Written job descriptions for all laboratory positions on file."),
      doh("Delegation of Authority", "Document defining authority delegation for laboratory management and quality functions."),
      doh("Laboratory Management Policy", "Written policy defining the management structure, responsibilities, and accountability."),
      doh("Management Responsibilities Defined", "Documented definition of management responsibilities for quality and operations."),
      doh("Quality Responsibilities Defined", "Documented definition of quality management responsibilities for all applicable personnel."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 13 — Facility Documents
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p13", number: 13, name: "Facility Documents", active: true,
    items: [
      doh("Approved Floor Plan on File", "DOH-approved or DOH-reviewed floor plan on file."),
      doh("Permit to Construct on File", "DOH Permit to Construct on file."),
      gp("Architectural Plans on File", "Complete architectural plans on file for reference."),
      cond("As-Built Documentation", "As-built drawings or documentation reflecting actual construction, where applicable.", false),
      doh("Equipment Layout on File", "Final equipment layout matching the approved floor plan on file."),
      gp("Laboratory Workflow Diagram", "Diagram showing the flow of specimens, personnel, and results through the laboratory."),
      gp("Patient / Client Flow Diagram", "Diagram showing the flow of patients or clients from collection to result release."),
      gp("Specimen Flow Diagram", "Diagram showing the flow of specimens from receipt through processing, testing, and disposal."),
      gp("Waste Flow Diagram", "Diagram showing the segregation, collection, storage, and disposal of all waste types."),
      doh("Emergency Exit Plan", "Emergency exit plan posted and on file."),
      doh("Fire Safety Documentation", "Fire safety documentation including evacuation plan, extinguisher log, and FSIC on file."),
      fp("Facility Maintenance Records", "Facility maintenance and cleaning records maintained."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 14 — Equipment Document Package
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p14", number: 14, name: "Equipment Records & Documentation (Per Instrument)", active: true,
    items: [
      doh("Equipment Master Record Created", "Individual equipment master record created for each instrument/equipment (name, manufacturer, model, serial number, asset number, date acquired, date installed, location, section, intended test, supplier)."),
      doh("Purchase Document on File", "Purchase order or proof of purchase for each instrument on file."),
      doh("Delivery Document on File", "Delivery receipt or waybill for each instrument on file."),
      doh("Installation Record on File", "Installation report or record for each instrument on file."),
      doh("Acceptance Record on File", "Acceptance testing record for each instrument on file."),
      doh("User Manual on File", "Manufacturer's user/operation manual for each instrument on file."),
      gp("Service Manual on File", "Manufacturer's service/technical manual on file, where available."),
      fp("Warranty Document on File", "Manufacturer's warranty certificate or service contract on file."),
      doh("Preventive Maintenance Schedule Established", "Preventive maintenance schedule established per manufacturer recommendations."),
      doh("Maintenance Record", "Log or record of all maintenance activities for each instrument."),
      doh("Calibration Certificate on File", "Current calibration certificate on file for all applicable instruments."),
      doh("Performance Verification Documented", "Performance verification or verification of reportable range conducted and documented."),
      fp("Service Reports on File", "All service and repair reports on file for each instrument."),
      fp("Repair Records on File", "Repair history documented for each instrument."),
      doh("Operator Training Records on File", "Training records for personnel authorized to operate each instrument."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 15 — Equipment / Reagent / Supply Requirements
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p15", number: 15, name: "Equipment, Reagent & Supply Requirements (Master Lists)", active: true,
    items: [
      doh("Equipment Master List Completed", "Master list of all laboratory equipment and instruments completed and current."),
      doh("Instrument List Completed", "List of all analyzers and instruments by section completed."),
      doh("Glassware List Completed", "Inventory list of all laboratory glassware completed."),
      doh("Supplies List Completed", "Inventory list of all laboratory supplies completed."),
      doh("Reagent Master List Completed", "Master list of all reagents in use completed."),
      doh("Test Material List Completed", "List of all test materials (controls, calibrators, test kits) completed."),
      // Per reagent
      doh("Reagent Records Established (per reagent)", "Individual record established for each reagent: product name, manufacturer, supplier, lot number, expiration date, storage requirement, receiving record, acceptance record, QC/validation documentation, inventory record."),
      doh("Reagent Receiving Procedure Established", "Documented procedure for receiving and accepting reagents."),
      doh("Reagent Storage Requirements Documented", "Storage requirements for each reagent documented and implemented."),
      doh("Expiration Date Monitoring System Established", "System for monitoring reagent and supply expiration dates implemented."),
      doh("Lot Number Tracking System Established", "System for tracking reagent lot numbers and associated QC data implemented."),
      fp("Inventory Monitoring System Established", "Stock monitoring and reordering system implemented."),
      cond("Safety Data Sheets Collected", "Safety Data Sheets (SDS) obtained for all applicable hazardous chemicals and reagents.", false),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 16 — Quality Management Documents
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p16", number: 16, name: "Quality Management System — Quality Manual", active: true,
    items: [
      doh("Quality Policy Documented", "Quality policy of the laboratory formally written and approved."),
      doh("Quality Objectives Defined", "Measurable quality objectives established and documented."),
      doh("Organizational Structure in Quality Manual", "Organizational structure described in the Quality Manual."),
      doh("Responsibilities Defined in Quality Manual", "Roles and responsibilities for quality defined in the Quality Manual."),
      doh("Quality Indicators Established", "Quality indicators identified, defined, and monitoring system established."),
      gp("Risk Management Process Established", "Risk management approach documented for laboratory operations."),
      doh("Document Control System Established", "Document control system described in the Quality Manual."),
      doh("Record Control System Established", "Record control system described in the Quality Manual."),
      doh("Internal Audit Program Described", "Internal audit program described in the Quality Manual."),
      doh("Corrective Action Process Described", "Corrective action process described in the Quality Manual."),
      doh("Management Review Process Described", "Management review process described in the Quality Manual."),
      doh("Continuous Improvement Process Described", "Continuous improvement approach described in the Quality Manual."),
      doh("Quality Manual Completed and Approved", "Quality Manual completed, reviewed, and formally approved by the Head of Laboratory."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 17 — Master SOP Documents
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p17", number: 17, name: "Standard Operating Procedures (SOP Master Index)", active: true,
    items: [
      doh("Master SOP Index Created", "A master SOP index listing all SOPs with document number, title, version, approval date, and review date."),
      doh("Specimen Collection SOP", "SOP for collection of blood, urine, and other specimens."),
      doh("Patient Identification SOP", "SOP for patient identification prior to specimen collection."),
      doh("Specimen Identification and Labeling SOP", "SOP for labeling specimens at the point of collection."),
      doh("Specimen Acceptance Criteria SOP", "SOP defining criteria for accepting specimens."),
      doh("Specimen Rejection Criteria SOP", "SOP defining criteria for rejecting specimens."),
      doh("Specimen Transport SOP", "SOP for internal and external transport of specimens."),
      doh("Specimen Processing SOP", "SOP for centrifugation, aliquoting, and pre-analytical processing."),
      doh("Result Verification SOP", "SOP for verification and authorization of test results."),
      doh("Result Reporting SOP", "SOP for releasing results to requesting physicians or clients."),
      doh("Critical Results / Panic Values SOP", "SOP defining critical values and the notification procedure."),
      doh("Corrected Reports SOP", "SOP for issuing and documenting corrected laboratory reports."),
      cond("Amended Reports SOP", "SOP for issuing and documenting amended reports.", false),
      doh("Confidentiality and Data Security SOP", "SOP for protecting patient data and maintaining confidentiality."),
      cond("Referral Testing SOP", "SOP for referring specimens or tests to external laboratories.", false),
      doh("Individual Test SOPs — All Offered Tests", "Procedure document for every test on the laboratory's test menu, covering principle, reagents, procedure, QC, result interpretation, and reporting."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 18 — Document Control
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p18", number: 18, name: "Document Control System", active: true,
    items: [
      doh("Document Control Procedure Established", "Written procedure for controlling the creation, review, approval, distribution, and withdrawal of all controlled documents."),
      doh("Master Document List Maintained", "Current master list of all controlled documents with version and status."),
      doh("Document Numbering System Implemented", "Consistent numbering system for all controlled documents implemented."),
      doh("Version Control Implemented", "Version/revision numbering system implemented and applied to all documents."),
      doh("Revision History Maintained", "Change history or revision log maintained for each controlled document."),
      doh("Document Approval System Implemented", "Review and approval process for controlled documents implemented and documented."),
      doh("Document Review Schedule Established", "Scheduled review cycle for all controlled documents established."),
      doh("Controlled Copy Distribution System", "System for distributing and tracking controlled copies implemented."),
      doh("Obsolete Document Control Implemented", "Process for withdrawing and controlling obsolete documents implemented."),
      cond("Electronic Document Control System", "Electronic document management system implemented, where applicable.", false),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 19 — Record Control
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p19", number: 19, name: "Record Control System", active: true,
    items: [
      doh("Record Control Procedure Established", "Written procedure for identifying, collecting, storing, protecting, retrieving, and disposing of quality records."),
      doh("Record Retention Schedule Established", "Retention periods defined for all record types per applicable regulatory and institutional requirements."),
      doh("Patient Records System Established", "System for maintaining patient result records per retention requirements."),
      doh("Laboratory Results Records", "All issued results maintained per defined retention schedule."),
      doh("QC Records System", "Internal quality control records maintained and retrievable."),
      doh("Equipment Records System", "Equipment maintenance, calibration, and performance records maintained."),
      doh("Reagent Records System", "Reagent lot, receiving, and expiry records maintained."),
      doh("Maintenance Records System", "Facility and equipment maintenance records maintained."),
      doh("Calibration Records System", "Calibration certificates and records maintained."),
      doh("Personnel Records System", "Personnel files including credentials, competency, and training records maintained."),
      doh("Training Records System", "Training and continuing education records maintained."),
      doh("Competency Records System", "Competency assessment records maintained for all personnel."),
      doh("Internal Audit Records System", "Internal audit reports, findings, and follow-up records maintained."),
      fp("Complaint Records System", "Complaint log and investigation records maintained."),
      fp("Incident Records System", "Incident reports and investigation records maintained."),
      doh("Corrective Action Records System", "Corrective action records with evidence of implementation and effectiveness maintained."),
      doh("Management Review Records System", "Management review meeting minutes, decisions, and action items maintained."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 20 — Internal Quality Control
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p20", number: 20, name: "Internal Quality Control (IQC)", active: true,
    items: [
      doh("QC Policy Established", "Written policy for internal quality control established and documented."),
      doh("QC SOP Established", "SOP for IQC preparation, use, and review established for all applicable tests."),
      doh("QC Materials Identified and Available", "Appropriate quality control materials identified, procured, and available for each test."),
      doh("QC Frequency Defined", "Frequency of QC testing defined per applicable test requirements."),
      doh("QC Acceptance Criteria Defined", "Acceptance criteria for QC results defined (e.g., Westgard rules)."),
      doh("QC Rejection Criteria Defined", "Rejection criteria defined and the out-of-control response procedure documented."),
      doh("QC Records Maintained", "QC results recorded for all applicable tests on all days of testing."),
      doh("QC Charts Maintained", "Levey-Jennings or equivalent control charts maintained for quantitative tests."),
      doh("Out-of-Control Response Procedure Documented", "Written procedure for responding to out-of-control QC results."),
      doh("Corrective Actions for QC Failures Documented", "Corrective actions taken in response to QC failures documented and reviewed."),
      doh("QC Review Conducted Regularly", "Periodic supervisory review of QC data conducted and documented."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 21 — External Quality Assessment / NEQAS
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p21", number: 21, name: "External Quality Assessment (EQA / NEQAS / PT)", active: true,
    items: [
      doh("Applicable EQA/NEQAS Program Identified", "Appropriate national or international External Quality Assessment program identified for the laboratory's test menu."),
      doh("EQA/NEQAS Registration / Enrollment Completed", "Laboratory enrolled in the applicable EQA/NEQAS/PT program."),
      doh("Proficiency Testing Participation — Rounds Completed", "All required EQA/PT rounds participated in and specimens processed per program instructions."),
      doh("EQA Specimen Records Maintained", "Records of EQA specimens received, processed, and submitted maintained."),
      doh("EQA Results Submitted", "Results submitted to the EQA/NEQAS program within required deadlines."),
      doh("EQA Performance Reports Received and Filed", "Performance feedback reports received from the program and filed."),
      doh("EQA Certificate on File", "Participation or performance certificate on file."),
      doh("Unsatisfactory Performance Investigated", "Any unsatisfactory EQA result formally investigated."),
      doh("Corrective Action for Unsatisfactory EQA Documented", "Corrective actions taken in response to unsatisfactory EQA results documented."),
      doh("Corrective Action Effectiveness Verified", "Effectiveness of corrective actions verified through subsequent EQA results or other means."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 22 — Biosafety
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p22", number: 22, name: "Biosafety Program & Documentation", active: true,
    items: [
      doh("Biosafety Policy Established", "Written biosafety policy covering the laboratory's approach to biological hazard control."),
      doh("Biosafety Manual Completed", "Biosafety manual covering all relevant biosafety requirements and procedures."),
      fp("Biosecurity Policy Established", "Biosecurity policy addressing access control and agent security, where applicable."),
      doh("PPE Policy Established", "Written policy for PPE selection, use, and disposal for all applicable laboratory tasks."),
      doh("Hand Hygiene Policy and Procedure Established", "Written hand hygiene policy and procedure covering all applicable moments."),
      doh("Exposure Control Procedure Established", "Written procedure for controlling exposure to biological, chemical, and other hazards."),
      doh("Sharps Injury Response Procedure Established", "Written procedure for responding to sharps injuries including immediate response, reporting, and follow-up."),
      doh("Biological Spill Response Procedure Established", "Written procedure for containing and decontaminating biological spills."),
      doh("Chemical Spill Response Procedure Established", "Written procedure for containing and managing chemical spills."),
      doh("Emergency Response Procedure Established", "Written emergency response procedure covering fire, medical emergency, and other applicable scenarios."),
      doh("Incident Reporting Procedure Established", "Written procedure for reporting and documenting biosafety incidents."),
      doh("Staff Biosafety Training Completed", "Biosafety training conducted and documented for all laboratory personnel."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 23 — Healthcare Waste Management
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p23", number: 23, name: "Healthcare Waste Management", active: true,
    items: [
      doh("Waste Management Plan Established", "Written healthcare waste management plan covering all waste types generated by the laboratory."),
      doh("Waste Segregation Procedure Established", "Written procedure for waste segregation at the point of generation."),
      doh("Infectious Waste Handling Procedure Established", "Written procedure for handling, packaging, and disposing of infectious waste."),
      doh("Sharps Disposal Procedure Established", "Written procedure for safe disposal of sharps into appropriate puncture-resistant containers."),
      doh("Chemical Waste Handling Procedure Established", "Written procedure for handling and disposing of chemical waste."),
      doh("Waste Labeling Procedure Implemented", "Waste labeling system implemented per applicable requirements."),
      doh("Waste Storage Area Designated and Operational", "Dedicated waste storage area designated, labeled, and operational."),
      doh("Waste Collection Arrangement Established", "Arrangement for regular waste collection from the laboratory established."),
      doh("Waste Disposal Arrangement Established", "Arrangement with a licensed waste treatment/disposal facility established per applicable requirements."),
      doh("Waste Records Maintained", "Waste generation, storage, collection, and disposal records maintained."),
      doh("Waste Management Training Completed", "Waste management training completed and documented for all applicable laboratory personnel."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 24 — Complaints & Client Feedback
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p24", number: 24, name: "Complaints & Client Feedback System", active: true,
    items: [
      doh("Complaint Policy Established", "Written complaint management policy established."),
      doh("Complaint Procedure Established", "Written procedure for receiving, logging, investigating, and resolving complaints."),
      fp("Complaint Form Available", "Standardized complaint form available and accessible."),
      doh("Complaint Log Maintained", "Complaint log maintained recording all complaints received."),
      fp("Client Feedback Form Available", "Client satisfaction or feedback form available."),
      fp("Suggestion System Available", "Suggestion box or equivalent feedback mechanism available.", false),
      doh("Complaint Investigation Process Implemented", "Process for investigating complaints and identifying root causes implemented."),
      doh("Root Cause Analysis Conducted for Significant Complaints", "Root cause analysis conducted for significant or recurring complaints."),
      doh("Corrective Action for Complaints Documented", "Corrective actions taken in response to complaints documented."),
      doh("Complaint Closure Process Implemented", "Process for formally closing and communicating complaint resolution implemented."),
      doh("Complaints Reviewed at Management Review", "Complaint data included in management review input."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 25 — Management Review
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p25", number: 25, name: "Management Review", active: true,
    items: [
      doh("Management Review Procedure Established", "Written procedure for the conduct of management reviews."),
      doh("Management Review Schedule Established", "Schedule for management reviews established (at minimum annually)."),
      doh("Management Review Agenda Defined", "Standard agenda for management reviews defined."),
      doh("Quality Indicator Data Included in Review Input", "Quality indicator data compiled and included in management review agenda."),
      doh("QC Results Included in Review Input", "Summary of internal QC results included in review input."),
      doh("EQA/NEQAS Results Included in Review Input", "EQA/PT results included in review input."),
      doh("Internal Audit Results Included in Review Input", "Internal audit findings and follow-up status included in review input."),
      doh("Complaints Summary Included in Review Input", "Complaint summary included in review input."),
      doh("Incidents Summary Included in Review Input", "Incident summary included in review input."),
      doh("Equipment Issues Included in Review Input", "Equipment performance issues included in review input."),
      doh("Personnel Issues Included in Review Input", "Personnel-related issues included in review input."),
      doh("Corrective Actions Status Included in Review Input", "Status of open corrective actions included in review input."),
      doh("Management Review Conducted and Documented", "Management review conducted with attendance sheet, minutes, decisions, action items, responsible persons, deadlines, and approval signature."),
      doh("Management Review Action Items Implemented", "Action items from management review implemented and effectiveness verified."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 26 — Internal Audit
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p26", number: 26, name: "Internal Audit Program", active: true,
    items: [
      doh("Internal Audit Procedure Established", "Written internal audit procedure established."),
      doh("Annual Internal Audit Plan Prepared", "Annual audit plan prepared covering all laboratory sections and quality system elements."),
      doh("Audit Schedule Established", "Audit schedule with specific dates and areas established."),
      doh("Auditor Designated", "Qualified internal auditor(s) designated (must be independent of the area being audited)."),
      doh("Audit Checklist Prepared", "Audit checklist based on applicable standards, SOPs, and regulatory requirements prepared."),
      doh("Internal Audit Conducted", "Internal audit conducted per the plan and schedule."),
      doh("Audit Report Prepared", "Formal audit report prepared with findings, nonconformities, and observations."),
      doh("Nonconformities Documented", "All nonconformities identified during the audit formally documented."),
      doh("Corrective Actions for Audit Findings Established", "Corrective actions established for all audit nonconformities."),
      doh("Follow-Up Audit Conducted", "Follow-up audit or verification conducted to confirm corrective action implementation."),
      doh("Corrective Action Effectiveness Verified", "Effectiveness of corrective actions verified and documented."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 27 — DOH Assessment Tool (Annex B1) Preparation
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p27", number: 27, name: "DOH Assessment Tool (Annex B1) — Preparation", active: true,
    items: [
      doh("Annex B1 Assessment Tool Reviewed in Full", "The 13-page DOH Assessment Tool reviewed item by item with the laboratory team."),
      doh("General Information Section Prepared", "All general information requirements of Annex B1 addressed."),
      doh("Administrative/Management Section Prepared", "Administrative and management requirements of Annex B1 addressed."),
      doh("Personnel Section Prepared", "Personnel requirements of Annex B1 addressed."),
      doh("Physical Plant Section Prepared", "Physical plant requirements of Annex B1 addressed."),
      doh("Equipment Section Prepared", "Equipment requirements of Annex B1 addressed."),
      doh("Laboratory Operations Section Prepared", "Laboratory operations requirements of Annex B1 addressed."),
      doh("Quality Assurance Section Prepared", "Quality assurance requirements of Annex B1 addressed."),
      doh("Compliance Evidence Organized per Annex B1 Section", "Evidence (documents, records, physical) organized and indexed per Annex B1 sections."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 28 — LabLaunch Mock DOH Inspection
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p28", number: 28, name: "LabLaunch Mock DOH Inspection (Pre-Inspection Assessment)", active: true,
    items: [
      fp("Mock Inspection Conducted — Document Review", "Simulated document review conducted replicating the DOH inspector's document review process."),
      fp("Mock Inspection Conducted — Observation", "Simulated physical observation of the facility, equipment, and operations conducted."),
      fp("Mock Inspection Conducted — Interview", "Simulated personnel interviews conducted to verify knowledge and preparedness."),
      fp("Mock Inspection Conducted — Validation", "Simulated validation of procedures and practices conducted."),
      fp("Mock Inspection Findings Documented", "All deficiencies identified during the mock inspection formally documented."),
      fp("Deficiency Regulatory Reference Documented", "Regulatory reference cited for each deficiency identified."),
      fp("Corrective Action Established for Each Finding", "Corrective action plan established and implemented for each mock inspection finding."),
      fp("Responsible Person Assigned for Each Finding", "Responsible person assigned for each corrective action."),
      fp("Corrective Actions Implemented", "All corrective actions implemented prior to the actual DOH inspection."),
      fp("Mock Inspection Summary Report Prepared", "Summary report of mock inspection readiness prepared and shared with the client."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 29 — DOH LTO Application Document Package
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p29", number: 29, name: "DOH LTO Application — Document Package", active: true,
    items: [
      doh("Health Facility Geographic Form Completed", "DOH Health Facility Geographic Form (or current equivalent) completed and ready for submission."),
      doh("Application Form 1 Completed", "DOH Application Form 1 for Licensing completed and signed."),
      doh("Application for License to Operate — General Clinical Laboratory", "Completed DOH application for LTO of a General Clinical Laboratory."),
      cond("HFS Change Request Form Completed", "DOH HFS Change Request Form completed, when applicable.", false),
      doh("Assessment Tool (Annex B1) Completed", "Completed Annex B1 Assessment Tool included in the LTO application package."),
      doh("Equipment/Instrument/Glassware/Supplies/Reagent Requirements Included", "Completed list of equipment, instruments, glassware, supplies, and reagents per service capability included in the application package."),
      doh("Planning and Design Guidelines Compliance Included", "Documentation of compliance with Annex D1 Planning and Design Guidelines included."),
      doh("Floor Plan Checklist (Annex D2) Included", "Completed Annex D2 Checklist for Review of Floor Plans included in the application package."),
      cond("Remote Collection Application Included", "Remote collection documentation included, if applicable.", false),
      doh("Facility-Specific Supporting Documents Compiled", "All facility-specific supporting documents required by the relevant CHD/RLED compiled and included."),
      doh("Complete Application Package Reviewed Before Submission", "Full application package reviewed for completeness and consistency before submission."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 30 — DOH Document Review & Submission
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p30", number: 30, name: "DOH Application Submission & Document Review", active: true,
    items: [
      doh("Application Submitted to DOH", "Complete LTO application package submitted to the appropriate DOH office."),
      doh("Proof of Submission Obtained", "Receiving stamp, acknowledgment receipt, or reference number obtained and filed."),
      doh("Payment Documentation Obtained", "Payment receipt or documentation of applicable fees obtained and filed."),
      doh("Document Completeness Verified by DOH", "DOH confirmation of complete submission received."),
      doh("DOH Deficiency Notice Received and Logged", "Any deficiency notice from DOH received, logged, and entered into the deficiency tracking system."),
      doh("Deficiencies Corrected", "All DOH-identified deficiencies corrected per the deficiency notice."),
      doh("Corrected Documents Prepared", "Corrected or additional documents prepared in response to deficiency notice."),
      doh("Corrected Documents Resubmitted", "Corrected or additional documents resubmitted to DOH."),
      doh("DOH Acceptance of Corrections Confirmed", "DOH acceptance of corrected submission confirmed and documented."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 31 — DOH On-Site Assessment
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p31", number: 31, name: "DOH On-Site Assessment (Annex B1 Inspection)", active: true,
    items: [
      doh("Inspection Request / Application Confirmed", "DOH on-site assessment scheduled and confirmed."),
      doh("Inspection Schedule Received", "Inspection date and team details received from DOH."),
      doh("Facility Ready for Inspection", "Laboratory facility clean, organized, properly labeled, and ready for assessment."),
      doh("Personnel Ready for Inspection", "All laboratory personnel briefed and present as required during the inspection."),
      doh("Personnel Credentials and Records Ready", "All personnel credentials, medical/health records, vaccination/immunization records compiled and ready for inspection."),
      doh("Equipment Ready and Operational", "All equipment operational, calibrated, and labeled for inspection."),
      doh("Reagents Ready", "All reagents available, within expiry, and properly stored and labeled."),
      doh("SOPs Available for Inspection", "All SOPs completed, approved, current, and accessible during inspection."),
      doh("Quality Records Available for Inspection", "QC records, EQA/PT records, audit records, and other quality records organized and accessible."),
      doh("Biosafety Documentation Ready", "Biosafety manual, training records, and safety documentation organized for inspection."),
      doh("Waste Management Documentation Ready", "Waste management plan and records organized for inspection."),
      doh("Complaint and Management Review Records Ready", "Complaint log, incident records, and management review minutes organized for inspection."),
      doh("Physical Workflow Operational", "Laboratory operational workflow demonstrable during inspection."),
      doh("DOH On-Site Inspection Conducted", "DOH inspection conducted."),
      doh("Inspection Findings Received", "Formal inspection findings or assessment results received from DOH."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 32 — DOH Deficiency Correction
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p32", number: 32, name: "DOH Inspection — Deficiency Correction", active: true,
    items: [
      doh("Each Deficiency Finding Received and Logged", "All findings from the DOH inspection formally entered into the deficiency tracking system."),
      doh("Regulatory Reference Documented per Finding", "Applicable regulatory reference (AO, Annex, section) documented for each finding."),
      doh("Root Cause Identified per Finding", "Root cause of each deficiency formally identified."),
      doh("Correction Implemented per Finding", "Immediate correction of each deficiency implemented."),
      doh("Corrective Action Plan Prepared", "Formal Corrective Action Plan prepared for all deficiencies."),
      doh("Evidence of Correction Compiled per Finding", "Evidence documenting correction (photos, updated documents, records) compiled for each finding."),
      doh("Responsible Person Assigned per Finding", "Responsible person assigned for each corrective action."),
      doh("Corrective Actions Submitted to DOH", "Corrective actions and evidence submitted to DOH within the required deadline."),
      doh("DOH Response to Corrective Actions Received", "DOH response or evaluation of corrective actions received and filed."),
      cond("Re-Inspection Requested", "Re-inspection or follow-up assessment requested, if required.", false),
      cond("Re-Inspection Completed", "Re-inspection or follow-up assessment completed, if required.", false),
      doh("All Findings Formally Closed", "All DOH inspection findings formally closed and documented."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 33 — LTO Issuance & Verification
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p33", number: 33, name: "DOH License to Operate — Issuance & Verification", active: true,
    items: [
      doh("DOH Approval Received", "Formal DOH approval for the License to Operate received."),
      doh("License to Operate (LTO) Issued", "DOH License to Operate issued and received."),
      doh("Laboratory Name on LTO Verified", "Laboratory name on the LTO verified against the application and facility signage."),
      doh("Address on LTO Verified", "Address on the LTO verified against the approved floor plan and facility."),
      doh("Laboratory Classification on LTO Verified", "Laboratory classification stated on the LTO verified against the approved classification."),
      doh("Service Capability on LTO Verified", "Authorized service capability stated on the LTO verified."),
      doh("Authorized Services on LTO Verified", "All authorized testing services listed on or associated with the LTO verified."),
      doh("LTO Validity Period Recorded", "LTO validity period (start date and expiration date) formally recorded."),
      doh("LTO Renewal Date Scheduled", "LTO renewal date entered into the renewal monitoring system."),
      doh("LTO Scanned / Digital Copy Stored", "Digital copy of the LTO scanned, stored, and backed up."),
      doh("LTO Displayed in Laboratory", "Original LTO displayed in the laboratory in a conspicuous place per DOH requirements."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 34 — Accreditation (PhilHealth & Others)
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p34", number: 34, name: "Accreditation (PhilHealth & Applicable Bodies)", active: false, moduleKey: "accreditation",
    items: [
      acc("Accreditation Eligibility Verified", "Laboratory eligibility for the applicable accreditation program(s) verified."),
      acc("Valid DOH LTO Confirmed as Prerequisite", "Confirmation that a valid DOH LTO is in place prior to accreditation application."),
      acc("PhilHealth Accreditation Requirements Reviewed", "All PhilHealth accreditation requirements reviewed and documented."),
      acc("PhilHealth Application Prepared", "PhilHealth accreditation application completed."),
      acc("Required Documents for Accreditation Compiled", "All documents required for the accreditation application compiled and verified."),
      acc("Personnel Requirements for Accreditation Verified", "Personnel qualifications and staffing requirements for accreditation verified."),
      acc("Equipment/Service Requirements for Accreditation Verified", "Equipment and service capability requirements for accreditation verified."),
      acc("Quality Requirements for Accreditation Verified", "Quality system requirements for accreditation verified."),
      acc("Accreditation Application Submitted", "Completed accreditation application submitted."),
      acc("Accreditation Assessment Conducted", "Accreditation assessment or inspection conducted."),
      acc("Accreditation Assessment Findings Addressed", "Any findings from the accreditation assessment addressed."),
      acc("Accreditation Granted", "Accreditation granted and certificate received."),
      acc("Accreditation Certificate Filed and Displayed", "Accreditation certificate filed and displayed in the laboratory."),
      acc("Accreditation Renewal Date Recorded", "Accreditation renewal date recorded in the monitoring system."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // PHASE 35 — Continuing Compliance & Renewal Monitoring
  // ──────────────────────────────────────────────────────────────────
  {
    id: "p35", number: 35, name: "Continuing Compliance & Renewal Monitoring", active: true,
    items: [
      // Personnel monitoring
      doh("PRC License Expiry Monitoring System Active", "System for monitoring PRC license expiry dates for all licensed personnel active."),
      doh("Medical Examination Renewal Monitoring Active", "System for monitoring and scheduling periodic medical examination renewals active."),
      fp("Vaccination Status Monitoring Active", "System for monitoring vaccination status and scheduling boosters or renewals active."),
      doh("Training Expiry and Renewal Monitoring Active", "System for monitoring training certificate expiry and scheduling renewal active."),
      doh("Personnel Competency Reassessment Scheduled", "Periodic competency reassessment schedule established and active."),
      // Equipment monitoring
      doh("Preventive Maintenance Due Date Monitoring Active", "System for monitoring and scheduling preventive maintenance for all equipment active."),
      doh("Calibration Due Date Monitoring Active", "System for monitoring calibration due dates for all applicable instruments active."),
      fp("Service Contract Expiry Monitoring Active", "System for monitoring service contract expiry dates active."),
      fp("Warranty Expiry Monitoring Active", "System for monitoring equipment warranty expiry dates active."),
      // Reagent monitoring
      doh("Reagent Expiration Monitoring Active", "System for monitoring reagent expiration dates active."),
      doh("Reagent Lot Tracking Active", "Reagent lot number tracking and associated QC data monitoring active."),
      fp("Inventory Monitoring Active", "Stock level monitoring and reorder system active."),
      // Quality monitoring
      doh("QC Data Reviewed Regularly", "Internal QC data reviewed on a regular basis per established schedule."),
      doh("EQA/NEQAS Participation Maintained", "Ongoing EQA/PT participation maintained and results monitored."),
      doh("Internal Audit Conducted per Schedule", "Internal audits conducted per the established annual plan."),
      doh("Management Reviews Conducted per Schedule", "Management reviews conducted per the established schedule."),
      doh("Corrective Actions Monitored for Effectiveness", "Open corrective actions monitored and effectiveness verified."),
      // Regulatory monitoring
      doh("DOH LTO Expiry Date Monitored", "LTO expiration date monitored and renewal process initiated per DOH requirements."),
      gov("Business Permit / Mayor's Permit Expiry Monitored", "Annual business permit renewal monitored and processed."),
      gov("Sanitary Permit Expiry Monitored", "Sanitary permit renewal monitored and processed."),
      gov("Fire Safety Certificate Expiry Monitored", "FSIC renewal monitored and inspections scheduled."),
      cond("Special Authorization Expiry Monitored", "Expiry of any special DOH authorizations monitored.", false),
      acc("Accreditation Expiry Monitored", "Accreditation expiry date monitored and renewal process initiated.", false),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // CONDITIONAL MODULE — Remote Collection
  // ──────────────────────────────────────────────────────────────────
  {
    id: "pm-remote", number: 36, name: "Remote Collection Site — Compliance Module",
    active: false, moduleKey: "remote_collection",
    items: [
      doh("Remote Collection Site LOI Prepared", "Letter of Intent for Remote Collection Site addressed to the DOH."),
      doh("Remote Collection Permit Application Prepared", "DOH Remote Collection Permit application form completed."),
      doh("Remote Collection Site Address Documented", "Complete address and description of the remote collection site documented."),
      doh("Remote Collection Personnel List Prepared", "List of personnel assigned to the remote collection site prepared."),
      doh("Remote Collection Site Facility Requirements Verified", "Physical requirements of the remote collection site verified per DOH standards."),
      doh("Remote Collection Supplies and Materials List Prepared", "List of supplies and materials at the remote collection site prepared."),
      doh("Specimen Collection SOP for Remote Site Prepared", "SOP for specimen collection at the remote site prepared."),
      doh("Specimen Packaging and Transport SOP Prepared", "SOP for packaging, labeling, and transporting specimens from the remote site."),
      doh("Specimen Transport Temperature Requirements Documented", "Temperature and time requirements for specimen transport documented."),
      cond("MOA / Contract with Remote Site Prepared", "Memorandum of Agreement or contract with the remote collection site entity prepared.", false),
      doh("Remote Collection Chain of Custody Procedure Established", "Procedure for maintaining chain of custody from remote site to laboratory."),
      doh("Remote Collection Site Inspection Readiness", "Remote collection site inspected for readiness prior to DOH assessment."),
      doh("Remote Collection Permit Application Submitted", "Complete Remote Collection Permit application submitted to DOH."),
      doh("Remote Collection Permit Received", "DOH Remote Collection Permit received and filed."),
      doh("Remote Collection Permit Displayed at Site", "Remote Collection Permit displayed at the remote collection site."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // CONDITIONAL MODULE — Molecular Pathology
  // ──────────────────────────────────────────────────────────────────
  {
    id: "pm-molecular", number: 37, name: "Molecular Pathology — Compliance Module",
    active: false, moduleKey: "molecular_pathology",
    items: [
      doh("Applicable DOH Authorization for Molecular Testing Identified", "Relevant DOH authorization or accreditation for molecular pathology testing identified."),
      doh("Dedicated Molecular Laboratory Area Established", "Separate, dedicated area for molecular testing established with appropriate physical separation."),
      doh("Pre-PCR Area Designated", "Pre-PCR or specimen preparation area designated and segregated."),
      doh("Amplification Area Designated", "PCR amplification area designated and segregated."),
      doh("Post-PCR / Analysis Area Designated", "Post-PCR or product analysis area designated and segregated."),
      doh("Molecular Equipment List Prepared", "List of molecular instruments and equipment prepared."),
      doh("PCR Instrument Records Established", "Individual equipment records for PCR instruments established."),
      doh("Nucleic Acid Extraction System Records Established", "Records for nucleic acid extraction instruments established."),
      doh("Molecular Biosafety Requirements Verified", "Biosafety requirements specific to molecular testing verified."),
      doh("Molecular SOPs Prepared", "SOPs for all molecular testing procedures prepared."),
      doh("Molecular QC Procedures Established", "Internal quality control procedures for molecular testing established."),
      doh("Molecular EQA / PT Enrollment Verified", "Enrollment in molecular-specific EQA or proficiency testing program verified."),
      doh("Molecular Personnel Competency Assessed", "Competency of personnel in molecular testing methods assessed."),
      doh("Contamination Control Procedures Established", "Procedures for preventing PCR contamination established and documented."),
      doh("Molecular Waste Management Procedure Established", "Disposal procedures for molecular testing waste established."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // CONDITIONAL MODULE — Anatomic Pathology
  // ──────────────────────────────────────────────────────────────────
  {
    id: "pm-anatomic", number: 38, name: "Anatomic Pathology — Compliance Module",
    active: false, moduleKey: "anatomic_pathology",
    items: [
      doh("Applicable DOH Requirements for Anatomic Pathology Identified", "Relevant DOH requirements for anatomic pathology services identified."),
      doh("Grossing Room Requirements Verified", "Grossing room with appropriate ventilation, fixtures, and equipment requirements verified."),
      doh("Tissue Processing Equipment Records Established", "Equipment records for tissue processors established."),
      doh("Microtome Records Established", "Equipment records for microtome(s) established."),
      doh("Staining Equipment Records Established", "Equipment records for staining equipment established."),
      doh("Histopathology SOP Prepared", "SOP for tissue processing, embedding, sectioning, and staining prepared."),
      doh("Cytology SOP Prepared", "SOP for cytology processing and staining prepared, where applicable."),
      doh("Fixation Procedure SOP Prepared", "SOP for tissue fixation including formalin handling established."),
      doh("Pathologist Qualifications Documented", "Qualifications, PRC license, and specialty certification of the pathologist documented."),
      doh("Chemical Safety for Fixatives Documented", "SDS and handling procedures for formalin and other fixatives documented."),
      doh("Chemical Waste Disposal for Anatomic Reagents Established", "Disposal procedures for xylene, formalin, and other anatomic pathology chemicals established."),
      doh("Anatomic Pathology EQA Enrollment Verified", "Enrollment in anatomic pathology EQA or proficiency testing verified."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // CONDITIONAL MODULE — HIV / Confirmatory Testing
  // ──────────────────────────────────────────────────────────────────
  {
    id: "pm-hiv", number: 39, name: "HIV / Confirmatory Testing — Compliance Module",
    active: false, moduleKey: "hiv_testing",
    items: [
      doh("Applicable DOH/NRCP Requirements for HIV Testing Identified", "Relevant DOH and National Reference Center for Pathology requirements for HIV testing identified."),
      doh("DOH Authorization for HIV Testing Confirmed", "DOH authorization or accreditation for HIV testing obtained or in process."),
      doh("Testing Algorithm Documented", "DOH-approved HIV testing algorithm documented and implemented."),
      doh("Confirmatory Testing Arrangement Documented", "Arrangement for confirmatory testing with the DOH-designated confirmatory laboratory documented, if applicable."),
      doh("HIV Testing Personnel Requirements Verified", "Personnel requirements specific to HIV testing verified."),
      doh("HIV Testing SOP Prepared", "SOP for HIV screening testing and result reporting prepared per DOH guidelines."),
      doh("HIV Result Counseling and Disclosure Procedure Established", "Procedure for counseling and disclosure of HIV results established."),
      doh("HIV Confidentiality Policy Established", "Confidentiality policy for HIV test results established per RA 11166 and applicable regulations."),
      doh("HIV QC Procedures Established", "Quality control procedures specific to HIV testing established."),
      doh("HIV EQA Enrollment Verified", "Enrollment in HIV testing proficiency program verified."),
      doh("HIV Biosafety Procedures Verified", "Biosafety procedures specific to HIV specimen handling verified."),
      doh("HIV Reagent Records Established", "Records for HIV screening and confirmatory reagents established."),
    ],
  },

  // ──────────────────────────────────────────────────────────────────
  // CONDITIONAL MODULE — Drug Testing Laboratory
  // ──────────────────────────────────────────────────────────────────
  {
    id: "pm-drug", number: 40, name: "Drug Testing Laboratory — Compliance Module",
    active: false, moduleKey: "drug_testing",
    items: [
      doh("Drug Testing Laboratory Regulatory Framework Identified", "PDEA, DOH, and DDB requirements for drug testing laboratories identified and compiled."),
      doh("Drug Testing Laboratory LTO (DOH) Application Prepared", "DOH LTO application specific to drug testing laboratory prepared."),
      doh("PDEA Accreditation Requirements Reviewed", "PDEA accreditation requirements reviewed and compliance plan established."),
      doh("Drug Testing Laboratory Classification Determined", "Drug testing laboratory classification (Type A, B, or other) determined per applicable issuances."),
      doh("Drug Testing Area Requirements Verified", "Physical area requirements for drug testing laboratory verified."),
      doh("Drug Testing Equipment Records Established", "Records for drug testing instruments and equipment established."),
      doh("Chain of Custody Procedure for Drug Specimens Established", "Strict chain of custody procedure for drug testing specimens established per regulatory requirements."),
      doh("Drug Testing Personnel Requirements Verified", "Personnel qualification requirements specific to drug testing laboratories verified."),
      doh("Medical Review Officer Identified", "Medical Review Officer identified and documented, where required."),
      doh("Drug Testing SOPs Prepared", "SOPs for drug testing procedures, chain of custody, and result reporting prepared."),
      doh("Drug Testing QC Procedures Established", "Quality control procedures specific to drug testing established."),
      doh("Drug Testing Proficiency Testing Enrollment Verified", "Enrollment in applicable proficiency testing program for drug testing verified."),
      doh("Drug Testing Biosafety Procedures Verified", "Biosafety procedures specific to drug testing specimen handling verified."),
      doh("Confidentiality Procedure for Drug Test Results Established", "Confidentiality procedures for drug test results established per applicable regulations."),
    ],
  },
];

const MODULE_MAP: Record<string, string> = {
  remote_collection: "remote_collection",
  molecular_pathology: "molecular_pathology",
  anatomic_pathology: "anatomic_pathology",
  hiv_testing: "hiv_testing",
  drug_testing: "drug_testing",
  philhealth_accreditation: "accreditation",
  other_accreditation: "accreditation",
  accreditation_readiness: "accreditation",
};

export function createLabChecklist(selectedServices: string[] = []): import("./types").Stage[] {
  const copy: Stage[] = JSON.parse(JSON.stringify(CHECKLIST_TEMPLATE));
  const ts = Date.now();
  let i = 0;

  const activeModules = new Set<string>();
  for (const svc of selectedServices) {
    if (MODULE_MAP[svc]) activeModules.add(MODULE_MAP[svc]);
  }

  for (const stage of copy) {
    if (stage.moduleKey) {
      stage.active = activeModules.has(stage.moduleKey);
    } else {
      stage.active = true;
    }
    for (const itm of stage.items) {
      itm.id = `${itm.id}-${ts}-${i++}`;
    }
  }
  return copy;
}
