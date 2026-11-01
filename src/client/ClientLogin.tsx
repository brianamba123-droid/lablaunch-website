import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { clientLogin } from "../data/clientStore";
import logoImg from "@/imports/logo_symbol.png";

export default function ClientLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 350));
    const ok = clientLogin(email, password);
    setLoading(false);
    if (ok) navigate("/client/dashboard");
    else setError("Invalid email or password. Please check your credentials and try again.");
  };

  return (
    <div className="min-h-screen bg-[#0b1f3a] flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "linear-gradient(#14b8a6 1px, transparent 1px), linear-gradient(90deg, #14b8a6 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#0b1f3a] px-8 py-8 flex flex-col items-center">
            <div className="rounded-xl overflow-hidden bg-[#f5f0e8] mb-4">
              <img src={logoImg} alt="LabLaunch Consulting" className="h-14 w-auto object-contain block" />
            </div>
            <h1 className="text-white font-extrabold text-xl">Client Portal</h1>
            <p className="text-slate-400 text-sm mt-1">Laboratory Project Management</p>
          </div>

          <div className="px-8 py-8">
            <h2 className="text-[#0b1f3a] font-bold text-lg mb-1">Sign In</h2>
            <p className="text-slate-500 text-sm mb-6">Access your laboratory projects and compliance checklist.</p>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" autoComplete="email"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
                <input
                  type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-500 disabled:bg-teal-400 text-white font-semibold py-3 rounded-lg transition-colors text-sm mt-2">
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-5">
              {"Don't have an account? "}
              <Link to="/client/register" className="text-teal-600 font-semibold hover:underline">Create Account</Link>
            </p>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 text-center">
                LabLaunch Consulting Client Portal — Authorized access only
              </p>
            </div>
          </div>
        </div>

        <Link to="/" className="block text-center mt-5 text-slate-400 hover:text-white text-sm transition-colors">
          ← Return to LabLaunch Website
        </Link>
      </div>
    </div>
  );
}
