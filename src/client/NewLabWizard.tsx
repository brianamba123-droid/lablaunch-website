import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getClientAuth, createClientProject } from "../data/clientStore";
import { SERVICE_GROUPS } from "../data/serviceModules";
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
  check: "M20 6 9 17l-5-5",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  arrowLeft: "M19 12H5M12 19l-7-7 7-7",
  flask: ["M8.5 2h7", "M8.5 2v5.5L4.5 17A2 2 0 0 0 6.38 20h11.24A2 2 0 0 0 19.5 17L15.5 7.5V2"],
  info: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 8v4", "M12 16h.01"],
};

const LAB_TYPES = ["General Clinical Laboratory", "Molecular Laboratory", "Anatomic Pathology Laboratory", "Drug Testing Laboratory", "Drinking Water Laboratory", "Other / Specialized"];
const CLASSIFICATIONS = ["Primary (Level 1)", "Secondary (Level 2)", "Tertiary (Level 3)", "Limited-Service"];
const CAPABILITIES = [
  "Hematology", "Clinical Chemistry", "Urinalysis / Urinalysis Chemistry",
  "Serology / Immunology", "Microbiology / Bacteriology", "Blood Banking / Blood Service Facility",
  "Histopathology / Anatomic Pathology", "Cytology", "Parasitology",
  "Molecular / PCR Testing", "HIV Testing", "Drug Testing",
];

const REGIONS = [
  "Region IX – Zamboanga Peninsula",
  "Region X – Northern Mindanao",
  "Region XI – Davao Region",
  "Region XII – SOCCSKSARGEN",
  "Region XIII – CARAGA",
  "BARMM – Bangsamoro",
  "Other / Outside Mindanao",
];

const STEPS = [
  { label: "Laboratory Information", desc: "Basic details about your laboratory" },
  { label: "Classification", desc: "Type and service capability" },
  { label: "Services Needed", desc: "Select LabLaunch consulting services" },
];

