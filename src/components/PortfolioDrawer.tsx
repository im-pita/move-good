import React from 'react';
import { X, CheckCircle, ShieldCheck, Terminal, FileCode2, Sparkles, Database, Layers } from 'lucide-react';

interface PortfolioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PortfolioDrawer: React.FC<PortfolioDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#FAF8F2] rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#163323] text-[#D5F044] text-[10px] font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Engineering & Product Portfolio Spec</span>
            </div>
            <h2 className="text-2xl font-bold text-[#163323] font-serif">
              MoveGood: Product Architecture
            </h2>
            <p className="text-xs text-stone-600 mt-1">
              Authored for technical interviewers, hiring managers, and portfolio exploration.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Principles */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#E26D5C]" />
            <span>Guiding Engineering Principles</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1">
              <p className="font-bold text-[#163323]">1. The AI describes; code decides</p>
              <p className="text-stone-600 leading-relaxed">
                Gemini 3.8 Flash Vision solely classifies items and counts. Organization acceptance logic is 100% deterministic TypeScript, preventing hallucinated donation rules.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1">
              <p className="font-bold text-[#163323]">2. Safety & Condition Checks</p>
              <p className="text-stone-600 leading-relaxed">
                High-risk items (space heaters, electrical fans, footwear) trigger human verification cards. Unconfirmed or damaged items are blocked from shelter bundles.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1">
              <p className="font-bold text-[#163323]">3. Honest Metadata</p>
              <p className="text-stone-600 leading-relaxed">
                Every organization rule displays its <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">lastVerified</code> date. Synthetic data is clearly labeled as sample data.
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 space-y-1">
              <p className="font-bold text-[#163323]">4. Privacy & Zero Storage</p>
              <p className="text-stone-600 leading-relaxed">
                Images are resized client-side to 1280px and processed strictly in-memory by the backend without persistent disk storage or database logging.
              </p>
            </div>
          </div>
        </div>

        {/* Architecture Flow Diagram */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#163323]" />
            <span>Full-Stack Pipeline Diagram</span>
          </h3>
          <div className="bg-[#163323] text-stone-200 font-mono text-[11px] p-4 rounded-2xl overflow-x-auto leading-relaxed border border-stone-800">
            <pre>{`[Mobile Upload] ──> Client Canvas Resizing (max 1280px)
        │
        ▼ POST /api/analyze (Express + TSX)
[Gemini 3.8 Flash Vision] ──> Structured JSON (responseSchema)
        │
        ▼ Output: DetectedItem[] (category, condition, quantity)
[Condition Check Gate] ──> Hold heaters & unconfirmed items
        │
        ▼ matchItemsToOrganizations() (src/lib/match.ts)
[Verified Rules: organizations.json] ──> Grouped Stops 01, 02, 03
        │
        ▼
[Interactive Plan] ──> Student can edit, delete, or confirm items`}</pre>
          </div>
        </div>

        {/* Evaluation Plan */}
        <div className="space-y-2 text-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#163323]" />
            <span>Evaluation Plan & Benchmarking</span>
          </h3>
          <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-2 text-stone-700">
            <p>
              Benchmarked against a labeled dataset of real student move-out photos:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-stone-600">
              <li><strong>Category Identification Accuracy:</strong> Real items identified within allowed categories.</li>
              <li><strong>Zero False Routing of Unsafe Goods:</strong> Space heaters and electrical goods require physical condition verification.</li>
              <li><strong>Stop Minimization:</strong> Greedy bundling ensures students visit the fewest drop-off locations possible.</li>
            </ul>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between text-xs text-stone-500 gap-2">
          <span>Project: MoveGood · Designed in Figma Make</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#163323] text-white font-bold hover:bg-[#11271b] ml-auto transition-colors"
          >
            Close Spec
          </button>
        </div>
      </div>
    </div>
  );
};
