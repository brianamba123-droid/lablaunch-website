import { Link } from "react-router-dom";
import logoImg from "@/imports/logo_symbol.png";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0b1f3a] flex items-center justify-center px-4">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "linear-gradient(#14b8a6 1px, transparent 1px), linear-gradient(90deg, #14b8a6 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#0b1f3a] px-8 py-8 flex flex-col items-center">
            <div className="rounded-xl overflow-hidden bg-[#f5f0e8] mb-4">
              <img src={logoImg} alt="LabLaunch Consulting" className="h-14 w-auto object-contain block" />
            </div>
            <h1 className="text-white font-extrabold text-xl">Admin Portal</h1>
            <p className="text-slate-400 text-sm mt-1">Laboratory Management System</p>
          </div>

          {/* Access status */}
          <div className="px-8 py-8">
            <h2 className="text-[#0b1f3a] font-bold text-lg mb-3">Admin access is temporarily unavailable</h2>
            <div role="status" className="bg-amber-50 border border-amber-200 text-amber-900 text-sm rounded-lg px-4 py-4 leading-relaxed">
              This site does not yet have server-side authentication. Browser-only passwords and sessions cannot securely protect the admin portal, so admin sign-in and dashboard access are disabled until secure authentication is configured.
            </div>
            <p className="text-slate-500 text-sm mt-4">
              No project data was moved or deleted as part of this change.
            </p>
            <div className="mt-6">
              <Link to="/" className="inline-flex items-center justify-center w-full bg-teal-600 hover:bg-teal-500 text-white font-semibold py-3 rounded-lg transition-colors text-sm">
                Return to LabLaunch
              </Link>
            </div>
            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-xs text-slate-400 text-center">
                A secure server-side sign-in must be deployed before admin access can be restored.
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
