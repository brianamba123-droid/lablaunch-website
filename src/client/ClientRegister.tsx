import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { clientRegister, clientLogin } from "../data/clientStore";
import logoImg from "@/imports/logo_symbol.png";

export default function ClientRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", email: "", mobile: "", company: "", position: "",
    password: "", confirmPassword: "", agreedToTerms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (form.password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!form.agreedToTerms) { setError("Please agree to the Terms & Privacy Policy to continue."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 350));
    const result = clientRegister({
      email: form.email, password: form.password, name: form.name,
      mobile: form.mobile, company: form.company, position: form.position,
      agreedToTerms: form.agreedToTerms,
    });
    if (!result.ok) { setError(result.error || "Registration failed."); setLoading(false); return; }
    clientLogin(form.email, form.password);
    navigate("/client/dashboard");
  };

  const field = (label: string, key: keyof typeof form, type = "text", placeholder = "") => (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      <input
        type={type} required={key !== "position"} value={form[key] as string}
        onChange={set(key)} placeholder={placeholder} autoComplete={type === "email" ? "email" : type === "password" ? "new-password" : "off"}
        className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b1f3a] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "linear-gradient(#14b8a6 1px, transparent 1px), linear-gradient(90deg, #14b8a6 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#0b1f3a] px-8 py-7 flex flex-col items-center">
            <div className="rounded-xl overflow-hidden bg-[#f5f0e8] mb-4">
              <img src={logoImg} alt="LabLaunch" className="h-12 w-auto object-contain block" />
            </div>
            <h1 className="text-white font-extrabold text-xl">Create Account</h1>
            <p className="text-slate-400 text-sm mt-1">Client Portal — Laboratory Project Management</p>
          </div>

          <div className="px-8 py-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-5">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {field("Full Name", "name", "text", "Juan dela Cruz")}

              <div className="grid grid-cols-2 gap-4">
                {field("Email Address", "email", "email", "juan@example.com")}
                {field("Mobile Number", "mobile", "tel", "+63 9XX XXX XXXX")}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {field("Company / Organization", "company", "text", "ABC Medical Clinic")}
                {field("Position / Designation", "position", "text", "e.g. Medical Director")}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {field("Password", "password", "password", "Minimum 8 characters")}
                {field("Confirm Password", "confirmPassword", "password", "Re-enter password")}
              </div>

              <label className="flex items-start gap-3 cursor-pointer pt-1">
                <input type="checkbox" checked={form.agreedToTerms} onChange={set("agreedToTerms")}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-400 shrink-0" />
                <span className="text-sm text-slate-600">
                  {"I agree to the "}
                  <span className="text-teal-600 font-semibold">Terms of Service</span>
                  {" and "}
                  <span className="text-teal-600 font-semibold">Privacy Policy</span>
                  {". I understand that LabLaunch Consulting will use my information to manage my laboratory project."}
                </span>
              </label>

              <button
                type="submit" disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-teal-400 text-white font-semibold py-3 rounded-lg transition-colors text-sm">
                {loading ? "Creating Account…" : "Create Account"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-5">
              Already have an account?{" "}
              <Link to="/client/login" className="text-teal-600 font-semibold hover:underline">Sign In</Link>
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
