import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

interface HeroIntroProps {
  onStart: () => void;
  onOpenPortfolio: () => void;
}

export const HeroIntro: React.FC<HeroIntroProps> = ({ onStart, onOpenPortfolio }) => {
  return (
    <div className="flex flex-col min-h-full px-5 py-6 sm:py-8 justify-between">
      <div className="space-y-6">
        {/* Kicker tag pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-200/70 text-stone-700 text-xs font-semibold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#E26D5C]" />
          <span>Clear your room. Help your community.</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-1">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#163323] font-serif leading-[1.08]">
            Moving out?
          </h1>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#E26D5C] font-serif italic leading-[1.08]">
            Move good.
          </h1>
        </div>

        {/* Editorial Subtitle with accent vertical bar */}
        <div className="pl-4 border-l-2 border-[#163323]/30">
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
            Snap a photo of what you&apos;re leaving behind and we&apos;ll show you where it can go.
            This prototype uses verified community rules and Gemini vision AI—no real donation is scheduled.
          </p>
        </div>

        {/* Primary CTA Button */}
        <div>
          <button
            onClick={onStart}
            className="w-full sm:w-auto inline-flex items-center justify-between gap-4 px-6 py-3.5 rounded-full bg-[#163323] hover:bg-[#11271b] text-white font-medium text-base shadow-md transition-all active:scale-[0.98] group"
          >
            <span>Try it now</span>
            <div className="w-8 h-8 rounded-full bg-[#D5F044] text-[#163323] flex items-center justify-center transition-transform group-hover:translate-x-1">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </div>

      {/* Visual illustration card matching Figma mockup */}
      <div className="mt-8 pt-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#EAE7DC] to-[#DFDCD0] p-5 border border-stone-200/90 shadow-sm">
          {/* Abstract stylized move-out goods illustration */}
          <div className="h-44 sm:h-52 w-full rounded-2xl bg-[#C7D8E6]/50 flex items-center justify-center relative overflow-hidden">
            {/* Organic graphic shapes resembling storage bag, pillow, hamper */}
            <div className="absolute -bottom-6 -left-4 w-32 h-32 rounded-3xl bg-[#E26D5C] rotate-6 opacity-90 shadow-sm" />
            <div className="absolute -bottom-4 right-6 w-36 h-40 rounded-t-3xl bg-[#163323] -rotate-3 opacity-95 shadow-md flex items-start justify-center pt-3">
              <div className="w-12 h-8 rounded-full border-2 border-stone-300/40" />
            </div>
            <div className="absolute bottom-1 w-44 h-12 rounded-xl bg-[#F0C05A] opacity-90 shadow-xs" />
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-[#D5F044] opacity-80" />
            
            <div className="relative z-10 text-center px-4 py-2 bg-white/85 backdrop-blur-md rounded-2xl shadow-sm border border-white/60">
              <p className="text-xs font-bold text-[#163323] font-serif">
                RPI & Capital Region Donation Map
              </p>
              <p className="text-[11px] text-stone-600 mt-0.5">
                Shelters · Community Thrift · Campus ReUse
              </p>
            </div>
          </div>

          {/* Quick value badges */}
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="p-2 rounded-xl bg-white/70 border border-stone-200/60">
              <ShieldCheck className="w-4 h-4 mx-auto text-[#163323] mb-1" />
              <p className="text-[10px] font-semibold text-stone-800">Safety Checks</p>
            </div>
            <div className="p-2 rounded-xl bg-white/70 border border-stone-200/60">
              <CheckCircle2 className="w-4 h-4 mx-auto text-[#E26D5C] mb-1" />
              <p className="text-[10px] font-semibold text-stone-800">Verified Rules</p>
            </div>
            <div className="p-2 rounded-xl bg-white/70 border border-stone-200/60">
              <HeartHandshake className="w-4 h-4 mx-auto text-[#163323] mb-1" />
              <p className="text-[10px] font-semibold text-stone-800">Zero Landfill</p>
            </div>
          </div>
        </div>

        {/* Spec callout */}
        <p className="text-center text-xs text-stone-500 mt-4">
          Built as a portfolio capstone.{' '}
          <button
            onClick={onOpenPortfolio}
            className="text-[#163323] underline font-semibold hover:text-[#E26D5C]"
          >
            Read the engineering spec & tradeoffs
          </button>
        </p>
      </div>
    </div>
  );
};
