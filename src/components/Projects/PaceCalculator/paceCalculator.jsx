import React, { useEffect, useMemo, useState } from "react";

const KM_PER_MILE = 1.609344;

export default function PaceCalcualtor() {
  const [distance, setDistance] = useState("");
  const [unit, setUnit] = useState("km");
  const [pacePref, setPacePref] = useState("per_km");
  const [hh, setHh] = useState("");
  const [mm, setMm] = useState("");
  const [ss, setSs] = useState("");
  const [error, setError] = useState("");

  // --- NEW: simple viewport flag for small devices
  const [isSmall, setIsSmall] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 480px)");
    const apply = () => setIsSmall(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search);
    const d = q.get("d");
    const u = q.get("u");
    const p = q.get("p");
    const H = q.get("H");
    const M = q.get("M");
    const S = q.get("S");
    if (d) setDistance(d);
    if (u === "km" || u === "mi") setUnit(u);
    if (p === "per_km" || p === "per_mile") setPacePref(p);
    if (H !== null) setHh(H);
    if (M !== null) setMm(M);
    if (S !== null) setSs(S);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams();
    if (distance) params.set("d", distance);
    if (hh) params.set("H", hh);
    if (mm) params.set("M", mm);
    if (ss) params.set("S", ss);
    params.set("u", unit);
    params.set("p", pacePref);
    const next = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", next);
  }, [distance, unit, pacePref, hh, mm, ss]);

  const seconds = useMemo(() => {
    const H = Number(hh) || 0;
    const M = Number(mm) || 0;
    const S = Number(ss) || 0;
    if (M < 0 || M > 59 || S < 0 || S > 59 || H < 0) return null;
    return H * 3600 + M * 60 + S;
  }, [hh, mm, ss]);

  const calc = useMemo(() => {
    setError("");
    const d = Number(distance);
    if (!d || d <= 0) return { pace: "—", paceUnit: "", detail: "Enter values to see results." };
    if (seconds === null || seconds <= 0) return { pace: "—", paceUnit: "", detail: "Enter values to see results." };

    let secPerKm, secPerMile;
    if (unit === "km") {
      secPerKm = seconds / d;
      secPerMile = seconds / (d / KM_PER_MILE);
    } else {
      secPerMile = seconds / d;
      secPerKm = seconds / (d * KM_PER_MILE);
    }

    const fmt = (spu) => {
      if (!isFinite(spu) || spu <= 0) return "—";
      const mm = Math.floor(spu / 60);
      const ss = Math.round(spu % 60);
      return `${mm}:${String(ss).padStart(2, "0")}`;
    };

    const paceUnitText = pacePref === "per_km" ? "/km" : "/mile";
    const paceVal = pacePref === "per_km" ? fmt(secPerKm) : fmt(secPerMile);

    const detail = `Alt pace: ${fmt(secPerKm)} /km, ${fmt(secPerMile)} /mile`;

    return { pace: paceVal, paceUnit: paceUnitText, detail };
  }, [distance, seconds, unit, pacePref]);

  function onCalculate(e) {
    e?.preventDefault?.();
    const d = Number(distance);
    if (!d || d <= 0) return setError("Please enter a distance greater than 0.");
    if (seconds === null || seconds <= 0) return setError("Please enter a valid time.");
    setError("");
  }

  function onReset() {
    setDistance("");
    setUnit("km");
    setPacePref("per_km");
    setHh("");
    setMm("");
    setSs("");
    setError("");
  }

  function autoAdvance(setter, maxLen, nextRef) {
    return (e) => {
      const v = e.target.value.replace(/\D+/g, "");
      setter(v);
      if (maxLen && v.length >= maxLen && nextRef?.current) {
        nextRef.current.focus();
      }
    };
  }

  const mmRef = React.useRef(null);
  const ssRef = React.useRef(null);

  // computed responsive tweaks
  const inlineRowStyle = {
    ...styles.inlineRow,
    ...(isSmall ? { gridTemplateColumns: "1fr" } : { gridTemplateColumns: "1.1fr 0.9fr" })
  };
  const actionsStyle = {
    ...styles.actions,
    ...(isSmall ? { flexDirection: "column", alignItems: "stretch" } : {})
  };
  const primaryBtnStyle = { ...styles.primaryBtn, ...(isSmall ? { width: "100%" } : {}) };
  const secondaryBtnStyle = { ...styles.secondaryBtn, ...(isSmall ? { width: "100%" } : {}) };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <header style={styles.header}>
          <h2 style={styles.h2}>Runner Pace</h2>
          <p style={styles.muted}>Enter distance and time. Pace shown first.</p>
        </header>

        <form onSubmit={onCalculate} style={styles.content}>
          <div style={styles.row}>
            <label htmlFor="distance" style={styles.label}>Distance</label>
            <div style={inlineRowStyle}>
              <input
                id="distance"
                type="number"
                inputMode="decimal"
                min="0"
                step="1"
                placeholder="e.g., 10"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                style={styles.input}
              />
              <div>
                <span style={styles.mutedSmall}>Units</span>
                <div style={styles.chips}>
                  <Chip checked={unit === "km"} onChange={() => setUnit("km")}>km</Chip>
                  <Chip checked={unit === "mi"} onChange={() => setUnit("mi")}>miles</Chip>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.row}>
            <label style={styles.label}>Time</label>
            <div style={styles.timeInputs}>
              <input
                aria-label="Hours"
                type="number"
                min="0"
                placeholder="hh"
                value={hh}
                onChange={autoAdvance(setHh, 2, mmRef)}
                style={{ ...styles.input, ...styles.timeField }}
              />
              <input
                ref={mmRef}
                aria-label="Minutes"
                type="number"
                min="0"
                max="59"
                placeholder="mm"
                value={mm}
                onChange={autoAdvance(setMm, 2, ssRef)}
                style={{ ...styles.input, ...styles.timeField }}
              />
              <input
                ref={ssRef}
                aria-label="Seconds"
                type="number"
                min="0"
                max="59"
                placeholder="ss"
                value={ss}
                onChange={(e) => setSs(e.target.value.replace(/\D+/g, ""))}
                style={{ ...styles.input, ...styles.timeField }}
              />
            </div>
          </div>

          <div style={styles.row}>
            <span style={styles.mutedSmall}>Show pace as</span>
            <div style={styles.chips}>
              <Chip checked={pacePref === "per_km"} onChange={() => setPacePref("per_km")}>min/km</Chip>
              <Chip checked={pacePref === "per_mile"} onChange={() => setPacePref("per_mile")}>min/mile</Chip>
            </div>
          </div>

          <div style={actionsStyle}>
            <button type="submit" style={primaryBtnStyle}>Calculate</button>
            <button type="button" style={secondaryBtnStyle} onClick={onReset}>Reset</button>
          </div>
        </form>

        <div style={styles.divider} />

        <section style={styles.result} aria-live="polite" aria-atomic="true">
          {error ? <div style={styles.error}>{error}</div> : null}
          <div style={styles.pace}>
            {calc.pace}<sup style={styles.paceSup}>{calc.paceUnit}</sup>
          </div>
          <small style={styles.detail}>{calc.detail}</small>
        </section>
      </div>
    </div>
  );
}

