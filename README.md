# SIF Precision

### AI/NLP-based Safety Intelligence Platform for SIF Precursor Detection

SIF Precision is a safety intelligence platform developed for the **Smart India Hackathon 2026** problem focused on identifying **Serious Injury & Fatality (SIF) precursors** from workplace safety reports.

The platform works with unstructured safety observations, Unsafe Acts (UA), Unsafe Conditions (UC), near-miss reports and incident narratives. It organizes the information and applies AI/NLP techniques to identify patterns, hazards and barrier failures that may otherwise be difficult to discover through manual review.

---

## Overview

Large volumes of workplace safety reports often contain valuable information about potentially serious hazards.

However, important precursor signals can be difficult to identify because:

- reports are largely free-text
- similar situations may be described using different terminology
- individual reports may appear low-severity
- recurring patterns may only become visible across many reports
- manual review can be time-consuming

**SIF Precision** is designed to transform these unstructured reports into structured safety intelligence that can support HSE teams in investigating recurring patterns and prioritizing observations for review.

---

## What the Project Does

The platform is designed to help HSE teams:

- Identify reports with potential for Serious Injury & Fatality (SIF)
- Classify safety observations and incident narratives
- Map observations to relevant Life-Saving Rules
- Identify recurring precursor patterns
- Identify common hazards
- Identify recurring barrier failures
- Compare patterns across sites and activities
- Investigate individual reports
- Support HSE review and prioritization
- Explore safety intelligence through interactive dashboards

The central idea is:

> **Move from simply storing safety reports to discovering meaningful patterns across them.**

---

## Main Workflow

```text
Main Workspace flow: 
Safety Reports → Data Validation & Preprocessing → NLP / Classification → SIF Detection → Life-Saving Rule Mapping → Precursor Detection → Barrier Analysis → Site / Activity Intelligence → HSE Investigation

Core intelligence chain: 
Safety Report → SIF Potential → Life-Saving Rule → Activity → Hazard → Barrier Failure → Precursor Pattern → Site / Facility → HSE Investigation

System Architecture: 
User → React Frontend → FastAPI Backend → Supabase PostgreSQL
                                      ↘
                                        ML / NLP Service
                                      ↙
                              Predictions & Analytics

Bulk data workflow:
CSV / XLSX → File Validation → Schema Detection → Column Mapping → Data Quality Check → Background Processing → NLP Analysis → Predictions → Database → Dashboard

Single report workflow:
Safety Observation → Analyze → SIF Classification → Life-Saving Rule → Hazard / Activity → Barrier Failure → Precursor Pattern → Evidence → HSE Review

Site investigation flow:
Organization → Site → Activity → Life-Saving Rule → Precursor Pattern → Barrier Failure → Matching Reports → Individual Report

ML pipeline:
Raw Text → Cleaning → Feature / Embedding Generation → SIF Classification → Rule Mapping → Entity Extraction → Semantic Pattern Detection → Structured Prediction

HSE review flow:
AI Prediction → HSE Review → Approve / Reject / Reclassify → Reviewer Comment → Corrective Action → Audit Record


Safety Reports → Validation → NLP Analysis → SIF Detection → Life-Saving Rule Mapping → Precursor Detection → Barrier Analysis → Site Intelligence → HSE Action
