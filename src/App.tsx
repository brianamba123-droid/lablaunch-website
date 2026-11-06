import { useState, useEffect, useRef, ReactNode } from "react";
import { HashRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import LoginPage from "./admin/LoginPage";
import Dashboard from "./admin/Dashboard";
import LabDetail from "./admin/LabDetail";
import ClientLogin from "./client/ClientLogin";
import ClientRegister from "./client/ClientRegister";
import ClientDashboard from "./client/ClientDashboard";
import NewLabWizard from "./client/NewLabWizard";
import ClientLabDetail from "./client/ClientLabDetail";
import ClientGuard from "./client/ClientGuard";
import { logout } from "./data/store";
import logoImg from "@/imports/lablaunch-emblem.png";

/* ─── FadeIn ──────────────────────────────────────────────────────── */
function FadeIn({ children, delay = 0, className = "" }: {
  children: ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          if (ref.current) { ref.current.style.opacity = "1"; ref.current.style.transform = "none"; }
        }, delay);
        io.disconnect();
      }
    }, { threshold: 0.06, rootMargin: "0px 0px -20px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={className}
      style={{ opacity: 0, transform: "translateY(20px)", transition: "opacity 0.65s ease, transform 0.65s ease" }}>
      {children}
    </div>
  );
}

/* ─── SVG Icon ───────────────────────────────────────────────────── */
function Ico({ d, size = 20, className = "" }: { d: string | string[]; size?: number; className?: string }) {
  const arr = Array.isArray(d) ? d : [d];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {arr.map((p, i) => <path key={i} d={p} />)}
    </svg>
  );
}

const I = {
  menu: "M3 12h18M3 6h18M3 18h18",
  close: "M18 6 6 18M6 6l12 12",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  chevDown: "M6 9l6 6 6-6",
  chevUp: "M18 15l-6-6-6 6",
  mapPin: ["M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z", "M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"],
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.9 1.18h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 5.99 5.99l1.27-1.27a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  mail: ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z", "M22 6l-10 7L2 6"],
  fb: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",
  whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.907-1.424A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z",
  check: "M20 6 9 17l-5-5",
  flask: ["M8.5 2h7", "M8.5 2v5.5L4.5 17A2 2 0 0 0 6.38 20h11.24A2 2 0 0 0 19.5 17L15.5 7.5V2"],
  shield: "M12 2 3 7v5c0 5.25 3.75 10.15 9 11.25C18.25 22.15 22 17.25 22 12V7L12 2z",
  document: ["M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z", "M14 2v6h6", "M16 13H8", "M16 17H8", "M10 9H8"],
  layout: ["M3 3h7v7H3z", "M14 3h7v7h-7z", "M14 14h7v7h-7z", "M3 14h7v7H3z"],
  tool: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  users: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"],
  book: ["M4 19.5A2.5 2.5 0 0 1 6.5 17H20", "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"],
  trending: ["M23 6 13.5 15.5 8.5 10.5 1 18", "M17 6h6v6"],
  search: ["M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z", "M21 21l-4.35-4.35"],
  zap: "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
  heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  clock: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 6v6l4 2"],
  info: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 8v4", "M12 16h.01"],
  award: ["M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z", "M8.21 13.89L7 23l5-3 5 3-1.21-9.12"],
  target: ["M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z", "M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z", "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"],
  globe: ["M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z", "M2 12h20", "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"],
  box: ["M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z", "M3.27 6.96 12 12.01l8.73-5.05", "M12 22.08V12"],
  truck: ["M1 3h15v13H1z", "M16 8h4l3 3v5h-7V8z", "M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z", "M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"],
  handshake: ["M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"],
};

const LABGUARD_URL = "https://labguard.brian-amba123.workers.dev/";
const LABQUEUE_DOWNLOAD_URL = "";

