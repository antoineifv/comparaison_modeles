import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, ChevronDown, Leaf, CalendarDays } from "lucide-react";
import riskData from "./riskData.json";

// ─── Risk levels ──────────────────────────────────────────────────────────────

const RISK = [
  { label: "Nul",       bg: "#f1f5f9", text: "#64748b", border: "#cbd5e1", dot: "#94a3b8" },
  { label: "Faible",    bg: "#dcfce7", text: "#15803d", border: "#86efac", dot: "#22c55e" },
  { label: "Moyen",     bg: "#fef9c3", text: "#a16207", border: "#fde047", dot: "#eab308" },
  { label: "Fort",      bg: "#ffedd5", text: "#c2410c", border: "#fdba74", dot: "#f97316" },
  { label: "Très fort", bg: "#fee2e2", text: "#b91c1c", border: "#fca5a5", dot: "#ef4444" },
];

// ─── Models ───────────────────────────────────────────────────────────────────

const MODELS = [
  { id: "rossi",   name: "ROSSI",    color: "#16a34a" },
  { id: "potsys",  name: "POT SYS",  color: "#0284c7" },
  { id: "milvit",  name: "MILVIT",   color: "#9333ea" },
  { id: "milstop", name: "MILSTOP",  color: "#dc2626" },
];

// ─── Hypotheses ───────────────────────────────────────────────────────────────

const HYPOTHESES = [
  { id: "h1", label: "Hypothèse 1" },
  { id: "h2", label: "Hypothèse 2" },
  { id: "h3", label: "Hypothèse 3" },
];

// ─── Locations (from COMMUNE column) ──────────────────────────────────────────

type CommuneEntry = { latitude?: string; longitude?: string; region?: unknown };
type CommuneDay = {
  latitude?: string;
  longitude?: string;
  region?: unknown;
  rossi?: Record<string, number>;
  potsys?: Record<string, number>;
  milvit?: Record<string, number>;
  milstop?: Record<string, number>;
  pluie?: Record<string, number>;
};

const COMMUNES: string[] = riskData.communes;
const DATA_BY_COMMUNE: Record<string, Record<string, CommuneDay>> = riskData.byCommune;
const DATES: string[] = riskData.dates;

// Excel serial date → JS Date
function excelSerialToDate(serial: number): Date {
  return new Date(Date.UTC(1899, 11, 30) + serial * 86400000);
}

const LOCATIONS = COMMUNES.map(name => {
  const firstDay = DATA_BY_COMMUNE[name]?.[DATES[0]] as CommuneEntry | undefined;
  const lat = firstDay?.latitude;
  const lon = firstDay?.longitude;
  return {
    name,
    region: String(firstDay?.region ?? ""),
    lat: lat != null ? `${lat}°` : "",
    lon: lon != null ? `${lon}°` : "",
  };
});

// ─── Sub-components ───────────────────────────────────────────────────────────

function RiskCell({ level, showLabel = false, isToday = false }: { level?: number; showLabel?: boolean; isToday?: boolean }) {
  if (level == null) {
    return (
      <td className="border border-border/30 p-1.5 text-center transition-colors">
        <span className="text-[10px] text-muted-foreground font-medium">N/A</span>
      </td>
    );
  }
  const r = RISK[level];
  return (
    <td
      className="border border-border/30 p-1.5 text-center transition-colors"
      style={{ backgroundColor: r.bg }}
    >
      <div className="flex flex-col items-center gap-0.5">
        <span
          className="font-semibold text-sm leading-none"
          style={{ color: r.text, fontFamily: "var(--font-mono)" }}
        > 
          {level}
        </span>
        {showLabel && (
          <span className="text-[10px] leading-none" style={{ color: r.text }}>
            {r.label}
          </span>
        )}
      </div>
    </td>
  );
}

