# 🛡️ REDSHIELD v3.0 — Crime Predictive Intelligence

A fully functional React.js conversion of the REDSHIELD dashboard, featuring live crime mapping, FIR management, AI analysis, and predictive risk scoring for Tiruchirapalli district.

---

## 🚀 Quick Start

```bash
# 1. Navigate to the project folder
cd redshield

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

---

## 🔐 Demo Login Credentials

| Rank | Badge ID | Password | Station       |
|------|----------|----------|---------------|
| SP   | SP001    | sp123    | District HQ   |
| SI   | SI001    | si123    | Central PS    |
| SI   | SI002    | si456    | Srirangam PS  |
| CI   | CO001    | ci123    | Ariyamangalam |
| HC   | HO001    | hc123    | Woraiyur PS   |

---

## 📁 Project Structure

```
redshield/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx              ← Entry point (loads leaflet-heat, mounts app)
    ├── App.jsx               ← Root component (auth, FIR state, filters)
    ├── index.css             ← All global styles (pixel-perfect match)
    ├── data/
    │   └── mockData.js       ← All mock data (101 FIRs, accounts, routes)
    ├── utils/
    │   └── loadLeafletHeat.js ← CDN loader for leaflet.heat plugin
    └── components/
        ├── LoginPage.jsx     ← Login + Register with demo accounts
        ├── Header.jsx        ← Live clock, ticker, user pill, stats pills
        ├── LeftSidebar.jsx   ← Filters, stats, hotspot rank, crime chart, legend
        ├── MapView.jsx       ← Leaflet map: heatmap, markers, zones, patrol
        ├── RightSidebar.jsx  ← SOS, FIR form, AI chat, weather, predictions, radar, patrol, IPC
        └── Notifications.jsx ← Floating toast notifications
```

---

## ✅ Features

### 🗺️ Map (4 View Modes)
- **Heatmap** — Density overlay with leaflet.heat + colored dot markers
- **Markers** — Labeled crime-type badges with popups
- **Zones** — Risk circles per area (color-coded by average severity)
- **Patrol** — Night/Day/Women route polylines + accident zones
- Live marker added instantly when FIR is registered

### 📝 FIR Form
- Controlled inputs with validation
- Live map preview marker as you type
- Submits to React state → map updates instantly
- Recent FIR list with fly-to on click

### 🔍 Filters
- Crime type, act/law, severity, date range
- Dynamically filters all panels (stats, chart, rank, map)

### 🚨 SOS / Emergency Dispatch
- Dispatches random nearby patrol unit
- Shows unit, ETA, location, status
- Animated pulsing button

### 🤖 AI Crime Analyst
- Keyword-based intelligent responses
- Analyzes live FIR state (hotspots, trends, arrest rates)
- Quick-query buttons

### 🌡️ Weather + Crime Correlation
- Fetches live weather from Open-Meteo API
- Calculates heat→aggression, night→theft, rain→accidents correlations

### 🧠 Predictive Analysis
- Real-time risk scores refreshed every 60s
- Factors: time of day, season, weather, day of week

### 📡 Radar
- Animated SVG sweep with blip effects

### ⚖️ IPC Reference
- Searchable list of 50+ IPC sections

---

## 🛠️ Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18 | UI framework |
| Vite | 5 | Dev server + build |
| Leaflet | 1.9.4 | Map rendering |
| leaflet.heat | 0.2.0 | Heatmap layer (loaded from CDN) |
| Open-Meteo API | — | Live weather data |

---

## 📦 Build for Production

```bash
npm run build
# Output in /dist
```

---

## 🖥️ Browser Requirements
- Chrome 90+ / Firefox 88+ / Edge 90+
- Internet required for: map tiles, Google Fonts, leaflet.heat CDN, Open-Meteo API

---

*REDSHIELD v3.0 — For demonstration/educational purposes only.*