/* ─── Philippines Mindanao Location Data ─────────────────────────── */
const LOCATION_DATA: Record<string, Record<string, string[]>> = {
  "Region IX – Zamboanga Peninsula": {
    "Zamboanga del Norte": ["Dapitan City", "Dipolog City", "Bacungan", "Baliguian", "Godod", "Gutalac", "Jose Dalman", "Kalawit", "Katipunan", "La Libertad", "Labason", "Leon B. Postigo", "Liloy", "Manukan", "Mutia", "Piñan", "Polanco", "Pres. Manuel A. Roxas", "Rizal", "Salug", "Sergio Osmeña Sr.", "Siayan", "Sibuco", "Sibutad", "Sindangan", "Siocon", "Sirawai", "Tampilisan"],
    "Zamboanga del Sur": ["Pagadian City", "Zamboanga City", "Alicia", "Aurora", "Bayog", "Dimataling", "Dinas", "Dumalinao", "Dumingag", "Guipos", "Josefina", "Kumalarang", "Labangan", "Lakewood", "Lapuyan", "Mahayag", "Margosatubig", "Midsalip", "Molave", "Pitogo", "Ramon Magsaysay", "San Miguel", "San Pablo", "Tabina", "Tambulig", "Tigbao", "Tukuran", "Vincenzo A. Sagun"],
    "Zamboanga Sibugay": ["Ipil", "Alicia", "Buug", "Diplahan", "Imelda", "Kabasalan", "Mabuhay", "Malangas", "Naga", "Olutanga", "Payao", "Roseller Lim", "Siay", "Talusan", "Titay", "Tungawan"],
  },
  "Region X – Northern Mindanao": {
    "Bukidnon": ["Malaybalay City", "Valencia City", "Baungon", "Cabanglasan", "Damulog", "Dangcagan", "Don Carlos", "Impasugong", "Kadingilan", "Kalilangan", "Kibawe", "Kitaotao", "Lantapan", "Libona", "Malitbog", "Manolo Fortich", "Maramag", "Pangantucan", "Quezon", "San Fernando", "Sumilao", "Talakag"],
    "Camiguin": ["Mambajao", "Catarman", "Guinsiliban", "Mahinog", "Sagay"],
    "Lanao del Norte": ["Iligan City", "Bacolod", "Baloi", "Baroy", "Kapatagan", "Kauswagan", "Kolambugan", "Lala", "Linamon", "Maigo", "Matungao", "Munai", "Nunungan", "Pantao Ragat", "Pantar", "Poona Piagapo", "Salvador", "Sapad", "Sultan Naga Dimaporo", "Tagoloan", "Tangcal", "Tubod"],
    "Misamis Occidental": ["Oroquieta City", "Ozamiz City", "Tangub City", "Calamba", "Clarin", "Concepcion", "Don Victoriano Chiongbian", "Jimenez", "Lopez Jaena", "Panaon", "Plaridel", "Sapang Dalaga", "Sinacaban", "Tudela"],
    "Misamis Oriental": ["Cagayan de Oro City", "Gingoog City", "El Salvador City", "Alubijid", "Balingasag", "Balingoan", "Binuangan", "Claveria", "Gitagum", "Initao", "Jasaan", "Kinoguitan", "Lagonglong", "Laguindingan", "Libertad", "Lugait", "Magsaysay", "Manticao", "Medina", "Naawan", "Opol", "Salay", "Sugbongcogon", "Tagoloan", "Talisayan", "Villanueva"],
  },
  "Region XI – Davao Region": {
    "Davao de Oro": ["Nabunturan", "Compostela", "Laak", "Mabini", "Maco", "Maragusan", "Mawab", "Monkayo", "Montevista", "New Bataan", "Pantukan"],
    "Davao del Norte": ["Tagum City", "Panabo City", "Island Garden City of Samal", "Asuncion", "Braulio E. Dujali", "Carmen", "Kapalong", "New Corella", "San Isidro", "Santo Tomas", "Talaingod"],
    "Davao del Sur": ["Davao City", "Digos City", "Bansalan", "Don Marcelino", "Hagonoy", "Jose Abad Santos", "Kiblawan", "Magsaysay", "Malalag", "Matanao", "Padada", "Santa Cruz", "Sulop"],
    "Davao Occidental": ["Malita", "Don Marcelino", "Jose Abad Santos", "Sarangani", "Santa Maria"],
    "Davao Oriental": ["Mati City", "Baganga", "Banaybanay", "Boston", "Caraga", "Cateel", "Governor Generoso", "Lupon", "Manay", "San Isidro", "Tarragona"],
  },
  "Region XII – SOCCSKSARGEN": {
    "Cotabato (North Cotabato)": ["Kidapawan City", "Alamada", "Aleosan", "Antipas", "Arakan", "Banisilan", "Carmen", "Kabacan", "Libungan", "M'lang", "Magpet", "Makilala", "Matalam", "Midsayap", "Pigkawayan", "Pikit", "President Roxas", "Tulunan"],
    "Sarangani": ["Alabel", "Glan", "Kiamba", "Maasim", "Maitum", "Malapatan", "Malungon"],
    "South Cotabato": ["General Santos City", "Koronadal City", "Banga", "Lake Sebu", "Norala", "Polomolok", "Santo Niño", "Surallah", "T'boli", "Tampakan", "Tantangan", "Tupi"],
    "Sultan Kudarat": ["Isulan", "Tacurong City", "Bagumbayan", "Columbio", "Esperanza", "Kalamansig", "Lebak", "Lutayan", "Lambayong", "Palimbang", "President Quirino", "Sen. Ninoy Aquino"],
  },
  "Region XIII – CARAGA": {
    "Agusan del Norte": ["Butuan City", "Cabadbaran City", "Buenavista", "Carmen", "Jabonga", "Kitcharao", "Las Nieves", "Magallanes", "Nasipit", "Remedios T. Romualdez", "Santiago", "Tubay"],
    "Agusan del Sur": ["Bayugan City", "Bunawan", "Esperanza", "La Paz", "Loreto", "Prosperidad", "Rosario", "San Francisco", "San Luis", "Santa Josefa", "Sibagat", "Talacogon", "Trento", "Veruela"],
    "Dinagat Islands": ["San Jose", "Basilisa", "Cagdianao", "Dinagat", "Libjo", "Loreto", "Tubajon"],
    "Surigao del Norte": ["Surigao City", "Alegria", "Bacuag", "Burgos", "Claver", "Dapa", "Del Carmen", "General Luna", "Gigaquit", "Mainit", "Malimono", "Pilar", "Placer", "San Benito", "San Francisco", "San Isidro", "Santa Monica", "Sison", "Socorro", "Tagana-an", "Tubod"],
    "Surigao del Sur": ["Tandag City", "Bislig City", "Barobo", "Bayabas", "Cagwait", "Cantilan", "Carmen", "Carrascal", "Cortes", "Hinatuan", "Lanuza", "Lianga", "Lingig", "Madrid", "Marihatag", "San Agustin", "San Miguel", "Tagbina", "Tago"],
  },
  "BARMM – Bangsamoro": {
    "Basilan": ["Isabela City", "Lamitan City", "Akbar", "Al-Barka", "Hadji Mohammad Ajul", "Hadji Muhtamad", "Lantawan", "Maluso", "Sumisip", "Tabuan-Lasa", "Tipo-Tipo", "Tuburan", "Ungkaya Pukan"],
    "Lanao del Sur": ["Marawi City", "Amai Manabilang", "Bacolod-Kalawi", "Balabagan", "Balindong", "Bayang", "Binidayan", "Buadiposo-Buntong", "Bubong", "Bumbaran", "Butig", "Calanogas", "Ditsaan-Ramain", "Ganassi", "Lumba-Bayabao", "Lumbatan", "Lumbayanague", "Madalum", "Madamba", "Maguing", "Malabang", "Marantao", "Marogong", "Masiu", "Mulondo", "Pagayawan", "Piagapo", "Poona Bayabao", "Pualas", "Saguiaran", "Tamparan", "Taraka", "Tubaran", "Tugaya", "Wao"],
    "Maguindanao del Norte": ["Datu Odin Sinsuat", "Barira", "Buldon", "Datu Blah T. Sinsuat", "Datu Saudi-Ampatuan", "Kabuntalan", "Matanog", "Northern Kabuntalan", "Parang", "Sultan Kudarat", "Sultan Mastura", "Upi"],
    "Maguindanao del Sur": ["Cotabato City", "Buluan", "Datu Abdullah Sangki", "Datu Anggal Midtimbang", "Datu Paglas", "Datu Piang", "Datu Salibo", "Datu Unsay", "Gen. S.K. Pendatun", "Guindulungan", "Mamasapano", "Mangudadatu", "Pagalungan", "Paglat", "Pandag", "Rajah Buayan", "Shariff Aguak", "South Upi", "Sultan sa Barongis", "Talayan"],
    "Sulu": ["Jolo", "Indanan", "Kalingalan Caluang", "Lugus", "Luuk", "Maimbung", "Old Panamao", "Omar", "Pandami", "Panglima Estino", "Pangutaran", "Parang", "Pata", "Patikul", "Siasi", "Talipao", "Tapul", "Tongkil"],
    "Tawi-Tawi": ["Bongao", "Languyan", "Mapun", "Panglima Sugala", "Sabah Al-Nur", "Sibutu", "Simunul", "Sitangkai", "South Ubian", "Tandubas", "Turtle Islands"],
  },
  "Other / Outside Mindanao": {
    "Other Location": ["Please specify in message"],
  },
};

