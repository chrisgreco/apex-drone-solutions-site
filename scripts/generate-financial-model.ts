/**
 * Apex Drone Solutions — 5-Year Financial Model Generator
 * Generates a fully linked Excel workbook with:
 *   1. Assumptions (all inputs)
 *   2. Startup Costs
 *   3. P&L (linked to assumptions)
 *   4. Cash Flow
 *   5. Exit Valuation
 *
 * Run: npx tsx scripts/generate-financial-model.ts
 */

import ExcelJS from "exceljs";
import path from "path";

const YEARS = [2027, 2028, 2029, 2030, 2031];
const FILE = path.join(process.cwd(), "Apex_Drone_Solutions_Financial_Model.xlsx");

// ── Styles ──────────────────────────────────────────────
const navy = "102A43";
const green = "16A34A";
const orange = "E8792A";
const lightGreen = "F0FDF4";
const lightBlue = "F0F4F8";
const lightOrange = "FFF8F0";
const lightGray = "F7F7F5";

const headerFill: ExcelJS.Fill = { type: "pattern", pattern: "solid", fgColor: { argb: navy } };
const headerFont: Partial<ExcelJS.Font> = { bold: true, color: { argb: "FFFFFF" }, size: 11, name: "Calibri" };
const sectionFont: Partial<ExcelJS.Font> = { bold: true, color: { argb: navy }, size: 11, name: "Calibri" };
const inputFill: ExcelJS.Fill = { type: "pattern", pattern: "solid", fgColor: { argb: lightGreen } };
const calcFill: ExcelJS.Fill = { type: "pattern", pattern: "solid", fgColor: { argb: lightBlue } };
const totalFill: ExcelJS.Fill = { type: "pattern", pattern: "solid", fgColor: { argb: lightGray } };
const accentFill: ExcelJS.Fill = { type: "pattern", pattern: "solid", fgColor: { argb: lightOrange } };
const borderThin: Partial<ExcelJS.Borders> = {
  top: { style: "thin", color: { argb: "D0D0D0" } },
  bottom: { style: "thin", color: { argb: "D0D0D0" } },
  left: { style: "thin", color: { argb: "D0D0D0" } },
  right: { style: "thin", color: { argb: "D0D0D0" } },
};

function dollarFmt(ws: ExcelJS.Worksheet, row: number, cols: number[]) {
  cols.forEach((c) => {
    const cell = ws.getCell(row, c);
    cell.numFmt = '$#,##0';
    cell.border = borderThin;
  });
}
function pctFmt(ws: ExcelJS.Worksheet, row: number, cols: number[]) {
  cols.forEach((c) => {
    const cell = ws.getCell(row, c);
    cell.numFmt = '0.0%';
    cell.border = borderThin;
  });
}
function numFmt(ws: ExcelJS.Worksheet, row: number, cols: number[]) {
  cols.forEach((c) => {
    const cell = ws.getCell(row, c);
    cell.numFmt = '#,##0';
    cell.border = borderThin;
  });
}

function setHeader(ws: ExcelJS.Worksheet, row: number, values: (string | number)[], startCol = 1) {
  values.forEach((v, i) => {
    const cell = ws.getCell(row, startCol + i);
    cell.value = v;
    cell.fill = headerFill;
    cell.font = headerFont;
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = borderThin;
  });
}

function setSection(ws: ExcelJS.Worksheet, row: number, label: string) {
  const cell = ws.getCell(row, 1);
  cell.value = label;
  cell.font = { ...sectionFont, size: 12 };
  cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "E8E8E8" } };
  cell.border = borderThin;
}

function setLabel(ws: ExcelJS.Worksheet, row: number, label: string, bold = false) {
  const cell = ws.getCell(row, 1);
  cell.value = label;
  cell.font = { name: "Calibri", size: 10, bold };
  cell.border = borderThin;
}

function setInputRow(ws: ExcelJS.Worksheet, row: number, label: string, values: (number | string)[], fmt: "dollar" | "pct" | "num" | "text" = "num") {
  setLabel(ws, row, label);
  const yrCols = [2, 3, 4, 5, 6];
  values.forEach((v, i) => {
    const cell = ws.getCell(row, yrCols[i]);
    cell.value = v;
    cell.fill = inputFill;
    cell.border = borderThin;
    cell.alignment = { horizontal: "center" };
    if (fmt === "dollar") cell.numFmt = '$#,##0';
    else if (fmt === "pct") cell.numFmt = '0.0%';
    else if (fmt === "num") cell.numFmt = '#,##0';
  });
}

