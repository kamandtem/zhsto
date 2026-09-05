// Pre-Wedding Photography Taxonomy & Pose Enrichment Engine

export const SCENARIOS = [
  'جزئیات صحنه',      // 1. Scene details (preparations, location specifics)
  'اکسسوری',           // 2. Accessories & decor focus
  'آماده شدن',         // 3. Getting ready (makeup, dressing)
  'نگاه اول',          // 4. First look moment
  'پرتره',             // 5. Portrait (single subject)
  'تعامل زوج',         // 6. Couple interaction
  'حرکت و دویدن',      // 7. Movement & walking
  'گروهی خانواده',     // 8. Family group shots
  'دوستان و شاهدین',   // 9. Friends & witnesses
  'مراسم و رسومات',    // 10. Ceremony & traditions
  'شب و رقص',          // 11. Evening & dancing
  'شام و مهمان‌ها',    // 12. Dinner & guests
  'تفریحی و عفویی'      // 13. Candid & playful moments
] as const;

export const LOCATIONS = [
  'باغ و عمارت',
  'شمال',
  'جنوب',
  'کویر',
  'ساحل',
  'شهر'
] as const;

export const SCOPES = ['عمومی', 'اختصاصی لوکیشن'] as const;
export const MOODS = ['رومانتیک', 'شادی', 'نزدیکی', 'عظیم', 'عفویی', 'درام'] as const;
export const FRAMINGS = ['کلوز‌آپ', 'نیم‌تنه', 'تمام‌بدن', 'شات وسیع', 'جزئیات'] as const;
export const MOVEMENTS = ['ایستا', 'سبک', 'فعال', 'رو‌به‌دوام'] as const;
export const ENVIRONMENTS = ['درون‌خانه', 'بیرون', 'طبیعت', 'شهری', 'مختلط'] as const;
export const IMAGE_ORIENTATIONS = ['landscape', 'portrait'] as const;

// Hard dependency keywords for scope derivation (regex patterns with word boundaries)
const LOCATION_HARD_KEYWORDS: Record<string, RegExp> = {
  'باغ و عمارت': /(?:^|\s)(باغ|عمارت|ویلا|حیاط)/i,
  'شمال': /(?:^|\s)(شمال|گیلان|مازندران|درختان)/i,
  'جنوب': /(?:^|\s)(جنوب|کرمان|فارس|خلیج)/i,
  'کویر': /(?:^|\s)(کویر|ریگ|شن|بیابان|خاکی|سفید)/i,
  'ساحل': /(?:^|\s)(ساحل|دریا|آب|موج|ماسه|خزر)/i,
  'شهر': /(?:^|\s)(شهر|ساختمان|نئون|خیابان|پل|معماری)/i
};

// Soft dependency keywords (multiple matches = no auto-lock)
const LOCATION_SOFT_KEYWORDS: Record<string, RegExp> = {
  'باغ و عمارت': /(?:^|\s)(مدل|میز|صندلی|داخل|اتاق)/i,
  'شمال': /(?:^|\s)(سبز|درخت|جنگل|تازه)/i,
  'جنوب': /(?:^|\s)(آفتاب|گرم|روشن)/i,
  'کویر': /(?:^|\s)(شن|ریگ|خاک|تنهایی)/i,
  'ساحل': /(?:^|\s)(سبز|آب|تازه)/i,
  'شهر': /(?:^|\s)(رنگین|روشن|شب)/i
};

// Manual overrides for edge-case poses (pose title → location to lock to)
const SCOPE_OVERRIDES: Record<string, string | null> = {
  // Intentionally location-locked despite soft keywords
  'پرتره زوج در بین درختان': 'شمال',
  'قدم زدن کنار آب': 'ساحل',
  'نشستن در موج': 'ساحل',
  // Intentionally general despite partial hard matches
  'جزئیات: دکمه عروس': null,  // "دکمه" triggers soft for many, but is genuinely general
};

