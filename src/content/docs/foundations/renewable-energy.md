---
title: Renewable Energy for Developers
description: Power vs energy, solar, wind, batteries, KPIs, markets, SCADA data, and time-series traps — the domain knowledge behind renewable-energy dashboards, with interview drills.
cheatsheet:
  slug: renewable-energy
  section: foundations
  summary: Domain terms, KPIs, plant data, and time-series traps a web developer needs to build — and interview for — renewable-energy analytics.
  topicVersion: "N/A"
  verifiedAgainst:
    - label: IEC 61724-1:2021 — PV system performance monitoring
      url: https://webstore.iec.ch/publication/70170
    - label: IEC 61400-26-1:2019 — Availability for wind energy generation systems
      url: https://webstore.iec.ch/en/publication/62548
    - label: IEC 61400-12-1 — Power performance measurements of wind turbines
      url: https://webstore.iec.ch/en/searchform?q=61400-12-1
    - label: NREL Annual Technology Baseline — Utility-scale battery storage
      url: https://atb.nlr.gov/electricity/2025/utility-scale_battery_storage
    - label: EIA Electric Power Monthly — Capacity factors (Table 6.07.B)
      url: https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_6_07_b
    - label: Jordan & Kurtz — Photovoltaic Degradation Rates, an Analytical Review
      url: https://doi.org/10.1002/pip.1182
    - label: Modbus Application Protocol Specification V1.1b3
      url: https://modbus.org/docs/Modbus_Application_Protocol_V1_1b3.pdf
  lastVerified: 2026-11-01
  difficulty: intermediate
  tags: [energy, solar, wind, battery, scada, time-series, dashboards, interview]
  related:
    - foundations/iot-concepts
    - backend/mqtt
    - languages/sql
  video:
    youtube: BTTQEC-3miA
    title: "Renewable Energy for Developers: kW vs kWh, Solar, Wind, Batteries & Dashboards That Add Up"
    duration: "4:09"
---

## Mental model

Power is a rate (kW) and energy is an amount (kWh); most renewable
dashboard bugs confuse the two. A wind or solar plant cannot choose its
output — the weather does — so analytics is always **actual versus
expected**: what the plant delivered compared with what it could have
delivered given the sun or wind it saw. The grid must match supply and
demand every second, and storage, forecasting, and markets all exist to
cope with supply nobody can dispatch.

## Power vs energy

| Term | Meaning |
|---|---|
| kW, MW | Power — an instantaneous rate |
| kWh, MWh | Energy — power × time |
| MWp | PV DC peak power at test conditions |
| MWac | Inverter or grid-export limit |
| Capacity | Nameplate maximum, not output |

Energy for an interval is average power times the interval length in
hours: 1 MW held for 15 minutes is 0.25 MWh. A "100 MW plant" tells you
the ceiling, not how much it produced. Solar plants quote both DC (MWp)
and AC (MWac) capacity, so every label on a chart must say which.

```ts
// Average kW per 15-min interval → kWh
const kw = [400, 420, 410, 390];
const hours = 15 / 60;
const kwh = kw.reduce(
  (sum, p) => sum + p * hours,
  0,
);
console.log(kwh); // 405
```

> **Gotcha:** summing raw power samples is not energy. Sixty 1-minute
> kW readings summed are sixty times the kWh — multiply each by its
> interval in hours, or average power and multiply once.

## Solar PV

| Term | Meaning |
|---|---|
| GHI | Global horizontal irradiance, W/m² |
| POA | Plane-of-array irradiance on the module |
| STC | 1000 W/m², 25 °C cell, AM1.5 spectrum |
| DC/AC ratio | MWp ÷ MWac, usually above 1 |
| Clipping | Inverter caps output at its AC rating |
| Soiling | Dirt on modules blocking light |

PV output tracks POA irradiance closely and drops as cells heat up.
Designers oversize the DC array so inverters run near full rating for
more hours, accepting some midday clipping. Modules also degrade
slowly — a median around 0.5 % per year in field studies — so year-on-
year comparisons must allow for it.

```ts
const kwp = 1200;   // DC nameplate
const kwAc = 1000;  // inverter limit
const poa = 900;    // W/m² measured
const loss = 0.85;  // temp, soiling, wiring
const dc = kwp * (poa / 1000) * loss;
const ac = Math.min(dc, kwAc);
console.log(Math.round(ac)); // 918
```

> **Gotcha:** a flat top on a sunny-day power curve is clipping, not a
> stuck sensor or an outage. Alerting on it pages someone for a design
> decision.

