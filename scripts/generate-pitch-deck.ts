/**
 * Apex Drone Solutions — Investor Pitch Deck Generator (v2 — Premium Design)
 * Run: npx tsx scripts/generate-pitch-deck.ts
 */

import jsPDF from "jspdf";
import * as fs from "fs";
import * as path from "path";

const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
const W = 297;
const H = 210;

// ─── Brand Colors ────────────────────────────────────────
const NAVY: [number, number, number] = [16, 42, 67]; // #102A43
const NAVY_DARK: [number, number, number] = [10, 28, 48];
const NAVY_MID: [number, number, number] = [25, 55, 88];
const NAVY_LIGHT: [number, number, number] = [40, 75, 115];
const ORANGE: [number, number, number] = [232, 121, 42]; // #E8792A
const ORANGE_LIGHT: [number, number, number] = [245, 166, 100];
const WHITE: [number, number, number] = [255, 255, 255];
const OFF_WHITE: [number, number, number] = [245, 247, 250];
const GRAY_300: [number, number, number] = [180, 190, 205];
const GRAY_500: [number, number, number] = [120, 135, 155];
const GRAY_700: [number, number, number] = [65, 80, 100];
const GREEN: [number, number, number] = [34, 197, 94];
const RED: [number, number, number] = [239, 68, 68];

function setColor(c: [number, number, number]) {
  doc.setTextColor(c[0], c[1], c[2]);
}
function setFill(c: [number, number, number]) {
  doc.setFillColor(c[0], c[1], c[2]);
}
function setDraw(c: [number, number, number]) {
  doc.setDrawColor(c[0], c[1], c[2]);
}

// ─── Logo Drawing ────────────────────────────────────────
function drawLogo(x: number, y: number, scale: number = 1, light: boolean = false) {
  const s = scale;
  // Mountain/roof shape - triangle
  setFill(light ? WHITE : NAVY);
  doc.triangle(x, y - 8 * s, x - 7 * s, y + 2 * s, x + 7 * s, y + 2 * s, "F");
  // Orange drone diamond
  setFill(ORANGE);
  doc.triangle(x + 5 * s, y - 1 * s, x + 4 * s, y, x + 6 * s, y, "F");
  doc.triangle(x + 5 * s, y + 1 * s, x + 4 * s, y, x + 6 * s, y, "F");
}

// ─── Decorative Elements ─────────────────────────────────
function drawDroneGrid(x: number, y: number, w: number, h: number, color: [number, number, number]) {
  setDraw(color);
  doc.setLineWidth(0.15);
  const spacing = 8;
  for (let i = 0; i <= w; i += spacing) {
    doc.line(x + i, y, x + i, y + h);
  }
  for (let j = 0; j <= h; j += spacing) {
    doc.line(x, y + j, x + w, y + j);
  }
}

function drawWaypointMarkers(x: number, y: number, count: number) {
  for (let i = 0; i < count; i++) {
    const mx = x + i * 18 + Math.sin(i * 1.2) * 5;
    const my = y + Math.cos(i * 0.9) * 8;
    setFill(ORANGE);
    doc.circle(mx, my, 1.5, "F");
    setDraw(ORANGE_LIGHT);
    doc.setLineWidth(0.3);
    doc.circle(mx, my, 3, "S");
  }
}

function addSlideNumber(num: number, total: number) {
  doc.setFontSize(7);
  setColor(GRAY_500);
  doc.text(`${num} / ${total}`, W - 12, H - 6, { align: "right" });
}

function addFooterLogo(light: boolean = false) {
  drawLogo(15, H - 7, 0.5, light);
  doc.setFontSize(6);
  setColor(light ? [200, 210, 225] : GRAY_500);
  doc.text("APEX DRONE SOLUTIONS", 22, H - 5.5);
}

// ═══════════════════════════════════════════════════════════
// SLIDE 1: Title — Dark cinematic
// ═══════════════════════════════════════════════════════════
setFill(NAVY_DARK);
doc.rect(0, 0, W, H, "F");

// Subtle grid overlay (drone flight grid feel)
drawDroneGrid(20, 30, 257, 120, [20, 38, 60]);

// Diagonal accent panels
setFill(NAVY_MID);
doc.triangle(0, 140, 0, H, W * 0.4, H, "F");
setFill([18, 35, 56]);
doc.triangle(W * 0.3, H, W, 160, W, H, "F");

// Orange accent bar at top
setFill(ORANGE);
doc.rect(0, 0, W, 3, "F");

// Waypoint markers for drone feel
drawWaypointMarkers(40, 50, 12);

// Logo — large centered
drawLogo(W / 2, 68, 2.5, true);

// Company name
setColor(WHITE);
doc.setFontSize(38);
doc.setFont("helvetica", "bold");
doc.text("APEX DRONE SOLUTIONS", W / 2, 95, { align: "center" });

// Orange underline
setFill(ORANGE);
doc.rect(W / 2 - 50, 99, 100, 1.2, "F");