function Chip({ checked, onChange, children }) {
  return (
    <label
      style={{
        ...styles.chip,
        ...(checked ? styles.chipChecked : null),
      }}
    >
      <input type="radio" checked={checked} onChange={onChange} style={{ display: "none" }} />
      {children}
    </label>
  );
}

const styles = {
  // Add safe-area padding so nothing gets obscured by mobile browser chrome
  wrap: {
    display: "grid",
    placeItems: "center",
    padding: "2rem 1rem calc(2rem + env(safe-area-inset-bottom))",
    background: "var(--bg, #333134)",
    color: "var(--text, #0f172a)",
    width: "100%",
  },
  card: {
    background: "var(--panel, #fff)",
    border: "1px solid var(--line, #e5e7eb)",
    borderRadius: 16,
    maxWidth: 760,
    width: "100%",
    boxShadow: "0 10px 24px rgba(0,0,0,.05)",
  },
  header: { padding: "1.25rem 1.25rem .75rem" },
  h2: { margin: 0, fontSize: "clamp(1.5rem, 1.1rem + 1.2vw, 2rem)" },
  muted: { margin: ".35rem 0 0", color: "var(--muted, #64748b)" },
  content: { padding: "1rem 1.25rem", display: "grid", gap: "1rem" },
  row: { display: "grid", gap: ".5rem" },

  // will be overridden responsively in component via inlineRowStyle
  inlineRow: { display: "grid", gap: ".75rem" },

  label: { fontWeight: 600, fontSize: ".95rem" },
  mutedSmall: { color: "var(--muted, #64748b)", fontWeight: 500 },

  input: {
    background: "var(--panel, #fff)",
    color: "inherit",
    border: "1px solid var(--line, #e5e7eb)",
    borderRadius: 10,
    padding: ".85rem 1rem",
    fontSize: "1rem",
    outline: "none",
    width: "100%",
  },

  // NEW: make time inputs share the row evenly and never overflow
  timeInputs: { display: "flex", gap: ".5rem", width: "100%" },
  timeField: { flex: "1 1 0", minWidth: 0 },

  chips: { display: "flex", gap: ".5rem", flexWrap: "wrap", alignItems: "center" },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: ".5rem",
    background: "var(--panel, #fff)",
    border: "1px solid var(--line, #e5e7eb)",
    padding: ".55rem .9rem", // a bit larger for touch
    borderRadius: 999,
    cursor: "pointer",
    userSelect: "none",
  },
  chipChecked: { borderColor: "var(--accent, #2563eb)", boxShadow: "0 0 0 4px rgba(37,99,235,.2)" },

  // buttons stack on small via actionsStyle computed above
  actions: { display: "flex", gap: ".75rem", flexWrap: "wrap", alignItems: "center" },
  primaryBtn: {
    background: "var(--accent, #2563eb)",
    color: "#fff",
    border: 0,
    borderRadius: 10,
    padding: ".95rem 1.1rem",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryBtn: {
    background: "transparent",
    color: "inherit",
    border: "1px solid var(--line, #e5e7eb)",
    borderRadius: 10,
    padding: ".95rem 1.1rem",
    fontSize: "1rem",
    fontWeight: 700,
    cursor: "pointer",
  },

  divider: { height: 1, background: "var(--line, #e5e7eb)", margin: ".25rem 0" },
  result: { padding: ".75rem 1.25rem 1.25rem", display: "grid", gap: ".5rem" },
  pace: { fontSize: "clamp(2.1rem, 1.6rem + 2vw, 3rem)", fontWeight: 800 },
  paceSup: { fontSize: "55%", color: "var(--muted, #64748b)", fontWeight: 700, marginLeft: ".2rem" },
  detail: { color: "var(--muted, #64748b)" },
  error: { color: "var(--danger, #dc2626)", fontWeight: 600 },
};
