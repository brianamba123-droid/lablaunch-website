import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerClient, clientLogin } from "../data/store";
import logoImg from "@/imports/logo_symbol.png";

export default function ClientRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", mobile: "", company: "", position: "", password: "", confirm: "" });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!agreed) { setError("Please agree to the Terms of Service and Privacy Policy."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 350));
    const result = registerClient({ name: form.name, email: form.email, mobile: form.mobile, company: form.company, position: form.position, password: form.password });
    if (!result.ok) { setError(result.error || "Registration failed."); setLoading(false); return; }
    clientLogin(form.email, form.password);
    navigate("/portal");
  };

  const inp = "w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent";

  return (
    <div className="min-h-screen bg-[#0b1f3a] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "linear-gradient(#14b8a6 1px, transparent 1px), linear-gradient(90deg, #14b8a6 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="relative w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#0b1f3a] px-8 py-7 flex flex-col items-center">
            <div className="rounded-xl overflow-hidden bg-[#f5f0e8] mb-4">
              <img src={logoImg} alt="LabLaunch Consulting" className="h-12 w-auto object-contain block" />
            </div>
            <h1 className="text-white font-extrabold text-xl">Create Your Account</h1>
            <p className="text-slate-400 text-sm mt-1">Join the LabLaunch Client Portal</p>
          </div>
          <div className="px-8 py-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
                  <input required type="text" value={form.name} onChange={set("name")} placeholder="Juan dela Cruz" className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mobile Number *</label>
                  <input required type="tel" value={form.mobile} onChange={set("mobile")} placeholder="0917 000 0000" className={inp} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address *</label>
                <input required type="email" value={form.email} onChange={set("email")} placeholder="juan@example.com" autoComplete="email" className={inp} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company / Organization *</label>
                  <input required type="text" value={form.company} onChange={set("company")} placeholder="ABC Medical Clinic" className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Position / Designation *</label>
                  <input required type="text" value={form.position} onChange={set("position")} placeholder="Medical Director" className={inp} />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password *</label>
                  <input required type="password" value={form.password} onChange={set("password")} placeholder="Min. 8 characters" autoComplete="new-password" className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm Password *</label>
                  <input required type="password" value={form.confirm} onChange={set("confirm")} placeholder="Repeat password" autoComplete="new-password" className={inp} />
                </div>
              </div>
              <label className="flex items-start gap-3 cursor-pointer pt-1">
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-400 shrink-0" />
                <span className="text-sm text-slate-600">
                  I agree to the <span className="text-teal-600 font-medium">Terms of Service</span> and <span className="text-teal-600 font-medium">Privacy Policy</span>. I understand that my information will be used to manage my laboratory compliance project.
                </span>
              </label>
              <button type="submit" disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-teal-400 text-white font-semibold py-3 rounded-lg transition-colors text-sm">
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>
            <p className="text-center text-sm text-slate-500 mt-5">
              Already have an account?{" "}
              <Link to="/portal/login" className="text-teal-600 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
        <Link to="/" className="block text-center mt-5 text-slate-400 hover:text-white text-sm transition-colors">
          ← Return to LabLaunch Website
        </Link>
      </div>
    </div>
  );
}