/* ─── Navigation ─────────────────────────────────────────────────── */
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  const links = [
    { href: "#home", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "#tools", label: "Lab Tools" },
    { href: "#process", label: "Our Process" },
    { href: "#about", label: "About" },
    { href: "#faq", label: "FAQ" },
    { href: "#contact", label: "Contact" },
  ];
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0b1f3a]/97 backdrop-blur-sm shadow-lg" : "bg-[#0b1f3a]"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          <a href="#home" className="flex items-center gap-3 group">
            <div className="rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-white/25 transition-all duration-200 bg-[#071426]">
              <img src={logoImg} alt="" className="h-11 w-11 object-cover block" />
            </div>
            <span className="flex flex-col leading-tight">
              <span className="text-white font-extrabold tracking-tight">LabLaunch</span>
              <span className="text-slate-400 text-[10px] font-medium tracking-wide">LABORATORY QUALITY ADVOCACY</span>
            </span>
          </a>
          <nav className="hidden lg:flex items-center gap-6">
            {links.map(l => (
              <a key={l.href} href={l.href} className="text-slate-300 hover:text-white text-sm font-medium transition-colors duration-150">{l.label}</a>
            ))}
          </nav>
          <div className="hidden lg:block">
            <a href="#contact" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors duration-150">
              Start Your Project <Ico d={I.arrowRight} size={15} />
            </a>
          </div>
          <button onClick={() => setOpen(!open)} className="lg:hidden text-white p-2" aria-label="Toggle menu">
            <Ico d={open ? I.close : I.menu} size={22} />
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden bg-[#0b1f3a] border-t border-white/10 px-4 py-4 space-y-1">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block py-2.5 px-3 text-slate-300 hover:text-white hover:bg-white/5 rounded-md text-sm font-medium transition-colors">{l.label}</a>
          ))}
          <div className="pt-2">
            <a href="#contact" onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold px-4 py-3 rounded-lg transition-colors w-full">
              Start Your Project
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center bg-[#0b1f3a] overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1920&h=1080&fit=crop&auto=format"
          alt="Laboratory professional operating diagnostic equipment" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1f3a] via-[#0b1f3a]/90 to-[#0b1f3a]/60" />
      </div>
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "linear-gradient(#14b8a6 1px, transparent 1px), linear-gradient(90deg, #14b8a6 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <div className="max-w-3xl">
          <FadeIn>
            <div className="inline-flex items-center gap-2 text-teal-400 text-xs font-semibold tracking-widest uppercase mb-6 border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 rounded-full">
              <Ico d={I.mapPin} size={12} />
              Laboratory quality advocacy rooted in Mindanao
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-6">
              Advancing Laboratory<br className="hidden sm:block" />{" "}
              <span className="text-teal-400">Result Quality in the Philippines.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-slate-300 text-lg sm:text-xl leading-relaxed mb-4 max-w-2xl">
              We champion practical, sustainable improvements that help laboratory teams strengthen confidence in their test results.
            </p>
            <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-2xl">
              Through quality-focused tools, resources, and consulting, we support laboratory teams and organizations. Our consulting services are based in Tangub City and available in selected areas across Mindanao.
            </p>
          </FadeIn>
          <FadeIn delay={300}>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#contact" className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors duration-150 text-sm">
                Explore Quality Tools <Ico d={I.arrowRight} size={16} />
              </a>
              <a href="#contact" className="inline-flex items-center justify-center gap-2 border border-white/25 hover:border-white/50 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors duration-150 text-sm hover:bg-white/5">
                Work With LabLaunch
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent" />
    </section>
  );
}