function RiskBadge({ level, size = "md" }: { level: number; size?: "sm" | "md" | "lg" }) {
  const r = RISK[level];
  if (!r) return null;
  const sizeClass = size === "sm" ? "text-[10px] px-1.5 py-0.5" : size === "lg" ? "text-sm px-3 py-1.5 font-semibold" : "text-xs px-2 py-0.5";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-medium leading-none border ${sizeClass}`}
      style={{ backgroundColor: r.bg, color: r.text, borderColor: r.border }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: r.dot }} />
      {r.label}
    </span>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeModels, setActiveModels] = useState<Set<string>>(new Set(MODELS.map(m => m.id)));
  const [hypothesis, setHypothesis] = useState<"h1" | "h2" | "h3">("h2");
  const [location, setLocation] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const commune = params.get("commune");
    if (commune && LOCATIONS.some(l => l.name === commune)) {
      return LOCATIONS.find(l => l.name === commune)!;
    }
    return LOCATIONS[0];
  });
  const [locationOpen, setLocationOpen] = useState(false);
  const [pastDays, setPastDays] = useState(21);
  const [futureDays, setFutureDays] = useState(14);

  const communeData = DATA_BY_COMMUNE[location.name] ?? {};

  // "Today" = the dataset date closest to the actual current date (Paris)
  const TODAY_INDEX = useMemo(() => {
    const now = new Date();
    let best = 0;
    let bestDiff = Infinity;
    DATES.forEach((serial, i) => {
      const diff = Math.abs(excelSerialToDate(Number(serial)).getTime() - now.getTime());
      if (diff < bestDiff) { bestDiff = diff; best = i; }
    });
    return best;
  }, []);

  const allDates = useMemo(
    () => DATES.map(serial => excelSerialToDate(Number(serial))),
    [],
  );

  // Visible window based on the period selectors
  const visibleRange = useMemo(() => {
    const start = Math.max(0, TODAY_INDEX - pastDays);
    const end = Math.min(DATES.length, TODAY_INDEX + futureDays + 1);
    return { start, end };
  }, [pastDays, futureDays]);

  const visibleDates = useMemo(
    () => allDates.slice(visibleRange.start, visibleRange.end),
    [allDates, visibleRange],
  );
  const visibleSerials = useMemo(
    () => DATES.slice(visibleRange.start, visibleRange.end),
    [visibleRange],
  );

  // Current risk per model for the selected location & hypothesis (actual today)
  const todaySerial = DATES[TODAY_INDEX];
  const tomorrowSerial = DATES[Math.min(DATES.length - 1, TODAY_INDEX + 1)];
  const currentRisk = MODELS.map(m => {
    const day = communeData[todaySerial];
    const nextDay = communeData[tomorrowSerial];
    const todayValue = day?.[m.id as keyof CommuneDay]?.[hypothesis] as number | undefined;
    const tomorrowValue = nextDay?.[m.id as keyof CommuneDay]?.[hypothesis] as number | undefined;
    return { ...m, today: todayValue, tomorrow: tomorrowValue };
  });

  const currentPluie = useMemo(() => {
    const day = communeData[todaySerial];
    const nextDay = communeData[tomorrowSerial];
    const todayPluie = day?.pluie?.[hypothesis] as number | undefined;
    const tomorrowPluie = nextDay?.pluie?.[hypothesis] as number | undefined;
    return { today: todayPluie, tomorrow: tomorrowPluie };
  }, [communeData, todaySerial, tomorrowSerial, hypothesis]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("commune") !== location.name) {
      const url = new URL(window.location.href);
      url.searchParams.set("commune", location.name);
      window.history.replaceState({}, "", url.toString());
    }
  }, [location.name]);

  const toggleModel = (id: string) => {
    setActiveModels(prev => {
      const next = new Set(prev);
      if (next.has(id) && next.size > 1) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col"
      style={{ fontFamily: "var(--font-sans)" }}
      onClick={() => setLocationOpen(false)}
    >
      {/* ── Header ── */}
      <header className="bg-card border-b border-border px-6 py-3.5 flex items-center justify-between gap-4 flex-wrap shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#2d6a4f22", border: "1.5px solid #2d6a4f44" }}
          >
            <Leaf className="w-5 h-5" style={{ color: "#2d6a4f" }} />
          </div>
          <div>
            <h1
              className="text-xl font-semibold tracking-tight leading-none"
              style={{ fontFamily: "var(--font-display)", color: "#1c2b1c" }}
            >
              Comparaison des modèles
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>
          <span className="hidden sm:block">Mis à jour : {format(new Date(), "d MMMM yyyy, HH:mm", { locale: fr, timeZone: "Europe/Paris" })} (Paris)</span>
          <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            En direct
          </span>
        </div>
      </header>

      {/* ── Controls ── */}
      <div className="bg-card border-b border-border px-6 py-3 flex flex-wrap items-center gap-3 shadow-sm">

        {/* Location */}
        <div className="relative" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setLocationOpen(v => !v)}
            className="flex items-center gap-2 border border-border rounded-md px-3 py-1.5 text-sm bg-background hover:border-primary/50 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="font-medium">{location.name}</span>
            <span
              className="text-muted-foreground text-xs hidden sm:inline"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              {location.lat}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
          {locationOpen && (
            <div className="absolute top-full left-0 mt-1 z-30 bg-card border border-border rounded-lg shadow-xl min-w-64 py-1">
              {LOCATIONS.map(loc => (
                <button
                  key={loc.name}
                  onClick={() => { setLocation(loc); setLocationOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between gap-4 hover:bg-secondary transition-colors ${loc.name === location.name ? "text-primary font-semibold" : ""}`}
                >
                  <span>{loc.name}</span>
                  <span className="text-xs text-muted-foreground">{loc.region}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground mr-1">Modèles :</span>
          {MODELS.map(m => {
            const active = activeModels.has(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleModel(m.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  active ? "border-transparent text-white shadow-sm" : "border-border text-muted-foreground bg-background opacity-50 hover:opacity-75"
                }`}
                style={{ backgroundColor: active ? m.color : undefined }}
              >
                {m.name}
              </button>
            );
          })}
        </div>

        {/* Hypothesis selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground mr-1">Hypothèses :</span>
          {HYPOTHESES.map(h => {
            const active = hypothesis === h.id;
            return (
              <button
                key={h.id}
                onClick={() => setHypothesis(h.id as "h1" | "h2" | "h3")}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                  active ? "border-transparent text-white shadow-sm bg-primary" : "border-border text-muted-foreground bg-background hover:opacity-75"
                }`}
              >
                {h.label}
              </button>
            );
          })}
        </div>

        {/* Period controls */}
        <div className="flex items-center gap-2 bg-background border border-border rounded-md px-3 py-1.5">
          <CalendarDays className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <span className="text-xs text-muted-foreground">Passé :</span>
          <select
            value={pastDays}
            onChange={e => setPastDays(Number(e.target.value))}
            className="text-xs bg-transparent focus:outline-none cursor-pointer text-foreground"
          >
            <option value={7}>7 j</option>
            <option value={14}>14 j</option>
            <option value={21}>21 j</option>
            <option value={90}>90 j</option>
          </select>
          <span className="text-border">|</span>
          <span className="text-xs text-muted-foreground">Prévision :</span>
          <select
            value={futureDays}
            onChange={e => setFutureDays(Number(e.target.value))}
            className="text-xs bg-transparent focus:outline-none cursor-pointer text-foreground"
          >
            <option value={0}>0 j</option>
            <option value={7}>7 j</option>
            <option value={14}>14 j</option>
          </select>
        </div>
      </div>

      {/* ── Risk legend ── */}
      <div className="px-6 py-2.5 border-b border-border bg-background flex items-center gap-3 flex-wrap">
        <span className="text-xs text-muted-foreground font-medium">Classe de risque :</span>
        {RISK.map((r, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border font-medium"
            style={{ backgroundColor: r.bg, color: r.text, borderColor: r.border }}
          >
            <span
              className="w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold"
              style={{ backgroundColor: r.dot + "33", color: r.text }}
            >
              {i}
            </span>
            {r.label}
          </span>
        ))}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0">

        {/* Sidebar */}
        <aside className="lg:w-56 xl:w-64 border-b lg:border-b-0 lg:border-r border-border bg-card px-4 py-5 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto">
          <div className="hidden lg:block mb-1">
            <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
              Risque aujourd'hui
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {location.name} • {HYPOTHESES.find(h => h.id === hypothesis)?.label}
            </p>
          </div>

              <div className="mt-2 pt-2 border-t border-border/50">
                <p className="text-[10px] font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                  Pluie
                </p>
                <div
                  className="rounded-lg border p-3 cursor-default select-none"
                  style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#64748b" }} />
                    <span className="text-xs font-semibold text-foreground/70">Aujourd'hui</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="text-2xl font-bold leading-none tabular-nums"
                      style={{ color: "#374151", fontFamily: "var(--font-numbers)" }}
                    >
                      {currentPluie.today !== undefined ? currentPluie.today.toFixed(1) : "N/A"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">mm</span>
                  </div>
                </div>
                <div
                  className="rounded-lg border p-3 mt-2 cursor-default select-none"
                  style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0" }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#94a3b8" }} />
                    <span className="text-xs font-semibold text-foreground/70">Demain</span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="text-2xl font-bold leading-none tabular-nums"
                      style={{ color: "#374151", fontFamily: "var(--font-numbers)" }}
                    >
                      {currentPluie.tomorrow !== undefined ? currentPluie.tomorrow.toFixed(1) : "N/A"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">mm</span>
                  </div>
                </div>
              </div>
              {currentRisk.map(m => {
            const active = activeModels.has(m.id);
            const r = m.today != null ? RISK[m.today] : undefined;
            const tr = m.tomorrow != null ? RISK[m.tomorrow] : undefined;
            return (
              <div
                key={m.id}
                onClick={() => toggleModel(m.id)}
                className={`flex-shrink-0 rounded-lg border p-3.5 cursor-pointer transition-all select-none ${
                  active ? "border-border shadow-sm" : "opacity-35"
                }`}
                style={{ backgroundColor: active ? (r ? r.bg : "#f1f5f9") : "#f8f8f8", borderColor: active ? (r ? r.border : "#cbd5e1") : "#e5e7eb" }}
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="text-xs font-semibold text-foreground/70">{m.name}</span>
                </div>
                <div className="flex items-end gap-2">
                  {m.today != null ? (
                    <>
                      <span
                        className="text-4xl font-bold leading-none tabular-nums"
                        style={{ color: r.text, fontFamily: "var(--font-numbers)" }}
                      >
                        {m.today}
                      </span>
                      <span className="text-xs font-medium pb-0.5" style={{ color: r.text }}>
                        {r.label}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-semibold text-muted-foreground">N/A</span>
                  )}
                </div>
                <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
                  <span>Demain :</span>
                  {m.tomorrow != null ? (
                    <RiskBadge level={m.tomorrow} size="sm" />
                  ) : (
                    <span className="text-[10px] text-muted-foreground">N/A</span>
                  )}
                </div>
              </div>
            );
          })}


        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col p-5 gap-4 min-w-0 bg-background overflow-auto">

          <div className="flex items-center border-b border-border gap-0 -mb-1 pb-2">
            <span className="text-xs text-muted-foreground" style={{ fontFamily: "var(--font-sans)" }}>
              {location.name} • Mildiou de la vigne • {HYPOTHESES.find(h => h.id === hypothesis)?.label}
            </span>
          </div>

          {/* ── Tableau (heatmap) ── */}
          <div className="overflow-x-auto">
              <table className="border-collapse text-sm w-full min-w-max">
                <thead>
                  <tr>
                    <th
                      className="text-left py-2 pr-4 text-xs text-muted-foreground font-medium sticky left-0 bg-background z-10 border-b border-r border-border"
                      style={{ minWidth: "80px" }}
                    >
                      Modèle
                    </th>
                    {visibleDates.map((d, i) => {
                      const globalIdx = visibleRange.start + i;
                      const isToday = globalIdx === TODAY_INDEX;
                      const isForecast = globalIdx > TODAY_INDEX;
                      return (
                        <th
                          key={i}
                          className={`py-2 px-1 text-center border-b border-border/40 ${isToday ? "border-b-2 border-b-primary bg-neutral-100 rounded-t-md" : ""}`}
                          style={{ minWidth: "52px" }}
                        >
                          <div
                            className={`text-[10px] leading-tight ${isToday ? "text-primary font-bold" : "text-muted-foreground"}`}
                            style={{ fontFamily: "var(--font-sans)" }}
                          >
                            {format(d, "d MMM", { locale: fr })}
                          </div>
                          <div
                            className={`text-[9px] leading-tight ${isToday ? "text-primary font-semibold" : "text-muted-foreground/60"}`}
                            style={{ fontFamily: "var(--font-sans)" }}
                          >
                            {isToday ? "auj." : isForecast ? "prévu" : ""}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {/* Meteo row */}
                  <tr>
                    <td
                      className="py-2 pr-4 text-xs font-semibold sticky left-0 bg-background z-10 border-r border-border whitespace-nowrap"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#64748b" }} />
                        Pluie
                      </div>
                      <span className="text-[10px] text-muted-foreground font-normal">(mm)</span>
                    </td>
                    {visibleSerials.map((serial, ci) => {
                      const day = communeData[serial];
                      const pluieVal = day?.pluie?.[hypothesis] as number | undefined;
                      const globalIdx = visibleRange.start + ci;
                      const isTodayCell = globalIdx === TODAY_INDEX;
                      const bg = isTodayCell && pluieVal !== undefined ? "#eff6ff" : "#f1f5f9";
                      return (
                        <td
                          key={serial}
                          className="border border-border/30 p-1.5 text-center transition-colors"
                          style={{ backgroundColor: bg }}
                        >
                          <div className="flex flex-col items-center gap-0.5">
                            <span
                              className="font-semibold text-sm leading-none"
                              style={{ fontFamily: "var(--font-mono)", color: "#374151" }}
                            >
                              {pluieVal !== undefined ? pluieVal.toFixed(1) : "N/A"}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                {/* Model rows */}
                  {MODELS.filter(m => activeModels.has(m.id)).map(m => (
                    <tr key={m.id}>
                      <td
                        className="py-2 pr-4 text-xs font-semibold sticky left-0 bg-background z-10 border-r border-border whitespace-nowrap"
                        style={{ color: m.color }}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: m.color }} />
                          {m.name}
                        </div>
                      </td>
                      {visibleSerials.map((serial, ci) => {
                        const globalIdx = visibleRange.start + ci;
                        const isTodayCell = globalIdx === TODAY_INDEX;
                        const day = communeData[serial];
                        const value = day?.[m.id as keyof CommuneDay]?.[hypothesis] as number | undefined;
                        return (
                          <RiskCell
                            key={serial}
                            level={value}
                            showLabel
                            isToday={isTodayCell}
                          />
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="text-xs text-muted-foreground mt-4" style={{ fontFamily: "var(--font-sans)" }}>
                Mildiou de la vigne • {location.name}, {location.region} •{" "}
                Classe 0 = Nul • 1 = Faible • 2 = Moyen • 3 = Fort • 4 = Très fort
              </p>
            </div>
        </main>
      </div>
    </div>
  );
}
