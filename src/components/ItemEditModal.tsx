import React, { useState } from 'react';
import { X, Check, Plus, Minus } from 'lucide-react';
import { DetectedItem, Category, Condition } from '../types';

interface ItemEditModalProps {
  item: DetectedItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: DetectedItem) => void;
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'blanket', label: 'Blanket / Bedding' },
  { value: 'laundry_basket', label: 'Laundry Basket / Hamper' },
  { value: 'hangers', label: 'Clothes Hangers' },
  { value: 'fan', label: 'Electric Fan' },
  { value: 'heater', label: 'Space Heater' },
  { value: 'shoes', label: 'Shoes / Footwear' },
  { value: 'cleaning_supplies', label: 'Cleaning Supplies' },
  { value: 'clothing', label: 'Clothing / Coats' },
  { value: 'other', label: 'Other Item' },
];

export const ItemEditModal: React.FC<ItemEditModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
}) => {
  const [label, setLabel] = useState(item.label);
  const [category, setCategory] = useState<Category>(item.category);
  const [quantity, setQuantity] = useState(item.quantity);
  const [condition, setCondition] = useState<Condition>(item.condition);
  const [note, setNote] = useState(item.note || '');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      ...item,
      label: label.trim() || item.label,
      category,
      quantity: Math.max(1, quantity),
      condition,
      note: note.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-[#FAF8F2] rounded-3xl p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <h3 className="text-lg font-bold text-[#163323] font-serif">
            Edit Detected Item
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 py-4 text-sm">
          {/* Label input */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              Item Name / Description
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#163323]/20"
              placeholder="e.g. Ceramic space heater"
            />
          </div>

          {/* Category dropdown */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              Category (determines routing)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#163323]/20"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-xl bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-100"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-base text-stone-800 min-w-8 text-center tabular-nums">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-9 h-9 rounded-xl bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-100"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Condition selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              Condition
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['good', 'worn', 'unclear'] as Condition[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCondition(c)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold capitalize transition-all ${
                    condition === c
                      ? 'border-[#163323] bg-[#163323] text-white shadow-xs'
                      : 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Note input */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 mb-1">
              Notes / Observation
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#163323]/20"
              placeholder="e.g. Gently used, power cord intact"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/60 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-[#163323] text-white hover:bg-[#11271b] shadow-sm transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save & Recalculate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
