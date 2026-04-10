// src/lib/drought.ts
//
// US Drought Monitor (USDM) via University of Nebraska-Lincoln API
// https://usdmdataservices.unl.edu/
//
// Weekly drought classifications by state, percent-of-area in each class:
//   None, D0 (Abnormally Dry), D1 (Moderate), D2 (Severe), D3 (Extreme), D4 (Exceptional)
//
// IMPORTANT: The API expects FIPS state codes (not abbreviations) as `aoi` param.
// Free, no API key required.

// ─── Types ──────────────────────────────────────────────────

export interface UsdmRecord {
  mapDate: string; // "2024-12-31T00:00:00"
  stateAbbreviation: string; // "NJ"
  none: number;
  d0: number;
  d1: number;
  d2: number;
  d3: number;
  d4: number;
  validStart: string;
  validEnd: string;
  statisticFormatID: number;
}

export interface DroughtState {
  state: string;
  stateName: string;
  mapDate: string;
  validStart: string;
  validEnd: string;
  none: number;
  d0: number;
  d1: number;
  d2: number;
  d3: number;
  d4: number;
  worstClass: "None" | "D0" | "D1" | "D2" | "D3" | "D4";
  worstClassLabel: string;
  percentInDrought: number; // d1+ (actual drought, not just dry)
}

// FIPS state codes for our coverage area
const STATE_FIPS: Record<string, { fips: string; name: string }> = {
  NJ: { fips: "34", name: "New Jersey" },
  PA: { fips: "42", name: "Pennsylvania" },
  DE: { fips: "10", name: "Delaware" },
  NY: { fips: "36", name: "New York" },
};

const DROUGHT_CLASS_LABELS: Record<string, string> = {
  None: "No Drought",
  D0: "Abnormally Dry",
  D1: "Moderate Drought",
  D2: "Severe Drought",
  D3: "Extreme Drought",
  D4: "Exceptional Drought",
};

// ─── Helpers ────────────────────────────────────────────────

function formatDateMdy(date: Date): string {
  // USDM expects M/D/YYYY format
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

function determineWorstClass(r: UsdmRecord): DroughtState["worstClass"] {
  if (r.d4 > 0) return "D4";
  if (r.d3 > 0) return "D3";
  if (r.d2 > 0) return "D2";
  if (r.d1 > 0) return "D1";
  if (r.d0 > 0) return "D0";
  return "None";
}

// ─── Fetch ──────────────────────────────────────────────────

async function fetchStateDrought(
  stateAbbr: string
): Promise<DroughtState | null> {
  const stateInfo = STATE_FIPS[stateAbbr];
  if (!stateInfo) return null;

  // Fetch the most recent ~5 weeks to ensure we get the latest data
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 35);

  const url = new URL(
    "https://usdmdataservices.unl.edu/api/StateStatistics/GetDroughtSeverityStatisticsByAreaPercent"
  );
  url.searchParams.set("aoi", stateInfo.fips);
  url.searchParams.set("startdate", formatDateMdy(startDate));
  url.searchParams.set("enddate", formatDateMdy(endDate));
  url.searchParams.set("statisticsType", "1");

  try {
    const res = await fetch(url.toString(), {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 }, // 24 hours — USDM updates weekly
    });

    if (!res.ok) return null;

    const records: UsdmRecord[] = await res.json();
    if (!records.length) return null;

    // Most recent record (USDM returns newest-first)
    const latest = records[0];
    const worstClass = determineWorstClass(latest);

    return {
      state: stateAbbr,
      stateName: stateInfo.name,
      mapDate: latest.mapDate,
      validStart: latest.validStart,
      validEnd: latest.validEnd,
      none: latest.none,
      d0: latest.d0,
      d1: latest.d1,
      d2: latest.d2,
      d3: latest.d3,
      d4: latest.d4,
      worstClass,
      worstClassLabel: DROUGHT_CLASS_LABELS[worstClass],
      percentInDrought: latest.d1,
    };
  } catch {
    return null;
  }
}

export async function fetchRegionalDrought(): Promise<DroughtState[]> {
  const states = ["NJ", "PA", "DE", "NY"];
  const results = await Promise.all(states.map(fetchStateDrought));
  return results.filter((r): r is DroughtState => r !== null);
}
