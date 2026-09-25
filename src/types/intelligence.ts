export type RiskLevel = "Critical" | "High" | "Moderate" | "Low";
export interface Site { id:string; name:string; code:string; reports:number; sif:number; density:number; critical:number; topRule:string; topPattern:string }
export interface Rule { id:string; name:string; reports:number; sif:number; density:number; topSite:string; topActivity:string; topPattern:string }
export interface Pattern { id:string; name:string; description:string; occurrences:number; sif:number; density:number; trend:number; activity:string; site:string; barrier:string; rule:string }
export interface Report { id:string; date:string; site:string; location:string; type:string; description:string; sif:boolean; confidence:number; rule:string; activity:string; hazard:string; barrier:string; consequence:string; pattern:string; risk:RiskLevel; evidence:string[] }
export interface TrendPoint { month:string; total:number; sif:number; nonSif:number; density:number }
export interface ReportQuery { page?:number; pageSize?:number; search?:string; site?:string; rule?:string; sif?:string; activity?:string; sort?:string }
