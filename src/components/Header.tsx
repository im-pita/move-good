import React from 'react';
import { ArrowLeft, Sparkles, BookOpen, Smartphone, Maximize2 } from 'lucide-react';

interface HeaderProps {
  currentView: 'intro' | 'upload' | 'scanning' | 'results';
  onBack: () => void;
  onOpenPortfolio: () => void;
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onBack,
  onOpenPortfolio,
  isFrameMode,
  onToggleFrameMode,
}) => {
  const showBack = currentView === 'upload' || currentView === 'results';

  return (
    <header className="w-full flex items-center justify-between px-5 py-4 border-b border-stone-200/80 bg-[#FAF8F2]/90 backdrop-blur-md sticky top-0 z-30">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-[#163323] flex items-center justify-center text-[#D5F044] shadow-sm shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="flex items-baseline">
          <span className="text-xl font-bold tracking-tight text-[#163323] font-serif">
            Move
          </span>
          <span className="text-xl font-bold tracking-tight text-[#E26D5C] font-serif italic">
            Good
          </span>
        </div>
      </div>

      {/* Action / Context Slot */}
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 bg-white/80 hover:bg-white border border-stone-200 transition-all shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        ) : (
          <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-500 bg-stone-200/60 px-2.5 py-1 rounded-full">
            Student Prototype
          </span>
        )}

        {/* Portfolio & Architecture Drawer trigger */}
        <button
          onClick={onOpenPortfolio}
          title="View Product Architecture & AI Spec for Recruiters"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#163323] bg-[#D5F044] hover:bg-[#c9e63c] transition-all shadow-xs"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Portfolio Spec</span>
        </button>

        {/* Device Viewport Toggle (Desktop Only) */}
        <button
          onClick={onToggleFrameMode}
          title={isFrameMode ? 'Switch to Full Width View' : 'Switch to iPhone Frame View'}
          className="hidden md:flex p-1.5 rounded-full text-slate-600 hover:text-slate-900 bg-white/70 hover:bg-white border border-stone-200 transition-colors"
        >
          {isFrameMode ? (
            <Maximize2 className="w-4 h-4" />
          ) : (
            <Smartphone className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
};