doc.setFontSize(15);
doc.setFont("helvetica", "normal");
setColor(GRAY_300);
doc.text("AI-Powered Roof Inspection & Claims Platform", W / 2, 112, { align: "center" });

// Bottom info bar
setFill([15, 30, 50]);
doc.roundedRect(W / 2 - 90, 145, 180, 35, 5, 5, "F");
setFill(ORANGE);
doc.rect(W / 2 - 90, 145, 180, 1, "F");

doc.setFontSize(8);
doc.setFont("helvetica", "bold");
setColor(ORANGE);
doc.text("TECHNOLOGY STACK", W / 2, 156, { align: "center" });

doc.setFontSize(8);
doc.setFont("helvetica", "normal");
setColor(GRAY_300);
doc.text("Claude Vision AI  ·  Mapbox Satellite  ·  Turf.js  ·  Three.js  ·  OpenDroneMap", W / 2, 164, { align: "center" });

doc.setFontSize(9);
setColor(GRAY_500);
doc.text("Confidential  ·  March 2026", W / 2, 174, { align: "center" });

addSlideNumber(1, 10);

// ═══════════════════════════════════════════════════════════
// SLIDE 2: The Problem
// ═══════════════════════════════════════════════════════════
doc.addPage();
setFill(WHITE);
doc.rect(0, 0, W, H, "F");

// Left accent panel
setFill(NAVY);
doc.rect(0, 0, 12, H, "F");
setFill(ORANGE);
doc.rect(12, 0, 2, H, "F");

doc.setFontSize(9);
doc.setFont("helvetica", "bold");
setColor(ORANGE);
doc.text("THE PROBLEM", 22, 20);

doc.setFontSize(26);
doc.setFont("helvetica", "bold");
setColor(NAVY);
doc.text("Roof Inspections Are Broken", 22, 36);

setFill(ORANGE);
doc.rect(22, 39, 50, 1, "F");

// Stats — big number cards
const problems = [
  { stat: "3.5M+", label: "property damage claims\nfiled annually in the US" },
  { stat: "$31B", label: "in roof claim costs\nin 2024 (up 30%)" },
  { stat: "42%", label: "catastrophe-related\nrequiring rapid response" },
  { stat: "14-21d", label: "average cycle from loss\nnotice to settlement" },
];

