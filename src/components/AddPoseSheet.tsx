import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Pose, LocationType, Scenario, Mood, Framing, Movement, Environment, DetailSubject, ImageOrientation } from '../types/pose';
import { SCENARIOS, LOCATIONS, MOODS, FRAMINGS, MOVEMENTS, ENVIRONMENTS } from '../data/taxonomy';
import { savePose } from '../services/storage';
import { newId } from '../services/util';

interface AddPoseSheetProps {
  onAdd: (pose: Pose) => void;
  onClose: () => void;
}

const DETAIL_SUBJECTS: DetailSubject[] = ['دکور', 'حلقه', 'دسته‌گل', 'لباس', 'کفش', 'اکسسوری'];

export const AddPoseSheet: React.FC<AddPoseSheetProps> = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [scenario, setScenario] = useState<Scenario>('تفریحی و عفویی');
  const [location, setLocation] = useState<LocationType>('باغ و عمارت');
  const [mood, setMood] = useState<Mood>('رومانتیک');
  const [framing, setFraming] = useState<Framing>('تمام‌بدن');
  const [movement, setMovement] = useState<Movement>('ایستا');
  const [environment, setEnvironment] = useState<Environment>('بیرون');
  const [detailSubject, setDetailSubject] = useState<DetailSubject>('دکور');
  const [imageOrientation, setImageOrientation] = useState<ImageOrientation>('landscape');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!name || !image) {
      alert('نام و تصویر الزامی است');
      return;
    }

    const newPose: Pose = {
      id: newId(),
      name,
      description,
      image,
      scenario,
      scope: 'عمومی',
      suitableLocations: [location],
      locations: [location],
      mood,
      framing,
      movement,
      environment,
      detailSubject: scenario === 'جزئیات صحنه' ? detailSubject : undefined,
      imageOrientation,
      isCustom: true,
    };

    savePose(newPose);
    onAdd(newPose);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full bg-gray-800 rounded-t-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">ژست جدید</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-full"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-300">تصویر</label>
          {image ? (
            <img src={image} alt="preview" className="w-full h-48 object-cover rounded" />
          ) : (
            <label className="block w-full p-4 border-2 border-dashed border-gray-600 rounded cursor-pointer hover:border-blue-500 text-center">
              <Plus size={24} className="mx-auto mb-2 text-gray-400" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={loading}
              />
              {loading ? 'در حال بارگذاری...' : 'کلیک کنید یا تصویر را رها کنید'}
            </label>
          )}
        </div>

        {/* Name */}
        <div>
          <label className="text-sm font-semibold text-gray-300">نام</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none"
            placeholder="نام ژست"
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-semibold text-gray-300">توضیحات</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none"
            placeholder="توضیحات"
            rows={3}
          />
        </div>

        {/* Scenario */}
        <div>
          <label className="text-sm font-semibold text-gray-300">سناریو</label>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value as Scenario)}
            className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none"
          >
            {SCENARIOS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Detail Subject (if scenario is جزئیات صحنه) */}
        {scenario === 'جزئیات صحنه' && (
          <div>
            <label className="text-sm font-semibold text-gray-300">موضوع جزئیات</label>
            <select
              value={detailSubject}
              onChange={(e) => setDetailSubject(e.target.value as DetailSubject)}
              className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none"
            >
              {DETAIL_SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Location */}
        <div>
          <label className="text-sm font-semibold text-gray-300">لوکیشن</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value as LocationType)}
            className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Mood */}
        <div>
          <label className="text-sm font-semibold text-gray-300">حال و هوا</label>
          <select
            value={mood}
            onChange={(e) => setMood(e.target.value as Mood)}
            className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none"
          >
            {MOODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Framing */}
        <div>
          <label className="text-sm font-semibold text-gray-300">فریمینگ</label>
          <select
            value={framing}
            onChange={(e) => setFraming(e.target.value as Framing)}
            className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none"
          >
            {FRAMINGS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Movement */}
        <div>
          <label className="text-sm font-semibold text-gray-300">حرکت</label>
          <select
            value={movement}
            onChange={(e) => setMovement(e.target.value as Movement)}
            className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none"
          >
            {MOVEMENTS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Environment */}
        <div>
          <label className="text-sm font-semibold text-gray-300">محیط</label>
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value as Environment)}
            className="w-full mt-1 px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none"
          >
            {ENVIRONMENTS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>

        {/* Image Orientation */}
        <div>
          <label className="text-sm font-semibold text-gray-300">جهت تصویر</label>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setImageOrientation('landscape')}
              className={`flex-1 py-2 rounded ${
                imageOrientation === 'landscape'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              📐 افقی
            </button>
            <button
              onClick={() => setImageOrientation('portrait')}
              className={`flex-1 py-2 rounded ${
                imageOrientation === 'portrait'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              📏 عمودی
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            لغو
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            افزودن
          </button>
        </div>
      </div>
    </div>
  );
};
