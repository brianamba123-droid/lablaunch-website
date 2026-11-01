import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createLab } from "../data/store";
import { getClientAuth } from "../data/store";
import { SERVICE_CATEGORIES } from "../data/services";

const LOCATION_DATA: Record<string, Record<string, string[]>> = {
  "Region IX – Zamboanga Peninsula": { "Zamboanga del Norte": ["Dapitan City", "Dipolog City", "Sindangan"], "Zamboanga del Sur": ["Pagadian City", "Zamboanga City"], "Zamboanga Sibugay": ["Ipil", "Kabasalan"] },
  "Region X – Northern Mindanao": { "Bukidnon": ["Malaybalay City", "Valencia City"], "Camiguin": ["Mambajao"], "Lanao del Norte": ["Iligan City", "Tubod"], "Misamis Occidental": ["Oroquieta City", "Ozamiz City", "Tangub City", "Jimenez"], "Misamis Oriental": ["Cagayan de Oro City", "Gingoog City", "El Salvador City", "Claveria"] },
  "Region XI – Davao Region": { "Davao del Norte": ["Tagum City", "Panabo City"], "Davao del Sur": ["Davao City", "Digos City"], "Davao Oriental": ["Mati City"] },
  "Region XII – SOCCSKSARGEN": { "South Cotabato": ["General Santos City", "Koronadal City"], "Sultan Kudarat": ["Isulan", "Tacurong City"] },
  "Region XIII – CARAGA": { "Agusan del Norte": ["Butuan City", "Cabadbaran City"], "Surigao del Norte": ["Surigao City"] },
  "Other": { "Other Location": ["Other City / Municipality"] },
};

const inp = "w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent";
const sel = inp + " bg-white";

