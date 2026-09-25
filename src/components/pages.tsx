import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Download,
  FileSpreadsheet,
  Filter,
  Mic,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DemoBadge,
  HorizontalBars,
  Metric,
  PageHead,
  Panel,
  RelationshipFlow,
  ReportList,
  Status,
  TrendChart,
} from "@/components/IntelligenceUI";
import { ReportDrawer } from "@/components/ReportDrawer";
import { dashboard, patterns, reports, rules, sites, trend } from "@/data/mockData";
import {
  analyzeSingleReport,
  getDashboardSummary,
  getReports,
  uploadSafetyData,
} from "@/services/api";
import type { Report } from "@/types/intelligence";

const benchmark = [
  "33kV Lockout Bypass",
  "Derrick Mast Clamp",
  "Oil Dispenser Leakage",
  "Office Water Leak",
];
export function DashboardPage() {
  const [text, setText] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [result, setResult] = useState<Awaited<ReturnType<typeof analyzeSingleReport>> | null>(
    null,
  );
  const [open, setOpen] = useState<Report | null>(null);
  const [summary, setSummary] = useState({
  totalReports: 0,
  sifReports: 0,
  density: 0,
  critical: 0,
  sites: 0,
});

const [dashboardLoading, setDashboardLoading] = useState(true);
  useEffect(() => {
  async function loadDashboard() {
    try {
      setDashboardLoading(true);

      const result = await getDashboardSummary();

      setSummary({
        totalReports: result.totalReports,
        sifReports: result.sifReports,
        density: result.density,
        critical: result.critical,
        sites: result.sites,
      });
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setDashboardLoading(false);
    }
  }

  loadDashboard();
}, []);
  async function analyze() {
    if (!text.trim()) return;
    setState("loading");
    const r = await analyzeSingleReport(text);
    setResult(r);
    setState("done");
  }
  return (
    <>
      <PageHead
        eyebrow="Organization / Command Center"
        title="Safety Intelligence Command Center"
        subtitle="Identify serious injury & fatality precursors before they become incidents."
        actions={<DemoBadge />}
      />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <Metric
          label="Total Reports"
          value={dashboardLoading ? "..." : summary.totalReports.toLocaleString()}
          trend="All operational sources"
        />
        <Metric
          label="SIF-Potential Reports"
          value={dashboardLoading ? "..." : summary.sifReports.toLocaleString()}
          trend="+4.8% vs prior period"
          tone="critical"
        />
        <Metric
          label="SIF Precursor Density"
          value={dashboardLoading ? "..." : `${summary.density}%`}
          trend="Across 8 operational sites"
          tone="warning"
        />
        <Metric
          label="Critical Precursors"
          value={dashboardLoading ? "..." : summary.critical.toLocaleString()}
          trend="128 require validation"
          tone="critical"
        />
        <Metric
          label="Sites with SIF Precursors"
          value={dashboardLoading ? "..." : `${summary.sites}`}
          trend="1 site below threshold"
          tone="success"
        />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <Panel
          title="AI Safety Command Composer"
          subtitle="Rapid single-report risk assessment"
          className="command-panel"
        >
          <div className="mb-4 grid gap-2 sm:grid-cols-3">
            {["Facility Context", "Duliajan Central Facility", "Unsafe Act"].map((x) => (
              <button
                key={x}
                className="flex h-9 items-center justify-between border border-input bg-background px-3 text-left text-xs text-muted-foreground"
              >
                {x}
                <ChevronRight className="size-3" />
              </button>
            ))}
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-32 resize-none border-border bg-background text-sm"
            placeholder="Describe a workplace safety observation, near miss, or hazard condition..."
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {benchmark.map((x) => (
              <button
                key={x}
                onClick={() =>
                  setText(
                    x === "Office Water Leak"
                      ? "Minor office water leak creating a small housekeeping issue with no significant exposure."
                      : x === "33kV Lockout Bypass"
                        ? "Worker bypassed lockout on 33kV switchgear panel without testing dead."
                        : `${x} observed during maintenance with workers inside the exposure zone.`,
                  )
                }
                className="border border-border bg-muted px-2 py-1 text-[10px] text-muted-foreground hover:border-primary hover:text-foreground"
              >
                {x}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <Button variant="ghost" size="sm">
              <Mic />
              Voice dictate
            </Button>
            <Button onClick={analyze} disabled={!text.trim() || state === "loading"}>
              {state === "loading" ? (
                <>
                  <span className="size-3 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Analyzing
                </>
              ) : (
                <>
                  Analyze Risk
                  <ArrowRight />
                </>
              )}
            </Button>
          </div>
          {state === "loading" && (
            <div className="mt-5 border-t border-border pt-4">
              <p className="mb-3 text-xs font-semibold uppercase text-primary">
                AI analysis in progress
              </p>
              <div className="grid gap-2 sm:grid-cols-5">
                {[
                  "Reading observation",
                  "Detecting hazards",
                  "Evaluating SIF",
                  "Mapping rule",
                  "Finding barriers",
                ].map((x, i) => (
                  <div key={x} className="border border-border bg-muted/40 p-2 text-[10px]">
                    <span className="mr-1 text-primary">0{i + 1}</span>
                    {x}
                  </div>
                ))}
              </div>
            </div>
          )}
          {result && state === "done" && (
            <div className="mt-5 border-t border-border pt-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">SIF Potential</p>
                  <p
                    className={
                      result.sif
                        ? "mt-1 font-display text-xl text-critical"
                        : "mt-1 font-display text-xl text-success"
                    }
                  >
                    {result.sif ? "YES" : "NO"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">Confidence</p>
                  <p className="mt-1 font-display text-xl">{result.confidence}%</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground">Risk level</p>
                  <Status tone={result.sif ? "critical" : "success"}>{result.risk}</Status>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-px bg-border">
                {[
                  ["Life-Saving Rule", result.rule],
                  ["Activity", result.activity],
                  ["Hazard", result.hazard],
                  ["Barrier Failure", result.barrier],
                ].map(([k, v]) => (
                  <div key={k} className="bg-card p-3">
                    <p className="text-[10px] uppercase text-muted-foreground">{k}</p>
                    <p className="mt-1 text-xs font-semibold">{v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-l-2 border-info bg-info/10 p-3 text-xs">
                <span className="font-semibold text-info">AI-GENERATED DECISION SUPPORT</span>
                <p className="mt-1 text-muted-foreground">
                  Potential exposure identified from the report narrative. Requires HSE validation.
                </p>
              </div>
            </div>
          )}
        </Panel>
        <Panel
          title="Organization SIF Trend"
          subtitle="Total and SIF-potential reports"
          action={
            <div className="flex gap-1">
              {["30D", "90D", "6M", "1Y"].map((x) => (
                <button
                  key={x}
                  className="px-2 py-1 text-[10px] text-muted-foreground first:bg-accent first:text-foreground"
                >
                  {x}
                </button>
              ))}
            </div>
          }
        >
          <TrendChart data={trend} />
        </Panel>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <Panel title="Emerging Precursors" subtitle="Highest-priority recurring patterns">
          <div className="divide-y divide-border">
            {patterns.slice(0, 3).map((p, i) => (
              <Link
                key={p.id}
                to="/patterns"
                search={{ pattern: p.id }}
                className="flex items-center gap-3 py-3 hover:text-primary"
              >
                <span className="font-display text-lg text-muted-foreground">0{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <b className="block text-xs">{p.name}</b>
                  <span className="text-[11px] text-muted-foreground">
                    {p.occurrences} occurrences · {p.sif} SIF
                  </span>
                </span>
                <ArrowRight className="size-4" />
              </Link>
            ))}
          </div>
        </Panel>
        <Panel title="Site Snapshot" subtitle="SIF precursor density by location">
          <div className="divide-y divide-border">
            {sites.slice(0, 4).map((s) => (
              <Link
                key={s.id}
                to="/sites"
                search={{ site: s.id }}
                className="grid grid-cols-[1fr_auto_auto] gap-3 py-3 text-xs hover:text-primary"
              >
                <span>{s.name}</span>
                <b>{s.density}%</b>
                <ArrowRight className="size-4" />
              </Link>
            ))}
          </div>
        </Panel>
        <Panel
          title="Recent Critical Reports"
          subtitle="Most recent high-confidence classifications"
        >
          <ReportList
            reports={reports.filter((r) => r.risk === "Critical").slice(0, 4)}
            onOpen={setOpen}
          />
        </Panel>
      </div>
      <ReportDrawer report={open} onClose={() => setOpen(null)} />
    </>
  );
}

export function DataPage() {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    filename: string;
    rows_received: number;
    rows_processed: number;
  } | null>(null);
  const [uploadError, setUploadError] = useState("");

  async function handleUpload() {
    if (!file) return;

    try {
      setUploading(true);
      setUploadError("");

      const result = await uploadSafetyData(file);

      setUploadResult(result);
      setStep(2);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Upload failed",
      );
    } finally {
      setUploading(false);
    }
  }

  function run() {
    setStep(5);
    setProgress(12);
    let p = 12;
    const t = setInterval(() => {
      p += 11;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(t);
        setStep(6);
      }
    }, 120);
  }
  return (
    <>
      <PageHead
        eyebrow="Data Operations / Import"
        title="Import Safety Data"
        subtitle="Upload UA/UC observations, near-miss and incident datasets for SIF precursor analysis."
        actions={<DemoBadge />}
      />
      <div className="mb-5 grid grid-cols-3 gap-px bg-border md:grid-cols-6">
        {["Upload", "Validate", "Map columns", "Preview", "Analyze", "Complete"].map((x, i) => (
          <div
            key={x}
            className={`bg-card p-3 ${step >= i + 1 ? "text-primary" : "text-muted-foreground"}`}
          >
            <p className="text-[10px]">0{i + 1}</p>
            <p className="mt-1 text-xs font-semibold">{x}</p>
          </div>
        ))}
      </div>
      <Panel
        title={
          step === 1
            ? "Upload CSV or XLSX"
            : step === 2
              ? "File Validation"
              : step === 3
                ? "Column Mapping"
                : step === 4
                  ? "Dataset Preview"
                  : step === 5
                    ? "Running SIF Analysis"
                    : "Analysis Complete"
        }
        subtitle="Dataset processing uses synthetic behavior in this prototype"
      >
        <div className="mx-auto max-w-5xl">
          {step === 1 && (
  <div className="grid min-h-80 place-items-center border border-dashed border-primary/50 bg-primary/5 text-center">
    <div>
      <UploadCloud className="mx-auto size-10 text-primary" />

      <h3 className="mt-4 text-base font-semibold">
        Upload safety data
      </h3>

      <p className="mt-2 text-sm text-muted-foreground">
        CSV or XLSX
      </p>

      <input
        id="safety-file"
        type="file"
        accept=".csv,.xlsx"
        className="hidden"
        onChange={(e) => {
          const selected = e.target.files?.[0] ?? null;
          setFile(selected);
          setUploadError("");
        }}
      />

      <label htmlFor="safety-file">
        <Button asChild className="mt-5">
          <span>Choose file</span>
        </Button>
      </label>

      {file && (
        <div className="mt-4 border border-border bg-card p-3 text-left text-xs">
          <p className="font-semibold">{file.name}</p>
          <p className="mt-1 text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}

      {file && (
        <Button
          className="mt-4"
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload to Safety Intelligence"}
        </Button>
      )}

      {uploadError && (
        <p className="mt-4 text-xs text-destructive">
          {uploadError}
        </p>
      )}
    </div>
  </div>
)}
          {step === 2 && uploadResult && (
  <div className="space-y-4 py-8">
    <div className="flex items-center gap-3 border border-border bg-muted/30 p-4">
      <FileSpreadsheet className="size-8 text-success" />

      <div>
        <p className="text-sm font-semibold">
          {uploadResult.filename}
        </p>

        <p className="text-xs text-muted-foreground">
          {uploadResult.rows_processed.toLocaleString()} records imported
        </p>
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <CheckCircle2 className="size-4 text-success" />
        File uploaded
      </div>

      <div className="flex items-center gap-2 text-sm">
        <CheckCircle2 className="size-4 text-success" />
        Format valid
      </div>

      <div className="flex items-center gap-2 text-sm">
        <CheckCircle2 className="size-4 text-success" />
        {uploadResult.rows_received.toLocaleString()} rows detected
      </div>

      <div className="flex items-center gap-2 text-sm">
        <CheckCircle2 className="size-4 text-success" />
        Reports stored in database
      </div>
    </div>

    <Button onClick={() => setStep(3)}>
      Continue
      <ArrowRight />
    </Button>
  </div>
)}
          {step === 3 && (
            <div className="py-6">
              <div className="grid grid-cols-[1fr_auto_1fr] gap-3 border-b border-border pb-2 text-[10px] uppercase text-muted-foreground">
                <span>Source column</span>
                <span />
                <span>Intelligence field</span>
              </div>
              {[
                ["Description", "Report Text"],
                ["Site", "Site"],
                ["Location", "Location"],
                ["Date", "Date"],
                ["Report Type", "Report Type"],
              ].map(([a, b]) => (
                <div
                  key={a}
                  className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-border py-3 text-sm"
                >
                  <span>{a}</span>
                  <ArrowRight className="size-4 text-primary" />
                  <select className="h-9 border border-input bg-background px-3">
                    <option>{b}</option>
                    <option>Ignore column</option>
                  </select>
                </div>
              ))}
              <Button className="mt-5" onClick={() => setStep(4)}>
                Review dataset
                <ArrowRight />
              </Button>
            </div>
          )}
          {step === 4 && (
            <div className="py-5">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-xs">
                  <thead className="border-b border-border text-[10px] uppercase text-muted-foreground">
                    <tr>
                      {["Date", "Site", "Type", "Description", "Mapped"].map((x) => (
                        <th key={x} className="p-3">
                          {x}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reports.slice(0, 6).map((r) => (
                      <tr key={r.id} className="border-b border-border">
                        <td className="p-3">{r.date}</td>
                        <td className="p-3">{r.site}</td>
                        <td className="p-3">{r.type}</td>
                        <td className="max-w-sm truncate p-3">{r.description}</td>
                        <td className="p-3 text-success">Ready</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button className="mt-5" onClick={run}>
                Run SIF Analysis
                <BrainCircuit />
              </Button>
            </div>
          )}
          {step === 5 && (
            <div className="py-14 text-center">
              <BrainCircuit className="mx-auto size-10 animate-pulse text-primary" />
              <p className="mt-4 font-semibold">Processing safety intelligence</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {Math.round((12482 * progress) / 100).toLocaleString()} / 12,482 reports
              </p>
              <Progress value={progress} className="mx-auto mt-5 max-w-xl" />
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {[
                  "SIF classification",
                  "Rule mapping",
                  "Precursor extraction",
                  "Pattern detection",
                ].map((x) => (
                  <span key={x} className="border border-border px-2 py-1 text-[10px]">
                    {x}
                  </span>
                ))}
              </div>
            </div>
          )}
          {step === 6 && (
            <div className="py-12 text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-full bg-success/10">
                <Check className="size-7 text-success" />
              </div>
              <h3 className="mt-4 font-display text-2xl">12,482 Reports Processed</h3>
              <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
                <Metric label="SIF Potential" value="2,731" tone="critical" />
                <Metric label="Critical Precursors" value="847" tone="warning" />
                <Metric label="Processing Status" value="100%" tone="success" />
              </div>
              <Button asChild className="mt-6">
                <Link to="/dashboard">
                  Open Safety Intelligence
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </Panel>
    </>
  );
}

export function SifPage() {
  const [site, setSite] = useState("all");
  return (
    <>
      <PageHead
        eyebrow="Organization / SIF Lens"
        title="SIF Intelligence"
        subtitle="What does the serious injury and fatality-potential population look like?"
        actions={<DemoBadge />}
      />
      <FilterBar site={site} setSite={setSite} />
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="SIF Potential" value="2,731" tone="critical" />
        <Metric label="Non-SIF" value="9,751" tone="success" />
        <Metric label="SIF Density" value="21.9%" tone="warning" />
        <Metric label="Median Confidence" value="91%" />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel title="SIF Distribution" subtitle="Potential vs non-SIF population">
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={[
                    { name: "SIF Potential", value: 2731 },
                    { name: "Non-SIF", value: 9751 },
                  ]}
                  innerRadius={70}
                  outerRadius={105}
                  dataKey="value"
                >
                  <Cell fill="var(--color-critical)" />
                  <Cell fill="var(--color-success)" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="SIF Trend" subtitle="Monthly organization view">
          <TrendChart data={trend} />
        </Panel>
        <Panel title="Top Hazards" subtitle="By SIF-potential report count">
          <HorizontalBars
            data={[
              { name: "Electrical energy", value: 731 },
              { name: "Line of fire", value: 624 },
              { name: "Toxic atmosphere", value: 388 },
              { name: "Stored pressure", value: 306 },
              { name: "Fall from height", value: 287 },
            ]}
          />
        </Panel>
        <Panel title="Barrier Failures" subtitle="Control weaknesses detected">
          <HorizontalBars
            data={patterns.slice(0, 6).map((p) => ({ name: p.barrier, value: p.sif }))}
          />
        </Panel>
      </div>
    </>
  );
}
function FilterBar({ site, setSite }: { site: string; setSite: (x: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border border-border bg-card p-3">
      <Filter className="size-4 text-muted-foreground" />
      <Select value={site} onValueChange={setSite}>
        <SelectTrigger className="w-52">
          <SelectValue placeholder="All sites" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All sites</SelectItem>
          {sites.map((s) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <select className="h-9 border border-input bg-background px-3 text-xs">
        <option>All activities</option>
        <option>Maintenance</option>
        <option>Drilling</option>
      </select>
      <select className="h-9 border border-input bg-background px-3 text-xs">
        <option>All report types</option>
        <option>Near Miss</option>
        <option>Unsafe Act</option>
      </select>
      <Button variant="ghost" size="sm" className="ml-auto">
        <X />
        Clear
      </Button>
    </div>
  );
}

export function SitesPage() {
  const [siteId, setSiteId] = useState("duliajan");
  const [open, setOpen] = useState<Report | null>(null);
  const site = sites.find((s) => s.id === siteId) ?? sites.at(0);
  if (!site) return null;
  const factor = site.density / 20.8;
  return (
    <>
      <PageHead
        eyebrow="Organization / Site"
        title="Site Intelligence"
        subtitle="Where are SIF precursor conditions occurring, and what controls are involved?"
        actions={<DemoBadge />}
      />
      <div className="mb-5 flex flex-col gap-3 border border-border bg-card p-4 md:flex-row md:items-center">
        <div>
          <p className="text-[10px] uppercase text-muted-foreground">Operational scope</p>
          <p className="mt-1 text-sm font-medium">
            All intelligence below is scoped to the selected site.
          </p>
        </div>
        <Select value={siteId} onValueChange={setSiteId}>
          <SelectTrigger className="md:ml-auto md:w-72">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sites.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="border-l-2 border-primary bg-primary/5 p-4">
        <p className="text-[10px] uppercase text-primary">Selected operational site</p>
        <h2 className="mt-1 font-display text-xl">{site.name}</h2>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Reports" value={site.reports.toLocaleString()} />
        <Metric label="SIF-Potential" value={site.sif.toLocaleString()} tone="critical" />
        <Metric label="SIF Density" value={`${site.density}%`} tone="warning" />
        <Metric
          label="Critical Precursors"
          value={site.critical.toLocaleString()}
          tone="critical"
        />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <Panel title="Site SIF Trend" subtitle={`SIF-potential trend for ${site.name}`}>
          <TrendChart data={trend.map((x) => ({ ...x, sif: Math.round(x.sif * factor) }))} />
        </Panel>
        <Panel
          title="Life-Saving Rule Distribution"
          subtitle="Click a rule to continue investigation"
        >
          <div className="space-y-4">
            {rules.slice(0, 5).map((r, i) => (
              <Link key={r.id} to="/rules" search={{ rule: r.id, site: siteId }} className="block">
                <div className="mb-1 flex justify-between text-xs">
                  <span>{r.name}</span>
                  <b>{Math.max(7, 34 - i * 6)}%</b>
                </div>
                <div className="h-1.5 bg-muted">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${Math.max(7, 34 - i * 6)}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </Panel>
        <Panel title="Activity Analysis" subtitle="Filter the site view by operation">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {["Maintenance", "Drilling", "Lifting", "Electrical", "Inspection", "Other"].map(
              (x, i) => (
                <button key={x} className="border border-border p-3 text-left hover:border-primary">
                  <span className="text-[10px] uppercase text-muted-foreground">
                    {120 - i * 11} reports
                  </span>
                  <span className="mt-1 block text-xs font-semibold">{x}</span>
                </button>
              ),
            )}
          </div>
        </Panel>
        <Panel title="Top Precursor Patterns" subtitle="Recurring conditions at selected site">
          <div className="divide-y divide-border">
            {patterns.slice(0, 4).map((p, i) => (
              <Link
                key={p.id}
                to="/patterns"
                search={{ pattern: p.id, site: siteId }}
                className="flex items-center gap-3 py-3 text-sm hover:text-primary"
              >
                <span className="text-muted-foreground">0{i + 1}</span>
                <span className="flex-1">{p.name}</span>
                <b>{Math.round(p.occurrences * factor)}</b>
                <ChevronRight className="size-4" />
              </Link>
            ))}
          </div>
        </Panel>
        <Panel title="Barrier Failures" subtitle="Most frequent control gaps">
          <HorizontalBars
            data={patterns
              .slice(0, 6)
              .map((p) => ({ name: p.barrier, value: Math.round(p.sif * factor) }))}
          />
        </Panel>
        <Panel title="Relevant Site Reports" subtitle="Reports supporting these signals">
          <ReportList
            reports={reports.filter((r) => r.site === site.name).slice(0, 5)}
            onOpen={setOpen}
          />
        </Panel>
      </div>
      <ReportDrawer report={open} onClose={() => setOpen(null)} />
    </>
  );
}

export function RulesPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const rule = rules.find((r) => r.id === selected);
  const [open, setOpen] = useState<Report | null>(null);
  if (rule)
    return (
      <>
        <PageHead
          eyebrow="Life-Saving Rules / Detail"
          title={`${rule.name} Intelligence`}
          subtitle="What is driving this fatal-risk control signal across the organization?"
          actions={
            <Button variant="outline" onClick={() => setSelected(null)}>
              <ChevronLeft />
              All rules
            </Button>
          }
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Reports" value={rule.reports.toLocaleString()} />
          <Metric label="SIF Potential" value={rule.sif.toLocaleString()} tone="critical" />
          <Metric label="SIF Density" value={`${rule.density}%`} tone="warning" />
          <Metric label="Top Site" value={rule.topSite.split(" ")[0] ?? rule.topSite} />
        </div>
        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <Panel title="Organization-wide Trend" subtitle={`Monthly ${rule.name} classifications`}>
            <TrendChart
              data={trend.map((x, i) => ({ ...x, sif: Math.round(x.sif * (0.35 + i * 0.01)) }))}
            />
          </Panel>
          <Panel title="Top Sites" subtitle="Affected operational locations">
            <HorizontalBars
              data={sites
                .slice(0, 5)
                .map((s, i) => ({ name: s.name, value: Math.round(s.sif * (0.4 - i * 0.03)) }))}
            />
          </Panel>
          <Panel title="Top Precursor Patterns" subtitle="Continue into pattern intelligence">
            <div className="divide-y divide-border">
              {patterns
                .filter((p) => p.rule === rule.name)
                .slice(0, 5)
                .concat(patterns.slice(0, 3))
                .slice(0, 5)
                .map((p) => (
                  <Link
                    key={p.id}
                    to="/patterns"
                    search={{ pattern: p.id }}
                    className="flex items-center justify-between py-3 text-sm hover:text-primary"
                  >
                    <span>{p.name}</span>
                    <ArrowRight className="size-4" />
                  </Link>
                ))}
            </div>
          </Panel>
          <Panel title="Representative Reports" subtitle="Evidence behind this control-area signal">
            <ReportList
              reports={reports.filter((r) => r.rule === rule.name).slice(0, 5)}
              onOpen={setOpen}
            />
          </Panel>
        </div>
        <ReportDrawer report={open} onClose={() => setOpen(null)} />
      </>
    );
  return (
    <>
      <PageHead
        eyebrow="Organization / Fatal-Risk Controls"
        title="Life-Saving Rules"
        subtitle="What fatal-risk control areas are appearing across the organization?"
        actions={<DemoBadge />}
      />
      <div className="overflow-x-auto border border-border bg-card">
        <table className="w-full min-w-[950px] text-left text-xs">
          <thead className="border-b border-border bg-muted/30 text-[10px] uppercase text-muted-foreground">
            <tr>
              {[
                "Rule",
                "Reports",
                "SIF Potential",
                "SIF Density",
                "Top Site",
                "Top Activity",
                "Top Precursor",
                "",
              ].map((x) => (
                <th key={x} className="p-3">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.id} className="border-b border-border hover:bg-accent/30">
                <td className="p-3 font-semibold">{r.name}</td>
                <td className="p-3">{r.reports.toLocaleString()}</td>
                <td className="p-3 text-critical">{r.sif}</td>
                <td className="p-3">
                  <Status tone={r.density > 25 ? "critical" : "warning"}>{r.density}%</Status>
                </td>
                <td className="p-3">{r.topSite}</td>
                <td className="p-3">{r.topActivity}</td>
                <td className="p-3">{r.topPattern}</td>
                <td className="p-3">
                  <Button variant="ghost" size="icon" onClick={() => setSelected(r.id)}>
                    <ArrowRight />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function PatternsPage() {
  const [selected, setSelected] = useState(patterns.at(0)?.id ?? "");
  const p = patterns.find((x) => x.id === selected) ?? patterns.at(0);
  const [open, setOpen] = useState<Report | null>(null);
  if (!p) return null;
  return (
    <>
      <PageHead
        eyebrow="Organization / Patterns / Investigation"
        title="Recurring SIF Precursor Patterns"
        subtitle="Identify recurring conditions and barrier failures across operations."
        actions={<DemoBadge />}
      />
      <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
        <div className="border border-border bg-card">
          <div className="border-b border-border p-3">
            <div className="flex items-center gap-2 border border-input bg-background px-3">
              <Search className="size-4 text-muted-foreground" />
              <Input
                placeholder="Search patterns"
                className="border-0 shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
          <div className="max-h-[720px] overflow-y-auto">
            {patterns.map((x) => (
              <button
                key={x.id}
                onClick={() => setSelected(x.id)}
                className={`w-full border-b border-border p-4 text-left ${selected === x.id ? "border-l-2 border-l-primary bg-accent" : "border-l-2 border-l-transparent hover:bg-accent/50"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold uppercase">{x.name}</span>
                  <Status tone={x.trend > 10 ? "critical" : "warning"}>
                    {x.trend > 0 ? "+" : ""}
                    {x.trend.toFixed(1)}%
                  </Status>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {x.occurrences} occurrences · {x.density}% SIF
                </p>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <div className="border-l-2 border-critical bg-card p-5">
            <div className="flex flex-wrap items-center gap-3">
              <Status tone="critical">Priority pattern</Status>
              <span className="text-xs text-muted-foreground">
                Trend {p.trend > 0 ? "+" : ""}
                {p.trend.toFixed(1)}%
              </span>
            </div>
            <h2 className="mt-3 font-display text-2xl uppercase">{p.name}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {p.description}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Metric label="Occurrences" value={p.occurrences.toString()} />
              <Metric label="SIF Potential" value={p.sif.toString()} tone="critical" />
              <Metric label="SIF Percentage" value={`${p.density}%`} tone="warning" />
            </div>
          </div>
          <Panel
            title="Precursor Relationship"
            subtitle="How this recurring condition can escalate"
          >
            <RelationshipFlow />
          </Panel>
          <div className="grid gap-5 lg:grid-cols-2">
            <Panel title="Affected Sites" subtitle="Distribution across operating locations">
              <HorizontalBars
                data={sites.slice(0, 5).map((s, i) => ({ name: s.name, value: 142 - i * 17 }))}
              />
            </Panel>
            <Panel title="Investigation Context" subtitle="Connected analytical dimensions">
              <div className="grid grid-cols-2 gap-px bg-border">
                {[
                  ["Top activity", p.activity],
                  ["Life-Saving Rule", p.rule],
                  ["Barrier failure", p.barrier],
                  ["Top site", p.site],
                ].map(([k, v]) => (
                  <div key={k} className="bg-card p-4">
                    <p className="text-[10px] uppercase text-muted-foreground">{k}</p>
                    <p className="mt-1 text-sm font-semibold">{v}</p>
                  </div>
                ))}
              </div>
              <Button asChild variant="outline" className="mt-4">
                <Link to="/rules">
                  Investigate {p.rule}
                  <ArrowRight />
                </Link>
              </Button>
            </Panel>
            <Panel
              title="Representative Reports"
              subtitle="Source reports supporting this pattern"
              className="lg:col-span-2"
            >
              <ReportList
                reports={reports.filter((r) => r.pattern === p.name).slice(0, 6)}
                onOpen={setOpen}
              />
            </Panel>
          </div>
        </div>
      </div>
      <ReportDrawer report={open} onClose={() => setOpen(null)} />
    </>
  );
}

export function ReportsPage() {
  const [q, setQ] = useState("");
  const [site, setSite] = useState("all");
  const [sif, setSif] = useState("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<Report | null>(null);

  const [rows, setRows] = useState<Report[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        setLoading(true);

        const result = await getReports({
          page,
          pageSize: 10,
          search: q,
          site,
          sif,
        });

        setRows(result.data);
        setTotal(result.total);
      } catch (error) {
        console.error("Failed to load reports:", error);
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [page, q, site, sif]);

  return (
    <>
      <PageHead
        eyebrow="Intelligence / Source Evidence"
        title="Reports"
        subtitle="Which individual reports produced these safety intelligence signals?"
        actions={
          <Button variant="outline">
            <Download />
            Export view
          </Button>
        }
      />
      <div className="flex flex-wrap gap-2 border border-border bg-card p-3">
        <div className="flex min-w-64 flex-1 items-center border border-input px-3">
          <Search className="size-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search report ID, text, site or rule"
            className="border-0 shadow-none focus-visible:ring-0"
          />
        </div>
        <Select
          value={site}
          onValueChange={(x) => {
            setSite(x);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sites</SelectItem>
            {sites.map((s) => (
              <SelectItem key={s.id} value={s.name}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={sif}
          onValueChange={(x) => {
            setSif(x);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All SIF states</SelectItem>
            <SelectItem value="true">SIF Potential</SelectItem>
            <SelectItem value="false">Non-SIF</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          onClick={() => {
            setQ("");
            setSite("all");
            setSif("all");
          }}
        >
          <X />
          Clear
        </Button>
      </div>
      <div className="mt-4 overflow-x-auto border border-border bg-card">
        <table className="w-full min-w-[1200px] text-left text-xs">
          <thead className="border-b border-border bg-muted/30 text-[10px] uppercase text-muted-foreground">
            <tr>
              {[
                "Report ID",
                "Date",
                "Site",
                "Report Type",
                "Description",
                "SIF Potential",
                "Confidence",
                "Life-Saving Rule",
                "Activity",
                "Barrier Failure",
              ].map((x) => (
                <th key={x} className="p-3">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                onClick={() => setOpen(r)}
                className="cursor-pointer border-b border-border hover:bg-accent/40"
              >
                <td className="sticky left-0 bg-card p-3 font-semibold text-primary">{r.id}</td>
                <td className="p-3">{r.date}</td>
                <td className="p-3">{r.site}</td>
                <td className="p-3">{r.type}</td>
                <td className="max-w-sm truncate p-3">{r.description}</td>
                <td className="p-3">
                  <Status tone={r.sif ? "critical" : "success"}>{r.sif ? "Yes" : "No"}</Status>
                </td>
                <td className="p-3">{r.confidence}%</td>
                <td className="p-3">{r.rule}</td>
                <td className="p-3">{r.activity}</td>
                <td className="p-3">{r.barrier}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Showing {total === 0 ? 0 : (page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total} reports
        </span>
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft />
          </Button>
          <span className="grid h-9 min-w-16 place-items-center border border-border">
            Page {page}
          </span>
          <Button
            size="icon"
            variant="outline"
            disabled={page * 10 >= total}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      <ReportDrawer report={open} onClose={() => setOpen(null)} />
    </>
  );
}

export function AnalyticsPage() {
  const [x, setX] = useState("Site"),
    [y, setY] = useState("Life-Saving Rule");
  return (
    <>
      <PageHead
        eyebrow="Advanced / Cross-sectional Analysis"
        title="Analytics Investigation Workspace"
        subtitle="Combine operational dimensions to test where precursor signals concentrate."
        actions={<DemoBadge />}
      />
      <div className="grid gap-5 xl:grid-cols-[280px_1fr]">
        <aside className="border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-primary" />
            <h2 className="text-xs font-semibold uppercase">Investigation setup</h2>
          </div>
          <label className="mt-5 block text-[10px] uppercase text-muted-foreground">
            Primary dimension
          </label>
          <select
            value={x}
            onChange={(e) => setX(e.target.value)}
            className="mt-2 h-10 w-full border border-input bg-background px-3 text-sm"
          >
            {["Site", "Rule", "Activity", "Precursor"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <label className="mt-4 block text-[10px] uppercase text-muted-foreground">
            Compare against
          </label>
          <select
            value={y}
            onChange={(e) => setY(e.target.value)}
            className="mt-2 h-10 w-full border border-input bg-background px-3 text-sm"
          >
            {["Life-Saving Rule", "Activity", "Precursor", "Site"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
          <div className="mt-5 border-t border-border pt-4">
            <p className="text-[10px] uppercase text-muted-foreground">Measures</p>
            {["Report volume", "SIF potential", "SIF density", "Confidence"].map((m, i) => (
              <label key={m} className="mt-3 flex items-center gap-2 text-xs">
                <input type="checkbox" defaultChecked={i < 2} />
                {m}
              </label>
            ))}
          </div>
          <Button className="mt-6 w-full">
            <Sparkles />
            Apply analysis
          </Button>
        </aside>
        <div className="space-y-5">
          <div className="border border-border bg-card p-5">
            <p className="text-[10px] uppercase text-primary">Active investigation</p>
            <h2 className="mt-2 font-display text-xl">
              {x} × {y}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              SIF-potential concentration across selected dimensions · Last 12 months
            </p>
          </div>
          <Panel title="Cross-dimensional Matrix" subtitle={`${x} compared with ${y}`}>
            <div className="overflow-x-auto">
              <div className="min-w-[650px]">
                <div className="mb-2 grid grid-cols-[160px_repeat(5,1fr)] gap-1 text-[10px] text-muted-foreground">
                  <span />
                  <span>Energy Isolation</span>
                  <span>Line of Fire</span>
                  <span>Confined Space</span>
                  <span>Hot Work</span>
                  <span>Height</span>
                </div>
                {sites.slice(0, 6).map((s, row) => (
                  <div key={s.id} className="mb-1 grid grid-cols-[160px_repeat(5,1fr)] gap-1">
                    <span className="truncate py-3 pr-2 text-xs">{s.name}</span>
                    {Array.from({ length: 5 }, (_, col) => {
                      const v = 18 + ((row * 11 + col * 17) % 65);
                      return (
                        <button
                          key={col}
                          title={`${v} SIF-potential reports`}
                          className="grid h-11 place-items-center bg-primary text-xs font-semibold text-primary-foreground"
                          style={{ opacity: 0.25 + v / 100 }}
                        >
                          {v}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </Panel>
          <div className="grid gap-5 lg:grid-cols-2">
            <Panel title="SIF Trend" subtitle="Filtered analytical cohort">
              <TrendChart data={trend} compact />
            </Panel>
            <Panel title="Leading Contributors" subtitle="Highest signal combinations">
              <div className="divide-y divide-border">
                {[
                  ["Duliajan × Energy Isolation", "142"],
                  ["Digboi × Line of Fire", "118"],
                  ["Drilling × Lifting Operations", "96"],
                  ["Production A × Confined Space", "81"],
                ].map(([a, b], i) => (
                  <div key={a} className="flex items-center gap-3 py-3 text-xs">
                    <span className="text-muted-foreground">0{i + 1}</span>
                    <span className="flex-1">{a}</span>
                    <b>{b}</b>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </>
  );
}
