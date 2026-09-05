import React, { useState } from 'react';
import { Search, X, SlidersHorizontal, RotateCcw, Compass, MapPin } from 'lucide-react';
import {
  CategoryType,
  DetailSubject,
  DifficultyLevel,
  EMPTY_FILTERS,
  EnvironmentType,
  FilterState,
  Framing,
  LocationType,
  Mood,
  MovementFilter,
  Pose,
  PoseScope,
  PoseType,
} from '../types/pose';
import { LOCATION_KEYS } from '../data/locations';
import {
  DETAIL_SUBJECTS,
  ENVIRONMENTS,
  FRAMINGS,
  MOODS,
  SCOPES,
} from '../data/taxonomy';
import { ScenarioRail } from './ScenarioRail';

const CATEGORIES: (CategoryType | 'همه')[] = ['همه', 'عروس و داماد', 'عروس', 'داماد', 'زوج', 'گروهی'];
const TYPES: (PoseType | 'همه')[] = [
  'همه', 'ایستاده', 'نشسته', 'راه رفتن', 'بغل کردن', 'رمانتیک', 'رسمی', 'خلاقانه', 'حرکتی',
];
const DIFFS: (DifficultyLevel | 'همه')[] = ['همه', 'آسان', 'متوسط', 'حرفه‌ای'];
const LOCS: (LocationType | 'همه')[] = ['همه', ...LOCATION_KEYS];
const SCOPE_OPTS: (PoseScope | 'همه')[] = ['همه', ...SCOPES];
const FRAMING_OPTS: (Framing | 'همه')[] = ['همه', ...FRAMINGS];
const MOOD_OPTS: (Mood | 'همه')[] = ['همه', ...MOODS];
const ENV_OPTS: (EnvironmentType | 'همه')[] = ['همه', ...ENVIRONMENTS];
const MOVE_OPTS: MovementFilter[] = ['همه', 'دارد', 'ندارد'];
const DETAIL_OPTS: (DetailSubject | 'همه')[] = ['همه', ...DETAIL_SUBJECTS];

interface Props {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  total: number;
  /** برای شمارش کنار چیپ‌های سناریو (کل کتابخانه، نه نتیجه فیلترشده) */
  allPoses?: Pose[];
}

/**
 * فیلترها با ترتیب جدید مدل ذهنی:
 *   ۱) مرحله سناریو  ← محور اصلی
 *   ۲) عمومی / اختصاصی لوکیشن
 *   ۳) لوکیشن، فقط به معنای «قابل اجرا این‌جا»
 *   ۴) ویژگی‌ها: حال‌وهوا، کادر، حرکت، فضا
 * دسته سوژه و سختی به بخش پیشرفته منتقل شده‌اند.
 */