export default function NewLabWizard() {
  const navigate = useNavigate();
  const auth = getClientAuth();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [info, setInfo] = useState({
    name: "", address: "", region: "", province: "", city: "",
    owner: "", ownershipType: "private",
    institutionType: "non-institutional",
    facilityType: "new" as "new" | "existing",
    targetOpeningDate: "", operatingHours: "",
  });

  const [classification, setClassification] = useState({
    labType: "", classification: "", capability: [] as string[], otherCapability: "",
  });

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const toggleCap = (c: string) => {
    setClassification(f => ({
      ...f, capability: f.capability.includes(c) ? f.capability.filter(x => x !== c) : [...f.capability, c],
    }));
  };

  const toggleService = (id: string) => {
    setSelectedServices(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  const canNext = () => {
    if (step === 0) return info.name.trim() && info.address.trim() && info.owner.trim() && info.region;
    if (step === 1) return classification.labType && classification.classification && classification.capability.length > 0;
    return selectedServices.length > 0;
  };

  const handleSubmit = async () => {
    if (!auth) return;
    setSubmitting(true);
    const caps = [...classification.capability];
    if (classification.otherCapability.trim()) caps.push(classification.otherCapability.trim());
    const project = createClientProject({
      clientId: auth.id,
      clientName: auth.name,
      name: info.name,
      address: info.address,
      region: info.region,
      province: info.province,
      city: info.city,
      owner: info.owner,
      ownershipType: info.ownershipType,
      institutionType: info.institutionType,
      facilityType: info.facilityType,
      targetOpeningDate: info.targetOpeningDate,
      operatingHours: info.operatingHours,
      labType: classification.labType,
      classification: classification.classification,
      capability: caps.join(", "),
      selectedServices,
    });
    await new Promise(r => setTimeout(r, 400));
    navigate(`/client/project/${project.id}`);
  };

  const inputCls = "w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all";
  const labelCls = "block text-xs font-semibold text-slate-700 mb-1.5";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#0b1f3a] text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg overflow-hidden bg-[#f5f0e8]">
              <img src={logoImg} alt="LabLaunch" className="h-9 w-auto object-contain block" />
            </div>
            <span className="font-bold text-sm hidden sm:block">New Laboratory Project</span>
          </div>
          <Link to="/client/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
            Cancel
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Step indicators */}
        <div className="flex items-center gap-0 mb-10">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i < step ? "bg-teal-600 text-white" : i === step ? "bg-[#0b1f3a] text-white ring-4 ring-[#0b1f3a]/20" : "bg-slate-200 text-slate-500"}`}>
                  {i < step ? <Ico d={I.check} size={16} /> : i + 1}
                </div>
                <div className={`text-[11px] font-semibold mt-1.5 hidden sm:block ${i === step ? "text-[#0b1f3a]" : "text-slate-400"}`}>{s.label}</div>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 mb-4 sm:mb-0 transition-colors ${i < step ? "bg-teal-400" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#0b1f3a] mb-1">{STEPS[step].label}</h2>
          <p className="text-slate-500 text-sm mb-6">{STEPS[step].desc}</p>

          {/* ── Step 0: Lab Information ── */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <label className={labelCls}>Laboratory Name <span className="text-red-500">*</span></label>
                <input className={inputCls} placeholder="e.g. Caretek General Clinical Laboratory" value={info.name} onChange={e => setInfo(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Complete Facility Address <span className="text-red-500">*</span></label>
                <input className={inputCls} placeholder="Street, Barangay, Municipality" value={info.address} onChange={e => setInfo(f => ({ ...f, address: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Region <span className="text-red-500">*</span></label>
                  <select className={inputCls} value={info.region} onChange={e => setInfo(f => ({ ...f, region: e.target.value }))}>
                    <option value="">Select region…</option>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Province</label>
                  <input className={inputCls} placeholder="Province" value={info.province} onChange={e => setInfo(f => ({ ...f, province: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>City / Municipality</label>
                  <input className={inputCls} placeholder="City" value={info.city} onChange={e => setInfo(f => ({ ...f, city: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Owner / Entity <span className="text-red-500">*</span></label>
                <input className={inputCls} placeholder="Full legal name of owner or organization" value={info.owner} onChange={e => setInfo(f => ({ ...f, owner: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Type of Ownership</label>
                  <select className={inputCls} value={info.ownershipType} onChange={e => setInfo(f => ({ ...f, ownershipType: e.target.value }))}>
                    <option value="private">Private</option>
                    <option value="government">Government</option>
                    <option value="corporate">Corporate</option>
                    <option value="partnership">Partnership</option>
                    <option value="cooperative">Cooperative</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Institutional or Non-Institutional</label>
                  <select className={inputCls} value={info.institutionType} onChange={e => setInfo(f => ({ ...f, institutionType: e.target.value }))}>
                    <option value="non-institutional">Non-Institutional (Standalone)</option>
                    <option value="institutional">Institutional (Part of a Hospital / Clinic)</option>
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Existing or New Facility</label>
                  <select className={inputCls} value={info.facilityType} onChange={e => setInfo(f => ({ ...f, facilityType: e.target.value as "new" | "existing" }))}>
                    <option value="new">New Facility</option>
                    <option value="existing">Existing Facility</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Target Opening Date</label>
                  <input type="date" className={inputCls} value={info.targetOpeningDate} onChange={e => setInfo(f => ({ ...f, targetOpeningDate: e.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Proposed Operating Hours</label>
                  <input className={inputCls} placeholder="e.g. Mon–Sat 7:00 AM – 5:00 PM" value={info.operatingHours} onChange={e => setInfo(f => ({ ...f, operatingHours: e.target.value }))} />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 1: Classification ── */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className={labelCls}>Laboratory Type <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {LAB_TYPES.map(t => (
                    <button key={t} type="button" onClick={() => setClassification(f => ({ ...f, labType: t }))}
                      className={`text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${classification.labType === t ? "border-teal-500 bg-teal-50 text-teal-800" : "border-slate-200 hover:border-slate-300 text-slate-700"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Service Classification / Level <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-3">
                  {CLASSIFICATIONS.map(c => (
                    <button key={c} type="button" onClick={() => setClassification(f => ({ ...f, classification: c }))}
                      className={`text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${classification.classification === c ? "border-teal-500 bg-teal-50 text-teal-800" : "border-slate-200 hover:border-slate-300 text-slate-700"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelCls}>Intended Test Menu / Service Capability <span className="text-red-500">*</span> <span className="text-slate-400 font-normal">(select all that apply)</span></label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CAPABILITIES.map(c => (
                    <label key={c} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border cursor-pointer transition-all text-sm ${classification.capability.includes(c) ? "border-teal-400 bg-teal-50 text-teal-800" : "border-slate-200 hover:border-slate-300 text-slate-700"}`}>
                      <input type="checkbox" className="w-4 h-4 text-teal-600 rounded" checked={classification.capability.includes(c)} onChange={() => toggleCap(c)} />
                      {c}
                    </label>
                  ))}
                </div>
                <div className="mt-3">
                  <input className={inputCls} placeholder="Other / specify additional services…" value={classification.otherCapability} onChange={e => setClassification(f => ({ ...f, otherCapability: e.target.value }))} />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Services ── */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-start gap-3 bg-teal-50 border border-teal-200 rounded-xl px-4 py-3">
                <Ico d={I.info} size={18} className="text-teal-600 shrink-0 mt-0.5" />
                <p className="text-sm text-teal-800">
                  Select the services you would like LabLaunch Consulting to assist with. Your selection determines which compliance checklist modules are activated for your project.
                </p>
              </div>

              {SERVICE_GROUPS.map(group => (
                <div key={group.id}>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">{group.label}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {group.services.map(svc => {
                      const selected = selectedServices.includes(svc.id);
                      return (
                        <label key={svc.id} className={`flex items-start gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${selected ? "border-teal-400 bg-teal-50" : "border-slate-200 hover:border-slate-300"}`}>
                          <input type="checkbox" className="w-4 h-4 text-teal-600 rounded shrink-0 mt-0.5" checked={selected} onChange={() => toggleService(svc.id)} />
                          <div>
                            <div className={`text-sm font-semibold leading-snug ${selected ? "text-teal-800" : "text-slate-700"}`}>{svc.label}</div>
                            <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">{svc.description}</div>
                            {svc.note && <div className="text-[11px] text-teal-600 font-medium mt-1">{svc.note}</div>}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              {selectedServices.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                  <p className="text-xs font-semibold text-slate-700 mb-1.5">{selectedServices.length} service{selectedServices.length !== 1 ? "s" : ""} selected</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedServices.map(id => {
                      const lbl = SERVICE_GROUPS.flatMap(g => g.services).find(s => s.id === id)?.label ?? id;
                      return <span key={id} className="bg-teal-100 text-teal-800 text-[11px] font-medium px-2 py-0.5 rounded-full">{lbl}</span>;
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => step > 0 ? setStep(s => s - 1) : navigate("/client/dashboard")}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 rounded-lg hover:bg-slate-100">
              <Ico d={I.arrowLeft} size={16} /> {step === 0 ? "Cancel" : "Back"}
            </button>

            {step < 2 ? (
              <button
                type="button"
                disabled={!canNext()}
                onClick={() => setStep(s => s + 1)}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
                Continue <Ico d={I.arrowRight} size={16} />
              </button>
            ) : (
              <button
                type="button"
                disabled={!canNext() || submitting}
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:bg-slate-200 disabled:text-slate-400 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors">
                {submitting ? "Creating Project…" : "Create Laboratory Project"}
                {!submitting && <Ico d={I.check} size={16} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