## Wind

| Term | Meaning |
|---|---|
| Cut-in speed | Wind speed where output starts |
| Rated speed | Wind speed reaching nameplate power |
| Cut-out speed | Shutdown to protect the turbine |
| Power curve | Expected power per wind-speed bin |
| Hub height | Height the wind is measured for |

Power in the wind is `½ρAv³`: it grows with the cube of wind speed, so
doubling the wind gives eight times the power, until the turbine hits
rated output. No rotor can extract more than 16/27 (about 59 %) of it —
the Betz limit. Official power curves bin 10-minute averages into
0.5 m/s wind-speed bins.

```ts
const rho = 1.225; // air density, kg/m³
const area = Math.PI * 60 ** 2; // 120 m rotor
const watts = (v: number) =>
  0.5 * rho * area * v ** 3;
console.log(watts(10) / watts(5)); // 8
```

> **Gotcha:** never feed a power curve a daily or monthly average wind
> speed. Because of the cube, the mean of `v³` is larger than the cube
> of mean `v`, so averaging first underestimates energy.

## Battery storage

| Term | Meaning |
|---|---|
| MW / MWh | Power rating / energy capacity |
| Duration | MWh ÷ MW — 400 MWh / 100 MW = 4 h |
| SoC | State of charge, % of usable energy |
| SoH | Capacity remaining versus new |
| C-rate | MW ÷ MWh; 1C empties in one hour |
| RTE | Round-trip efficiency, energy out ÷ in |

A battery energy storage system (BESS) earns money by arbitrage —
charging when power is cheap, discharging when it is dear — and by
grid services such as frequency response. NREL's planning baseline
assumes 85 % round-trip efficiency for utility-scale lithium-ion.
Cycle count and depth of discharge drive degradation, which shows up
as falling SoH.

```ts
const mw = 100;
const mwh = 400;
const durationH = mwh / mw; // 4
const cRate = mw / mwh; // 0.25
const chargedMwh = 200;
const outMwh = chargedMwh * 0.85; // 170
```

> **Gotcha:** vendors disagree on sign: some report charging as
> positive power, others as negative. Normalize the sign at ingestion
> and document it, or a battery appears to create energy.

## Performance KPIs

| KPI | Formula |
|---|---|
| Capacity factor | Energy ÷ (nameplate × hours) |
| Specific yield | kWh ÷ kWp, in hours |
| Performance ratio | Final yield ÷ reference yield |
| Availability | Available ÷ possible (time or energy) |
| Curtailment | Possible energy − delivered energy |

Capacity factor is mostly weather and site: the US fleet runs around
23 % for utility solar and 34 % for wind. Performance ratio (IEC
61724-1) divides out irradiance, so it measures losses rather than
weather — the right metric to compare plants. Availability (IEC
61400-26-1) is either time-based or production-based; a turbine down
on a calm day loses hours but little energy.

```ts
const kwp = 1000; // DC nameplate
const kwh = 4200; // AC energy, one day
const poa = 5.2; // kWh/m², one day
const yf = kwh / kwp; // final yield, h
const yr = poa / 1; // ref yield, h (1 kW/m²)
const pr = yf / yr; // ≈ 0.81
const cf = kwh / (kwp * 24); // 0.175
```

> **Gotcha:** always state the denominator. A capacity factor on MWp
> and one on MWac differ by the DC/AC ratio, and both get called
> "capacity factor" in the same meeting.

## Grid, markets, and carbon

| Term | Meaning |
|---|---|
| PPA | Long-term contract buying plant output |
| LCOE | Discounted lifetime cost ÷ energy |
| Day-ahead / real-time | Market cleared ahead vs near delivery |
| Imbalance | Penalty for missing your forecast |
| REC / GO | Certificate per MWh green (US / EU) |
| Frequency | 50 Hz Europe, 60 Hz North America |

Grid frequency drifts whenever supply and demand differ, so operators
pay for reserves and frequency response. Wind and solar have near-zero
marginal cost, bid low in the merit order, and push prices down — at
times below zero. Plants bid on forecasts, so forecast error has a
direct imbalance cost. Emissions are energy times a grid emission
factor in gCO₂/kWh.

```ts
const mwh = [40, 55, 60];
const price = [52, 8, -15]; // EUR/MWh
const revenue = mwh.reduce(
  (sum, e, i) => sum + e * (price[i] ?? 0),
  0,
);
console.log(revenue); // 1620
```

