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
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

// Keep these mock functions temporarily.
// We'll replace them one by one.
export const getDashboardSummary = () => Promise.resolve(dashboard);
export const getSifTrends = () => Promise.resolve(trend);
export const getRuleDistribution = () => Promise.resolve(rules);
export const getSites = () => Promise.resolve(sites);
export const getSite = (id: string) =>
  Promise.resolve(sites.find((x) => x.id === id) ?? sites[0]);
export const getRules = () => Promise.resolve(rules);
export const getPatterns = () => Promise.resolve(patterns);
export const getPattern = (id: string) =>
  Promise.resolve(patterns.find((x) => x.id === id) ?? patterns[0]);

// REAL BACKEND CONNECTION
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

  const queryString = params.toString();
  const path = queryString
    ? `/api/reports?${queryString}`
    : "/api/reports";

  const backendReports = await apiGet<
    Array<{
      report_id: string;
      report_text: string;
      report_date: string | null;
      report_type: string | null;
      severity: string | null;
      facility: string | null;
      site: string | null;
      activity: string | null;
    }>
  >(path);

  const data: Report[] = backendReports.map((r) => ({
    id: r.report_id,
    date: r.report_date ?? "",
    site: r.site ?? "Unknown",
    location: r.facility ?? "Unknown",
    type: r.report_type ?? "Unknown",
    description: r.report_text,

    // ML hasn't been connected yet.
    sif: false,
    confidence: 0,

    rule: "Pending ML",
    activity: r.activity ?? "Unknown",
    hazard: "Pending ML",
    barrier: "Pending ML",
    consequence: "Pending ML",
    pattern: "Pending ML",

    risk:
      r.severity?.toLowerCase() === "critical"
        ? "Critical"
        : r.severity?.toLowerCase() === "high"
          ? "High"
          : "Low",

    evidence: [],
  }));

  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;

  return {
    data: data.slice((page - 1) * pageSize, page * pageSize),
    total: data.length,
    page,
    pageSize,
  };
}

export const getAnalytics = () =>
  Promise.resolve({
    trend,
    rules,
    sites,
    patterns,
  });

// Still mock for now.
// We will connect this to your friend's ML later.
export async function analyzeSingleReport(text: string) {
  const nonSif = /housekeeping|water leak|office/i.test(text);

  return {
    sif: !nonSif,
    confidence: nonSif ? 68 : 94,
    risk: nonSif ? "LOW" : "CRITICAL",
    rule: nonSif ? "Other" : "Energy Isolation",
    activity: nonSif ? "Housekeeping" : "Electrical Maintenance",
    hazard: nonSif
      ? "Slip / Trip"
      : "Uncontrolled Electrical Energy",
    barrier: nonSif
      ? "Routine inspection"
      : "Isolation Verification",
    consequence: nonSif
      ? "Minor injury"
      : "Fatal Electrical Contact",
    evidence: nonSif
      ? ["Limited exposure", "No critical energy source"]
      : [
          "Lockout bypass",
          "Electrical energy exposure",
          "Isolation verification failure",
          "Worker exposure",
        ],
  };
}

export const uploadDataset = () =>
  Promise.resolve({
    name: "oil_safety_reports_q3.xlsx",
    records: 12482,
    valid: true,
  });

export const processDataset = () =>
  Promise.resolve({
    processed: 12482,
    sif: 2731,
    critical: 847,
  });
