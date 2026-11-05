import React from 'react';
import { Sparkles } from 'lucide-react';

interface ScanningViewProps {
  previewUrl: string | null;
  modeLabel?: string;
}

export const ScanningView: React.FC<ScanningViewProps> = ({
  previewUrl,
  modeLabel = 'GEMINI VISION SCAN',
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[520px] px-6 py-12 bg-[#163323] text-white rounded-b-3xl sm:rounded-3xl shadow-inner relative overflow-hidden select-none">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#D5F044]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Image Thumbnail with active animated laser scanner */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl overflow-hidden border-2 border-[#D5F044]/30 shadow-2xl mb-8 bg-stone-900">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Scanning pile"
            className="w-full h-full object-cover filter brightness-90 contrast-105"
          />
        ) : (
          <div className="w-full h-full bg-stone-800 flex items-center justify-center text-stone-500">
            Scanning photo...
          </div>
        )}

        {/* Animated laser line */}
        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D5F044] to-transparent shadow-[0_0_15px_#D5F044] animate-laser" />

        {/* Floating lime badge in corner */}
        <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-[#D5F044] text-[#163323] flex items-center justify-center shadow-lg">
          <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
        </div>
      </div>

      {/* Tag indicator */}
      <p className="text-[11px] font-bold tracking-widest text-[#D5F044] uppercase mb-2">
        {modeLabel}
      </p>

      {/* Title */}
      <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#FAF8F2] text-center leading-tight mb-3">
        Sorting the good stuff...
      </h2>

      {/* Subtitle */}
      <p className="text-xs sm:text-sm text-stone-300 text-center max-w-xs leading-relaxed mb-8">
        Identifying items, counting bundles, and matching them with nearby verified community organizations.
      </p>

      {/* Animated lime progress indicator */}
      <div className="w-44 h-1.5 bg-stone-700/80 rounded-full overflow-hidden relative">
        <div className="absolute top-0 bottom-0 left-0 bg-[#D5F044] rounded-full animate-pulse w-3/5" />
      </div>

      {/* Engineering note */}
      <p className="text-[10px] text-stone-400 text-center mt-6">
        Principle 1: The AI describes categories; local code decides routing.
      </p>
    </div>
  );
};
