import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Sparkles, ArrowRight, UploadCloud, X } from 'lucide-react';
import { SAMPLE_PILES } from '../data/samplePiles';
import { SamplePile } from '../types';

interface UploadViewProps {
  onAnalyzeUploaded: (imageData: string, mimeType: string) => void;
  onSelectSamplePile: (pile: SamplePile) => void;
  isLoading: boolean;
}

export const UploadView: React.FC<UploadViewProps> = ({
  onAnalyzeUploaded,
  onSelectSamplePile,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFileMime, setSelectedFileMime] = useState<string>('image/jpeg');
  const [selectedPileId, setSelectedPileId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Process and shrink JPG image in browser before uploading
  // Speeds up upload and vision model inference significantly (800px max, 0.72 quality)
  const processImageFile = (file: File) => {
    setSelectedPileId(null);
    setStatusMessage(null);

    const fileName = file.name.toLowerCase();
    const isHeic =
      fileName.endsWith('.heic') ||
      fileName.endsWith('.heif') ||
      file.type === 'image/heic' ||
      file.type === 'image/heif';

    if (isHeic) {
      setStatusMessage('Currently only supporting JPG photos. Please select a JPG photo.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setSelectedFileMime(file.type || 'image/jpeg');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        // Optimized 800px max dimension provides sharp item recognition with fast response
        const MAX_DIM = 800;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_DIM) {
          height = Math.round((height * MAX_DIM) / width);
          width = MAX_DIM;
        } else if (height > MAX_DIM) {
          width = Math.round((width * MAX_DIM) / height);
          height = MAX_DIM;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compressed data URL (~80-120KB)
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.72);
          setPreviewUrl(compressedDataUrl);
          setSelectedFileMime('image/jpeg');
        }
      };
      img.onerror = () => {
        setStatusMessage('Could not read image file. Please ensure it is a valid JPG.');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleSelectPreset = (pile: SamplePile) => {
    setSelectedPileId(pile.id);
    setPreviewUrl(pile.imageUrl);
    setStatusMessage(null);
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setSelectedPileId(null);
    setStatusMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSubmit = () => {
    if (!previewUrl) return;

    if (selectedPileId) {
      const pile = SAMPLE_PILES.find((p) => p.id === selectedPileId);
      if (pile) {
        onSelectSamplePile(pile);
        return;
      }
    }

    onAnalyzeUploaded(previewUrl, selectedFileMime);
  };

  return (
    <div className="flex flex-col min-h-full px-5 py-6 justify-between space-y-6">
      <div className="space-y-4">
        {/* Step indicator */}
        <p className="text-xs font-bold uppercase tracking-wider text-[#E26D5C]">
          Step 1 of 2
        </p>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#163323] font-serif">
          Show us the pile.
        </h2>

        {/* Hidden file input for Photo Gallery / Library (no capture attribute to allow picking from gallery) */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,.jpg,.jpeg"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Hidden file input for Camera capture */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/jpeg,image/jpg,.jpg,.jpeg"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Main Dropzone / Photo Selection Area */}
        {!previewUrl ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full rounded-3xl border-2 border-dashed border-stone-300 bg-white/50 hover:bg-white hover:border-[#163323]/40 p-6 sm:p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-xs group relative overflow-hidden"
          >
            {/* Lime icon circle */}
            <div className="w-16 h-16 rounded-full bg-[#D5F044] text-[#163323] flex items-center justify-center mb-3 shadow-sm group-hover:scale-105 transition-transform">
              <ImageIcon className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 font-sans">
              Add a photo
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-xs mt-1">
              Select a JPG from your gallery or take a new photo
            </p>

            {/* Action buttons for mobile selection */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white bg-[#163323] hover:bg-[#11271b] shadow-xs active:scale-95 transition-all"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Choose from Gallery</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 shadow-xs active:scale-95 transition-all"
              >
                <Camera className="w-3.5 h-3.5 text-stone-600" />
                <span>Take Photo</span>
              </button>
            </div>

            {/* Accepted formats badge */}
            <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-stone-600 bg-stone-200/70 px-3 py-1 rounded-full">
              <span>Currently only supporting JPG</span>
            </div>
          </div>
        ) : (
          /* Image Selected / Preview State */
          <div className="relative rounded-3xl overflow-hidden border border-stone-200 bg-stone-900 shadow-md">
            <img
              src={previewUrl}
              alt="Uploaded move-out pile"
              className="w-full h-56 sm:h-64 object-cover"
            />
            <button
              onClick={handleClear}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
              title="Remove photo"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D5F044]" />
              <span>Optimized for fast AI vision analysis</span>
            </div>
          </div>
        )}

        {statusMessage && (
          <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
            {statusMessage}
          </p>
        )}

        {/* Prototype Tip Banner */}
        <div className="rounded-2xl bg-[#EAE7DC]/80 p-3.5 border border-stone-200/70 flex items-start gap-3">
          <div className="p-1 rounded-md bg-[#FAF8F2] text-stone-700 shrink-0 mt-0.5">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div className="text-xs text-stone-700 leading-relaxed">
            <span className="font-bold text-stone-900">Portfolio testing tip: </span>
            Upload your own move-out photo, or click any prepared sample pile below to explore live results.
          </div>
        </div>

        {/* Quick Sample Piles for Recruiters & Visitors */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
            Or pick a prepared move-out pile:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SAMPLE_PILES.map((pile) => {
              const isSelected = selectedPileId === pile.id;
              return (
                <button
                  key={pile.id}
                  onClick={() => handleSelectPreset(pile)}
                  className={`text-left p-2.5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'border-[#163323] bg-[#FAF8F2] ring-2 ring-[#163323]/20 shadow-xs'
                      : 'border-stone-200 bg-white/70 hover:bg-white hover:border-stone-300'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {pile.title}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                    {pile.subtitle}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4">
        <button
          onClick={handleSubmit}
          disabled={!previewUrl || isLoading}
          className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-medium text-sm sm:text-base transition-all shadow-sm ${
            previewUrl && !isLoading
              ? 'bg-[#163323] hover:bg-[#11271b] text-white active:scale-[0.99] cursor-pointer'
              : 'bg-[#98A89E] text-white/80 cursor-not-allowed opacity-80'
          }`}
        >
          <span>Find donation matches</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
