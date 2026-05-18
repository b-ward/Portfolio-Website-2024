import React, { useCallback, useEffect, useMemo, useState } from "react";

const KM_PER_MILE = 1.609344;

export default function PaceCalcualtor() {
  const [distance, setDistance] = useState("");
  const [unit, setUnit] = useState("km");
  const [pacePref, setPacePref] = useState("per_km");
  const [hh, setHh] = useState("");
  const [mm, setMm] = useState("");
  const [ss, setSs] = useState("");
  const [error, setError] = useState("");

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

  useEffect(() => {
    setError("");
  }, [distance, hh, mm, ss]);

  const calc = useMemo(() => {
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

  const autoAdvance = useCallback((setter, maxLen, nextRef) => (e) => {
    const v = e.target.value.replace(/\D+/g, "");
    setter(v);
    if (maxLen && v.length >= maxLen && nextRef?.current) {
      nextRef.current.focus();
    }
  }, []);

  const mmRef = React.useRef(null);
  const ssRef = React.useRef(null);

  return (
    <div className="grid place-items-center p-2 sm:p-8 w-full">
      <div className="bg-white border border-gray-200 rounded-2xl max-w-[760px] w-full shadow-lg text-gray-900">
        <header className="px-3 sm:px-5 pt-5 pb-3">
          <h2 className="m-0 text-2xl font-semibold text-gray-900">Runner Pace</h2>
          <p className="mt-1.5 text-slate-500 text-sm">Enter distance and time. Pace shown first.</p>
        </header>

        <form onSubmit={onCalculate} className="px-3 sm:px-5 pb-5 grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="distance" className="font-semibold text-sm text-gray-700">Distance</label>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                id="distance"
                type="number"
                inputMode="decimal"
                min="0"
                step="1"
                placeholder="e.g., 10"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="bg-white text-gray-900 border border-gray-200 rounded-xl p-3.5 text-base outline-none w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <div>
                <span className="text-slate-500 font-medium text-sm">Units</span>
                <div className="flex gap-2 flex-wrap items-center mt-1">
                  <Chip checked={unit === "km"} onChange={() => setUnit("km")}>km</Chip>
                  <Chip checked={unit === "mi"} onChange={() => setUnit("mi")}>miles</Chip>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <label className="font-semibold text-sm text-gray-700">Time</label>
            <div className="flex gap-2 w-full">
              <input
                aria-label="Hours"
                type="number"
                min="0"
                placeholder="hh"
                value={hh}
                onChange={autoAdvance(setHh, 2, mmRef)}
                className="bg-white text-gray-900 border border-gray-200 rounded-xl p-3.5 text-base outline-none flex-1 min-w-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                className="bg-white text-gray-900 border border-gray-200 rounded-xl p-3.5 text-base outline-none flex-1 min-w-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
                className="bg-white text-gray-900 border border-gray-200 rounded-xl p-3.5 text-base outline-none flex-1 min-w-0 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <span className="text-slate-500 font-medium text-sm">Show pace as</span>
            <div className="flex gap-2 flex-wrap items-center">
              <Chip checked={pacePref === "per_km"} onChange={() => setPacePref("per_km")}>min/km</Chip>
              <Chip checked={pacePref === "per_mile"} onChange={() => setPacePref("per_mile")}>min/mile</Chip>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button type="submit" className="bg-blue-600 text-white border-0 rounded-xl p-3.5 text-base font-bold cursor-pointer w-full hover:bg-blue-700">Calculate</button>
            <button type="button" className="bg-transparent border border-gray-200 rounded-xl p-3.5 text-base font-bold cursor-pointer w-full text-gray-700 hover:border-gray-400" onClick={onReset}>Reset</button>
          </div>
        </form>

        <div className="h-px bg-gray-200 my-1" />

        <section className="px-3 sm:px-5 pb-5 pt-3 grid gap-2" aria-live="polite" aria-atomic="true">
          {error ? <div className="text-red-600 font-semibold text-sm">{error}</div> : null}
          <div className="text-5xl font-extrabold text-gray-900">
            {calc.pace}<sup className="text-[55%] text-slate-500 font-bold ml-1">{calc.paceUnit}</sup>
          </div>
          <small className="text-slate-500 text-sm">{calc.detail}</small>
        </section>
      </div>
    </div>
  );
}

function Chip({ checked, onChange, children }) {
  return (
    <label
      className={`inline-flex items-center gap-2 bg-white border px-4 py-2 rounded-full cursor-pointer select-none text-gray-700 text-sm ${checked ? 'border-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.2)]' : 'border-gray-200'}`}
    >
      <input type="radio" checked={checked} onChange={onChange} style={{ display: "none" }} />
      {children}
    </label>
  );
}
