import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  CheckCircle2,
  HelpCircle,
  Pencil,
  Trash2,
  Plus,
  RotateCcw,
  AlertTriangle,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { DetectedItem, MatchResult, Organization, Category } from '../types';
import { ItemEditModal } from './ItemEditModal';

interface ResultsViewProps {
  matchResult: MatchResult;
  allItems: DetectedItem[];
  previewUrl: string | null;
  sourceSummary?: string;
  onConfirmCondition: (itemId: string) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateItem: (updated: DetectedItem) => void;
  onAddItem: (item: DetectedItem) => void;
  onReset: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  matchResult,
  allItems,
  previewUrl,
  sourceSummary,
  onConfirmCondition,
  onRemoveItem,
  onUpdateItem,
  onAddItem,
  onReset,
}) => {
  const [editingItem, setEditingItem] = useState<DetectedItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('blanket');

  const { stops, unmatched, pendingChecks } = matchResult;

  // Active confirmed items count
  const activeItemsCount = allItems.filter(
    (i) => !i.needsConditionCheck || i.isConditionConfirmed
  ).length;

  const handleCreateNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    const newItem: DetectedItem = {
      id: `manual-item-${Date.now()}`,
      label: newLabel.trim(),
      category: newCategory,
      quantity: 1,
      condition: 'good',
      confidence: 'high',
      needsConditionCheck: newCategory === 'heater' || newCategory === 'fan',
      conditionCheckQuestion:
        newCategory === 'heater'
          ? 'Does this heater power on without issues or cord fraying?'
          : newCategory === 'fan'
          ? 'Does this fan spin properly and power on safely?'
          : undefined,
      isConditionConfirmed: !(newCategory === 'heater' || newCategory === 'fan'),
      note: 'Manually added by student',
    };

    onAddItem(newItem);
    setNewLabel('');
    setShowAddForm(false);
  };

  // Header background theme styles matching Figma prototype
  const getThemeHeaderStyles = (theme: Organization['themeColor']) => {
    switch (theme) {
      case 'lime':
        return {
          headerBg: 'bg-[#D5F044]',
          headerText: 'text-[#163323]',
          badgeBg: 'bg-white/80 text-[#163323]',
        };
      case 'coral':
        return {
          headerBg: 'bg-[#FFB39A]',
          headerText: 'text-[#5C2314]',
          badgeBg: 'bg-white/80 text-[#5C2314]',
        };
      case 'blue':
        return {
          headerBg: 'bg-[#A2D2FF]',
          headerText: 'text-[#0E3559]',
          badgeBg: 'bg-white/80 text-[#0E3559]',
        };
      case 'emerald':
      default:
        return {
          headerBg: 'bg-[#86EFAC]',
          headerText: 'text-[#144225]',
          badgeBg: 'bg-white/80 text-[#144225]',
        };
    }
  };

  return (
    <div className="flex flex-col min-h-full px-4 sm:px-5 py-6 space-y-6">
      {/* Top Heading */}
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-[#E26D5C]">
          Your Donation Plan
        </p>
        <div className="flex flex-wrap items-baseline gap-2">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#163323] font-serif">
            {activeItemsCount} items.
          </h2>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#E26D5C] font-serif italic">
            {stops.length} good stop{stops.length === 1 ? '' : 's'}.
          </h2>
        </div>
      </div>

      {/* Analyzed photo thumbnail strip */}
      <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/70 border border-stone-200 shadow-2xs">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Analyzed pile preview"
            className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-stone-200 flex items-center justify-center shrink-0 text-stone-500 text-xs">
            Pile
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-slate-900 truncate">
            Photo analyzed
          </p>
          <p className="text-[11px] text-stone-500 truncate mt-0.5">
            {sourceSummary || 'Classified with Gemini 3.8 Flash Vision'}
          </p>
        </div>
      </div>

      {/* Condition Check Section (Yellow Card from Figma screen 4) */}
      {pendingChecks.length > 0 && (
        <div className="rounded-3xl bg-[#FEF3C7] border border-[#FDE68A] p-5 space-y-4 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-sans">
                A quick condition check
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed mt-0.5">
                A photo can&apos;t tell us everything. Confirm these before donating.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {pendingChecks.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 shadow-xs border border-[#FDE68A]/60 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs sm:text-sm font-semibold text-stone-900 leading-snug">
                    {item.conditionCheckQuestion ||
                      `Does the ${item.label.toLowerCase()} work properly, with no damage?`}
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                    Needs Check
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onConfirmCondition(item.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#163323] hover:bg-[#11271b] text-white font-medium text-xs text-center shadow-xs transition-colors"
                  >
                    Yes, confirmed
                  </button>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="py-2 px-3 rounded-xl bg-white hover:bg-stone-100 text-stone-600 border border-stone-300 font-medium text-xs transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Donation Stops Cards (Figma screens 4, 5, 6) */}
      <div className="space-y-5">
        {stops.map((stop) => {
          const themeStyle = getThemeHeaderStyles(stop.organization.themeColor);
          return (
            <div
              key={stop.organization.id}
              className="rounded-3xl overflow-hidden border border-stone-200/90 bg-white shadow-sm"
            >
              {/* Card Color-Coded Header */}
              <div className={`${themeStyle.headerBg} p-5 ${themeStyle.headerText}`}>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${themeStyle.badgeBg}`}
                  >
                    {stop.organization.badgeNumber}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-black/10 px-2.5 py-0.5 rounded-full">
                    Donation Stop
                  </span>
                </div>

                <h3 className="text-2xl font-bold font-serif tracking-tight leading-tight">
                  {stop.organization.name}
                </h3>
                <p className="text-xs font-medium opacity-90 mt-1">
                  {stop.organization.acceptsDescription}
                </p>
              </div>

              {/* Card Body Details */}
              <div className="p-5 space-y-4">
                {/* Address & Hours */}
                <div className="space-y-1.5 text-xs text-stone-600 border-b border-stone-100 pb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{stop.organization.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{stop.organization.hours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-400 pt-1">
                    <span>Last verified: {stop.organization.lastVerified}</span>
                    <span>·</span>
                    <span>{stop.organization.isSample ? 'Sample data' : 'Verified Partner'}</span>
                    {stop.organization.website && (
                      <a
                        href={stop.organization.website}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-0.5 text-[#163323] underline ml-auto hover:text-[#E26D5C]"
                      >
                        <span>Visit</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Matched Items Section */}
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Your matched items ({stop.items.length})
                  </p>

                  <div className="divide-y divide-stone-100">
                    {stop.items.map((item) => (
                      <div
                        key={item.id}
                        className="py-2.5 flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-slate-800 truncate">
                                {item.label}
                              </span>
                              {item.quantity > 1 && (
                                <span className="text-[11px] font-bold text-stone-600 bg-stone-100 px-1.5 py-0.2 rounded-md">
                                  ×{item.quantity}
                                </span>
                              )}
                            </div>
                            {item.note && (
                              <p className="text-[11px] text-stone-400 truncate">
                                {item.note}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Edit & Delete Controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                            title="Edit detected item"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Remove from bundle"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Unmatched Items Section (if any) */}
      {unmatched.length > 0 && (
        <div className="rounded-3xl bg-stone-100 border border-stone-200/80 p-5 space-y-3">
          <div className="flex items-center gap-2 text-stone-800">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <h4 className="text-sm font-bold">
              Items without a direct drop-off match ({unmatched.length})
            </h4>
          </div>
          <p className="text-xs text-stone-600">
            Local shelters and thrift stores couldn&apos;t accept these items based on current rules. Consider posting to RPI Free & For Sale, the campus mutual aid Slack, or recycling.
          </p>
          <div className="divide-y divide-stone-200/80">
            {unmatched.map((item) => (
              <div
                key={item.id}
                className="py-2 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-stone-400" />
                  <span className="font-medium text-stone-800">{item.label}</span>
                  <span className="text-[10px] text-stone-500">({item.category})</span>
                </div>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-stone-400 hover:text-red-600 text-xs"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Item Add Form / Toggle */}
      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-3 px-4 rounded-2xl border border-dashed border-stone-300 bg-white/60 hover:bg-white text-xs font-semibold text-stone-700 flex items-center justify-center gap-2 transition-all shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add another item manually to test routing</span>
        </button>
      ) : (
        <form
          onSubmit={handleCreateNewItem}
          className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-3 text-xs"
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-800">Add Item to Bundle</span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-stone-400 hover:text-stone-600 text-xs"
            >
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input
              type="text"
              required
              placeholder="Item name (e.g. Winter coat)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-slate-800"
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as Category)}
              className="px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 text-slate-800"
            >
              <option value="blanket">Blanket / Bedding</option>
              <option value="laundry_basket">Laundry Basket</option>
              <option value="hangers">Clothes Hangers</option>
              <option value="fan">Desk / Box Fan</option>
              <option value="heater">Space Heater</option>
              <option value="shoes">Shoes</option>
              <option value="cleaning_supplies">Cleaning Supplies</option>
              <option value="clothing">Clothing</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-[#163323] text-white rounded-xl font-bold hover:bg-[#11271b]"
          >
            Add & Match
          </button>
        </form>
      )}

      {/* Bottom Disclaimer Card (Figma screen 6) */}
      <div className="rounded-3xl bg-[#EAE7DC]/90 border border-stone-200 p-5 text-center space-y-4">
        <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
          Sample organizations, addresses, and hours are for demonstration only. Always contact a real organization before dropping items off.
        </p>

        <div>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-stone-400/80 bg-white/80 hover:bg-white text-xs font-semibold text-stone-800 shadow-2xs transition-all active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try another photo</span>
          </button>
        </div>
      </div>

      {/* Inline Item Edit Modal */}
      {editingItem && (
        <ItemEditModal
          item={editingItem}
          isOpen={true}
          onClose={() => setEditingItem(null)}
          onSave={onUpdateItem}
        />
      )}
    </div>
  );
};
