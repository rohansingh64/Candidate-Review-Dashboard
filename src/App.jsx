import { useState, useMemo } from "react";
import { generateCandidates, calcPriorityScore, getPriorityLabel } from "./data/candidates";
import Header from "./components/Header";
import SummaryBar from "./components/SummaryBar";
import FilterPanel from "./components/FilterPanel";
import CandidateTable from "./components/CandidateTable";
import CandidateDrawer from "./components/CandidateDrawer";
import CompareModal from "./components/CompareModal";

const INITIAL_CANDIDATES = generateCandidates();

export default function App() {
  const [candidates, setCandidates] = useState(INITIAL_CANDIDATES);
  const [selectedId, setSelectedId] = useState(null);
  const [compareIds, setCompareIds] = useState([]);
  const [showCompare, setShowCompare] = useState(false);
  const [activeTab, setActiveTab] = useState("list"); // list | compare

  // Filter & sort state
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    assignmentMin: 0, assignmentMax: 100,
    videoMin: 0, videoMax: 100,
    atsMin: 0, atsMax: 100,
    status: "all",
    priority: "all",
    shortlisted: false,
  });
  const [sortBy, setSortBy] = useState("priority");
  const [sortDir, setSortDir] = useState("desc");

  // Enrich candidates with live priority
  const enriched = useMemo(() => candidates.map(c => {
    const ps = calcPriorityScore(c);
    return { ...c, priorityScore: ps, priority: getPriorityLabel(ps) };
  }), [candidates]);

  // Filtered + sorted candidates
  const filtered = useMemo(() => {
    let result = enriched.filter(c => {
      const nameMatch = c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.college.toLowerCase().includes(search.toLowerCase());
      const assignOk = c.assignment_score >= filters.assignmentMin && c.assignment_score <= filters.assignmentMax;
      const videoOk = c.video_score >= filters.videoMin && c.video_score <= filters.videoMax;
      const atsOk = c.ats_score >= filters.atsMin && c.ats_score <= filters.atsMax;
      const statusOk = filters.status === "all" || c.status === filters.status;
      const priorityOk = filters.priority === "all" || c.priority === filters.priority;
      const shortlistOk = !filters.shortlisted || c.shortlisted;
      return nameMatch && assignOk && videoOk && atsOk && statusOk && priorityOk && shortlistOk;
    });

    result.sort((a, b) => {
      let va, vb;
      switch (sortBy) {
        case "priority": va = b.priorityScore; vb = a.priorityScore; break;
        case "assignment": va = b.assignment_score; vb = a.assignment_score; break;
        case "video": va = b.video_score; vb = a.video_score; break;
        case "ats": va = b.ats_score; vb = a.ats_score; break;
        case "name": va = a.name; vb = b.name; return va.localeCompare(vb) * (sortDir === "asc" ? 1 : -1);
        default: va = b.priorityScore; vb = a.priorityScore;
      }
      return sortDir === "desc" ? va - vb : vb - va;
    });
    return result;
  }, [enriched, search, filters, sortBy, sortDir]);

  // Summary stats
  const summary = useMemo(() => ({
    total: candidates.length,
    reviewed: candidates.filter(c => c.status === "reviewed").length,
    shortlisted: candidates.filter(c => c.shortlisted).length,
    pending: candidates.filter(c => c.status === "pending").length,
    p0: enriched.filter(c => c.priority === "P0").length,
    p1: enriched.filter(c => c.priority === "P1").length,
    p2: enriched.filter(c => c.priority === "P2").length,
    p3: enriched.filter(c => c.priority === "P3").length,
  }), [candidates, enriched]);

  const updateCandidate = (id, updates) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const selectedCandidate = enriched.find(c => c.id === selectedId) || null;
  const compareCandidates = enriched.filter(c => compareIds.includes(c.id));

  const toggleCompare = (id) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        compareCount={compareIds.length}
        onOpenCompare={() => setShowCompare(true)}
        onClearCompare={() => setCompareIds([])}
      />

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-3 sm:px-4 lg:px-6 py-4 space-y-4">
        <SummaryBar summary={summary} />

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left: Filters */}
          <div className="lg:w-64 xl:w-72 flex-shrink-0">
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              search={search}
              setSearch={setSearch}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortDir={sortDir}
              setSortDir={setSortDir}
              resultCount={filtered.length}
            />
          </div>

          {/* Right: Table */}
          <div className="flex-1 min-w-0">
            <CandidateTable
              candidates={filtered}
              selectedId={selectedId}
              onSelect={setSelectedId}
              compareIds={compareIds}
              onToggleCompare={toggleCompare}
              onShortlist={(id) => updateCandidate(id, {
                shortlisted: !candidates.find(c => c.id === id)?.shortlisted
              })}
              sortBy={sortBy}
              setSortBy={setSortBy}
              sortDir={sortDir}
              setSortDir={setSortDir}
            />
          </div>
        </div>
      </main>

      {/* Candidate Detail Drawer */}
      {selectedCandidate && (
        <CandidateDrawer
          candidate={selectedCandidate}
          onClose={() => setSelectedId(null)}
          onUpdate={(updates) => updateCandidate(selectedCandidate.id, updates)}
        />
      )}

      {/* Comparison Modal */}
      {showCompare && (
        <CompareModal
          candidates={compareCandidates}
          onClose={() => setShowCompare(false)}
          onRemove={(id) => setCompareIds(prev => prev.filter(x => x !== id))}
        />
      )}
    </div>
  );
}