export function deriveScope(title: string, description: string): typeof SCOPES[number] {
  const combined = `${title} ${description}`;
  
  // Check manual overrides first
  for (const [key, location] of Object.entries(SCOPE_OVERRIDES)) {
    if (title.toLowerCase().includes(key.toLowerCase())) {
      return location ? 'اختصاصی لوکیشن' : 'عمومی';
    }
  }

  let hardMatches = 0;
  let softMatches = 0;

  for (const location of LOCATIONS) {
    const hardRegex = LOCATION_HARD_KEYWORDS[location];
    const softRegex = LOCATION_SOFT_KEYWORDS[location];

    if (hardRegex?.test(combined)) hardMatches++;
    if (softRegex?.test(combined)) softMatches++;
  }

  // If exactly 1 hard match and no conflicts: location-locked
  if (hardMatches === 1) {
    return 'اختصاصی لوکیشن';
  }

  // If multiple soft matches or no clear signal: general
  return 'عمومی';
}

export function deriveScenario(title: string): typeof SCENARIOS[number] {
  const lower = title.toLowerCase();

  const scenarioKeywords: Record<typeof SCENARIOS[number], RegExp> = {
    'جزئیات صحنه': /(?:^|\s)(جزئیات|صحنه|شال|دستمال|گل|زیورآلات|ساعت|کفش|آینه)/i,
    'اکسسوری': /(?:^|\s)(اکسسوری|دسته|بوکه|گل|تاج|حلقه|گردن‌بند)/i,
    'آماده شدن': /(?:^|\s)(آرایش|آماده|مو|میک‌آپ|آینه|صندلی|رختکن)/i,
    'نگاه اول': /(?:^|\s)(نگاه اول|اول|بار اول|ملاقات|شوک|ابروبینی)/i,
    'پرتره': /(?:^|\s)(پرتره|تک|تنهایی|چهره|صورت|سر)/i,
    'تعامل زوج': /(?:^|\s)(زوج|دو نفر|دو تا|تعامل|بغل|دست|بوسه|آغوش)/i,
    'حرکت و دویدن': /(?:^|\s)(دویدن|قدم|راه|حرکت|پریدن|دویدگی)/i,
    'گروهی خانواده': /(?:^|\s)(خانواده|گروه|والدین|مادر|پدر|برادر|خواهر)/i,
    'دوستان و شاهدین': /(?:^|\s)(دوست|شاهد|همراه|گروه|جمع)/i,
    'مراسم و رسومات': /(?:^|\s)(مراسم|رسم|شالق|حنابندی|هنا|پیاده|کاروان)/i,
    'شب و رقص': /(?:^|\s)(شب|رقص|رقصنده|رقصیدن|موسیقی|دی‌جی|میکروفن)/i,
    'شام و مهمان‌ها': /(?:^|\s)(شام|مهمان|سفره|خوردن|نوشیدنی|شراب|کیک)/i,
    'تفریحی و عفویی': /(?:^|\s)(عفویی|خنده|شاد|بازی|تفریح|خندہ|خیلی شاد)/i
  };

  for (const [scenario, regex] of Object.entries(scenarioKeywords)) {
    if (regex.test(lower)) {
      return scenario as typeof SCENARIOS[number];
    }
  }

  return 'تفریحی و عفویی'; // default
}

export function deriveSuitableLocations(title: string, description: string): string[] {
  const combined = `${title} ${description}`;
  const suitable: string[] = [];

  for (const location of LOCATIONS) {
    const hardRegex = LOCATION_HARD_KEYWORDS[location];
    const softRegex = LOCATION_SOFT_KEYWORDS[location];

    const hardMatch = hardRegex?.test(combined) ?? false;
    const softMatch = softRegex?.test(combined) ?? false;

    // Include location if hard match or (soft match without conflicting hard match)
    if (hardMatch || (softMatch && hardMatch === false)) {
      suitable.push(location);
    }
  }

  return suitable.length > 0 ? suitable : LOCATIONS as unknown as string[];
}

