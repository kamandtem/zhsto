import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Scenario,
  LocationType,
  Mood,
  Framing,
  PoseType,
  DifficultyLevel,
  Movement,
  Environment,
  CategoryType,
  FilterState,
} from '../types/pose';
import { SCENARIOS, LOCATIONS, MOODS, FRAMINGS, MOVEMENTS, ENVIRONMENTS } from '../data/taxonomy';

interface FiltersProps {
  value: FilterState;
  onChange: (f: FilterState) => void;
}

const POSE_TYPES: PoseType[] = ['ایستاده', 'نشسته', 'راه رفتن', 'بغل کردن', 'رمانتیک', 'رسمی', 'خلاقانه', 'حرکتی'];
const DIFFICULTIES: DifficultyLevel[] = ['آسان', 'متوسط', 'حرفه‌ای'];
const CATEGORIES: CategoryType[] = ['عروس و داماد', 'عروس', 'داماد', 'زوج', 'گروهی'];

export const Filters: React.FC<FiltersProps> = ({ value, onChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleScenario = (scenario: Scenario | 'همه') => {
    onChange({ ...value, scenario });
  };

  const handleLocation = (location: LocationType | 'همه') => {
    onChange({ ...value, location });
  };

  const handleMood = (mood: Mood | 'همه') => {
    onChange({ ...value, mood });
  };

  const handleFraming = (framing: Framing | 'همه') => {
    onChange({ ...value, framing });
  };

  // Advanced filters
  const handlePoseType = (poseType: PoseType | 'همه') => {
    onChange({ ...value, poseType });
  };

  const handleDifficulty = (difficulty: DifficultyLevel | 'همه') => {
    onChange({ ...value, difficulty });
  };

  const handleMovement = (movement: Movement | 'همه') => {
    onChange({ ...value, movement });
  };

  const handleEnvironment = (environment: Environment | 'همه') => {
    onChange({ ...value, environment });
  };

  const handleCategory = (category: CategoryType | 'همه') => {
    onChange({ ...value, category });
  };

  return (
    <div className="space-y-3">
      {/* PRIMARY FILTERS */}
      <div className="space-y-2">
        <div>
          <label className="text-xs font-semibold text-gray-300">سناریو</label>
          <select
            value={value.scenario || 'همه'}
            onChange={(e) => handleScenario(e.target.value as Scenario | 'همه')}
            className="w-full mt-1 px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="همه">همه سناریوها</option>
            {SCENARIOS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-300">لوکیشن</label>
          <select
            value={value.location || 'همه'}
            onChange={(e) => handleLocation(e.target.value as LocationType | 'همه')}
            className="w-full mt-1 px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="همه">همه لوکیشن‌ها</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-300">حال و هوا</label>
          <select
            value={value.mood || 'همه'}
            onChange={(e) => handleMood(e.target.value as Mood | 'همه')}
            className="w-full mt-1 px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="همه">همه حال‌ها</option>
            {MOODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-300">فریمینگ</label>
          <select
            value={value.framing || 'همه'}
            onChange={(e) => handleFraming(e.target.value as Framing | 'همه')}
            className="w-full mt-1 px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
          >
            <option value="همه">همه فریمینگ‌ها</option>
            {FRAMINGS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ADVANCED FILTERS */}
      <div className="border-t border-gray-700 pt-3 mt-3">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-xs font-semibold text-blue-400 hover:text-blue-300"
        >
          <ChevronDown size={14} className={`transition ${showAdvanced ? 'rotate-180' : ''}`} />
          فیلترهای پیشرفته
        </button>

        {showAdvanced && (
          <div className="space-y-2 mt-3">
            <div>
              <label className="text-xs font-semibold text-gray-300">نوع ژست</label>
              <select
                value={value.poseType || 'همه'}
                onChange={(e) => handlePoseType(e.target.value as PoseType | 'همه')}
                className="w-full mt-1 px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="همه">همه انواع</option>
                {POSE_TYPES.map((pt) => (
                  <option key={pt} value={pt}>
                    {pt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300">سختی</label>
              <select
                value={value.difficulty || 'همه'}
                onChange={(e) => handleDifficulty(e.target.value as DifficultyLevel | 'همه')}
                className="w-full mt-1 px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="همه">همه سطح‌ها</option>
                {DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300">حرکت</label>
              <select
                value={value.movement || 'همه'}
                onChange={(e) => handleMovement(e.target.value as Movement | 'همه')}
                className="w-full mt-1 px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="همه">همه حرکات</option>
                {MOVEMENTS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300">محیط</label>
              <select
                value={value.environment || 'همه'}
                onChange={(e) => handleEnvironment(e.target.value as Environment | 'همه')}
                className="w-full mt-1 px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="همه">همه محیط‌ها</option>
                {ENVIRONMENTS.map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300">دسته</label>
              <select
                value={value.category || 'همه'}
                onChange={(e) => handleCategory(e.target.value as CategoryType | 'همه')}
                className="w-full mt-1 px-3 py-2 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="همه">همه دسته‌ها</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
