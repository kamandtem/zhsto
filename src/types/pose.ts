export type CategoryType =
  | 'عروس و داماد'
  | 'عروس'
  | 'داماد'
  | 'زوج'
  | 'گروهی';

export type PoseType =
  | 'ایستاده'
  | 'نشسته'
  | 'راه رفتن'
  | 'بغل کردن'
  | 'رمانتیک'
  | 'رسمی'
  | 'خلاقانه'
  | 'حرکتی';

export type DifficultyLevel = 'آسان' | 'متوسط' | 'حرفه‌ای';
export type LocationType = 'جنوب' | 'ساحل' | 'شمال' | 'کویر' | 'شهر' | 'باغ و عمارت';

export type Scenario =
  | 'جزئیات صحنه'
  | 'اکسسوری'
  | 'آماده شدن'
  | 'نگاه اول'
  | 'پرتره'
  | 'تعامل زوج'
  | 'حرکت و دویدن'
  | 'گروهی خانواده'
  | 'دوستان و شاهدین'
  | 'مراسم و رسومات'
  | 'شب و رقص'
  | 'شام و مهمان‌ها'
  | 'تفریحی و عفویی';

export type PoseScope = 'عمومی' | 'اختصاصی لوکیشن';
export type Mood = 'رومانتیک' | 'شادی' | 'نزدیکی' | 'عظیم' | 'عفویی' | 'درام';
export type Framing = 'کلوز‌آپ' | 'نیم‌تنه' | 'تمام‌بدن' | 'شات وسیع' | 'جزئیات';
export type Movement = 'ایستا' | 'سبک' | 'فعال' | 'رو‌به‌دوام';
export type Environment = 'درون‌خانه' | 'بیرون' | 'طبیعت' | 'شهری' | 'مختلط';
export type ImageOrientation = 'landscape' | 'portrait';
export type DetailSubject = 'دکور' | 'حلقه' | 'دسته‌گل' | 'لباس' | 'کفش' | 'اکسسوری';

export interface Pose {
  id: string;
  name: string;
  description?: string;
  image: string;
  locations: LocationType[];
  
  // New metadata fields (enriched on read via enrichPose)
  scenario: Scenario;
  scope: PoseScope;
  locationLock?: string | null; // If set, pose is locked to this location
  locationReason?: string; // Why it's locked (hard match, etc.)
  suitableLocations: LocationType[]; // Auto-computed: derived from keywords
  
  mood?: Mood;
  framing?: Framing;
  movement?: Movement;
  environment?: Environment;
  detailSubject?: DetailSubject; // Applies to 'جزئیات صحنه' scenario
  imageOrientation: ImageOrientation; // 'landscape' or 'portrait'
  
  // Legacy fields (kept for backward compat)
  category?: CategoryType;
  poseType?: PoseType;
  difficulty?: DifficultyLevel;
  gardenSubCategory?: string; // Deprecated, use scenario instead
}

export interface FilterState {
  scenario?: Scenario | 'همه';
  location?: LocationType | 'همه';
  mood?: Mood | 'همه';
  framing?: Framing | 'همه';
  
  // Advanced filters (behind expandable section)
  poseType?: PoseType | 'همه';
  difficulty?: DifficultyLevel | 'همه';
  movement?: Movement | 'همه';
  environment?: Environment | 'همه';
  category?: CategoryType | 'همه';
}