// Affinity scoring for location recommendation (0-1 range)
export function scoreLocationAffinity(scenario: string, location: string): number {
  const scenarioLocationAffinities: Record<string, Record<string, number>> = {
    'جزئیات صحنه': { 'باغ و عمارت': 0.95, 'شمال': 0.7, 'جنوب': 0.6, 'کویر': 0.6, 'ساحل': 0.7, 'شهر': 0.65 },
    'اکسسوری': { 'باغ و عمارت': 0.8, 'شمال': 0.7, 'جنوب': 0.7, 'کویر': 0.6, 'ساحل': 0.75, 'شهر': 0.65 },
    'آماده شدن': { 'باغ و عمارت': 1.0, 'شمال': 0.65, 'جنوب': 0.65, 'کویر': 0.5, 'ساحل': 0.55, 'شهر': 0.75 },
    'نگاه اول': { 'باغ و عمارت': 0.9, 'شمال': 0.8, 'جنوب': 0.75, 'کویر': 0.65, 'ساحل': 0.8, 'شهر': 0.7 },
    'پرتره': { 'باغ و عمارت': 0.9, 'شمال': 0.85, 'جنوب': 0.85, 'کویر': 0.8, 'ساحل': 0.85, 'شهر': 0.75 },
    'تعامل زوج': { 'باغ و عمارت': 0.95, 'شمال': 0.9, 'جنوب': 0.85, 'کویر': 0.75, 'ساحل': 0.9, 'شهر': 0.8 },
    'حرکت و دویدن': { 'باغ و عمارت': 0.85, 'شمال': 0.9, 'جنوب': 0.8, 'کویر': 0.7, 'ساحل': 0.95, 'شهر': 0.65 },
    'گروهی خانواده': { 'باغ و عمارت': 0.95, 'شمال': 0.85, 'جنوب': 0.75, 'کویر': 0.6, 'ساحل': 0.75, 'شهر': 0.7 },
    'دوستان و شاهدین': { 'باغ و عمارت': 0.85, 'شمال': 0.75, 'جنوب': 0.7, 'کویر': 0.5, 'ساحل': 0.7, 'شهر': 0.8 },
    'مراسم و رسومات': { 'باغ و عمارت': 0.9, 'شمال': 0.8, 'جنوب': 0.75, 'کویر': 0.5, 'ساحل': 0.65, 'شهر': 0.7 },
    'شب و رقص': { 'باغ و عمارت': 0.8, 'شمال': 0.65, 'جنوب': 0.65, 'کویر': 0.4, 'ساحل': 0.65, 'شهر': 0.95 },
    'شام و مهمان‌ها': { 'باغ و عمارت': 0.9, 'شمال': 0.7, 'جنوب': 0.65, 'کویر': 0.4, 'ساحل': 0.6, 'شهر': 0.85 },
    'تفریحی و عفویی': { 'باغ و عمارت': 0.85, 'شمال': 0.8, 'جنوب': 0.75, 'کویر': 0.65, 'ساحل': 0.8, 'شهر': 0.75 }
  };

  return scenarioLocationAffinities[scenario]?.[location] ?? 0.5;
}

// Main enrichment function: call on every pose read to backfill legacy data
export function enrichPose(pose: any) {
  const enriched = { ...pose };

  if (!enriched.scenario) {
    enriched.scenario = deriveScenario(enriched.name || '');
  }

  if (!enriched.scope) {
    enriched.scope = deriveScope(enriched.name || '', enriched.description || '');
  }

  if (!enriched.suitableLocations || enriched.suitableLocations.length === 0) {
    enriched.suitableLocations = deriveSuitableLocations(enriched.name || '', enriched.description || '');
  }

  return enriched;
}

// Helper function: check if a pose "runs in" a location (compatibility, not ownership)
export function runsIn(scope: typeof SCOPES[number], suitableLocations: string[], location: string): boolean {
  if (scope === 'عمومی') {
    return true; // General poses run everywhere
  }

  // Location-locked poses only run in their suitable locations
  return suitableLocations.includes(location);
}
