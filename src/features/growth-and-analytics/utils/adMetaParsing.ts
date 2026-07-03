type GeoLocation = {
  countries?: string[];
  cities?: Array<{ name?: string }>;
  regions?: Array<{ name?: string }>;
};

type Targeting = {
  geo_locations?: GeoLocation;
  age_min?: number;
  age_max?: number;
  custom_audiences?: Array<{ name?: string }>;
  flexible_spec?: Array<Record<string, Array<{ name?: string }>>>;
};

type MetaAdsetTargeting = {
  optimization_goal?: string;
  targeting?: Targeting;
  publisher_platforms?: string[];
  facebook_positions?: string[];
  instagram_positions?: string[];
};

function joinNames(items: Array<{ name?: string }> | undefined, limit = 5): string | null {
  if (!items?.length) return null;
  const names = items
    .map((item) => item.name?.trim())
    .filter((name): name is string => Boolean(name));
  if (names.length === 0) return null;
  const shown = names.slice(0, limit);
  const suffix = names.length > limit ? ` +${names.length - limit} more` : "";
  return shown.join(", ") + suffix;
}

function titleCase(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatPerformanceGoal(goal?: string | null): string | null {
  if (!goal?.trim()) return null;
  return titleCase(goal.trim());
}

export function parseLocationSummary(targeting?: Targeting): string | null {
  const geo = targeting?.geo_locations;
  if (!geo) return null;

  const parts: string[] = [];
  if (geo.countries?.length) {
    parts.push(geo.countries.join(", "));
  }
  const cityNames = joinNames(geo.cities);
  if (cityNames) parts.push(cityNames);
  const regionNames = joinNames(geo.regions);
  if (regionNames) parts.push(regionNames);

  return parts.length > 0 ? parts.join(" · ") : null;
}

export function parseAgeSummary(targeting?: Targeting): string | null {
  const min = targeting?.age_min;
  const max = targeting?.age_max;
  if (min == null && max == null) return null;
  if (min != null && max != null) return `${min}–${max}`;
  if (min != null) return `${min}+`;
  return `Up to ${max}`;
}

export function parseCustomTargetingSummary(targeting?: Targeting): string | null {
  return joinNames(targeting?.custom_audiences, 8);
}

export function parseDetailedTargetingSummary(targeting?: Targeting): string | null {
  const specs = targeting?.flexible_spec;
  if (!specs?.length) return null;

  const names: string[] = [];
  for (const spec of specs) {
    for (const entries of Object.values(spec)) {
      if (!Array.isArray(entries)) continue;
      for (const entry of entries) {
        if (entry.name?.trim()) names.push(entry.name.trim());
      }
    }
  }

  if (names.length === 0) return null;
  const unique = [...new Set(names)];
  const shown = unique.slice(0, 8);
  const suffix = unique.length > 8 ? ` +${unique.length - 8} more` : "";
  return shown.join(", ") + suffix;
}

export function parsePlacementsSummary(adset: {
  publisher_platforms?: string[];
  facebook_positions?: string[];
  instagram_positions?: string[];
}): string | null {
  const parts: string[] = [];

  if (adset.publisher_platforms?.length) {
    parts.push(adset.publisher_platforms.map(titleCase).join(", "));
  }
  if (adset.facebook_positions?.length) {
    parts.push(`Facebook: ${adset.facebook_positions.map(titleCase).join(", ")}`);
  }
  if (adset.instagram_positions?.length) {
    parts.push(`Instagram: ${adset.instagram_positions.map(titleCase).join(", ")}`);
  }

  return parts.length > 0 ? parts.join(" · ") : null;
}

export function mapMetaAdsetSummaries(adset: MetaAdsetTargeting) {
  const targeting = adset.targeting;

  return {
    performanceGoal: formatPerformanceGoal(adset.optimization_goal),
    locationSummary: parseLocationSummary(targeting),
    ageSummary: parseAgeSummary(targeting),
    customTargetingSummary: parseCustomTargetingSummary(targeting),
    detailedTargetingSummary: parseDetailedTargetingSummary(targeting),
    placementsSummary: parsePlacementsSummary(adset),
  };
}
