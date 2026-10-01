"use client";

import { useState } from "react";
import styles from "./calculator.module.css";

const UNITS_PER_ML = 100;
const VIAL_ML = 10;
const PEN_ML = 3;

type Mode = "total" | "freq";
type Device = "vial" | "pen";

const DEVICES: Record<Device, { plural: string; ml: number; units: number }> = {
  vial: { plural: "vials", ml: VIAL_ML, units: UNITS_PER_ML * VIAL_ML },
  pen: { plural: "pens", ml: PEN_ML, units: UNITS_PER_ML * PEN_ML },
};

const num = (v: string) => (v === "" ? NaN : Number(v));
const fmt = (n: number) => (Math.round(n * 10) / 10).toLocaleString();
// Round away float noise (e.g. 3.0000000004) before ceil
const ceil = (n: number) => Math.ceil(Math.round(n * 1e6) / 1e6);

export default function Home() {
  const [mode, setMode] = useState<Mode>("total");
  const [dailyIn, setDailyIn] = useState("");
  const [doseIn, setDoseIn] = useState("");
  const [timesIn, setTimesIn] = useState("");
  const [per, setPer] = useState("1");
  const [daysIn, setDaysIn] = useState("30");
  const [device, setDevice] = useState<Device>("vial");

  const days = num(daysIn);
  const daily =
    mode === "total"
      ? num(dailyIn)
      : (num(doseIn) * num(timesIn)) / Number(per);

  const bad =
    [daily, days].some((v) => !isFinite(v) || v < 0) ||
    !(daily > 0) ||
    !(days >= 1);

  const dev = DEVICES[device];
  const total = daily * days;
  const count = ceil(total / dev.units);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.title}>Insulin Supply Calculator</h1>
        <p className={styles.sub}>
          Estimate how many vials or pens are needed (U-100 insulin).
        </p>

        <div className={styles.card}>
          <div className={styles.modes}>
            <label className={styles.radio}>
              <input
                type="radio"
                name="mode"
                checked={mode === "total"}
                onChange={() => setMode("total")}
              />{" "}
              Total daily units
            </label>
            <label className={styles.radio}>
              <input
                type="radio"
                name="mode"
                checked={mode === "freq"}
                onChange={() => setMode("freq")}
              />{" "}
              Dose &times; frequency
            </label>
          </div>

          {mode === "total" ? (
            <div>
              <label className={styles.label} htmlFor="daily">
                Total units per day
              </label>
              <input
                className={styles.input}
                type="number"
                id="daily"
                min="0"
                step="any"
                placeholder="e.g. 40"
                value={dailyIn}
                onChange={(e) => setDailyIn(e.target.value)}
              />
            </div>
          ) : (
            <div className={styles.row}>
              <div>
                <label className={styles.label} htmlFor="dose">
                  Units per dose
                </label>
                <input
                  className={styles.input}
                  type="number"
                  id="dose"
                  min="0"
                  step="any"
                  placeholder="e.g. 10"
                  value={doseIn}
                  onChange={(e) => setDoseIn(e.target.value)}
                />
              </div>
              <div>
                <label className={styles.label} htmlFor="times">
                  How many times
                </label>
                <input
                  className={styles.input}
                  type="number"
                  id="times"
                  min="0"
                  step="any"
                  placeholder="e.g. 3"
                  value={timesIn}
                  onChange={(e) => setTimesIn(e.target.value)}
                />
              </div>
              <div>
                <label className={styles.label} htmlFor="per">
                  Per
                </label>
                <select
                  className={styles.input}
                  id="per"
                  value={per}
                  onChange={(e) => setPer(e.target.value)}
                >
                  <option value="1">day</option>
                  <option value="7">week</option>
                </select>
              </div>
            </div>
          )}

          <label className={styles.label} htmlFor="days">
            Days supply
          </label>
          <input
            className={styles.input}
            type="number"
            id="days"
            min="1"
            step="1"
            value={daysIn}
            onChange={(e) => setDaysIn(e.target.value)}
          />

          <div className={styles.label}>Insulin container</div>
          <div className={styles.modes}>
            <label className={styles.radio}>
              <input
                type="radio"
                name="device"
                checked={device === "vial"}
                onChange={() => setDevice("vial")}
              />{" "}
              Vial (10 mL)
            </label>
            <label className={styles.radio}>
              <input
                type="radio"
                name="device"
                checked={device === "pen"}
                onChange={() => setDevice("pen")}
              />{" "}
              Pen (3 mL)
            </label>
          </div>
        </div>

        <div className={styles.card}>
          {bad ? (
            <div className={styles.err}>
              Enter a dose greater than 0 and a days supply of at least 1.
            </div>
          ) : (
            <div className={styles.results}>
              <div className={styles.stat}>
                <div className={styles.n}>{fmt(daily)}</div>
                <div className={styles.l}>units per day</div>
              </div>
              <div className={styles.stat}>
                <div className={styles.n}>{fmt(total)}</div>
                <div className={styles.l}>
                  units for {days} day{days === 1 ? "" : "s"}
                </div>
              </div>
              <div className={`${styles.stat} ${styles.wide}`}>
                <div className={styles.n}>{count}</div>
                <div className={styles.l}>
                  {dev.plural} needed ({dev.ml} mL, {dev.units.toLocaleString()}{" "}
                  U each)
                </div>
                <div className={styles.x}>
                  {fmt(count * dev.units - total)} units left over
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.note}>
          Opened vials and pens are generally discarded after about 28 days
          (check the product label), so a 30-day supply may need more than the
          math suggests. This tool gives estimates only and is not medical
          advice &mdash; follow your prescriber&apos;s and pharmacist&apos;s
          instructions.
        </div>
      </main>
    </div>
  );
}
