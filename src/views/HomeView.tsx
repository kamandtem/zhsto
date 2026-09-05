import React from 'react';
import {
  ArrowLeft,
  Heart,
  Clock,
  Sparkles,
  PlusCircle,
  Users2,
  UserRound,
  UserSquare2,
  HeartHandshake,
  Users,
  MapPin,
  Compass,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { CategoryType, LocationType, Mood, MyLocation, Pose, ScenarioCategory, ViewTab } from '../types/pose';
import { PoseCard } from '../components/PoseCard';
import { SectionGuide } from '../components/SectionGuide';
import { LOCATIONS } from '../data/locations';
import { WeatherCard } from '../components/WeatherCard';
import { SCENARIOS, scenarioOf, scopeOf, splitByScope } from '../data/taxonomy';

interface Props {
  poses: Pose[];
  favoriteIds: string[];
  recentIds: string[];
  onSelect: (p: Pose) => void;
  onDelete: (p: Pose) => void;
  onAddToProject: (p: Pose) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenAddPose: () => void;
  onPickCategory: (c: CategoryType) => void;
  onPickLocation: (l: LocationType) => void;
  onPickScenario: (s: ScenarioCategory) => void;
  onPickMood: (m: Mood) => void;
  onTab: (t: ViewTab) => void;
  selectedLocation: MyLocation | null;
  onOpenWeather: () => void;
  onOpenMyLocations: () => void;
  onQuickStart: () => void;
}

const CATEGORY_META: { name: CategoryType; icon: LucideIcon; sub: string }[] = [
  { name: 'عروس و داماد', icon: Users2, sub: 'ژست‌های دونفره اصلی' },
  { name: 'عروس', icon: UserRound, sub: 'پرتره تک‌نفره' },
  { name: 'داماد', icon: UserSquare2, sub: 'استایل و پرتره' },
  { name: 'زوج', icon: HeartHandshake, sub: 'صمیمی و کژوال' },
  { name: 'گروهی', icon: Users, sub: 'ساقدوش و خانواده' },
];

export const HomeView: React.FC<Props> = ({
  poses,
  favoriteIds,
  recentIds,
  onSelect,
  onDelete,
  onAddToProject,
  onToggleFavorite,
  onOpenAddPose,
  onPickCategory,
  onPickLocation,
  onPickScenario,
  onPickMood,
  onTab,
  selectedLocation,
  onOpenWeather,
  onOpenMyLocations,
  onQuickStart,
}) => {
  const favorites = poses.filter((p) => favoriteIds.includes(p.id));
  const recents = recentIds
    .map((id) => poses.find((p) => p.id === id))
    .filter(Boolean) as Pose[];
  const mine = poses.filter((p) => p.isCustom);

  const countOf = (c: CategoryType) => poses.filter((p) => p.category === c).length;
  const countScenario = (k: ScenarioCategory) => poses.filter((p) => scenarioOf(p) === k).length;
  const generalCount = poses.filter((p) => scopeOf(p) === 'عمومی').length;

  return (
    <div className="space-y-7">
      <SectionGuide section="home-scenario-v2" title="مدل جدید: سناریو، نه لوکیشن" text="اول بگو کجای روز تصویربرداری هستی، بعد اگر لازم بود لوکیشن را انتخاب کن. ژست‌های عمومی همه‌جا اجرا می‌شوند؛ لوکیشن فقط Context است." />

      <WeatherCard selected={selectedLocation} onOpen={onOpenWeather} />
      {/* هیرو */}
      <section className="card relative overflow-hidden p-5 sm:p-7">
        <div
          className="absolute -top-16 -left-10 w-56 h-56 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'color-mix(in srgb, var(--color-gold) 22%, transparent)' }}
        />
        <div
          className="absolute -bottom-20 -right-10 w-56 h-56 rounded-full blur-3xl pointer-events-none"
          style={{ background: 'color-mix(in srgb, var(--color-plum) 26%, transparent)' }}
        />

        <div className="relative space-y-3.5">
          <span className="pill">
            <Sparkles className="w-3 h-3 text-gold" />
            {poses.length} ژست آماده اجرا
          </span>

          <h1 className="text-[22px] sm:text-[26px] font-extrabold leading-snug">
            سر صحنه معطل نمان.
            <br />
            <span className="gold-text">ژست بعدی را همین‌جا بگیر.</span>
          </h1>

          <p className="text-[12px] text-muted leading-relaxed max-w-md">
            کتابخانه بر اساس <span className="font-bold text-gold">سناریوی تصویربرداری</span> چیده شده،
            نه لوکیشن. {generalCount} ژست عمومی داری که در اکثر محیط‌ها اجرا می‌شود؛ لوکیشن فقط تعیین
            می‌کند کدام‌ها این‌جا جواب می‌دهند.
          </p>

          <button
            onClick={onQuickStart}
            className="btn btn-primary w-full !py-3.5 !text-[14px]"
          >
            <Compass className="w-4.5 h-4.5" />
            الان کجای مراسمی؟ — شروع سریع
          </button>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button onClick={onOpenAddPose} className="btn btn-ghost">
              <PlusCircle className="w-4 h-4 text-gold" />
              ژست خودم
            </button>
            <button onClick={onOpenMyLocations} className="btn btn-ghost">
              <MapPin className="w-4 h-4 text-gold" />
              لوکیشن‌های من
            </button>
          </div>
        </div>
      </section>

      {/* ۱) محور اصلی: سناریوی تصویربرداری */}
      <section className="space-y-3">
        <SectionHead title="کجای روز تصویربرداری هستی؟" onMore={() => onTab('library')} />
        <p className="text-[11px] text-muted leading-relaxed -mt-1">
          ترتیب زیر همان توالی واقعی یک Pre-Wedding / فرمالیتی است. از هر مرحله وارد شو.
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {SCENARIOS.map((sc, i) => {
            const n = countScenario(sc.key);
            return (
              <button
                key={sc.key}
                onClick={() => onPickScenario(sc.key)}
                className="card card-hover p-3 text-right min-h-24 flex flex-col justify-between"
                style={n === 0 ? { opacity: 0.5 } : undefined}
              >
                <div className="flex items-center justify-between gap-1">
                  <span
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-extrabold shrink-0"
                    style={{
                      background: 'color-mix(in srgb, var(--color-gold) 16%, transparent)',
                      color: 'var(--color-gold)',
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="pill !text-[10px] !px-2 !py-0.5">{n}</span>
                </div>
                <div className="mt-1.5">
                  <h3 className="font-bold text-[12px] leading-snug">{sc.key}</h3>
                  <p className="text-[9.5px] text-faint line-clamp-1 mt-0.5">{sc.en}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ۲) شروع از نیاز، نه از لوکیشن */}
      <section className="space-y-3">
        <SectionHead title="الان چه ژستی می‌خواهی؟" />
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <button onClick={() => onPickMood('رمانتیک')} className="pill shrink-0">
            یک ژست رمانتیک دونفره
          </button>
          <button onClick={() => onPickMood('شاد')} className="pill shrink-0">
            یک ژست شاد و پرانرژی
          </button>
          <button onClick={() => onPickMood('آرام')} className="pill shrink-0">
            یک ژست آرام و ساده
          </button>
          <button onClick={() => onPickMood('دراماتیک')} className="pill shrink-0">
            یک ژست دراماتیک
          </button>
          <button onClick={() => onPickMood('رسمی')} className="pill shrink-0">
            یک ژست رسمی
          </button>
        </div>
      </section>

      {/* ۳) لوکیشن، به‌عنوان Context و نه دسته‌بندی */}
      <section className="space-y-3">
        <SectionHead title="Location Context" onMore={() => onTab('locations')} />
        <p className="text-[11px] text-muted leading-relaxed -mt-1">
          لوکیشن دسته‌بندی نیست. عدد فیروزه‌ای = ژست عمومی قابل اجرا این‌جا، عدد طلایی = ژست اختصاصی
          همین محیط.
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {LOCATIONS.map((l) => {
            const split = splitByScope(poses, l.key);
            return (
              <button
                key={l.key}
                onClick={() => onPickLocation(l.key)}
                className="card card-hover relative overflow-hidden p-3.5 text-right h-24 flex flex-col justify-between"
              >
                <img
                  src={l.cover}
                  alt={l.key}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in srgb, ${l.colors[0]} 55%, transparent), color-mix(in srgb, ${l.colors[1]} 30%, transparent) 60%, rgba(6,5,10,.55))`,
                  }}
                />
                <div className="relative flex items-center justify-between">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(8,6,14,.32)' }}
                  >
                    <l.icon className="w-4 h-4" style={{ color: '#FFF8EC' }} />
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(8,6,14,.5)' }}
                  >
                    <span style={{ color: '#4FC7B4' }}>{split.general.length}</span>
                    <span style={{ color: 'rgba(255,248,236,.5)' }}> · </span>
                    <span style={{ color: '#F0B357' }}>{split.special.length}</span>
                  </span>
                </div>
                <div className="relative">
                  <h3 className="font-extrabold text-[13px]" style={{ color: '#FFF8EC' }}>
                    {l.key}
                  </h3>
                  <p className="text-[10px] line-clamp-1" style={{ color: 'rgba(255,248,236,.75)' }}>
                    {l.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* دسته‌بندی‌ها */}
      <section className="space-y-3">
        <SectionHead title="سوژه (فیلتر کمکی)" onMore={() => onTab('library')} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {CATEGORY_META.map((c) => (
            <button
              key={c.name}
              onClick={() => onPickCategory(c.name)}
              className="card card-hover p-3.5 text-right h-24 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'color-mix(in srgb, var(--color-gold) 14%, transparent)', color: 'var(--color-gold)' }}
                >
                  <c.icon className="w-4 h-4" />
                </span>
                <span className="pill !text-[10px] !px-2 !py-0.5">{countOf(c.name)}</span>
              </div>
              <div>
                <h3 className="font-bold text-[12px]">{c.name}</h3>
                <p className="text-[10px] text-faint line-clamp-1">{c.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {mine.length > 0 && (
        <section className="space-y-3">
          <SectionHead
            title={`ژست‌های من (${mine.length})`}
            icon={<Sparkles className="w-4 h-4 text-gold" />}
            onMore={() => onTab('myposes')}
          />
          <div className="grid grid-cols-2 gap-3">
            {mine.slice(0, 2).map((p) => (
              <PoseCard
                key={p.id}
                pose={p}
                isFavorite={favoriteIds.includes(p.id)}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelect}
                onDelete={onDelete}
                onAddToProject={onAddToProject}
                compact
              />
            ))}
          </div>
        </section>
      )}

      {favorites.length > 0 && (
        <section className="space-y-3">
          <SectionHead
            title={`نشان‌شده‌ها (${favorites.length})`}
            icon={<Heart className="w-4 h-4" style={{ color: 'var(--color-rose)' }} fill="currentColor" />}
            onMore={() => onTab('favorites')}
          />
          <div className="grid grid-cols-2 gap-3">
            {favorites.slice(0, 4).map((p) => (
              <PoseCard
                key={p.id}
                pose={p}
                isFavorite
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelect}
                onDelete={onDelete}
                onAddToProject={onAddToProject}
                compact
              />
            ))}
          </div>
        </section>
      )}

      {recents.length > 0 && (
        <section className="space-y-3">
          <SectionHead title="آخرین ژست‌های دیده‌شده" icon={<Clock className="w-4 h-4 text-gold" />} />
          <div className="grid grid-cols-2 gap-3">
            {recents.slice(0, 4).map((p) => (
              <PoseCard
                key={p.id}
                pose={p}
                isFavorite={favoriteIds.includes(p.id)}
                onToggleFavorite={onToggleFavorite}
                onSelect={onSelect}
                onDelete={onDelete}
                onAddToProject={onAddToProject}
                compact
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

const SectionHead: React.FC<{
  title: string;
  icon?: React.ReactNode;
  onMore?: () => void;
}> = ({ title, icon, onMore }) => (
  <div className="flex items-center justify-between">
    <h2 className="flex items-center gap-2 text-[15px] font-extrabold">
      {icon}
      {title}
    </h2>
    {onMore && (
      <button onClick={onMore} className="flex items-center gap-1 text-[11px] font-bold text-gold">
        مشاهده همه
        <ArrowLeft className="w-3.5 h-3.5" />
      </button>
    )}
  </div>
);
