import {
  ScenarioCategory,
  LocationType,
  Pose,
  PoseScope,
} from '../types/pose';

/* Simplified Scenario & Scope enrichment for existing codebase */

export const SCENARIOS = [
  'جزئیات و اکسسوری',
  'آماده شدن عروس',
  'آماده شدن داماد',
  'نگاه اول و بهم رسیدن',
  'پرتره عروس',
  'پرتره داماد',
  'پرتره زوج',
  'تعامل زوج',
  'قدم زدن و حرکت',
  'شادی، احساس و رقص',
  'خانواده و گروهی',
  'مراسم و ورود',
  'شب و بدرقه',
] as const;

const LOCATIONS_LIST = ['جنوب', 'ساحل', 'شمال', 'کویر', 'شهر', 'باغ عمارت'] as const;

// Regex for scope detection
const LOCATION_KEYWORDS: Record<string, RegExp> = {
  'باغ عمارت': /(?:^|\s)(باغ|عمارت|ویلا|حیاط)/i,
  'شمال': /(?:^|\s)(شمال|گیلان|مازندران)/i,
  'جنوب': /(?:^|\s)(جنوب|کرمان|فارس)/i,
  'کویر': /(?:^|\s)(کویر|ریگ|شن|بیابان)/i,
  'ساحل': /(?:^|\s)(ساحل|دریا|آب|موج)/i,
  'شهر': /(?:^|\s)(شهر|ساختمان|خیابان)/i,
};

/** Auto-detect scope & enrich missing fields on read */
export function enrichPose(pose: any): any {
  if (!pose) return pose;
  
  const enriched = { ...pose };
  
  // Auto-detect scenario if missing
  if (!enriched.scenario && enriched.gardenSubCategory) {
    enriched.scenario = enriched.gardenSubCategory;
  }
  
  // Auto-detect scope if missing
  if (!enriched.scope) {
    const text = `${pose.title || pose.name || ''} ${pose.description || ''}`;
    let matches = 0;
    for (const loc of LOCATIONS_LIST) {
      if (LOCATION_KEYWORDS[loc]?.test(text)) matches++;
    }
    enriched.scope = matches === 1 ? 'اختصاصی لوکیشن' : 'عمومی';
  }
  
  // Auto-compute suitable locations if missing
  if (!enriched.suitableLocations || enriched.suitableLocations.length === 0) {
    enriched.suitableLocations = enriched.locations || [];
  }
  
  return enriched;
}

/** Get scenario from pose (enriched) */
export function scenarioOf(pose: any): string {
  const enriched = enrichPose(pose);
  return enriched.scenario || enriched.gardenSubCategory || 'تفریحی و عفویی';
}

/** Get scope from pose (enriched) */
export function scopeOf(pose: any): string {
  const enriched = enrichPose(pose);
  return enriched.scope || 'عمومی';
}

/** Get suitable locations from pose (enriched) */
export function suitableLocationsOf(pose: any): string[] {
  const enriched = enrichPose(pose);
  return enriched.suitableLocations || [];
}

/** Check if pose "runs in" location (compatibility, not ownership) */
export function runsIn(pose: any, location: string): boolean {
  const enriched = enrichPose(pose);
  if (enriched.scope === 'عمومی') return true;
  return (enriched.suitableLocations || []).includes(location);
}

/** Group all poses by scenario */
export function groupByScenario(poses: any[]): Record<string, any[]> {
  const groups: Record<string, any[]> = {};
  for (const scenario of SCENARIOS) {
    groups[scenario] = poses.filter((p) => scenarioOf(p) === scenario);
  }
  return groups;
}

/** Split poses into general and location-locked */
export function splitByScope(poses: any[]): { general: any[]; special: any[] } {
  return {
    general: poses.filter((p) => scopeOf(p) === 'عمومی'),
    special: poses.filter((p) => scopeOf(p) === 'اختصاصی لوکیشن'),
  };
}

/* Helper constants & functions for UI */
export const MOODS = ['رمانتیک', 'شاد', 'آرام', 'دراماتیک', 'رسمی'] as const;
export const FRAMINGS = ['کلوز', 'مدیوم', 'واید'] as const;
export const ENVIRONMENTS = ['فضای باز', 'فضای بسته', 'هر دو'] as const;
export const SCOPES = ['عمومی', 'اختصاصی لوکیشن'] as const;
export const DETAIL_SUBJECTS = ['دکور', 'حلقه', 'دسته‌گل', 'لباس', 'کفش', 'اکسسوری'] as const;
export const SCENARIO_KEYS = SCENARIOS;

export function scopeLabel(scope: string): string {
  return scope === 'عمومی' ? 'عمومی' : 'اختصاصی';
}