/* ─── Trust Strip ────────────────────────────────────────────────── */
function TrustStrip() {
  const pillars = [
    { icon: I.target, label: "Quality Improvement" },
    { icon: I.flask, label: "Quality Control" },
    { icon: I.document, label: "Audits & Documentation" },
    { icon: I.users, label: "Laboratory Teams" },
    { icon: I.shield, label: "Reliable Systems" },
    { icon: I.trending, label: "Continuous Learning" },
  ];
  return (
    <section className="bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <FadeIn className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-shrink-0 bg-white border border-slate-200 rounded-2xl px-8 py-5 text-center shadow-sm">
            <p className="text-teal-700 text-[10px] font-bold tracking-widest uppercase mb-2">Our Commitment</p>
            <p className="text-[#0b1f3a] font-extrabold text-lg leading-tight">Better Laboratory<br />Result Quality</p>
          </div>
          <div className="flex flex-wrap justify-center gap-2.5 flex-1">
            {pillars.map((p, i) => (
              <FadeIn key={p.label} delay={i * 50}>
                <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                  <Ico d={p.icon} size={15} className="text-teal-600" />
                  {p.label}
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Services ───────────────────────────────────────────────────── */
function Services() {
  const services = [
    {
      icon: I.flask,
      title: "Laboratory Planning & Setup",
      desc: "Assistance with planning laboratory requirements, workflow, equipment, documentation, and operational needs — from initial concept through readiness.",
      points: ["Space and workflow planning", "Equipment and supply requirements", "Operational preparation"],
    },
    {
      icon: I.shield,
      title: "Regulatory & Compliance Assistance",
      desc: "Guidance in understanding and preparing for applicable laboratory regulatory requirements, permits, licenses, inspections, and compliance documentation.",
      points: ["DOH laboratory requirements", "Documentation for assessment", "Compliance preparation review"],
    },
    {
      icon: I.document,
      title: "Laboratory Documentation",
      desc: "Development and organization of laboratory SOPs, policies, procedures, forms, checklists, manuals, and other operational documents.",
      points: ["Standard Operating Procedures", "Policy and procedure manuals", "Forms and record templates"],
    },
    {
      icon: I.box,
      title: "Equipment Planning",
      desc: "Assistance in identifying laboratory equipment and determining appropriate requirements based on the laboratory's intended testing services and scope.",
      points: ["Equipment selection guidance", "Instrument and analyzer planning", "Maintenance and calibration considerations"],
    },
    {
      icon: I.truck,
      title: "Supplier & Procurement Coordination",
      desc: "Assistance in communicating with suppliers, requesting quotations, comparing options, coordinating purchases, and organizing laboratory supply requirements.",
      points: ["Supplier communication and quotations", "Reagent and consumable coordination", "Procurement organization"],
    },
    {
      icon: I.trending,
      title: "Quality Improvement & Operations Support",
      desc: "Support for existing laboratories to strengthen quality systems, QC review, audit readiness, documentation, workflows, and corrective-action follow-through — tailored to each laboratory's context and resources.",
      points: ["QC and internal-audit workflows", "Process and documentation improvement", "Ongoing quality and compliance support"],
    },
  ];
  return (
    <section id="services" className="bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <FadeIn>
            <p className="text-teal-600 text-xs font-semibold tracking-widest uppercase mb-3">Our Services</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0b1f3a] mb-4">
              Practical Support for Better Laboratory Quality
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              We connect quality improvement with the systems behind it: capable teams, sound documentation, dependable workflows, and fit-for-purpose tools.
            </p>
          </FadeIn>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <FadeIn key={s.title} delay={i * 60}>
              <div className="group flex flex-col bg-slate-50 border border-slate-200 hover:border-teal-300 hover:shadow-md rounded-2xl p-6 transition-all duration-200 h-full">
                <div className="w-11 h-11 rounded-xl bg-teal-100 group-hover:bg-teal-200 flex items-center justify-center mb-4 transition-colors flex-shrink-0">
                  <Ico d={s.icon} size={20} className="text-teal-700" />
                </div>
                <h3 className="font-bold text-[#0b1f3a] text-base mb-2 leading-snug">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{s.desc}</p>
                <ul className="mt-auto space-y-1.5">
                  {s.points.map(pt => (
                    <li key={pt} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <Ico d={I.check} size={9} className="text-teal-600" />
                      </div>
                      <span className="text-slate-500 text-xs">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={200}>
          <div className="mt-12 text-center">
            <a href="#contact" className="inline-flex items-center gap-2 bg-[#0b1f3a] hover:bg-[#112b4d] text-white font-semibold px-7 py-3.5 rounded-lg transition-colors text-sm">
              Start Your Laboratory Project <Ico d={I.arrowRight} size={16} />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Laboratory Tools ───────────────────────────────────────────── */
function LaboratoryTools() {
  return (
    <section id="tools" className="bg-slate-50 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <FadeIn>
            <p className="text-teal-600 text-xs font-semibold tracking-widest uppercase mb-3">Tools for Better Laboratory Quality</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b1f3a] mb-5 leading-tight">
              Practical Tools. Stronger Quality Systems.
            </h2>
            <p className="text-slate-600 text-base leading-relaxed mb-5">
              We advocate for better laboratory result quality by making practical quality-control, audit, and workflow tools more accessible to laboratory teams in the Philippines.
            </p>
            <p className="text-slate-600 text-base leading-relaxed">
              Tools alone cannot guarantee accurate results. They are designed to support—not replace—professional judgment, approved procedures, and each laboratory's quality system. We welcome feedback from laboratory professionals as we continue to improve them.
            </p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="space-y-5">
              <article className="bg-white border border-slate-200 rounded-2xl p-7 sm:p-9 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                    <Ico d={I.flask} size={22} className="text-teal-700" />
                  </div>
                  <div>
                    <p className="text-teal-700 text-xs font-semibold tracking-widest uppercase">A community-minded lab tool</p>
                    <h3 className="text-2xl font-extrabold text-[#0b1f3a]">LabGuard</h3>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">
                  A laboratory quality-control and internal-audit workspace with QC result tracking, Levey–Jennings charts, Westgard evaluations, audit and CAPA workflows, and inventory tools.
                </p>
                <p className="text-slate-500 text-xs leading-relaxed mb-6">
                  Built to help make quality-control and internal-audit work more organized and approachable. LabGuard supports recordkeeping and review; it does not replace approved laboratory procedures, professional judgment, or regulatory requirements.
                </p>
                <a href={LABGUARD_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0b1f3a] hover:bg-[#112b4d] text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm">
                  Explore LabGuard <Ico d={I.arrowRight} size={15} />
                </a>
              </article>

              <article id="labqueue" className="bg-white border border-slate-200 rounded-2xl p-7 sm:p-9 shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Ico d={I.box} size={22} className="text-blue-700" />
                  </div>
                  <div>
                    <p className="text-blue-700 text-xs font-semibold tracking-widest uppercase">Local-first workflow</p>
                    <h3 className="text-2xl font-extrabold text-[#0b1f3a]">LabQueue</h3>
                  </div>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">
                  A laboratory request and specimen workflow for receiving, section queues, staff accounts, and audit exports. Patient records are stored on the laboratory host and are not uploaded to LabLaunch.
                </p>
                <p className="text-slate-500 text-xs leading-relaxed mb-6">
                  Created to support laboratories looking for a practical, locally run workflow. LabQueue requires local network setup and is not a cloud-hosted service. The installer is unsigned, and the software has not been validated as a clinical system; review the setup guide and complete appropriate security, privacy, and clinical checks before use.
                </p>
                {LABQUEUE_DOWNLOAD_URL ? (
                  <a href={LABQUEUE_DOWNLOAD_URL} download
                    className="inline-flex items-center gap-2 bg-[#0b1f3a] hover:bg-[#112b4d] text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm">
                    Download Windows installer <Ico d={I.arrowRight} size={15} />
                  </a>
                ) : (
                  <span aria-disabled="true"
                    className="inline-flex items-center gap-2 bg-slate-200 text-slate-500 font-semibold px-6 py-3 rounded-lg text-sm">
                    Installer download coming soon
                  </span>
                )}
              </article>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── Process ────────────────────────────────────────────────────── */
function Process() {
  const steps = [
    {
      num: "01", title: "Plan",
      desc: "Understand the laboratory's goals, intended testing services, facility, equipment needs, and operational requirements.",
    },
    {
      num: "02", title: "Prepare",
      desc: "Organize regulatory requirements, documentation, SOPs, policies, and other preparations needed before and during setup.",
    },
    {
      num: "03", title: "Source",
      desc: "Assist with equipment identification, supply requirements, quotation requests, and supplier coordination.",
    },
    {
      num: "04", title: "Implement",
      desc: "Help organize the laboratory's physical setup, workflow, personnel requirements, and operational readiness.",
    },
    {
      num: "05", title: "Improve",
      desc: "Support existing laboratories with ongoing operational, documentation, procurement, and compliance improvements.",
    },
  ];
  return (
    <section id="process" className="bg-[#0b1f3a] py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <FadeIn>
            <p className="text-teal-400 text-xs font-semibold tracking-widest uppercase mb-3">How We Help</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">A Structured Approach to Laboratory Success.</h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Every laboratory project is different, but a disciplined process makes the difference between a laboratory that struggles and one that operates effectively from the start.
            </p>
          </FadeIn>
        </div>
        <div className="hidden lg:flex items-start gap-0">
          {steps.map((s, i) => (
            <FadeIn key={s.num} delay={i * 80} className="flex-1">
              <div className="relative pr-4">
                {i < steps.length - 1 && <div className="absolute top-5 left-[calc(50%+20px)] right-0 h-px bg-teal-800 z-0" />}
                <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-extrabold text-xs mb-4 ring-4 ring-[#0b1f3a]">{s.num}</div>
                  <h3 className="text-white font-bold text-base mb-2">{s.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        <div className="lg:hidden space-y-0">
          {steps.map((s, i) => (
            <FadeIn key={s.num} delay={i * 60}>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-extrabold text-xs flex-shrink-0">{s.num}</div>
                  {i < steps.length - 1 && <div className="w-px flex-1 bg-teal-800 my-2 min-h-[32px]" />}
                </div>
                <div className="pb-8 pt-2">
                  <h3 className="text-white font-bold text-base mb-1.5">{s.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={200}>
          <div className="mt-14 text-center">
            <a href="#contact" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors text-sm">
              Start the Conversation <Ico d={I.arrowRight} size={16} />
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── Why LabLaunch ──────────────────────────────────────────────── */
function WhyLabLaunch() {
  const reasons = [
    {
      icon: I.flask, title: "Laboratory-Focused",
      tagline: "Built around the realities of laboratory work.",
      desc: "Our services are built specifically around how diagnostic laboratories operate — from test workflows and documentation to staffing, equipment, and supplier coordination. Every recommendation is grounded in actual laboratory practice.",
      points: ["Advice tailored to laboratory-specific requirements", "Understanding of clinical laboratory operations", "Guidance informed by hands-on experience"],
    },
    {
      icon: I.zap, title: "End-to-End Support",
      tagline: "One partner for the entire process.",
      desc: "From your first idea to your laboratory's first day of operation — and beyond — LabLaunch can assist at every stage. Planning, documentation, equipment, suppliers, compliance, and ongoing operations.",
      points: ["Planning through launch and beyond", "No need to manage multiple separate consultants", "Consistent guidance from concept through operations"],
    },
    {
      icon: I.target, title: "Practical Approach",
      tagline: "Real solutions for real laboratory situations.",
      desc: "Recommendations are realistic, operational, and matched to your laboratory's actual resources, capacity, and goals — not generic templates or overcomplicated systems that look good on paper but don't work in practice.",
      points: ["Solutions scaled to your actual resources", "Actionable guidance, not theoretical frameworks", "Focus on what works in the field"],
    },
    {
      icon: I.shield, title: "Compliance-Minded",
      tagline: "Understand the requirements before they catch you off guard.",
      desc: "Regulatory requirements for diagnostic laboratories can be detailed and complex. LabLaunch helps you understand what applies, prepare your documentation accordingly, and approach assessment with greater confidence.",
      points: ["Clear explanation of applicable DOH requirements", "Documentation and system preparation for assessment", "Transparent guidance on what to expect"],
    },
    {
      icon: I.truck, title: "Supplier Coordination",
      tagline: "Connecting laboratories with the right supplies.",
      desc: "Laboratory purchasing can be fragmented and time-consuming. LabLaunch assists with supplier communication, quotation requests, product comparisons, and procurement coordination — making the process more organized and efficient.",
      points: ["Equipment and reagent sourcing assistance", "Quotation requests and supplier coordination", "Procurement organized around your needs"],
    },
    {
      icon: I.clock, title: "Long-Term Support",
      tagline: "We're here even after the doors open.",
      desc: "Quality systems need to be maintained. Staff need continued development. Documentation needs to be kept current. LabLaunch can remain a resource for your laboratory long after the initial establishment.",
      points: ["Post-launch quality and operations support", "Ongoing documentation and compliance assistance", "A consistent partner as your laboratory grows"],
    },
  ];
  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <FadeIn>
            <p className="text-teal-600 text-xs font-semibold tracking-widest uppercase mb-3">Our Approach</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0b1f3a] mb-4">Quality Improvement, Grounded in Practice</h2>
            <p className="text-slate-500 text-base leading-relaxed">We pair laboratory-focused experience with practical support shaped around the people, processes, and resources behind every result.</p>
          </FadeIn>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <FadeIn key={r.title} delay={i * 70}>
              <div className="group flex flex-col p-6 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all duration-200 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 group-hover:bg-teal-200 flex items-center justify-center flex-shrink-0 transition-colors">
                    <Ico d={r.icon} size={18} className="text-teal-700" />
                  </div>
                  <h3 className="font-extrabold text-[#0b1f3a] text-base leading-tight">{r.title}</h3>
                </div>
                <p className="text-teal-700 text-xs font-semibold italic mb-3 leading-snug">{r.tagline}</p>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{r.desc}</p>
                <ul className="mt-auto space-y-2">
                  {r.points.map(pt => (
                    <li key={pt} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Ico d={I.check} size={9} className="text-teal-600" />
                      </div>
                      <span className="text-slate-500 text-xs leading-relaxed">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── About ──────────────────────────────────────────────────────── */
function About() {
  return (
    <section id="about" className="bg-white py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <FadeIn className="order-2 lg:order-1">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3]">
                <img src="https://images.unsplash.com/photo-1602052577122-f73b9710adba?w=800&h=600&fit=crop&auto=format"
                  alt="Modern laboratory workbench with analytical equipment" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-4 bg-[#0b1f3a] text-white rounded-xl px-6 py-4 shadow-xl max-w-48">
                <div className="text-teal-400 text-2xl font-extrabold leading-none mb-1">2026</div>
                <div className="text-slate-300 text-xs font-medium">Established in Tangub City</div>
              </div>
            </div>
          </FadeIn>
          <div className="order-1 lg:order-2">
            <FadeIn>
              <p className="text-teal-600 text-xs font-semibold tracking-widest uppercase mb-3">About LabLaunch</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b1f3a] mb-6 leading-tight">Better Results Begin with Better Laboratory Systems.</h2>
            </FadeIn>
            <FadeIn delay={80}>
              <p className="text-slate-600 text-base leading-relaxed mb-5">
                LabLaunch exists to champion better laboratory result quality in the Philippines.
              </p>
              <p className="text-slate-600 text-base leading-relaxed mb-5">
                Every laboratory result can inform an important health decision. Confidence in those results depends on capable people, sound quality systems, dependable workflows, and a commitment to continuous improvement.
              </p>
              <p className="text-slate-600 text-base leading-relaxed mb-5">
                We bring practical tools, learning resources, and laboratory consulting together to help teams strengthen the systems behind their work. Our goal is to support laboratories as they <span className="text-[#0b1f3a] font-semibold">build reliable processes, learn from their quality data, and improve over time.</span>
              </p>
              <p className="text-slate-600 text-base leading-relaxed mb-8">
                Our work is rooted in Tangub City, with consulting available in selected areas across Mindanao. Our advocacy for stronger laboratory quality reaches beyond our service area through tools and resources for the wider Philippine laboratory community.
              </p>
            </FadeIn>
            <FadeIn delay={150}>
              <div className="bg-teal-50 border border-teal-100 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <Ico d={I.award} size={16} className="text-teal-600" />
                  </div>
                  <div>
                    <div className="font-bold text-[#0b1f3a] text-sm mb-1">Experienced Laboratory Professionals</div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Hands-on experience in clinical laboratory operations, quality systems, diagnostic testing, laboratory information systems, and laboratory management.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Supplier Partnership ───────────────────────────────────────── */
function SupplierPartnership() {
  const categories = [
    "Laboratory Equipment & Instruments",
    "Reagents & Diagnostic Products",
    "Consumables & Labware",
    "Maintenance & Technical Services",
    "Laboratory Information Systems",
  ];
  return (
    <section className="bg-[#0b1f3a] py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <FadeIn>
              <p className="text-teal-400 text-xs font-semibold tracking-widest uppercase mb-3">Supplier Partnerships</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">Connecting Laboratories with the Right Suppliers.</h2>
              <p className="text-slate-300 text-base leading-relaxed mb-5">
                Laboratories require reliable access to equipment, reagents, consumables, and other essential supplies. LabLaunch assists with supplier communication, quotation requests, product comparisons, and procurement coordination — making laboratory purchasing more organized and less time-consuming.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                LabLaunch is building relationships with trusted suppliers across Mindanao. Suppliers interested in working with laboratory clients through LabLaunch are welcome to reach out.
              </p>
            </FadeIn>
            <FadeIn delay={100}>
              <a href="#contact" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-3.5 rounded-lg transition-colors text-sm">
                Become a Supplier Partner <Ico d={I.arrowRight} size={16} />
              </a>
            </FadeIn>
          </div>
          <FadeIn delay={100}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-teal-600/30 flex items-center justify-center">
                  <Ico d={I.handshake} size={18} className="text-teal-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base">For Laboratory Suppliers</h3>
                  <p className="text-slate-400 text-xs">Partner with LabLaunch to reach laboratory clients</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">We are actively building supplier relationships across the following categories:</p>
              <ul className="space-y-2.5 mb-6">
                {categories.map(cat => (
                  <li key={cat} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                      <Ico d={I.check} size={10} className="text-white" />
                    </div>
                    <span className="text-slate-300 text-sm">{cat}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-500 text-xs leading-relaxed border-t border-white/10 pt-4">
                Contact LabLaunch to discuss potential partnership opportunities. We do not claim an established supplier network — we are building these relationships actively.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── Service Area ───────────────────────────────────────────────── */
function ServiceArea() {
  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <p className="text-teal-600 text-xs font-semibold tracking-widest uppercase mb-3">Service Area</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b1f3a] mb-5">Local Roots. A Philippines-Wide Quality Commitment.</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              LabLaunch is based in Tangub City, Misamis Occidental. Consulting and on-site support are available in selected areas across Mindanao, depending on project requirements and location. Our commitment to better laboratory result quality in the Philippines is shared through practical tools and resources.
            </p>
            <a href="#contact" className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm">
              Discuss Your Location With Us <Ico d={I.arrowRight} size={15} />
            </a>
          </FadeIn>
          <FadeIn delay={120}>
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
              <svg viewBox="0 0 400 300" className="w-full max-w-sm mx-auto" fill="none">
                <defs>
                  <linearGradient id="mindanaoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#e0f2fe" />
                    <stop offset="100%" stopColor="#b2e4dc" />
                  </linearGradient>
                </defs>
                <path d="M80 80 C60 70, 40 85, 45 110 C50 135, 70 140, 65 165 C60 190, 75 210, 95 215 C115 220, 130 200, 155 205 C180 210, 195 230, 220 225 C245 220, 255 200, 280 195 C305 190, 330 200, 345 185 C360 170, 355 145, 340 130 C325 115, 305 120, 295 100 C285 80, 295 55, 275 45 C255 35, 235 55, 215 50 C195 45, 185 25, 165 30 C145 35, 140 60, 120 65 C100 70, 90 75, 80 80Z"
                  fill="url(#mindanaoGrad)" stroke="#0d9488" strokeWidth="2" />
                <circle cx="125" cy="120" r="8" fill="#0d9488" />
                <circle cx="125" cy="120" r="14" fill="#0d9488" fillOpacity="0.2" />
                <line x1="125" y1="112" x2="125" y2="85" stroke="#0d9488" strokeWidth="1.5" />
                <circle cx="125" cy="83" r="3" fill="#0d9488" />
                <text x="130" y="78" fontSize="9" fill="#0b1f3a" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">Tangub City</text>
                <text x="118" y="89" fontSize="7" fill="#64748b" fontFamily="Plus Jakarta Sans, sans-serif">Misamis Occidental</text>
                <circle cx="200" cy="140" r="90" fill="none" stroke="#0d9488" strokeWidth="1" strokeDasharray="4 6" opacity="0.3" />
                <text x="200" y="255" fontSize="10" fill="#0b1f3a" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif" textAnchor="middle">Mindanao</text>
              </svg>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1.5 rounded-full">
                  <Ico d={I.mapPin} size={11} /> Tangub City (Base)
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-full">
                  <Ico d={I.globe} size={11} /> Selected Areas Across Mindanao
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ─── Consultation CTA ───────────────────────────────────────────── */
function ConsultationCTA() {
  return (
    <section className="bg-gradient-to-br from-[#0b1f3a] via-[#0f2d4e] to-[#0b2a3a] py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #14b8a6 0%, transparent 60%), radial-gradient(circle at 80% 20%, #0d9488 0%, transparent 50%)" }} />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5">Ready to Strengthen Your Laboratory's Quality Systems?</h2>
          <p className="text-slate-300 text-xl leading-relaxed mb-3 max-w-2xl mx-auto font-medium">
            Make quality improvement part of everyday laboratory practice.
          </p>
          <p className="text-teal-400 text-sm mb-10">No obligation. We&apos;ll discuss your project and identify the right next steps.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-base">
              Explore Our Quality Tools <Ico d={I.arrowRight} size={17} />
            </a>
            <a href="#contact" className="inline-flex items-center justify-center gap-2 border border-white/25 hover:border-white/50 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-base hover:bg-white/5">
              Contact LabLaunch
            </a>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─── FAQ ────────────────────────────────────────────────────────── */
function FAQ() {
  const [active, setActive] = useState<number | null>(null);
  const items = [
    { q: "What does LabLaunch mean by advocating for laboratory result quality?", a: "We promote practical quality improvement through tools, learning resources, and laboratory consulting. Our work supports laboratory teams; it does not replace professional judgment, approved procedures, or the role of regulatory authorities." },
    { q: "Can LabLaunch help me start a new laboratory?", a: "Yes. We provide consulting and coordination support covering planning, documentation, equipment, supplier coordination, regulatory preparation, and operational readiness." },
    { q: "Do you assist with DOH regulatory requirements?", a: "Yes. LabLaunch provides guidance and preparation support for applicable DOH laboratory requirements and regulatory assessment. Final approval and licensing decisions remain with the appropriate regulatory authority." },
    { q: "Can you help with supplier coordination and procurement?", a: "Yes. This is one of our core services. We assist with supplier communication, quotation requests, product comparisons, and procurement coordination to make the purchasing process more organized." },
    { q: "Can you prepare laboratory SOPs and documents?", a: "Yes. Laboratory documentation development — including SOPs, policies, forms, manuals, and records — is one of our primary services." },
    { q: "Do you provide laboratory management consulting?", a: "Yes. We assist both new and existing laboratories with operational systems, quality, workflow, documentation, procurement, and ongoing management." },
    { q: "Do you guarantee DOH approval or accreditation?", a: "No. LabLaunch provides professional guidance and preparation assistance, but cannot guarantee regulatory approval or accreditation. All approvals and licensing decisions remain with the relevant government authorities." },
    { q: "How do I work with LabLaunch as a supplier?", a: "Suppliers interested in partnership opportunities can reach out through our contact form and select 'Supplier Partnership' as the project type. We are actively building supplier relationships across equipment, reagents, consumables, and services." },
    { q: "How much does consulting cost?", a: "Because every laboratory project has different requirements, we provide project-specific quotations rather than fixed public pricing. Contact us to discuss your project and receive a tailored proposal." },
  ];
  return (
    <section id="faq" className="bg-white py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <FadeIn>
            <p className="text-teal-600 text-xs font-semibold tracking-widest uppercase mb-3">FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b1f3a]">Frequently Asked Questions</h2>
          </FadeIn>
        </div>
        <div className="space-y-2">
          {items.map((item, i) => (
            <FadeIn key={i} delay={i * 40}>
              <div className={`border rounded-xl transition-all duration-200 ${active === i ? "border-teal-300 bg-teal-50/50" : "border-slate-200 bg-white hover:border-teal-200"}`}>
                <button className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left" onClick={() => setActive(active === i ? null : i)}>
                  <span className={`font-semibold text-sm leading-snug ${active === i ? "text-teal-700" : "text-[#0b1f3a]"}`}>{item.q}</span>
                  <Ico d={active === i ? I.chevUp : I.chevDown} size={16} className={`flex-shrink-0 transition-colors ${active === i ? "text-teal-600" : "text-slate-400"}`} />
                </button>
                {active === i && (
                  <div className="px-5 pb-5">
                    <p className="text-slate-600 text-sm leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ────────────────────────────────────────────────────── */
function Contact() {
  const serviceOptions = [
    "Laboratory Planning & Setup",
    "Regulatory & Compliance Assistance",
    "Laboratory Documentation & SOPs",
    "Equipment Planning",
    "Supplier & Procurement Coordination",
    "Laboratory Operations Support",
    "Supplier Partnership",
  ];

  const [form, setForm] = useState({ name: "", org: "", email: "", phone: "", region: "", province: "", city: "", projectType: "", stage: "", message: "" });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  const onRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, region: e.target.value, province: "", city: "" }));

  const onProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, province: e.target.value, city: "" }));

  const toggle = (s: string) =>
    setSelectedServices(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const provinces = form.region ? Object.keys(LOCATION_DATA[form.region] || {}) : [];
  const cities = form.province && form.region ? LOCATION_DATA[form.region]?.[form.province] || [] : [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const locationStr = [form.city, form.province, form.region].filter(Boolean).join(", ") || "Not specified";
    const emailData = {
      _subject: "New Laboratory Quality Inquiry - LabLaunch",
      _template: "table",
      _replyto: form.email,
      name: form.name,
      organization: form.org || "Not provided",
      email: form.email,
      phone: form.phone || "Not provided",
      project_type: form.projectType || "Not specified",
      region: form.region || "Not specified",
      province: form.province || "Not specified",
      city_municipality: form.city || "Not specified",
      full_location: locationStr,
      current_stage: form.stage || "Not specified",
      services_needed: selectedServices.length > 0 ? selectedServices.join(", ") : "Not specified",
      message: form.message || "None",
    };
    try {
      const response = await fetch("https://formsubmit.co/ajax/brian.amba123@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(emailData),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setSubmitted(true);
        setForm({ name: "", org: "", email: "", phone: "", region: "", province: "", city: "", projectType: "", stage: "", message: "" });
        setSelectedServices([]);
      } else {
        alert("There was a problem sending your inquiry. Please try again.");
      }
    } catch {
      alert("There was a problem sending your inquiry. Please try again.");
    }
  };

  const field = "w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed";

  return (
    <section id="contact" className="bg-slate-50 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          {/* Contact info */}
          <div className="lg:col-span-2">
            <FadeIn>
              <p className="text-teal-600 text-xs font-semibold tracking-widest uppercase mb-3">Get In Touch</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0b1f3a] mb-5 leading-tight">Let&apos;s Improve Laboratory Quality Together.</h2>
              <p className="text-slate-600 text-base leading-relaxed mb-8">
                Whether you&apos;re strengthening a quality system, planning a laboratory, or exploring a partnership, reach out and tell us what your team needs.
              </p>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <Ico d={I.phone} size={16} className="text-teal-600" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</div>
                    <div className="text-sm text-[#0b1f3a] font-medium">0912-307-7206</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <Ico d={I.whatsapp} size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">WhatsApp</div>
                    <div className="text-sm text-[#0b1f3a] font-medium">0912-307-7206</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <Ico d={I.mail} size={16} className="text-teal-600" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</div>
                    <a href="mailto:brian.amba123@gmail.com" className="text-sm text-teal-700 font-medium hover:underline">brian.amba123@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Ico d={I.fb} size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Facebook / Messenger</div>
                    <a href="https://www.facebook.com/profile.php?id=61593681134029" target="_blank" rel="noopener noreferrer"
                      className="text-sm text-blue-600 font-medium hover:underline">
                      LabLaunch Consulting
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200">
                  <div className="w-9 h-9 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Ico d={I.mapPin} size={16} className="text-teal-600" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Location</div>
                    <div className="text-sm text-[#0b1f3a] font-medium">Tangub City, Misamis Occidental</div>
                    <div className="text-xs text-slate-500">Serving Selected Areas Across Mindanao</div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <FadeIn delay={80}>
              {submitted ? (
                <div className="bg-white border border-teal-200 rounded-2xl p-12 text-center shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-5">
                    <Ico d={I.check} size={24} className="text-teal-600" />
                  </div>
                  <h3 className="text-[#0b1f3a] font-bold text-xl mb-2">Inquiry Received</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Thank you for reaching out. We will review your inquiry and get back to you shortly to discuss your laboratory project.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="mt-6 text-teal-600 text-sm font-medium hover:underline">
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">

                  {/* Name + Org */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
                      <input required className={field} placeholder="Your full name" value={form.name} onChange={set("name")} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Organization / Business Name</label>
                      <input className={field} placeholder="Clinic or organization name" value={form.org} onChange={set("org")} />
                    </div>
                  </div>

                  {/* Email + Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address *</label>
                      <input required type="email" className={field} placeholder="your@email.com" value={form.email} onChange={set("email")} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
                      <input type="tel" className={field} placeholder="+63 9XX XXX XXXX" value={form.phone} onChange={set("phone")} />
                    </div>
                  </div>

                  {/* Project Type */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Project Type</label>
                    <select className={field} value={form.projectType} onChange={set("projectType")}>
                      <option value="">Select project type</option>
                      <option>New Laboratory</option>
                      <option>Existing Laboratory</option>
                      <option>Laboratory Expansion</option>
                      <option>Compliance / Licensing Preparation</option>
                      <option>Documentation / SOPs</option>
                      <option>Equipment Planning</option>
                      <option>Procurement Assistance</option>
                      <option>Supplier Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>

                  {/* Location — Region */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Region</label>
                    <select className={field} value={form.region} onChange={onRegionChange}>
                      <option value="">Select region</option>
                      {Object.keys(LOCATION_DATA).map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  {/* Province + City */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Province</label>
                      <select className={field} value={form.province} onChange={onProvinceChange} disabled={!form.region}>
                        <option value="">{form.region ? "Select province" : "Select region first"}</option>
                        {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">City / Municipality</label>
                      <select className={field} value={form.city} onChange={set("city")} disabled={!form.province}>
                        <option value="">{form.province ? "Select city" : "Select province first"}</option>
                        {cities.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Current Stage */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Stage</label>
                    <select className={field} value={form.stage} onChange={set("stage")}>
                      <option value="">Select stage</option>
                      <option>Planning / Idea</option>
                      <option>Looking for a Location</option>
                      <option>Laboratory Under Construction</option>
                      <option>Preparing Documentation</option>
                      <option>Preparing for Regulatory Assessment</option>
                      <option>Existing Laboratory</option>
                      <option>Expansion / Improvement</option>
                      <option>Other</option>
                    </select>
                  </div>

                  {/* Services */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">Services of Interest</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {serviceOptions.map(s => (
                        <label key={s} className="flex items-center gap-2 cursor-pointer group" onClick={() => toggle(s)}>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${selectedServices.includes(s) ? "bg-teal-600 border-teal-600" : "border-slate-300 group-hover:border-teal-400"}`}>
                            {selectedServices.includes(s) && <Ico d={I.check} size={10} className="text-white" />}
                          </div>
                          <span className="text-xs text-slate-600 group-hover:text-slate-900 transition-colors leading-snug">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Message</label>
                    <textarea rows={4} className={`${field} resize-none`} placeholder="Tell us about your laboratory project..." value={form.message} onChange={set("message")} />
                  </div>

                  <button type="submit" className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-semibold px-6 py-3.5 rounded-lg transition-colors text-sm">
                    Start Your Laboratory Project <Ico d={I.arrowRight} size={16} />
                  </button>
                  <p className="text-xs text-slate-400 text-center">No obligation. We will review your inquiry and respond as soon as possible.</p>
                </form>
              )}
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────── */
function Footer() {
  const navLinks = [
    { href: "#home", label: "Home" }, { href: "#services", label: "Services" }, { href: "#tools", label: "Lab Tools" },
    { href: "#about", label: "About" }, { href: "#faq", label: "FAQ" }, { href: "#contact", label: "Contact" },
  ];
  return (
    <footer className="bg-[#060d18] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-2">
            <div className="mb-5">
              <div className="inline-block rounded-2xl overflow-hidden ring-1 ring-white/10 bg-[#071426]">
                <img src={logoImg} alt="" className="h-20 w-20 object-cover block" />
              </div>
              <p className="text-white text-xl font-extrabold tracking-tight mb-1">LabLaunch</p>
              <p className="text-teal-400 text-[10px] font-semibold tracking-widest uppercase mb-3">Laboratory Quality Advocacy</p>
            </div>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Championing better laboratory result quality through practical tools, resources, and consulting.
            </p>
            <a href={LABGUARD_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300 text-xs font-semibold transition-colors mb-4">
              LabGuard laboratory tools <Ico d={I.arrowRight} size={12} />
            </a>
            <a href="#labqueue"
              className="inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300 text-xs font-semibold transition-colors mb-4 ml-4">
              LabQueue local workflow <Ico d={I.arrowRight} size={12} />
            </a>
            <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-4">
              <Ico d={I.mapPin} size={12} className="text-teal-600" />
              Based in Tangub City, Misamis Occidental &bull; Serving Selected Areas Across Mindanao
            </div>
            <a href="https://www.facebook.com/profile.php?id=61593681134029" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors">
              <Ico d={I.fb} size={13} /> Follow us on Facebook
            </a>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs tracking-widest uppercase mb-4">Navigation</h4>
            <ul className="space-y-2">
              {navLinks.map(l => (
                <li key={l.href}><a href={l.href} className="text-slate-400 hover:text-teal-400 text-sm transition-colors">{l.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs tracking-widest uppercase mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Terms &amp; Conditions</a></li>
            </ul>
            <div className="mt-6">
              <h4 className="text-white font-semibold text-xs tracking-widest uppercase mb-3">Contact</h4>
              <a href="#contact" className="inline-flex items-center gap-1.5 text-sm text-teal-400 hover:text-teal-300 transition-colors font-medium">
                Send an Inquiry <Ico d={I.arrowRight} size={13} />
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p className="flex items-center gap-3">&copy; 2026 LabLaunch. All rights reserved. &nbsp;<Link to="/client/login" className="text-slate-500 hover:text-teal-400 transition-colors text-xs underline underline-offset-2">Client Portal</Link> &nbsp;<Link to="/admin/login" className="text-slate-500 hover:text-teal-400 transition-colors text-xs underline underline-offset-2">Admin Portal (temporarily disabled)</Link></p>
          <p className="text-center">LabLaunch advances laboratory quality through practical advocacy, tools, resources, and professional consulting. Regulatory approvals remain with the appropriate authorities.</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Landing Page ───────────────────────────────────────────────── */
function LandingPage() {
  return (
    <div className="font-sans antialiased">
      <Nav />
      <Hero />
      <TrustStrip />
      <Services />
      <LaboratoryTools />
      <Process />
      <WhyLabLaunch />
      <About />
      <SupplierPartnership />
      <ServiceArea />
      <ConsultationCTA />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}

/* ─── App with Router ────────────────────────────────────────────── */
function AdminGuard() {
  useEffect(() => logout(), []);
  return <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/dashboard" element={<AdminGuard />} />
        <Route path="/admin/lab/:id" element={<AdminGuard />} />
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/client/register" element={<ClientRegister />} />
        <Route path="/client/dashboard" element={<ClientGuard><ClientDashboard /></ClientGuard>} />
        <Route path="/client/new-project" element={<ClientGuard><NewLabWizard /></ClientGuard>} />
        <Route path="/client/project/:id" element={<ClientGuard><ClientLabDetail /></ClientGuard>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}