export const Filters: React.FC<Props> = ({ filters, onChange, total, allPoses }) => {
  const [expanded, setExpanded] = useState(false);

  const dirty =
    filters.search !== '' ||
    filters.scenario !== 'همه' ||
    filters.detailSubject !== 'همه' ||
    filters.scope !== 'همه' ||
    filters.location !== 'همه' ||
    filters.framing !== 'همه' ||
    filters.mood !== 'همه' ||
    filters.movement !== 'همه' ||
    filters.environment !== 'همه' ||
    filters.category !== 'همه' ||
    filters.poseType !== 'همه' ||
    filters.difficulty !== 'همه' ||
    filters.customOnly;

  const Row = <T extends string>({
    label,
    hint,
    options,
    value,
    onPick,
  }: {
    label: string;
    hint?: string;
    options: T[];
    value: T;
    onPick: (v: T) => void;
  }) => (
    <div>
      <span className="label">{label}</span>
      {hint && <p className="text-[10px] text-faint -mt-1 mb-1.5 leading-relaxed">{hint}</p>}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        {options.map((o) => (
          <button key={o} onClick={() => onPick(o)} className={`pill shrink-0 ${value === o ? 'pill-on' : ''}`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="card p-3.5 space-y-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" />
          <input
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="مثلاً: ژست رمانتیک دونفره، مناسب کویر، کادر واید..."
            className="field !pr-9 !pl-9 !rounded-full"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-faint"
              aria-label="پاک کردن جستجو"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setExpanded((v) => !v)}
          className="btn btn-ghost !px-3 !py-2.5 shrink-0"
          style={{ borderColor: expanded || dirty ? 'var(--color-gold)' : 'var(--color-line)' }}
          aria-label="فیلترها"
        >
          <SlidersHorizontal className="w-4 h-4 text-gold" />
        </button>
      </div>

      {/* ۱) محور اصلی: مرحله سناریو */}
      <div>
        <span className="label">مرحله سناریو (محور اصلی)</span>
        <ScenarioRail
          poses={allPoses || []}
          value={filters.scenario}
          onPick={(v) =>
            onChange({
              ...filters,
              scenario: v,
              detailSubject: v === 'جزئیات و اکسسوری' ? filters.detailSubject : 'همه',
            })
          }
        />
      </div>

      {filters.scenario === 'جزئیات و اکسسوری' && (
        <Row label="موضوع جزئیات" options={DETAIL_OPTS} value={filters.detailSubject} onPick={(v) => onChange({ ...filters, detailSubject: v })} />
      )}

      {/* ۲) عمومی یا اختصاصی */}
      <div>
        <span className="label flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-gold" />
          نوع ژست
        </span>
        <p className="text-[10px] text-faint -mt-1 mb-1.5 leading-relaxed">
          «عمومی» یعنی مستقل از لوکیشن و قابل اجرا در اکثر محیط‌ها. «اختصاصی لوکیشن» فقط جایی معنا
          دارد که ژست به ویژگی فیزیکی آن محیط وابسته است.
        </p>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {SCOPE_OPTS.map((o) => (
            <button
              key={o}
              onClick={() => onChange({ ...filters, scope: o })}
              className={`pill shrink-0 ${filters.scope === o ? 'pill-on' : ''}`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* ۳) لوکیشن = سازگاری، نه مالکیت */}
      <div>
        <span className="label flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-gold" />
          قابل اجرا در لوکیشن
        </span>
        <p className="text-[10px] text-faint -mt-1 mb-1.5 leading-relaxed">
          لوکیشن یک Context است، نه دسته‌بندی. با انتخاب هر محیط، ژست‌های عمومی سازگار + ژست‌های
          اختصاصی همان محیط را می‌بینی.
        </p>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {LOCS.map((o) => (
            <button
              key={o}
              onClick={() => onChange({ ...filters, location: o })}
              className={`pill shrink-0 ${filters.location === o ? 'pill-on' : ''}`}
            >
              {o}
            </button>
          ))}
        </div>
      </div>

      {/* ۴) ویژگی‌های اصلی */}
      <Row label="حال‌وهوا" options={MOOD_OPTS} value={filters.mood} onPick={(v) => onChange({ ...filters, mood: v })} />
      <Row label="کادر" options={FRAMING_OPTS} value={filters.framing} onPick={(v) => onChange({ ...filters, framing: v })} />

      {expanded && (
        <div className="space-y-3 a-fade">
          <Row label="حرکت" options={MOVE_OPTS} value={filters.movement} onPick={(v) => onChange({ ...filters, movement: v })} />
          <Row label="فضا" options={ENV_OPTS} value={filters.environment} onPick={(v) => onChange({ ...filters, environment: v })} />
          <Row label="دسته‌بندی سوژه" options={CATEGORIES} value={filters.category} onPick={(v) => onChange({ ...filters, category: v })} />
          <Row label="حالت بدن" options={TYPES} value={filters.poseType} onPick={(v) => onChange({ ...filters, poseType: v })} />
          <Row label="سطح سختی" options={DIFFS} value={filters.difficulty} onPick={(v) => onChange({ ...filters, difficulty: v })} />
          <button
            onClick={() => onChange({ ...filters, customOnly: !filters.customOnly })}
            className={`pill ${filters.customOnly ? 'pill-on' : ''}`}
          >
            فقط ژست‌های خودم
          </button>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-line">
        <span className="text-[11px] text-muted font-semibold">{total} ژست یافت شد</span>
        {dirty && (
          <button onClick={() => onChange({ ...EMPTY_FILTERS })} className="flex items-center gap-1 text-[11px] font-bold text-gold">
            <RotateCcw className="w-3.5 h-3.5" />
            پاک کردن فیلترها
          </button>
        )}
      </div>
    </div>
  );
};
