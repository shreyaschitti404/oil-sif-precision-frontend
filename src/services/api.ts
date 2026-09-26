import {
  dashboard,
  patterns,
  reports,
  rules,
  sites,
  trend,
} from "@/data/mockData";
import type { Report, ReportQuery } from "@/types/intelligence";

const API_URL = import.meta.env.VITE_API_URL;

function apiUrl(path: string) {
  if (!API_URL) {
    throw new Error("VITE_API_URL is not configured");
  }

  return `${API_URL}${path}`;
}

async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(apiUrl(path));

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || `API request failed: ${response.status}`,
    );
  }

  return response.json();
}

/* =========================================================
   DASHBOARD
   ========================================================= */

export async function getDashboardSummary() {
  const result = await apiGet<{
    total_reports: number;
    critical_reports: number;
    high_reports: number;
    reports_by_site: Array<{
      site: string;
      count: number;
    }>;
    reports_by_activity: Array<{
      activity: string;
      count: number;
    }>;
    reports_by_severity: Array<{
      severity: string;
      count: number;
    }>;
  }>("/api/dashboard");

  return {
    totalReports: result.total_reports,

    // ML not connected yet.
    sifReports: 0,
    density: 0,

    critical: result.critical_reports,
    sites: result.reports_by_site.length,

    reportsBySite: result.reports_by_site,
    reportsByActivity: result.reports_by_activity,
    reportsBySeverity: result.reports_by_severity,
  };
}

/* =========================================================
   TEMPORARY MOCK FUNCTIONS
   These will be replaced with real APIs later.
   ========================================================= */

export const getSifTrends = () => Promise.resolve(trend);

export const getRuleDistribution = () => Promise.resolve(rules);

export const getSites = () => Promise.resolve(sites);

export const getSite = (id: string) =>
  Promise.resolve(
    sites.find((x) => x.id === id) ?? sites[0],
  );

export const getRules = () => Promise.resolve(rules);

export const getPatterns = () => Promise.resolve(patterns);

export const getPattern = (id: string) =>
  Promise.resolve(
    patterns.find((x) => x.id === id) ?? patterns[0],
  );

/* =========================================================
   REAL REPORTS API
   ========================================================= */

export async function getReports(query: ReportQuery = {}) {
  const params = new URLSearchParams();

  if (query.page) {
    params.set("page", String(query.page));
  }

  if (query.pageSize) {
    params.set("page_size", String(query.pageSize));
  }

  if (query.search) {
    params.set("search", query.search);
  }

  if (query.site && query.site !== "all") {
    params.set("site", query.site);
  }

  const queryString = params.toString();

  const path = queryString
    ? `/api/reports?${queryString}`
    : "/api/reports";

  /*
    Backend response:

    {
      data: [...],
      total: 34,
      page: 1,
      page_size: 10
    }
  */

  const response = await apiGet<{
    data: Array<{
      report_id: string;
      report_text: string;
      report_date: string | null;
      report_type: string | null;
      severity: string | null;
      facility: string | null;
      site: string | null;
      activity: string | null;

      // ML fields
      sif_potential: boolean | null;
      confidence: number | null;
      life_saving_rule: string | null;
      hazard: string | null;
      barrier_failure: string | null;
      precursor_pattern: string | null;
      model_version: string | null;
    }>;

    total: number;
    page: number;
    page_size: number;
  }>(path);

  const data: Report[] = response.data.map((r) => ({
    id: r.report_id,

    date: r.report_date ?? "",

    site: r.site ?? "Unknown",

    location: r.facility ?? "Unknown",

    type: r.report_type ?? "Unknown",

    description: r.report_text,

    /*
      ML is not connected yet.
      Once your friend's model is added,
      these fields will come from predictions.
    */
    sif: r.sif_potential ?? false,

    confidence: r.confidence ?? 0,

    rule: r.life_saving_rule ?? "Pending ML",

    activity: r.activity ?? "Unknown",

    hazard: r.hazard ?? "Pending ML",

    barrier: r.barrier_failure ?? "Pending ML",

    consequence: "Pending ML",

    pattern: r.precursor_pattern ?? "Pending ML",

    risk:
      r.severity?.toLowerCase() === "critical"
        ? "Critical"
        : r.severity?.toLowerCase() === "high"
          ? "High"
          : r.severity?.toLowerCase() === "medium"
            ? "Medium"
            : "Low",

    evidence: [],
  }));

  /*
    IMPORTANT:

    Do NOT slice the data here.

    FastAPI already handles:
      page
      page_size
      search
      site

    So we return exactly what the backend gave us.
  */

  return {
    data,

    total: response.total,

    page: response.page,

    pageSize: response.page_size,
  };
}

/* =========================================================
   ANALYTICS
   ========================================================= */

export const getAnalytics = () =>
  Promise.resolve({
    trend,
    rules,
    sites,
    patterns,
  });

/* =========================================================
   SINGLE REPORT ANALYSIS
   TEMPORARY MOCK

   This will later call:
   POST /api/analyze

   after your friend's ML model is ready.
   ========================================================= */
export async function analyzeSingleReport(text: string) {
  const response = await fetch(apiUrl("/api/analyze"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || `Analysis request failed: ${response.status}`,
    );
  }

  const result = (await response.json()) as {
    sif_potential: boolean;
    confidence: number;
    life_saving_rule: string | null;
    activity: string | null;
    hazard: string | null;
    barrier_failure: string | null;
    precursor_pattern: string | null;
    model_version: string;
  };

  return {
    sif: result.sif_potential,

    confidence: Math.round(result.confidence * 100),

    risk: result.sif_potential
      ? "CRITICAL"
      : "LOW",

    rule:
      result.life_saving_rule ??
      "Pending ML",

    activity:
      result.activity ??
      "Pending ML",

    hazard:
      result.hazard ??
      "Pending ML",

    barrier:
      result.barrier_failure ??
      "Pending ML",

    consequence: "Pending ML",

    evidence: result.precursor_pattern
      ? [result.precursor_pattern]
      : [],

    model_version: result.model_version,
  };
}

/* =========================================================
   REAL CSV / XLSX UPLOAD
   ========================================================= */

export async function uploadSafetyData(file: File) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await fetch(
    apiUrl("/api/upload"),
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      errorText || "Upload failed",
    );
  }

  return response.json() as Promise<{
    status: string;
    filename: string;
    rows_received: number;
    rows_processed: number;
  }>;
}

/* =========================================================
   OLD MOCK UPLOAD FUNCTION
   Kept temporarily in case another page still imports it.
   ========================================================= */

export const uploadDataset = () =>
  Promise.resolve({
    name: "demo-upload.csv",
    records: 0,
    valid: true,
  });

/* =========================================================
   OLD MOCK PROCESS FUNCTION
   Kept temporarily.

   We will remove this once the upload page is fully real.
   ========================================================= */

export const processDataset = () =>
  Promise.resolve({
    processed: 0,
    sif: 0,
    critical: 0,
  });
