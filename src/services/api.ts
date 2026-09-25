import { dashboard, patterns, reports, rules, sites, trend } from "@/data/mockData";
import type { ReportQuery } from "@/types/intelligence";
const wait=<T,>(data:T,ms=180)=>new Promise<T>(resolve=>setTimeout(()=>resolve(data),ms));
export const getDashboardSummary=()=>wait(dashboard);
export const getSifTrends=()=>wait(trend);
export const getRuleDistribution=()=>wait(rules);
export const getSites=()=>wait(sites);
export const getSite=(id:string)=>wait(sites.find(x=>x.id===id)??sites[0]);
export const getRules=()=>wait(rules);
export const getPatterns=()=>wait(patterns);
export const getPattern=(id:string)=>wait(patterns.find(x=>x.id===id)??patterns[0]);
export const getReport=(id:string)=>wait(reports.find(x=>x.id===id)??reports[0]);
export async function getReports(query:ReportQuery={}) { let rows=[...reports]; if(query.search){const q=query.search.toLowerCase();rows=rows.filter(r=>Object.values(r).join(" ").toLowerCase().includes(q));} if(query.site&&query.site!=="all")rows=rows.filter(r=>r.site===query.site); if(query.rule&&query.rule!=="all")rows=rows.filter(r=>r.rule===query.rule); if(query.sif&&query.sif!=="all")rows=rows.filter(r=>String(r.sif)===query.sif); const page=query.page??1,size=query.pageSize??10; return wait({data:rows.slice((page-1)*size,page*size),total:rows.length,page,pageSize:size}); }
export const getAnalytics=()=>wait({trend,rules,sites,patterns});
export async function analyzeSingleReport(text:string){await wait(null,1200);const nonSif=/housekeeping|water leak|office/i.test(text);return {sif:!nonSif,confidence:nonSif?68:94,risk:nonSif?"LOW":"CRITICAL",rule:nonSif?"Other":"Energy Isolation",activity:nonSif?"Housekeeping":"Electrical Maintenance",hazard:nonSif?"Slip / Trip":"Uncontrolled Electrical Energy",barrier:nonSif?"Routine inspection":"Isolation Verification",consequence:nonSif?"Minor injury":"Fatal Electrical Contact",evidence:nonSif?["Limited exposure","No critical energy source"]:["Lockout bypass","Electrical energy exposure","Isolation verification failure","Worker exposure"]};}
export const uploadDataset=()=>wait({name:"oil_safety_reports_q3.xlsx",records:12482,valid:true},700);
export const processDataset=()=>wait({processed:12482,sif:2731,critical:847},1600);