problems.forEach((p, i) => {
  const px = 22 + i * 66;
  const py = 52;

  setFill(i === 1 ? [255, 247, 237] : OFF_WHITE);
  doc.roundedRect(px, py, 60, 50, 3, 3, "F");

  // Top accent bar on card
  setFill(i === 1 ? ORANGE : NAVY_LIGHT);
  doc.rect(px, py, 60, 2, "F");

  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  setColor(i === 1 ? ORANGE : NAVY);
  doc.text(p.stat, px + 30, py + 22, { align: "center" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  setColor(GRAY_700);
  const lines = p.label.split("\n");
  lines.forEach((l, li) => {
    doc.text(l, px + 30, py + 32 + li * 5, { align: "center" });
  });
});

// Pain points dark section
setFill(NAVY);
doc.roundedRect(22, 112, W - 44, 55, 4, 4, "F");

const pains = [
  "Manual inspections risk adjuster safety",
  "Inconsistent damage assessments (±30%)",
  "No standardized measurements across adjusters",
  "Slow claims cycle loses policyholders",
  "Xactimate estimates require manual data entry",
  "No aerial imagery in carrier reports",
];

doc.setFontSize(11);
doc.setFont("helvetica", "bold");
setColor(ORANGE);
doc.text("Current Industry Pain Points", 32, 124);

pains.forEach((p, i) => {
  const col = i < 3 ? 0 : 1;
  const row = i % 3;
  const ppx = 36 + col * 125;
  const ppy = 134 + row * 10;

  setColor(ORANGE);
  doc.setFontSize(8);
  doc.text("▸", ppx - 4, ppy);
  doc.setFont("helvetica", "normal");
  setColor(GRAY_300);
  doc.text(p, ppx + 1, ppy);
});

doc.setFontSize(6);
setColor(GRAY_500);
doc.text("Sources: LexisNexis 2025 Home Insurance Trends Report, III.org, MarketsandMarkets", 22, H - 8);

addFooterLogo();
addSlideNumber(2, 10);

// ═══════════════════════════════════════════════════════════
// SLIDE 3: The Solution — Workflow
// ═══════════════════════════════════════════════════════════
doc.addPage();
setFill(WHITE);
doc.rect(0, 0, W, H, "F");

setFill(NAVY);
doc.rect(0, 0, 12, H, "F");
setFill(ORANGE);
doc.rect(12, 0, 2, H, "F");

doc.setFontSize(9);
doc.setFont("helvetica", "bold");
setColor(ORANGE);
doc.text("THE SOLUTION", 22, 20);

doc.setFontSize(26);
doc.setFont("helvetica", "bold");
setColor(NAVY);
doc.text("End-to-End Drone Inspection Platform", 22, 36);

setFill(ORANGE);
doc.rect(22, 39, 50, 1, "F");

// Workflow steps
const steps = [
  { num: "01", title: "PLAN", subtitle: "Boundary & Flight", desc: "Draw roof on Mapbox satellite.\nAuto-generate drone waypoints\nwith optimal overlap.", color: NAVY as [number, number, number] },
  { num: "02", title: "FLY", subtitle: "Capture & Upload", desc: "Automated grid/crosshatch\npatterns. Upload geo-tagged\nimagery to cloud.", color: NAVY_MID as [number, number, number] },
  { num: "03", title: "ANALYZE", subtitle: "AI Detection", desc: "Claude Vision detects 11\ndamage types with severity\nscoring & confidence.", color: ORANGE as [number, number, number] },
  { num: "04", title: "DELIVER", subtitle: "Measure & Report", desc: "Turf.js measurements,\nPDF reports, Xactimate\nESX with line items.", color: GREEN as [number, number, number] },
];

const stepW = 58;
const stepGap = 8;
const startX = 22;
const stepY = 50;

steps.forEach((s, i) => {
  const x = startX + i * (stepW + stepGap);

  // Card
  setFill(OFF_WHITE);
  doc.roundedRect(x, stepY, stepW, 90, 3, 3, "F");

  // Top color bar
  setFill(s.color);
  doc.roundedRect(x, stepY, stepW, 22, 3, 3, "F");
  doc.rect(x, stepY + 18, stepW, 4, "F");

  // Number
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  setColor(WHITE);
  doc.text(s.num, x + 8, stepY + 13);

  // Title in bar
  doc.setFontSize(12);
  doc.text(s.title, x + 24, stepY + 13);

  // Subtitle
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  setColor(NAVY);
  doc.text(s.subtitle, x + 5, stepY + 32);

  // Description
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  setColor(GRAY_700);
  const lines = s.desc.split("\n");
  lines.forEach((line, li) => {
    doc.text(line, x + 5, stepY + 42 + li * 7);
  });

  // Connection arrow
  if (i < steps.length - 1) {
    setFill(ORANGE);
    const ax = x + stepW + 1;
    const ay = stepY + 45;
    doc.triangle(ax + 5, ay, ax, ay - 3, ax, ay + 3, "F");
    setDraw(ORANGE);
    doc.setLineWidth(0.5);
    doc.line(ax - 2, ay, ax + 1, ay);
  }
});

// Bottom banner
setFill(NAVY);
doc.roundedRect(22, 150, W - 44, 28, 4, 4, "F");
setFill(ORANGE);
doc.rect(22, 150, W - 44, 1, "F");

doc.setFontSize(11);
doc.setFont("helvetica", "bold");
setColor(WHITE);
doc.text("100% Open Source  ·  $0 Software Lock-in  ·  Full Data Ownership", W / 2, 163, { align: "center" });
doc.setFontSize(8);
setColor(GRAY_500);
doc.text("Turf.js  |  jsPDF  |  Three.js  |  JSZip  |  OpenDroneMap  |  Mapbox  |  Claude Vision API", W / 2, 171, { align: "center" });

addFooterLogo();
addSlideNumber(3, 10);

// ═══════════════════════════════════════════════════════════
// SLIDE 4: Market Opportunity
// ═══════════════════════════════════════════════════════════
doc.addPage();
setFill(WHITE);
doc.rect(0, 0, W, H, "F");

setFill(NAVY);
doc.rect(0, 0, 12, H, "F");
setFill(ORANGE);
doc.rect(12, 0, 2, H, "F");

doc.setFontSize(9);
doc.setFont("helvetica", "bold");
setColor(ORANGE);
doc.text("MARKET OPPORTUNITY", 22, 20);

doc.setFontSize(26);
doc.setFont("helvetica", "bold");
setColor(NAVY);
doc.text("$7.2B Addressable Market by 2033", 22, 36);

setFill(ORANGE);
doc.rect(22, 39, 50, 1, "F");

// TAM/SAM/SOM — stacked horizontal bars
const markets = [
  { label: "TAM", value: "$38.2B", desc: "Drone Inspection & Monitoring (all sectors)", growth: "15.1% CAGR → 2030", width: 230 },
  { label: "SAM", value: "$7.24B", desc: "Drone Inspections for Insurance", growth: "18.7% CAGR → 2033", width: 165 },
  { label: "SOM", value: "$889M", desc: "Drone Roof Inspection (direct addressable)", growth: "14.4% CAGR → 2035", width: 100 },
];

let barY = 55;
markets.forEach((m, i) => {
  const barH = 26;
  const barColor: [number, number, number] = i === 0 ? [200, 220, 245] : i === 1 ? [130, 175, 230] : ORANGE;
  const textC: [number, number, number] = i === 2 ? WHITE : NAVY;

  setFill(barColor);
  doc.roundedRect(22, barY, m.width, barH, 3, 3, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  setColor(textC);
  doc.text(m.label, 28, barY + 8);

  doc.setFontSize(18);
  doc.text(m.value, 50, barY + 10);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  setColor(i === 2 ? [255, 220, 190] : GRAY_700);
  doc.text(m.desc, 28, barY + 18);

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  setColor(GREEN);
  doc.text(m.growth, m.width + 28, barY + 12);

  barY += barH + 5;
});

// Market drivers
const driversX = 165;
const driversY = 115;

setFill(OFF_WHITE);
doc.roundedRect(driversX - 5, driversY - 8, 125, 80, 4, 4, "F");

doc.setFontSize(10);
doc.setFont("helvetica", "bold");
setColor(NAVY);
doc.text("Market Drivers", driversX, driversY);

const drivers = [
  { val: "78%", text: "of roof inspectors now use drones" },
  { val: "23.5%", text: "wind claim severity increase (2024)" },
  { val: "$100B", text: "US roofing market" },
  { val: "$109B", text: "commercial drone market by 2030" },
  { val: "64%", text: "of losses from catastrophes (7-yr high)" },
];

let dy = driversY + 10;
drivers.forEach((d) => {
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  setColor(ORANGE);
  doc.text(d.val, driversX, dy);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  setColor(GRAY_700);
  doc.text(d.text, driversX + 32, dy);
  dy += 12;
});

// Adjacent markets
setFill(NAVY);
doc.roundedRect(22, 150, 130, 25, 3, 3, "F");
doc.setFontSize(9);
doc.setFont("helvetica", "bold");
setColor(ORANGE);
doc.text("Adjacent Markets", 28, 160);
doc.setFontSize(8);
doc.setFont("helvetica", "normal");
setColor(GRAY_300);
doc.text("US Roofing: $100B  ·  Commercial Drones: $109B", 28, 168);

doc.setFontSize(6);
setColor(GRAY_500);
doc.text("Sources: MarketsandMarkets, Mordor Intelligence, Fact.MR, Growth Market Reports, III.org", 22, H - 8);

addFooterLogo();
addSlideNumber(4, 10);

// ═══════════════════════════════════════════════════════════
// SLIDE 5: Technology Deep Dive — Dark theme
// ═══════════════════════════════════════════════════════════
doc.addPage();
setFill(NAVY_DARK);
doc.rect(0, 0, W, H, "F");

drawDroneGrid(20, 15, 257, 180, [20, 38, 60]);

setFill(ORANGE);
doc.rect(0, 0, W, 3, "F");

doc.setFontSize(9);
doc.setFont("helvetica", "bold");
setColor(ORANGE);
doc.text("TECHNOLOGY", 22, 18);

doc.setFontSize(26);
doc.setFont("helvetica", "bold");
setColor(WHITE);
doc.text("Full-Stack Open Source Architecture", 22, 34);

setFill(ORANGE);
doc.rect(22, 37, 50, 1, "F");

// Tech stack table
const techRows = [
  { layer: "Frontend", tech: "Next.js 16 + React 19", detail: "App Router, SSR, Tailwind CSS v4" },
  { layer: "Maps & Satellite", tech: "Mapbox GL JS v3", detail: "Satellite imagery, geocoding, polygon drawing" },
  { layer: "Flight Planning", tech: "Turf.js + Mapbox", detail: "Grid/crosshatch/orbit, GSD calc, KML export" },
  { layer: "AI Analysis", tech: "Anthropic Claude Vision", detail: "11 damage types, severity scoring, ~$0.02/img" },
  { layer: "Measurements", tech: "Turf.js", detail: "Area, perimeter, edges, squares, materials" },
  { layer: "3D Modeling", tech: "Three.js + R3F", detail: "GLB/glTF viewer, orbit controls, wireframe" },
  { layer: "Photogrammetry", tech: "OpenDroneMap / WebODM", detail: "Orthophoto, DSM, DTM, point cloud, mesh" },
  { layer: "Reports", tech: "jsPDF + autotable", detail: "Branded multi-page PDF with measurements" },
  { layer: "Xactimate", tech: "JSZip (ESX format)", detail: "R&R line items, Xactimate category codes" },
  { layer: "Database", tech: "Supabase (Postgres)", detail: "Auth, RLS, Storage, real-time subscriptions" },
  { layer: "Deployment", tech: "Vercel + GitHub", detail: "Auto-deploy, edge CDN, serverless functions" },
];

let ty = 46;
// Header row
setFill(ORANGE);
doc.roundedRect(22, ty, W - 44, 8, 2, 2, "F");
doc.setFontSize(7);
doc.setFont("helvetica", "bold");
setColor(WHITE);
doc.text("LAYER", 28, ty + 5.5);
doc.text("TECHNOLOGY", 85, ty + 5.5);
doc.text("DETAILS", 165, ty + 5.5);
ty += 9;

techRows.forEach((row, i) => {
  const isAI = row.layer === "AI Analysis";
  if (isAI) {
    setFill([40, 55, 75]);
  } else if (i % 2 === 0) {
    setFill([18, 35, 56]);
  } else {
    setFill(NAVY_DARK);
  }
  doc.rect(22, ty, W - 44, 10, "F");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  setColor(isAI ? ORANGE : GRAY_300);
  doc.text(row.layer, 28, ty + 6.5);

  setColor(isAI ? ORANGE_LIGHT : [140, 180, 230]);
  doc.text(row.tech, 85, ty + 6.5);

  doc.setFont("helvetica", "normal");
  setColor(GRAY_500);
  doc.text(row.detail, 165, ty + 6.5);

  ty += 10;
});

// Cost callout
setFill([20, 60, 40]);
doc.roundedRect(22, ty + 4, W - 44, 16, 3, 3, "F");
setFill(GREEN);
doc.rect(22, ty + 4, W - 44, 1, "F");
doc.setFontSize(9);
doc.setFont("helvetica", "bold");
setColor(GREEN);
doc.text("Total Software Cost: $0/mo (all open source)", 32, ty + 12);
doc.setFontSize(8);
doc.setFont("helvetica", "normal");
setColor(GRAY_500);
doc.text("Infrastructure: Vercel ($20) + Supabase ($25) + Claude API (usage) + Mapbox (usage) = ~$100-200/mo at scale", 32, ty + 18);

addFooterLogo(true);
addSlideNumber(5, 10);

// ═══════════════════════════════════════════════════════════
// SLIDE 6: Competitive Landscape
// ═══════════════════════════════════════════════════════════
doc.addPage();
setFill(WHITE);
doc.rect(0, 0, W, H, "F");

setFill(NAVY);
doc.rect(0, 0, 12, H, "F");
setFill(ORANGE);
doc.rect(12, 0, 2, H, "F");

doc.setFontSize(9);
doc.setFont("helvetica", "bold");
setColor(ORANGE);
doc.text("COMPETITIVE LANDSCAPE", 22, 20);

doc.setFontSize(26);
doc.setFont("helvetica", "bold");
setColor(NAVY);
doc.text("Positioned Against $1B+ Incumbents", 22, 36);

setFill(ORANGE);
doc.rect(22, 39, 50, 1, "F");

// Competitor cards
const competitors = [
  { name: "EagleView", val: "~$1B", model: "Aerial imagery monopoly", weak: "Closed, high cost, no AI" },
  { name: "IMGING", val: "Undisclosed", model: "DJI app + AI + 3D", weak: "Proprietary, carrier-locked" },
  { name: "Hover", val: "$490M", model: "Smartphone 3D capture", weak: "No drone, no damage detect" },
  { name: "Nearmap", val: "$690M", model: "Satellite/aerial imagery", weak: "No on-site, no claims flow" },
  { name: "DroneDeploy", val: "$75M ARR", model: "General drone platform", weak: "Not insurance, no Xactimate" },
];

const cardW = 50;
competitors.forEach((c, i) => {
  const cx = 22 + i * (cardW + 4);
  const cy2 = 50;

  setFill(OFF_WHITE);
  doc.roundedRect(cx, cy2, cardW, 60, 3, 3, "F");

  // Top bar
  setFill(GRAY_300);
  doc.roundedRect(cx, cy2, cardW, 12, 3, 3, "F");
  doc.rect(cx, cy2 + 8, cardW, 4, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  setColor(NAVY);
  doc.text(c.name, cx + cardW / 2, cy2 + 8, { align: "center" });

  doc.setFontSize(11);
  setColor(NAVY);
  doc.text(c.val, cx + cardW / 2, cy2 + 24, { align: "center" });

  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  setColor(GRAY_700);
  doc.text(c.model, cx + 4, cy2 + 34);

  doc.setFontSize(6.5);
  setColor(RED);
  doc.text(c.weak, cx + 4, cy2 + 44);
});

// Apex card — highlighted
const apexX = 22;
const apexY = 118;
setFill(NAVY);
doc.roundedRect(apexX, apexY, W - 44, 40, 4, 4, "F");
setFill(ORANGE);
doc.rect(apexX, apexY, W - 44, 2, "F");

drawLogo(apexX + 16, apexY + 18, 1, true);

doc.setFontSize(14);
doc.setFont("helvetica", "bold");
setColor(WHITE);
doc.text("Apex Drone Solutions", apexX + 32, apexY + 16);

doc.setFontSize(9);
doc.setFont("helvetica", "normal");
setColor(ORANGE);
doc.text("Open source, full-stack platform — 10x lower cost than incumbents", apexX + 32, apexY + 24);

// Feature checkmarks
const features = [
  "AI Damage Detection", "Auto Measurements", "Xactimate ESX", "3D Modeling",
  "Flight Planning", "PDF Reports", "Satellite Maps", "Full Data Ownership"
];

features.forEach((f, i) => {
  const fx = apexX + 32 + i * 30;
  const fy = apexY + 33;
  doc.setFontSize(5.5);
  setColor(GREEN);
  doc.text("✓", fx, fy);
  setColor(GRAY_300);
  doc.text(f, fx + 3, fy);
});

// Differentiator
setFill(OFF_WHITE);
doc.roundedRect(22, 165, W - 44, 20, 3, 3, "F");
doc.setFontSize(8);
doc.setFont("helvetica", "bold");
setColor(NAVY);
doc.text("Key Differentiator:", 28, 175);
doc.setFont("helvetica", "normal");
setColor(GRAY_700);
doc.text("Only platform combining AI damage detection + automated measurements + Xactimate ESX export + flight planning in one open-source workflow.", 68, 175);

addFooterLogo();
addSlideNumber(6, 10);

// ═══════════════════════════════════════════════════════════
// SLIDE 7: Unit Economics
// ═══════════════════════════════════════════════════════════
doc.addPage();
setFill(WHITE);
doc.rect(0, 0, W, H, "F");

setFill(NAVY);
doc.rect(0, 0, 12, H, "F");
setFill(ORANGE);
doc.rect(12, 0, 2, H, "F");

doc.setFontSize(9);
doc.setFont("helvetica", "bold");
setColor(ORANGE);
doc.text("UNIT ECONOMICS", 22, 20);

doc.setFontSize(26);
doc.setFont("helvetica", "bold");
setColor(NAVY);
doc.text("Platform Revenue Model", 22, 36);

setFill(ORANGE);
doc.rect(22, 39, 50, 1, "F");

// Revenue stream cards
const streams = [
  { name: "Per-Inspection Fee", price: "$49-149", unit: "per job", desc: "SaaS fee per completed inspection", volume: "Target: 500 jobs/mo by Year 2", color: NAVY as [number, number, number] },
  { name: "AI Analysis Add-on", price: "$8", unit: "per job", desc: "Claude Vision ($0.02/img x 40 = $2.40 COGS)", volume: "3x markup on API pass-through", color: ORANGE as [number, number, number] },
  { name: "Report Exports", price: "$25", unit: "per report", desc: "PDF + Xactimate ESX generation", volume: "85% conversion rate", color: NAVY_MID as [number, number, number] },
  { name: "Photogrammetry", price: "$50-200", unit: "per job", desc: "3D model generation via WebODM", volume: "Premium tier, 30% of jobs", color: NAVY_LIGHT as [number, number, number] },
];

streams.forEach((s, i) => {
  const sx = 22 + i * 66;
  const sy = 52;

  setFill(OFF_WHITE);
  doc.roundedRect(sx, sy, 60, 60, 3, 3, "F");

  // Color top
  setFill(s.color);
  doc.roundedRect(sx, sy, 60, 18, 3, 3, "F");
  doc.rect(sx, sy + 14, 60, 4, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  setColor(WHITE);
  doc.text(s.name, sx + 30, sy + 10, { align: "center" });

  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  setColor(NAVY);
  doc.text(s.price, sx + 30, sy + 32, { align: "center" });

  doc.setFontSize(7);
  setColor(GRAY_500);
  doc.text(s.unit, sx + 30, sy + 38, { align: "center" });

  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  setColor(GRAY_700);
  doc.text(s.desc, sx + 4, sy + 48);
  doc.setFontSize(6);
  setColor(GRAY_500);
  doc.text(s.volume, sx + 4, sy + 55);
});

// Margin section
setFill(NAVY);
doc.roundedRect(22, 120, W - 44, 55, 4, 4, "F");
setFill(ORANGE);
doc.rect(22, 120, W - 44, 1, "F");

doc.setFontSize(12);
doc.setFont("helvetica", "bold");
setColor(WHITE);
doc.text("Gross Margin Targets", 32, 135);

// Margin bars
const margins = [
  { label: "Software Revenue", val: 92 },
  { label: "AI Analysis", val: 70 },
  { label: "Photogrammetry", val: 55 },
  { label: "Blended Target", val: 78 },
];

margins.forEach((m, i) => {
  const mx = 32;
  const mmY = 143 + i * 8;
  const barMaxW = 140;

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  setColor(GRAY_300);
  doc.text(m.label, mx, mmY);

  // Bar background
  setFill([25, 45, 70]);
  doc.roundedRect(mx + 55, mmY - 3.5, barMaxW, 5, 1.5, 1.5, "F");

  // Bar fill
  setFill(i === 3 ? ORANGE : GREEN);
  doc.roundedRect(mx + 55, mmY - 3.5, barMaxW * m.val / 100, 5, 1.5, 1.5, "F");

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  setColor(WHITE);
  doc.text(`${m.val}%`, mx + 55 + barMaxW * m.val / 100 + 3, mmY);
});

// Revenue projection
doc.setFontSize(11);
doc.setFont("helvetica", "bold");
setColor(ORANGE);
doc.text("Year 2 Revenue Projection", 220, 135);

const projections = [
  { label: "Monthly Jobs", val: "500" },
  { label: "Avg Rev/Job", val: "$127" },
  { label: "Monthly Revenue", val: "$63.5K" },
  { label: "Annual Run Rate", val: "$762K" },
];

let projY = 143;
projections.forEach((p) => {
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  setColor(GRAY_300);
  doc.text(p.label, 220, projY);

  doc.setFont("helvetica", "bold");
  setColor(p.label === "Annual Run Rate" ? ORANGE : WHITE);
  doc.text(p.val, 268, projY, { align: "right" });
  projY += 8;
});

addFooterLogo();
addSlideNumber(7, 10);

// ═══════════════════════════════════════════════════════════
// SLIDE 8: Traction & Roadmap
// ═══════════════════════════════════════════════════════════
doc.addPage();
setFill(WHITE);
doc.rect(0, 0, W, H, "F");

setFill(NAVY);
doc.rect(0, 0, 12, H, "F");
setFill(ORANGE);
doc.rect(12, 0, 2, H, "F");

doc.setFontSize(9);
doc.setFont("helvetica", "bold");
setColor(ORANGE);
doc.text("TRACTION & ROADMAP", 22, 20);

doc.setFontSize(26);
doc.setFont("helvetica", "bold");
setColor(NAVY);
doc.text("Built & Deployed — Ready to Scale", 22, 36);

setFill(ORANGE);
doc.rect(22, 39, 50, 1, "F");

// What's live
doc.setFontSize(11);
doc.setFont("helvetica", "bold");
setColor(NAVY);
doc.text("What's Live Today", 22, 54);

const live = [
  "Full SaaS platform on Vercel (production)",
  "Mapbox satellite mapping + roof boundary",
  "Automated flight planning with KML export",
  "AI damage detection (11 types, severity)",
  "Automated roof measurements",
  "PDF report generation (branded)",
  "Xactimate ESX export with line items",
  "3D model viewer (Three.js)",
  "Supabase auth, storage, Postgres",
];

let ly = 62;
doc.setFontSize(8);
live.forEach((item) => {
  setFill(GREEN);
  doc.circle(28, ly - 1.5, 1.5, "F");
  doc.setFont("helvetica", "normal");
  setColor(GRAY_700);
  doc.text(item, 33, ly);
  ly += 9;
});

// Roadmap timeline
doc.setFontSize(11);
doc.setFont("helvetica", "bold");
setColor(NAVY);
doc.text("Roadmap", 165, 54);

setDraw(ORANGE);
doc.setLineWidth(0.8);
doc.line(172, 60, 172, 155);

const roadmap = [
  { q: "Q2 2026", items: ["Beta: 5 roofing contractors", "Carrier report templates"] },
  { q: "Q3 2026", items: ["Mobile companion app (RN)", "DJI SDK guided flights"] },
  { q: "Q4 2026", items: ["Carrier API integrations", "Xactimate pricing lookups"] },
  { q: "2027", items: ["Multi-peril (wind, hail, fire)", "Enterprise SaaS + teams"] },
];

let ry = 68;
roadmap.forEach((r) => {
  setFill(ORANGE);
  doc.circle(172, ry, 2.5, "F");
  setFill(WHITE);
  doc.circle(172, ry, 1.2, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  setColor(ORANGE);
  doc.text(r.q, 178, ry + 1);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  setColor(GRAY_700);
  r.items.forEach((item, ii) => {
    doc.text("· " + item, 178, ry + 8 + ii * 6);
  });

  ry += 24;
});

addFooterLogo();
addSlideNumber(8, 10);

// ═══════════════════════════════════════════════════════════
// SLIDE 9: Go-to-Market
// ═══════════════════════════════════════════════════════════
doc.addPage();
setFill(WHITE);
doc.rect(0, 0, W, H, "F");

setFill(NAVY);
doc.rect(0, 0, 12, H, "F");
setFill(ORANGE);
doc.rect(12, 0, 2, H, "F");

doc.setFontSize(9);
doc.setFont("helvetica", "bold");
setColor(ORANGE);
doc.text("GO-TO-MARKET", 22, 20);

doc.setFontSize(26);
doc.setFont("helvetica", "bold");
setColor(NAVY);
doc.text("Land & Expand: Roofing → Insurance", 22, 36);

setFill(ORANGE);
doc.rect(22, 39, 50, 1, "F");

// Three phase cards
const phases = [
  {
    phase: "PHASE 1", title: "Roofing Contractors",
    timeline: "Now → Q3 2026",
    target: "50,000+ roofing companies",
    pain: "Manual estimates, inconsistent reports",
    hook: "Free flight planning + measurements",
    convert: "$99/mo SaaS for AI + reports",
    color: ORANGE as [number, number, number],
  },
  {
    phase: "PHASE 2", title: "Independent Adjusters",
    timeline: "Q3 2026 → Q1 2027",
    target: "75,000+ independent adjusters",
    pain: "Slow inspection cycle, no tech tools",
    hook: "Xactimate ESX auto-export",
    convert: "$149/mo + per-inspection fees",
    color: NAVY_MID as [number, number, number],
  },
  {
    phase: "PHASE 3", title: "Insurance Carriers",
    timeline: "2027+",
    target: "Top 25 P&C carriers",
    pain: "$31B/yr claims cost, 42% CAT",
    hook: "API integration, branded reports",
    convert: "Enterprise SaaS ($5-50K/mo)",
    color: NAVY as [number, number, number],
  },
];

const phaseW = 82;
phases.forEach((p, i) => {
  const px = 22 + i * (phaseW + 6);
  const py = 50;

  setFill(OFF_WHITE);
  doc.roundedRect(px, py, phaseW, 92, 4, 4, "F");

  setFill(p.color);
  doc.roundedRect(px, py, phaseW, 22, 4, 4, "F");
  doc.rect(px, py + 18, phaseW, 4, "F");

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  setColor(i === 0 ? NAVY_DARK : WHITE);
  doc.text(p.phase, px + 5, py + 8);

  doc.setFontSize(10);
  setColor(WHITE);
  doc.text(p.title, px + 5, py + 17);

  doc.setFontSize(7);
  setColor(ORANGE);
  doc.text(p.timeline, px + 5, py + 30);

  const details = [
    { label: "Target:", val: p.target },
    { label: "Pain:", val: p.pain },
    { label: "Hook:", val: p.hook },
    { label: "Convert:", val: p.convert },
  ];

  let ddy = py + 38;
  details.forEach((d) => {
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    setColor(NAVY);
    doc.text(d.label, px + 5, ddy);
    doc.setFont("helvetica", "normal");
    setColor(GRAY_700);
    doc.text(d.val, px + 5, ddy + 5);
    ddy += 13;
  });

  if (i < phases.length - 1) {
    setFill(ORANGE);
    const ax = px + phaseW + 1;
    const ay2 = py + 45;
    doc.triangle(ax + 4, ay2, ax, ay2 - 2.5, ax, ay2 + 2.5, "F");
  }
});

// Bottom stats bar
setFill(NAVY);
doc.roundedRect(22, 150, W - 44, 30, 4, 4, "F");
setFill(ORANGE);
doc.rect(22, 150, W - 44, 1, "F");

const gtmStats = [
  { val: "78%", label: "of inspectors use drones" },
  { val: "45%", label: "faster with AI assistance" },
  { val: "60%", label: "cost reduction vs manual" },
  { val: "25%", label: "annual market growth" },
];

gtmStats.forEach((s, i) => {
  const gx = 42 + i * 63;
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  setColor(ORANGE);
  doc.text(s.val, gx, 164);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  setColor(GRAY_300);
  doc.text(s.label, gx, 171);
});

addFooterLogo();
addSlideNumber(9, 10);

// ═══════════════════════════════════════════════════════════
// SLIDE 10: The Ask — Dark cinematic close
// ═══════════════════════════════════════════════════════════
doc.addPage();
setFill(NAVY_DARK);
doc.rect(0, 0, W, H, "F");

drawDroneGrid(20, 30, 257, 120, [20, 38, 60]);

setFill(ORANGE);
doc.rect(0, 0, W, 3, "F");

drawWaypointMarkers(30, 40, 14);

doc.setFontSize(9);
doc.setFont("helvetica", "bold");
setColor(ORANGE);
doc.text("THE OPPORTUNITY", 22, 22);

doc.setFontSize(30);
doc.setFont("helvetica", "bold");
setColor(WHITE);
doc.text("Invest in the Future of", W / 2, 60, { align: "center" });
doc.text("Property Inspection", W / 2, 74, { align: "center" });

setFill(ORANGE);
doc.rect(W / 2 - 40, 80, 80, 1.2, "F");

// Key investment points
const askPoints = [
  "Full platform built and deployed — not a prototype",
  "$889M direct TAM growing at 14.4% CAGR",
  "10x cost advantage vs. incumbents (open source stack)",
  "Revenue model proven in adjacent SaaS markets",
  "78% industry adoption — at the inflection point",
];

let ay = 95;
doc.setFontSize(11);
askPoints.forEach((p) => {
  setFill(ORANGE);
  doc.triangle(55, ay - 2, 52, ay - 4, 52, ay, "F");
  doc.setFont("helvetica", "normal");
  setColor(WHITE);
  doc.text(p, 60, ay);
  ay += 13;
});

// Bottom CTA box
setFill([15, 30, 50]);
doc.roundedRect(W / 2 - 75, 160, 150, 35, 5, 5, "F");
setFill(ORANGE);
doc.rect(W / 2 - 75, 160, 150, 1.5, "F");

drawLogo(W / 2, 175, 1.5, true);

doc.setFontSize(14);
doc.setFont("helvetica", "bold");
setColor(WHITE);
doc.text("APEX DRONE SOLUTIONS", W / 2, 185, { align: "center" });

doc.setFontSize(9);
setColor(GRAY_300);
doc.text("apexdronesolutions.com", W / 2, 192, { align: "center" });

addSlideNumber(10, 10);

// ═══════════════════════════════════════════════════════════
// Save
// ═══════════════════════════════════════════════════════════
const output = doc.output("arraybuffer");
const outPath = path.join(process.cwd(), "Apex_Drone_Solutions_Pitch_Deck.pdf");
fs.writeFileSync(outPath, Buffer.from(output));
console.log(`\n✅ Pitch deck saved to: ${outPath}`);
console.log(`   10 slides, ${Math.round(Buffer.from(output).length / 1024)}KB`);
