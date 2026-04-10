// src/lib/tfrs.ts
//
// FAA Temporary Flight Restrictions (TFRs)
// https://tfr.faa.gov/tfrapi/exportTfrList
// Free. Returns JSON list of active TFRs across the US.

// ─── Types ──────────────────────────────────────────────────

export type TfrType =
  | "HAZARDS"
  | "VIP"
  | "SECURITY"
  | "SPACE OPERATIONS"
  | "AIR SHOWS/SPORTS"
  | "UAS PUBLIC GATHERING"
  | string;

export interface FaaNotam {
  notam_id: string;
  type: TfrType;
  facility: string;
  state: string;
  description: string;
  creation_date: string;
}

export interface RegionalTfr {
  id: string;
  type: TfrType;
  state: string;
  description: string;
  createdAt: string;
  detailUrl: string;
}

// ─── Normalizer ─────────────────────────────────────────────

function normalizeTfr(n: FaaNotam): RegionalTfr {
  // FAA maintains detail pages at:
  //   https://tfr.faa.gov/save_pages/detail_<notam_id>.html
  // The notam_id comes in as "6/0826" — strip the slash for the detail URL.
  const slug = n.notam_id.replace("/", "_");
  return {
    id: n.notam_id,
    type: n.type,
    state: n.state,
    description: n.description,
    createdAt: n.creation_date,
    detailUrl: `https://tfr.faa.gov/save_pages/detail_${slug}.html`,
  };
}

// ─── Fetch ──────────────────────────────────────────────────

export async function fetchRegionalTfrs(
  states: string[] = ["NJ", "PA", "DE", "NY"]
): Promise<RegionalTfr[]> {
  try {
    const res = await fetch("https://tfr.faa.gov/tfrapi/exportTfrList", {
      headers: { Accept: "application/json" },
      next: { revalidate: 600 }, // 10 minutes
    });

    if (!res.ok) return [];

    const data: FaaNotam[] = await res.json();
    const stateSet = new Set(states.map((s) => s.toUpperCase()));

    return data
      .filter((n) => stateSet.has(n.state?.toUpperCase()))
      .map(normalizeTfr);
  } catch {
    return [];
  }
}