> **Gotcha:** at negative prices, generating loses money, so curtailing
> is the correct call. A dashboard that counts every curtailed MWh as
> lost revenue punishes the operator for doing the right thing.

## Plant data: SCADA and protocols

| Term | Role |
|---|---|
| SCADA | Plant control and data acquisition |
| Modbus TCP / RTU | Polling of numbered 16-bit registers |
| OPC UA | Typed, browsable industrial data model |
| IEC 61850 | Substation and DER communication |
| PPC | Power plant controller, sets site output |
| Met station | Irradiance, wind, temperature sensors |

Inverters, turbines, meters, and sensors talk to an on-site gateway,
which forwards to the cloud over MQTT or HTTPS. Web developers rarely
touch devices directly, but every value arrives with a tag name, unit,
and often a scale factor. Modbus registers are 16-bit and big-endian;
a 32-bit value spans two registers.

```ts
// Two 16-bit registers → one float32
const [hi, lo] = [0x4479, 0xc000];
const view = new DataView(new ArrayBuffer(4));
view.setUint16(0, hi); // high word first
view.setUint16(2, lo);
console.log(view.getFloat32(0)); // 999
```

> **Warning:** Modbus does not define the word order of 32-bit values,
> and vendors differ. Swapped words give plausible-looking wrong
> numbers, not an error — check one value against the device display.

## Time-series pitfalls

| Pitfall | Fix |
|---|---|
| Interval labels | Store interval start and length |
| DST 23- and 25-hour days | Store UTC, convert for display |
| Summing power | Average power; sum energy |
| Cumulative meter counters | Difference reads, handle resets |
| Gaps and frozen values | Quality flag; never fill silently |

Revenue meters keep a running kWh register; differencing consecutive
reads gives billing-grade interval energy, better than integrating
power. Store telemetry as a narrow table — asset, signal, UTC
timestamp, value, quality — and pre-aggregate raw → 15 min → day for
dashboards.

```sql
CREATE TABLE meter (ts TEXT, kwh_total REAL);
INSERT INTO meter VALUES
  ('2026-06-01T10:00Z', 1000.0),
  ('2026-06-01T10:15Z', 1105.5),
  ('2026-06-01T10:30Z', 1210.0);
-- interval energy from a running counter
SELECT ts,
  kwh_total - LAG(kwh_total)
    OVER (ORDER BY ts) AS kwh
FROM meter;
-- 10:15 → 105.5, 10:30 → 104.5
```

> **Gotcha:** US power markets label hours as hour-ending: "HE 14" is
> 13:00–14:00. Joining hour-ending prices to period-beginning
> generation shifts every row by an hour, and the result still looks
> plausible.

## Interview drills

| Question | Short answer |
|---|---|
| kW vs kWh? | Rate vs amount; kWh = avg kW × h |
| Why is solar CF ~25 %? | Night and weather, not inefficiency |
| P50 vs P90? | Yield exceeded with 50 % / 90 % odds |
| Why DC/AC above 1? | More full-power hours; some clipping |
| PR vs CF? | PR removes weather; CF does not |
| Detect underperformance? | Actual vs modelled expected output |

Expect a system-design prompt as well. A strong answer for "dashboard
for 200 solar sites" covers:

- Ingest: gateway → MQTT → stream → time-series store
- Model: narrow table, UTC, units and quality per signal
- Roll-ups: precomputed 15-min, daily, monthly aggregates
- Alerts: PR or availability below fleet peers, not below yesterday
- Lost energy: expected minus actual, split by cause

> **Tip:** lenders size debt on P90 — the yield exceeded in nine years
> out of ten — so finance users want P50 and P90 lines on every
> long-term production chart.

## Further reading

- [IEC 61724-1:2021 — PV system performance monitoring](https://webstore.iec.ch/publication/70170)
- [IEC 61400-26-1:2019 — Wind availability](https://webstore.iec.ch/en/publication/62548)
- [NREL ATB — Utility-scale battery storage](https://atb.nlr.gov/electricity/2025/utility-scale_battery_storage)
- [EIA — Capacity factors by energy source](https://www.eia.gov/electricity/monthly/epm_table_grapher.php?t=epmt_6_07_b)
- [Jordan & Kurtz — PV degradation rates](https://doi.org/10.1002/pip.1182)
- [Modbus Application Protocol V1.1b3](https://modbus.org/docs/Modbus_Application_Protocol_V1_1b3.pdf)