function setFormulaRow(ws: ExcelJS.Worksheet, row: number, label: string, formulas: string[], fmt: "dollar" | "pct" | "num" = "num", isBold = false, fill?: ExcelJS.Fill) {
  setLabel(ws, row, label, isBold);
  const yrCols = [2, 3, 4, 5, 6];
  formulas.forEach((f, i) => {
    const cell = ws.getCell(row, yrCols[i]);
    cell.value = { formula: f };
    cell.fill = fill || calcFill;
    cell.border = borderThin;
    cell.alignment = { horizontal: "center" };
    cell.font = { name: "Calibri", size: 10, bold: isBold };
    if (fmt === "dollar") cell.numFmt = '$#,##0';
    else if (fmt === "pct") cell.numFmt = '0.0%';
    else if (fmt === "num") cell.numFmt = '#,##0';
  });
}

// ── Column letters for year columns (B-F) ──────────────
const YC = ["B", "C", "D", "E", "F"];
const A = "Assumptions"; // sheet ref

async function main() {
  const wb = new ExcelJS.Workbook();
  wb.creator = "Apex Drone Solutions Financial Model";
  wb.created = new Date();

  // ╔══════════════════════════════════════════════════════╗
  // ║  TAB 1: ASSUMPTIONS                                 ║
  // ╚══════════════════════════════════════════════════════╝
  const as = wb.addWorksheet("Assumptions", { properties: { tabColor: { argb: green } } });
  as.columns = [
    { width: 40 },
    { width: 16 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 16 },
    { width: 5 },
    { width: 30 },
  ];

  let r = 1;
  as.mergeCells(r, 1, r, 6);
  const titleCell = as.getCell(r, 1);
  titleCell.value = "APEX DRONE SOLUTIONS — 5-YEAR FINANCIAL MODEL ASSUMPTIONS";
  titleCell.font = { bold: true, size: 14, color: { argb: navy }, name: "Calibri" };
  titleCell.alignment = { horizontal: "center" };

  r = 2;
  as.getCell(r, 1).value = "Green cells = editable inputs. Blue cells = calculated.";
  as.getCell(r, 1).font = { italic: true, size: 9, color: { argb: "666666" }, name: "Calibri" };

  r = 4;
  setHeader(as, r, ["Assumption", ...YEARS]);

  // ── Revenue Assumptions ──────────────────────────────
  r = 5; setSection(as, r, "REVENUE ASSUMPTIONS");
  r = 6; setInputRow(as, r, "Total Client Acres (contracted)", [3000, 6000, 10000, 14000, 18000]);
  r = 7; setInputRow(as, r, "Avg Spray Passes per Season", [8, 8, 9, 9, 10]);
  r = 8; setFormulaRow(as, r, "Total Acre-Passes", YC.map((c) => `${c}6*${c}7`));
  r = 9; setInputRow(as, r, "Revenue per Acre-Pass", [16, 15.5, 15, 15, 14.5], "dollar");
  r = 10; setInputRow(as, r, "NDVI Mapping Revenue", [5000, 15000, 30000, 45000, 60000], "dollar");
  r = 11; setInputRow(as, r, "Cover Crop Seeding Revenue", [0, 10000, 25000, 40000, 55000], "dollar");
  r = 12; setFormulaRow(as, r, "TOTAL REVENUE", YC.map((c) => `${c}8*${c}9+${c}10+${c}11`), "dollar", true, totalFill);

  // ── Fleet & Capacity ─────────────────────────────────
  r = 14; setSection(as, r, "FLEET & CAPACITY");
  r = 15; setInputRow(as, r, "Number of Drones (DJI T25)", [2, 3, 4, 5, 6]);
  r = 16; setInputRow(as, r, "Acres per Drone per Day", [250, 250, 250, 260, 270]);
  r = 17; setInputRow(as, r, "Operational Days per Season", [100, 110, 115, 120, 125]);
  r = 18; setFormulaRow(as, r, "Fleet Capacity (acre-passes)", YC.map((c) => `${c}15*${c}16*${c}17`));
  r = 19; setFormulaRow(as, r, "Utilization Rate", YC.map((c) => `${c}8/${c}18`), "pct");

  // ── Staffing ──────────────────────────────────────────
  r = 21; setSection(as, r, "STAFFING");
  r = 22; setInputRow(as, r, "Drone Pilots (W-2)", [1, 2, 3, 4, 5]);
  r = 23; setInputRow(as, r, "Ground Crew", [1, 1, 2, 2, 3]);
  r = 24; setInputRow(as, r, "Owner Salary (you)", [50000, 65000, 85000, 100000, 120000], "dollar");
  r = 25; setInputRow(as, r, "Pilot Salary (avg per person)", [55000, 58000, 60000, 62000, 65000], "dollar");
  r = 26; setInputRow(as, r, "Ground Crew Wage (avg/person)", [38000, 40000, 42000, 44000, 46000], "dollar");
  r = 27; setInputRow(as, r, "Per-Acre Pilot Bonus ($/acre-pass)", [1.5, 1.5, 1.5, 1.5, 1.5], "dollar");
  r = 28; setInputRow(as, r, "Payroll Tax & Benefits Rate", [0.18, 0.20, 0.22, 0.22, 0.22], "pct");

  // ── Direct Costs ──────────────────────────────────────
  r = 30; setSection(as, r, "DIRECT COSTS (COGS)");
  r = 31; setInputRow(as, r, "Chemical Cost per Acre-Pass (client-supplied %)", [0, 0, 0, 0, 0], "dollar");
  r = 32; setInputRow(as, r, "Battery Replacement Cost / Year", [8000, 12000, 18000, 22000, 28000], "dollar");
  r = 33; setInputRow(as, r, "Drone Maintenance & Repairs / Year", [4000, 8000, 14000, 18000, 24000], "dollar");
  r = 34; setInputRow(as, r, "Fuel (Trucks) / Year", [8000, 12000, 16000, 20000, 24000], "dollar");
  r = 35; setInputRow(as, r, "RTK / Software Subscriptions / Year", [3000, 4000, 5000, 6000, 7000], "dollar");
  r = 36; setInputRow(as, r, "PPE & Consumables / Year", [2000, 3000, 4000, 5000, 6000], "dollar");

  // ── Operating Expenses ────────────────────────────────
  r = 38; setSection(as, r, "OPERATING EXPENSES");
  r = 39; setInputRow(as, r, "Insurance (Liability + Equipment)", [15000, 20000, 28000, 35000, 40000], "dollar");
  r = 40; setInputRow(as, r, "Truck Lease / Payment (per truck/yr)", [18000, 18000, 18000, 18000, 18000], "dollar");
  r = 41; setInputRow(as, r, "Number of Trucks", [1, 2, 2, 3, 3]);
  r = 42; setInputRow(as, r, "Trailer Lease / Year", [3600, 7200, 7200, 10800, 10800], "dollar");
  r = 43; setInputRow(as, r, "Storage / Shop Rent (monthly)", [500, 800, 1200, 1500, 2000], "dollar");
  r = 44; setInputRow(as, r, "Licensing & Compliance (FAA, NJ, EPA)", [3000, 2000, 2500, 3000, 3000], "dollar");
  r = 45; setInputRow(as, r, "Marketing & Sales", [5000, 8000, 12000, 15000, 18000], "dollar");
  r = 46; setInputRow(as, r, "Website & Software (CRM, accounting)", [3000, 4000, 5000, 6000, 7000], "dollar");
  r = 47; setInputRow(as, r, "Legal & Professional Fees", [5000, 4000, 5000, 6000, 7000], "dollar");
  r = 48; setInputRow(as, r, "Office / Admin / Misc", [3000, 4000, 5000, 6000, 7000], "dollar");
  r = 49; setInputRow(as, r, "WOTC Tax Credit (veteran hires)", [-4800, -9600, -9600, -9600, -9600], "dollar");

  // ── Capital Expenditure ───────────────────────────────
  r = 51; setSection(as, r, "CAPITAL EXPENDITURES");
  r = 52; setInputRow(as, r, "New Drone Purchases (qty)", [2, 1, 1, 1, 1]);
  r = 53; setInputRow(as, r, "Cost per Drone (DJI T25 + batteries)", [22000, 22000, 23000, 23000, 24000], "dollar");
  r = 54; setInputRow(as, r, "Truck Down Payment / Purchase", [15000, 25000, 0, 25000, 0], "dollar");
  r = 55; setInputRow(as, r, "Trailer Purchase", [8000, 8000, 0, 8000, 0], "dollar");
  r = 56; setInputRow(as, r, "RTK Base Station", [6000, 0, 0, 6000, 0], "dollar");
  r = 57; setInputRow(as, r, "Generator & Field Equipment", [4000, 2000, 2000, 2000, 2000], "dollar");
  r = 58; setInputRow(as, r, "Other Startup (LLC, initial marketing, PPE)", [8000, 0, 0, 0, 0], "dollar");
  r = 59; setFormulaRow(as, r, "TOTAL CAPEX", YC.map((c) => `${c}52*${c}53+${c}54+${c}55+${c}56+${c}57+${c}58`), "dollar", true, totalFill);

  // ── Depreciation ──────────────────────────────────────
  r = 61; setSection(as, r, "DEPRECIATION & AMORTIZATION");
  r = 62; setInputRow(as, r, "Drone Useful Life (years)", [3, 3, 3, 3, 3]);
  r = 63; setInputRow(as, r, "Vehicle Useful Life (years)", [7, 7, 7, 7, 7]);
  r = 64; setInputRow(as, r, "Equipment Useful Life (years)", [5, 5, 5, 5, 5]);

  // ── Exit / Valuation ──────────────────────────────────
  r = 66; setSection(as, r, "EXIT / VALUATION ASSUMPTIONS");
  r = 67; setInputRow(as, r, "Target Exit Year", [0, 0, 0, 0, 2031]);
  r = 68; setInputRow(as, r, "EBITDA Multiple (services business)", [4, 4, 5, 5, 6]);
  r = 69; setInputRow(as, r, "Revenue Multiple (high-growth alternative)", [1.5, 1.5, 2, 2, 2.5]);
  r = 70; setInputRow(as, r, "Annual Revenue Growth Rate", [0, 0.80, 0.50, 0.30, 0.20], "pct");
  r = 71; setInputRow(as, r, "Tax Rate (federal + NJ state)", [0.30, 0.30, 0.30, 0.30, 0.30], "pct");

  // ╔══════════════════════════════════════════════════════╗
  // ║  TAB 2: STARTUP COSTS                               ║
  // ╚══════════════════════════════════════════════════════╝
  const sc = wb.addWorksheet("Startup Costs", { properties: { tabColor: { argb: orange } } });
  sc.columns = [{ width: 45 }, { width: 14 }, { width: 10 }, { width: 16 }, { width: 30 }];

  r = 1;
  sc.mergeCells(r, 1, r, 4);
  sc.getCell(r, 1).value = "PRE-LAUNCH STARTUP COSTS (Q4 2026 Preparation)";
  sc.getCell(r, 1).font = { bold: true, size: 14, color: { argb: navy }, name: "Calibri" };

  r = 3;
  setHeader(sc, r, ["Item", "Unit Cost", "Qty", "Total", "Notes"], 1);

  const startupItems = [
    ["FAA Part 107 Certification (you)", 400, 1, "Study + test + medical"],
    ["FAA Part 137 Application & Legal Help", 5000, 1, "Attorney + petition + exemption"],
    ["NJ Pesticide Applicator License (CORE + AERIAL)", 500, 1, "Rutgers 1-day program"],
    ["EPA Pesticide Business License", 500, 1, "Federal registration"],
    ["LLC Formation + Operating Agreement", 1500, 1, "Attorney fees"],
    ["Commercial Liability Insurance (first year)", 15000, 1, "Ag aviation policy"],
    ["DJI Agras T25 (with batteries)", 22000, 2, "Primary fleet — 2 drones"],
    ["Extra Battery Sets (8 per drone)", 4000, 2, "For full-day operations"],
    ["Multi-Port Charger Station", 2500, 2, "One per drone set"],
    ["RTK Base Station", 6000, 1, "Centimeter GPS accuracy"],
    ["Used Truck (F-250 or similar)", 35000, 1, "Field transport vehicle"],
    ["Enclosed Trailer (16ft)", 8000, 1, "Drone + equipment hauling"],
    ["Generator (3500W)", 2000, 1, "Field battery charging"],
    ["Chemical Mixing Equipment", 1500, 1, "Tanks, pumps, measuring"],
    ["PPE (respirators, suits, gloves)", 1500, 1, "OSHA + EPA compliant"],
    ["Weather Station / Anemometer", 500, 1, "Wind speed monitoring"],
    ["Website & Branding", 3000, 1, "Professional site (already built)"],
    ["Initial Marketing & Outreach", 5000, 1, "Farm visits, demos, print"],
    ["Accounting Software (first year)", 600, 1, "QuickBooks or similar"],
    ["CRM / Job Management Software", 1200, 1, "Client & job tracking"],
    ["Working Capital Reserve", 20000, 1, "3-month operating buffer"],
  ];

  startupItems.forEach((item, i) => {
    r = 4 + i;
    sc.getCell(r, 1).value = item[0] as string;
    sc.getCell(r, 1).font = { name: "Calibri", size: 10 };
    sc.getCell(r, 1).border = borderThin;
    sc.getCell(r, 2).value = item[1] as number;
    sc.getCell(r, 2).numFmt = '$#,##0';
    sc.getCell(r, 2).border = borderThin;
    sc.getCell(r, 2).alignment = { horizontal: "center" };
    sc.getCell(r, 3).value = item[2] as number;
    sc.getCell(r, 3).border = borderThin;
    sc.getCell(r, 3).alignment = { horizontal: "center" };
    sc.getCell(r, 4).value = { formula: `B${r}*C${r}` };
    sc.getCell(r, 4).numFmt = '$#,##0';
    sc.getCell(r, 4).fill = calcFill;
    sc.getCell(r, 4).border = borderThin;
    sc.getCell(r, 4).alignment = { horizontal: "center" };
    sc.getCell(r, 5).value = item[3] as string;
    sc.getCell(r, 5).font = { name: "Calibri", size: 9, italic: true, color: { argb: "888888" } };
    sc.getCell(r, 5).border = borderThin;
  });

  r = 4 + startupItems.length;
  sc.getCell(r, 1).value = "TOTAL STARTUP INVESTMENT";
  sc.getCell(r, 1).font = { bold: true, size: 11, color: { argb: navy }, name: "Calibri" };
  sc.getCell(r, 1).fill = totalFill;
  sc.getCell(r, 1).border = borderThin;
  sc.getCell(r, 4).value = { formula: `SUM(D4:D${r - 1})` };
  sc.getCell(r, 4).numFmt = '$#,##0';
  sc.getCell(r, 4).font = { bold: true, size: 11, name: "Calibri" };
  sc.getCell(r, 4).fill = accentFill;
  sc.getCell(r, 4).border = borderThin;

  // ╔══════════════════════════════════════════════════════╗
  // ║  TAB 3: P&L                                         ║
  // ╚══════════════════════════════════════════════════════╝
  const pl = wb.addWorksheet("P&L", { properties: { tabColor: { argb: "2D8A4E" } } });
  pl.columns = [{ width: 42 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 16 }];

  r = 1;
  pl.mergeCells(r, 1, r, 6);
  pl.getCell(r, 1).value = "APEX DRONE SOLUTIONS — PROFIT & LOSS STATEMENT";
  pl.getCell(r, 1).font = { bold: true, size: 14, color: { argb: navy }, name: "Calibri" };
  pl.getCell(r, 1).alignment = { horizontal: "center" };

  r = 3;
  setHeader(pl, r, ["", ...YEARS]);

  // Revenue
  r = 4; setSection(pl, r, "REVENUE");
  r = 5; setFormulaRow(pl, r, "  Spraying Revenue", YC.map((c) => `${A}!${c}8*${A}!${c}9`), "dollar");
  r = 6; setFormulaRow(pl, r, "  NDVI Mapping Revenue", YC.map((c) => `${A}!${c}10`), "dollar");
  r = 7; setFormulaRow(pl, r, "  Cover Crop Seeding Revenue", YC.map((c) => `${A}!${c}11`), "dollar");
  r = 8; setFormulaRow(pl, r, "TOTAL REVENUE", YC.map((c) => `SUM(${c}5:${c}7)`), "dollar", true, accentFill);
  r = 9; // blank

  // COGS
  r = 10; setSection(pl, r, "COST OF GOODS SOLD (COGS)");
  r = 11; setFormulaRow(pl, r, "  Pilot Labor (salaries)", YC.map((c) => `${A}!${c}22*${A}!${c}25`), "dollar");
  r = 12; setFormulaRow(pl, r, "  Ground Crew Labor", YC.map((c) => `${A}!${c}23*${A}!${c}26`), "dollar");
  r = 13; setFormulaRow(pl, r, "  Pilot Per-Acre Bonuses", YC.map((c) => `${A}!${c}8*${A}!${c}27`), "dollar");
  r = 14; setFormulaRow(pl, r, "  Payroll Taxes & Benefits", YC.map((c) => `(${c}11+${c}12+${c}13)*${A}!${c}28`), "dollar");
  r = 15; setFormulaRow(pl, r, "  Battery Replacement", YC.map((c) => `${A}!${c}32`), "dollar");
  r = 16; setFormulaRow(pl, r, "  Drone Maintenance & Repairs", YC.map((c) => `${A}!${c}33`), "dollar");
  r = 17; setFormulaRow(pl, r, "  Fuel (Trucks)", YC.map((c) => `${A}!${c}34`), "dollar");
  r = 18; setFormulaRow(pl, r, "  RTK / Software Subscriptions", YC.map((c) => `${A}!${c}35`), "dollar");
  r = 19; setFormulaRow(pl, r, "  PPE & Consumables", YC.map((c) => `${A}!${c}36`), "dollar");
  r = 20; setFormulaRow(pl, r, "TOTAL COGS", YC.map((c) => `SUM(${c}11:${c}19)`), "dollar", true, totalFill);
  r = 21; // blank

  // Gross Profit
  r = 22; setFormulaRow(pl, r, "GROSS PROFIT", YC.map((c) => `${c}8-${c}20`), "dollar", true, accentFill);
  r = 23; setFormulaRow(pl, r, "  Gross Margin %", YC.map((c) => `IF(${c}8=0,0,${c}22/${c}8)`), "pct", false, accentFill);
  r = 24; // blank

  // Operating Expenses
  r = 25; setSection(pl, r, "OPERATING EXPENSES");
  r = 26; setFormulaRow(pl, r, "  Owner Salary", YC.map((c) => `${A}!${c}24`), "dollar");
  r = 27; setFormulaRow(pl, r, "  Owner Payroll Tax & Benefits", YC.map((c) => `${c}26*${A}!${c}28`), "dollar");
  r = 28; setFormulaRow(pl, r, "  Insurance", YC.map((c) => `${A}!${c}39`), "dollar");
  r = 29; setFormulaRow(pl, r, "  Truck Payments", YC.map((c) => `${A}!${c}40*${A}!${c}41`), "dollar");
  r = 30; setFormulaRow(pl, r, "  Trailer Lease", YC.map((c) => `${A}!${c}42`), "dollar");
  r = 31; setFormulaRow(pl, r, "  Storage / Shop Rent", YC.map((c) => `${A}!${c}43*12`), "dollar");
  r = 32; setFormulaRow(pl, r, "  Licensing & Compliance", YC.map((c) => `${A}!${c}44`), "dollar");
  r = 33; setFormulaRow(pl, r, "  Marketing & Sales", YC.map((c) => `${A}!${c}45`), "dollar");
  r = 34; setFormulaRow(pl, r, "  Website & Software", YC.map((c) => `${A}!${c}46`), "dollar");
  r = 35; setFormulaRow(pl, r, "  Legal & Professional", YC.map((c) => `${A}!${c}47`), "dollar");
  r = 36; setFormulaRow(pl, r, "  Office / Admin / Misc", YC.map((c) => `${A}!${c}48`), "dollar");
  r = 37; setFormulaRow(pl, r, "  WOTC Veteran Tax Credits", YC.map((c) => `${A}!${c}49`), "dollar");
  r = 38; setFormulaRow(pl, r, "TOTAL OPERATING EXPENSES", YC.map((c) => `SUM(${c}26:${c}37)`), "dollar", true, totalFill);
  r = 39; // blank

  // EBITDA
  r = 40; setFormulaRow(pl, r, "EBITDA", YC.map((c) => `${c}22-${c}38`), "dollar", true, accentFill);
  r = 41; setFormulaRow(pl, r, "  EBITDA Margin %", YC.map((c) => `IF(${c}8=0,0,${c}40/${c}8)`), "pct", false, accentFill);
  r = 42; // blank

  // Depreciation
  r = 43; setSection(pl, r, "DEPRECIATION & AMORTIZATION");
  r = 44; setFormulaRow(pl, r, "  Drone Depreciation", YC.map((c) => `${A}!${c}52*${A}!${c}53/${A}!${c}62`), "dollar");
  r = 45; setFormulaRow(pl, r, "  Vehicle Depreciation", YC.map((c) => `${A}!${c}54/${A}!${c}63`), "dollar");
  r = 46; setFormulaRow(pl, r, "  Equipment Depreciation", YC.map((c) => `(${A}!${c}55+${A}!${c}56+${A}!${c}57)/${A}!${c}64`), "dollar");
  r = 47; setFormulaRow(pl, r, "Total D&A", YC.map((c) => `SUM(${c}44:${c}46)`), "dollar", true, totalFill);
  r = 48; // blank

  // Operating Income
  r = 49; setFormulaRow(pl, r, "OPERATING INCOME (EBIT)", YC.map((c) => `${c}40-${c}47`), "dollar", true, accentFill);
  r = 50; // blank

  // Taxes & Net Income
  r = 51; setSection(pl, r, "TAXES & NET INCOME");
  r = 52; setFormulaRow(pl, r, "  Income Tax", YC.map((c) => `IF(${c}49>0,${c}49*${A}!${c}71,0)`), "dollar");
  r = 53; setFormulaRow(pl, r, "NET INCOME", YC.map((c) => `${c}49-${c}52`), "dollar", true, accentFill);
  r = 54; setFormulaRow(pl, r, "  Net Margin %", YC.map((c) => `IF(${c}8=0,0,${c}53/${c}8)`), "pct", false, accentFill);

  // ╔══════════════════════════════════════════════════════╗
  // ║  TAB 4: CASH FLOW                                   ║
  // ╚══════════════════════════════════════════════════════╝
  const cf = wb.addWorksheet("Cash Flow", { properties: { tabColor: { argb: "486581" } } });
  cf.columns = [{ width: 42 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 16 }, { width: 16 }];

  r = 1;
  cf.mergeCells(r, 1, r, 6);
  cf.getCell(r, 1).value = "APEX DRONE SOLUTIONS — CASH FLOW STATEMENT";
  cf.getCell(r, 1).font = { bold: true, size: 14, color: { argb: navy }, name: "Calibri" };
  cf.getCell(r, 1).alignment = { horizontal: "center" };

  r = 3; setHeader(cf, r, ["", ...YEARS]);

  r = 4; setSection(cf, r, "OPERATING CASH FLOW");
  r = 5; setFormulaRow(cf, r, "  Net Income", YC.map((c) => `'P&L'!${c}53`), "dollar");
  r = 6; setFormulaRow(cf, r, "  Add Back: Depreciation", YC.map((c) => `'P&L'!${c}47`), "dollar");
  r = 7; setFormulaRow(cf, r, "Operating Cash Flow", YC.map((c) => `${c}5+${c}6`), "dollar", true, accentFill);
  r = 8; // blank

  r = 9; setSection(cf, r, "INVESTING CASH FLOW");
  r = 10; setFormulaRow(cf, r, "  Capital Expenditures", YC.map((c) => `-${A}!${c}59`), "dollar");
  r = 11; // blank

  r = 12; setSection(cf, r, "FINANCING");
  r = 13; setInputRow(cf, r, "  Loan Proceeds / Owner Investment", [85000, 0, 0, 0, 0], "dollar");
  r = 14; setInputRow(cf, r, "  Loan Repayment", [0, -12000, -12000, -12000, -12000], "dollar");
  r = 15; setInputRow(cf, r, "  Owner Draws / Distributions", [0, -20000, -40000, -60000, -80000], "dollar");
  r = 16; setFormulaRow(cf, r, "Financing Cash Flow", YC.map((c) => `SUM(${c}13:${c}15)`), "dollar", true, totalFill);
  r = 17; // blank

  r = 18; setFormulaRow(cf, r, "NET CASH FLOW", YC.map((c) => `${c}7+${c}10+${c}16`), "dollar", true, accentFill);
  r = 19; // blank

  r = 20; setSection(cf, r, "CUMULATIVE CASH POSITION");
  // Startup cost reference
  r = 21; setLabel(cf, r, "  Beginning Cash");
  cf.getCell(r, 2).value = { formula: `'Startup Costs'!D25*-1+B13` }; // negative startup + investment
  cf.getCell(r, 2).numFmt = '$#,##0';
  cf.getCell(r, 2).fill = calcFill;
  cf.getCell(r, 2).border = borderThin;
  for (let i = 1; i < 5; i++) {
    cf.getCell(r, 2 + i).value = { formula: `${YC[i - 1]}22` };
    cf.getCell(r, 2 + i).numFmt = '$#,##0';
    cf.getCell(r, 2 + i).fill = calcFill;
    cf.getCell(r, 2 + i).border = borderThin;
  }
  r = 22; setFormulaRow(cf, r, "  Ending Cash", YC.map((c) => `${c}21+${c}18`), "dollar", true, accentFill);

  // ╔══════════════════════════════════════════════════════╗
  // ║  TAB 5: EXIT VALUATION                              ║
  // ╚══════════════════════════════════════════════════════╝
  const ev = wb.addWorksheet("Exit Valuation", { properties: { tabColor: { argb: orange } } });
  ev.columns = [{ width: 45 }, { width: 18 }, { width: 18 }, { width: 30 }];

  r = 1;
  ev.mergeCells(r, 1, r, 3);
  ev.getCell(r, 1).value = "APEX DRONE SOLUTIONS — EXIT VALUATION ANALYSIS";
  ev.getCell(r, 1).font = { bold: true, size: 14, color: { argb: navy }, name: "Calibri" };

  r = 3;
  ev.getCell(r, 1).value = "Based on Year 5 (2031) financials";
  ev.getCell(r, 1).font = { italic: true, size: 10, color: { argb: "888888" }, name: "Calibri" };

  r = 5; setHeader(ev, r, ["Metric", "Value", "Notes"], 1);

  const valRows: [string, string, string, string][] = [
    ["Year 5 Revenue", `'P&L'!F8`, '$#,##0', "Total 2031 revenue"],
    ["Year 5 EBITDA", `'P&L'!F40`, '$#,##0', "Earnings before interest, tax, D&A"],
    ["Year 5 EBITDA Margin", `'P&L'!F41`, '0.0%', "EBITDA as % of revenue"],
    ["Year 5 Net Income", `'P&L'!F53`, '$#,##0', "After-tax profit"],
    ["Year 5 Net Margin", `'P&L'!F54`, '0.0%', "Net income as % of revenue"],
  ];

  valRows.forEach((vr, i) => {
    r = 6 + i;
    ev.getCell(r, 1).value = vr[0];
    ev.getCell(r, 1).font = { name: "Calibri", size: 10 };
    ev.getCell(r, 1).border = borderThin;
    ev.getCell(r, 2).value = { formula: vr[1] };
    ev.getCell(r, 2).numFmt = vr[2];
    ev.getCell(r, 2).fill = calcFill;
    ev.getCell(r, 2).border = borderThin;
    ev.getCell(r, 2).alignment = { horizontal: "center" };
    ev.getCell(r, 3).value = vr[3];
    ev.getCell(r, 3).font = { name: "Calibri", size: 9, italic: true, color: { argb: "888888" } };
    ev.getCell(r, 3).border = borderThin;
  });

  r = 12;
  ev.getCell(r, 1).value = "VALUATION SCENARIOS";
  ev.getCell(r, 1).font = { bold: true, size: 12, color: { argb: navy }, name: "Calibri" };

  r = 14; setHeader(ev, r, ["Scenario", "Valuation", "Methodology"], 1);

  const scenarios: [string, string, string][] = [
    ["Conservative (4x EBITDA)", `'P&L'!F40*4`, "Standard services business multiple"],
    ["Base Case (5x EBITDA)", `'P&L'!F40*5`, "Growing, recurring revenue with moat"],
    ["Aggressive (6x EBITDA)", `'P&L'!F40*6`, "High-growth with licensing moat + FAA barrier"],
    ["Revenue Multiple (2.5x)", `'P&L'!F8*2.5`, "Alternative: revenue-based for high-growth"],
  ];

  scenarios.forEach((s, i) => {
    r = 15 + i;
    ev.getCell(r, 1).value = s[0];
    ev.getCell(r, 1).font = { name: "Calibri", size: 10, bold: i === 1 };
    ev.getCell(r, 1).border = borderThin;
    ev.getCell(r, 2).value = { formula: s[1] };
    ev.getCell(r, 2).numFmt = '$#,##0';
    ev.getCell(r, 2).fill = i === 1 ? accentFill : calcFill;
    ev.getCell(r, 2).border = borderThin;
    ev.getCell(r, 2).alignment = { horizontal: "center" };
    ev.getCell(r, 2).font = { name: "Calibri", size: 10, bold: i === 1 };
    ev.getCell(r, 3).value = s[2];
    ev.getCell(r, 3).font = { name: "Calibri", size: 9, italic: true, color: { argb: "888888" } };
    ev.getCell(r, 3).border = borderThin;
  });

  r = 21;
  ev.getCell(r, 1).value = "5-YEAR RETURN ON INVESTMENT";
  ev.getCell(r, 1).font = { bold: true, size: 12, color: { argb: navy }, name: "Calibri" };

  r = 23; setHeader(ev, r, ["Metric", "Value", "Notes"], 1);

  const roiRows: [string, string, string, string][] = [
    ["Total Startup Investment", `'Startup Costs'!D25`, '$#,##0', "Pre-launch capital required"],
    ["Total 5-Year Net Income", `SUM('P&L'!B53:F53)`, '$#,##0', "Cumulative after-tax earnings"],
    ["Total 5-Year Owner Draws", `SUM('Cash Flow'!B15:F15)*-1`, '$#,##0', "Cash distributed to owner"],
    ["Total Owner Compensation (5yr salary)", `SUM(${A}!B24:F24)`, '$#,##0', "Owner salary over 5 years"],
    ["Total Owner Cash Received", `B25+B26+B27`, '$#,##0', "Net income + draws + salary"],
    ["Cash-on-Cash Return (excl. exit)", `IF(B24=0,0,B28/B24)`, '0.0x', "Total cash / investment"],
    ["Exit Value (5x EBITDA)", `'P&L'!F40*5`, '$#,##0', "Estimated sale price"],
    ["Total Return (incl. exit)", `B28+B30`, '$#,##0', "All cash + exit value"],
    ["Total ROI (incl. exit)", `IF(B24=0,0,B31/B24)`, '0.0x', "Total return / investment"],
  ];

  roiRows.forEach((rr, i) => {
    r = 24 + i;
    ev.getCell(r, 1).value = rr[0];
    ev.getCell(r, 1).font = { name: "Calibri", size: 10, bold: i >= 7 };
    ev.getCell(r, 1).border = borderThin;
    ev.getCell(r, 2).value = { formula: rr[1] };
    ev.getCell(r, 2).numFmt = rr[2];
    ev.getCell(r, 2).fill = i >= 7 ? accentFill : calcFill;
    ev.getCell(r, 2).border = borderThin;
    ev.getCell(r, 2).alignment = { horizontal: "center" };
    ev.getCell(r, 2).font = { name: "Calibri", size: 10, bold: i >= 7 };
    ev.getCell(r, 3).value = rr[3];
    ev.getCell(r, 3).font = { name: "Calibri", size: 9, italic: true, color: { argb: "888888" } };
    ev.getCell(r, 3).border = borderThin;
  });

  // ── Write file ────────────────────────────────────────
  await wb.xlsx.writeFile(FILE);
  console.log(`\n✅ Financial model generated: ${FILE}\n`);
  console.log("Tabs: Assumptions | Startup Costs | P&L | Cash Flow | Exit Valuation");
  console.log("Green cells = editable inputs. Blue cells = calculated formulas.\n");
}

main().catch(console.error);