function Ico({ d, size = 18 }: { d: string | string[]; size?: number }) {
  const arr = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      {arr.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

const CHECK = "M20 6 9 17l-5-5";
const CHEVR = "M9 18l6-6-6-6";

interface WizardProps { onClose: () => void; }

export default function LabWizard({ onClose }: WizardProps) {
  const navigate = useNavigate();
  const client = getClientAuth();
  const [step, setStep] = useState(1);
  const TOTAL = 3;

  const [info, setInfo] = useState({
    name: "", address: "", company: "", ownershipType: "Private",
    institutionalType: "Non-Institutional", facilityType: "New Facility",
    targetOpeningDate: "", proposedHours: "",
    region: "", province: "", city: "",
  });
  const [classification, setClassification] = useState({
    labType: "General Clinical Laboratory", level: "Primary",
    intendedServices: "",
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const setI = (k: keyof typeof info) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setInfo(p => ({ ...p, [k]: e.target.value }));
  const setC = (k: keyof typeof classification) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setClassification(p => ({ ...p, [k]: e.target.value }));

  const provinces = info.region ? Object.keys(LOCATION_DATA[info.region] || {}) : [];
  const cities = info.region && info.province ? LOCATION_DATA[info.region]?.[info.province] || [] : [];

  const toggleService = (id: string) =>
    setSelectedServices(p => p.includes(id) ? p.filter(s => s !== id) : [...p, id]);

  const handleSubmit = async () => {
    if (!client) return;
    setSubmitting(true);
    setError("");
    try {
      const lab = createLab({
        name: info.name,
        company: info.company,
        contactPerson: client.name,
        contactNumber: client.mobile,
        email: client.email,
        address: `${info.address}, ${info.city}, ${info.province}`,
        region: info.region,
        province: info.province,
        city: info.city,
        labType: classification.labType,
        classification: `${classification.labType} — ${classification.level}`,
        ownershipType: info.ownershipType,
        institutionalType: info.institutionalType,
        facilityType: info.facilityType,
        intendedServices: classification.intendedServices,
        proposedHours: info.proposedHours,
        targetOpeningDate: info.targetOpeningDate,
        consultant: "",
        projectNotes: "",
        status: "active",
        startDate: new Date().toISOString().split("T")[0],
        clientId: client.id,
        selectedServices,
      });
      navigate(`/portal/lab/${lab.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#0b1f3a] px-6 py-5 rounded-t-2xl flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-white font-bold text-lg">Add Laboratory Project</h2>
            <p className="text-slate-400 text-xs mt-0.5">Step {step} of {TOTAL}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
            <Ico d="M18 6 6 18M6 6l12 12" size={20} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-100 shrink-0">
          <div className="h-1 bg-teal-500 transition-all duration-500" style={{ width: `${(step / TOTAL) * 100}%` }} />
        </div>

        {/* Step labels */}
        <div className="flex border-b border-slate-100 shrink-0">
          {["Laboratory Information", "Classification", "Services Required"].map((label, i) => (
            <div key={i} className={`flex-1 px-2 py-3 text-center text-xs font-semibold transition-colors ${step === i + 1 ? "text-teal-600 border-b-2 border-teal-500" : step > i + 1 ? "text-slate-400" : "text-slate-400"}`}>
              {step > i + 1 && <span className="inline-block w-4 h-4 bg-teal-500 text-white rounded-full text-[10px] leading-4 mr-1">✓</span>}
              {label}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">{error}</div>}

          {/* Step 1 — Lab Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Laboratory Name *</label>
                <input required type="text" value={info.name} onChange={setI("name")} placeholder="e.g. Caretek General Clinical Laboratory" className={inp} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Owner / Entity Name *</label>
                <input required type="text" value={info.company} onChange={setI("company")} placeholder="ABC Medical Clinic, Inc." className={inp} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Facility Address *</label>
                <input required type="text" value={info.address} onChange={setI("address")} placeholder="Street address / building / unit" className={inp} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Region *</label>
                  <select value={info.region} onChange={e => setInfo(p => ({ ...p, region: e.target.value, province: "", city: "" }))} className={sel}>
                    <option value="">Select region</option>
                    {Object.keys(LOCATION_DATA).map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Province *</label>
                  <select value={info.province} onChange={e => setInfo(p => ({ ...p, province: e.target.value, city: "" }))} className={sel} disabled={!info.region}>
                    <option value="">Select province</option>
                    {provinces.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">City / Municipality *</label>
                  <select value={info.city} onChange={setI("city")} className={sel} disabled={!info.province}>
                    <option value="">Select city</option>
                    {cities.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Type of Ownership</label>
                  <select value={info.ownershipType} onChange={setI("ownershipType")} className={sel}>
                    {["Private", "Government", "Partnership", "Corporation", "Cooperative"].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Institutional Type</label>
                  <select value={info.institutionalType} onChange={setI("institutionalType")} className={sel}>
                    {["Non-Institutional", "Institutional (Hospital-Based)", "Government"].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Facility Status</label>
                  <select value={info.facilityType} onChange={setI("facilityType")} className={sel}>
                    {["New Facility", "Existing Facility", "Renovation / Expansion"].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Target Opening Date</label>
                  <input type="date" value={info.targetOpeningDate} onChange={setI("targetOpeningDate")} className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Proposed Operating Hours</label>
                  <input type="text" value={info.proposedHours} onChange={setI("proposedHours")} placeholder="e.g. Monday–Friday, 7AM–5PM" className={inp} />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Classification */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Laboratory Type *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {["General Clinical Laboratory", "Drug Testing Laboratory", "Molecular Pathology Laboratory", "Anatomic Pathology Laboratory", "Limited-Service Laboratory", "Other"].map(t => (
                    <label key={t} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${classification.labType === t ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:border-slate-300"}`}>
                      <input type="radio" name="labType" value={t} checked={classification.labType === t} onChange={setC("labType")} className="text-teal-600 focus:ring-teal-400" />
                      <span className="text-sm font-medium text-slate-700">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Service Capability / Level</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["Primary", "Secondary", "Tertiary", "Limited-Service"].map(l => (
                    <label key={l} className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${classification.level === l ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:border-slate-300"}`}>
                      <input type="radio" name="level" value={l} checked={classification.level === l} onChange={setC("level")} className="text-teal-600 focus:ring-teal-400" />
                      <span className="text-sm font-medium text-slate-700">{l}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Intended Services / Test Menu</label>
                <textarea rows={3} value={classification.intendedServices} onChange={setC("intendedServices")}
                  placeholder="e.g. Hematology, Clinical Chemistry, Urinalysis, Microbiology, Serology, Blood Banking"
                  className={inp} />
                <p className="text-xs text-slate-400 mt-1">List the diagnostic tests or sections you plan to offer.</p>
              </div>
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-teal-800 mb-1">Why does this matter?</p>
                <p className="text-xs text-teal-700">Your laboratory type and classification determine which DOH requirements apply to your project. LabLaunch will use this to build your customized compliance checklist.</p>
              </div>
            </div>
          )}

          {/* Step 3 — Services */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-slate-800 mb-1">Select the services you need from LabLaunch</p>
                <p className="text-xs text-slate-500">Selecting a service activates the corresponding compliance requirements and checklist modules for your project. You can add more services later.</p>
              </div>
              {SERVICE_CATEGORIES.map(cat => (
                <div key={cat.id}>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{cat.label}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cat.services.map(svc => {
                      const active = selectedServices.includes(svc.id);
                      return (
                        <label key={svc.id} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${active ? "border-teal-500 bg-teal-50" : "border-slate-200 hover:border-slate-300"}`}>
                          <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${active ? "bg-teal-500 border-teal-500" : "border-slate-300"}`}
                            onClick={() => toggleService(svc.id)}>
                            {active && <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"><path d={CHECK} /></svg>}
                          </div>
                          <div onClick={() => toggleService(svc.id)}>
                            <p className="text-sm font-semibold text-slate-700">{svc.label}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{svc.description}</p>
                            {svc.activatesModule && <span className="inline-block mt-1 text-[10px] font-bold text-teal-600 bg-teal-50 border border-teal-200 rounded px-1.5 py-0.5">Activates checklist module</span>}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
              {selectedServices.length > 0 && (
                <div className="bg-teal-50 border border-teal-200 rounded-xl p-3">
                  <p className="text-xs font-semibold text-teal-700">{selectedServices.length} service{selectedServices.length > 1 ? "s" : ""} selected. Your compliance checklist will be generated based on your selections.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          <button onClick={step === 1 ? onClose : () => setStep(s => s - 1)}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
            {step === 1 ? "Cancel" : "← Back"}
          </button>
          {step < TOTAL ? (
            <button
              onClick={() => {
                if (step === 1 && (!info.name || !info.company || !info.address || !info.region)) {
                  setError("Please fill in all required fields (Name, Owner, Address, Region)."); return;
                }
                setError("");
                setStep(s => s + 1);
              }}
              className="px-5 py-2 text-sm font-semibold bg-teal-600 hover:bg-teal-500 text-white rounded-lg transition-colors flex items-center gap-2">
              Continue <Ico d={CHEVR} size={16} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              className="px-5 py-2 text-sm font-semibold bg-teal-600 hover:bg-teal-500 disabled:bg-teal-400 text-white rounded-lg transition-colors">
              {submitting ? "Creating project…" : "Create Laboratory Project"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
