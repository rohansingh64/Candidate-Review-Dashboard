# TalentOS — Hiring Dashboard

An internal tool for reviewing and prioritizing 1000+ student applicants with automated priority scoring.

## Features

- **Live Priority Engine** — P0–P3 labels based on weighted scoring (Assignment 30%, Video 25%, ATS 20%, GitHub 15%, Communication 10%)
- **Smart Filters** — filter by assignment/video/ATS score ranges, review status, priority, and shortlist status
- **Multi-column Sorting** — sort by priority, assignment, video, ATS, or name
- **Candidate Detail Drawer** — score rings, breakdown bars, reviewer notes
- **Assignment Evaluation** — rate 6 criteria (UI Quality, Component Structure, State Handling, Edge Cases, Responsiveness, Accessibility) — updates assignment score live
- **Video Evaluation** — rate 5 criteria + timestamp notes — updates video score live
- **Comparison Mode** — compare 2–3 candidates side-by-side with best-score highlights
- **Shortlist & Review Actions** — mark candidates as reviewed or shortlisted
- **Dashboard Summary** — total, pending, reviewed, shortlisted counts + priority distribution bar
- **Responsive Design** — works on mobile, tablet, and desktop

## Tech Stack

- React 18
- Vite 6
- Tailwind CSS 3
- Lucide React (icons)
- Google Fonts (Syne, DM Sans, JetBrains Mono)

## Getting Started


### Installation

# Clone the repo
git clone https://github.com/YOUR_USERNAME/hiring-dashboard.git
cd hiring-dashboard

# Install dependencies
npm install

# Start dev server
npm run dev


Open [http://localhost:5173](http://localhost:5173) in your browser.


## Project Structure

hiring-dashboard/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx               # Entry point
    ├── App.jsx                # Root component + state
    ├── index.css              # Global styles + Tailwind
    ├── data/
    │   └── candidates.js      # Data generation + priority engine
    └── components/
        ├── Header.jsx         # Top navigation bar
        ├── SummaryBar.jsx     # Stats + priority distribution
        ├── FilterPanel.jsx    # Search, filters, sort controls
        ├── CandidateTable.jsx # Main candidate list
        ├── CandidateDrawer.jsx # Detail view (drawer)
        ├── ScoreRing.jsx      # Circular score indicator
        ├── RatingSlider.jsx   # 1–5 rating buttons
        ├── AssignmentEvalPanel.jsx # Assignment scoring form
        ├── VideoEvalPanel.jsx # Video scoring + timestamps
        └── CompareModal.jsx   # Side-by-side comparison


## Priority Formula
Priority Score = (Assignment × 0.30) + (Video × 0.25) + (ATS × 0.20) + (GitHub × 0.15) + (Communication × 0.10)

P0 → score ≥ 80  (Interview Immediately)
P1 → score ≥ 65  (Strong Shortlist)
P2 → score ≥ 50  (Review Later)
P3 → score < 50  (Reject)

