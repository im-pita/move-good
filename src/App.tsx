/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import organizationsData from './data/organizations.json';
import { Organization, DetectedItem, SamplePile } from './types';
import { matchItemsToOrganizations } from './lib/match';
import { Header } from './components/Header';
import { HeroIntro } from './components/HeroIntro';
import { UploadView } from './components/UploadView';
import { ScanningView } from './components/ScanningView';
import { ResultsView } from './components/ResultsView';
import { PortfolioDrawer } from './components/PortfolioDrawer';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'intro' | 'upload' | 'scanning' | 'results'>('intro');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
  const [sourceSummary, setSourceSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState<boolean>(false);
  const [isFrameMode, setIsFrameMode] = useState<boolean>(true);

  // Load organizations from local verified repository
  const organizations: Organization[] = useMemo(() => {
    return organizationsData as Organization[];
  }, []);

  // Compute matched stops and condition checks deterministically
  const matchResult = useMemo(() => {
    return matchItemsToOrganizations(detectedItems, organizations);
  }, [detectedItems, organizations]);

  // Handle uploading and analyzing image via Gemini Vision API
  const handleAnalyzeUploaded = async (imageData: string, mimeType: string) => {
    setPreviewUrl(imageData);
    setErrorMessage(null);
    setCurrentView('scanning');
    setIsLoading(true);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData, mimeType }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${response.status}`);
      }

      const data = await response.json();
      setDetectedItems(data.items || []);
      setSourceSummary(data.summary || 'Items detected via Gemini 3.8 Flash Vision');
      setCurrentView('results');
    } catch (err: any) {
      console.warn('API analyze fallback to prepared item list:', err);
      // Graceful degradation for portfolio visitors if API key is rate-limited or unavailable:
      setErrorMessage(
        err.message?.includes('GEMINI_API_KEY')
          ? 'Live Gemini API key not yet set in Secrets; showing sample verified analysis.'
          : `Note: ${err.message || 'Analysis note'}. Showing verified sample pile.`
      );
      // Fallback sample detection items matching the move-out pile
      const fallbackItems: DetectedItem[] = [
        {
          id: 'item-fb-1',
          category: 'heater',
          label: 'Portable space heater',
          quantity: 1,
          condition: 'good',
          confidence: 'high',
          note: 'Ceramic space heater. Cord looks intact.',
          needsConditionCheck: true,
          conditionCheckQuestion: 'Does the heater work, with no frayed wires or damage?',
          isConditionConfirmed: false,
        },
        {
          id: 'item-fb-2',
          category: 'blanket',
          label: 'Fleece blanket',
          quantity: 1,
          condition: 'good',
          confidence: 'high',
          note: 'Navy blue fleece throw, clean and washed.',
          needsConditionCheck: false,
          isConditionConfirmed: true,
        },
        {
          id: 'item-fb-3',
          category: 'hangers',
          label: 'Plastic coat hangers',
          quantity: 10,
          condition: 'good',
          confidence: 'high',
          note: 'Clean white plastic hangers.',
          needsConditionCheck: false,
          isConditionConfirmed: true,
        },
        {
          id: 'item-fb-4',
          category: 'shoes',
          label: 'Athletic running shoes',
          quantity: 1,
          condition: 'worn',
          confidence: 'medium',
          note: 'Light sole wear.',
          needsConditionCheck: true,
          conditionCheckQuestion: 'Are the running shoes clean and in good condition?',
          isConditionConfirmed: false,
        },
        {
          id: 'item-fb-5',
          category: 'cleaning_supplies',
          label: 'All-purpose spray cleaner',
          quantity: 1,
          condition: 'good',
          confidence: 'high',
          note: 'Full disinfectant spray bottle.',
          needsConditionCheck: false,
          isConditionConfirmed: true,
        },
      ];
      setDetectedItems(fallbackItems);
      setSourceSummary('Demonstration detection list (5 items spotted)');
      setCurrentView('results');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle preset sample pile selection
  const handleSelectSamplePile = (pile: SamplePile) => {
    setPreviewUrl(pile.imageUrl);
    setErrorMessage(null);
    setCurrentView('scanning');
    setIsLoading(true);

    // Brief realistic scanning pause for UX
    setTimeout(() => {
      setDetectedItems(pile.items);
      setSourceSummary(pile.description);
      setCurrentView('results');
      setIsLoading(false);
    }, 1400);
  };

  // Condition verification handler
  const handleConfirmCondition = (itemId: string) => {
    setDetectedItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, isConditionConfirmed: true, needsConditionCheck: false }
          : item
      )
    );
  };

  // Remove item handler
  const handleRemoveItem = (itemId: string) => {
    setDetectedItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Update item handler
  const handleUpdateItem = (updated: DetectedItem) => {
    setDetectedItems((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  // Add manual item handler
  const handleAddItem = (newItem: DetectedItem) => {
    setDetectedItems((prev) => [newItem, ...prev]);
  };

  // Back button handler
  const handleBack = () => {
    if (currentView === 'results') {
      setCurrentView('upload');
    } else if (currentView === 'upload') {
      setCurrentView('intro');
    }
  };

  // Reset to upload
  const handleReset = () => {
    setPreviewUrl(null);
    setDetectedItems([]);
    setErrorMessage(null);
    setCurrentView('upload');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F2] flex flex-col items-center justify-start md:py-8 px-0 sm:px-4 font-sans selection:bg-[#D5F044]">
      {/* Recruiter / Portfolio Top Banner on Desktop */}
      <div className="hidden md:flex items-center justify-between w-full max-w-4xl px-4 py-2 mb-4 bg-white/80 rounded-2xl border border-stone-200/90 shadow-2xs text-xs text-stone-600">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-semibold text-slate-800">
            Portfolio Showcase: MoveGood Move-Out Sorter
          </span>
          <span className="text-stone-400">|</span>
          <span className="text-stone-500">
            Figma Make to Full-Stack React + Gemini 3.8 Flash
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPortfolioOpen(true)}
            className="font-bold text-[#163323] hover:text-[#E26D5C] underline"
          >
            Read System Design & AI Principles
          </button>
        </div>
      </div>

      {/* Main Container: Mobile Phone Frame or Responsive Desktop Width */}
      <div
        className={`w-full transition-all duration-300 ${
          isFrameMode
            ? 'max-w-[430px] md:rounded-[44px] md:shadow-2xl md:border-8 md:border-stone-800/90 md:overflow-hidden md:min-h-[820px] bg-[#FAF8F2]'
            : 'max-w-2xl rounded-3xl shadow-lg border border-stone-200 bg-[#FAF8F2]'
        } flex flex-col relative`}
      >
        {/* Dynamic Island / Speaker Notch Simulation for Desktop iPhone frame */}
        {isFrameMode && (
          <div className="hidden md:flex justify-center pt-2 pb-1 bg-[#FAF8F2]">
            <div className="w-24 h-4 rounded-full bg-stone-900 shadow-inner flex items-center justify-end pr-2">
              <div className="w-2 h-2 rounded-full bg-stone-700/60" />
            </div>
          </div>
        )}

        {/* Global Header */}
        <Header
          currentView={currentView}
          onBack={handleBack}
          onOpenPortfolio={() => setIsPortfolioOpen(true)}
          isFrameMode={isFrameMode}
          onToggleFrameMode={() => setIsFrameMode((prev) => !prev)}
        />

        {/* Transient Notice / Error Banner */}
        {errorMessage && (
          <div className="mx-4 mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-snug">{errorMessage}</div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-amber-700 font-bold hover:text-amber-950 ml-1"
            >
              ×
            </button>
          </div>
        )}

        {/* Screen Views */}
        <main className="flex-1 flex flex-col">
          {currentView === 'intro' && (
            <HeroIntro
              onStart={() => setCurrentView('upload')}
              onOpenPortfolio={() => setIsPortfolioOpen(true)}
            />
          )}

          {currentView === 'upload' && (
            <UploadView
              onAnalyzeUploaded={handleAnalyzeUploaded}
              onSelectSamplePile={handleSelectSamplePile}
              isLoading={isLoading}
            />
          )}

          {currentView === 'scanning' && (
            <ScanningView
              previewUrl={previewUrl}
              modeLabel={isLoading ? 'LIVE GEMINI 3.8 FLASH VISION SCAN' : 'SIMULATED AI SCAN'}
            />
          )}

          {currentView === 'results' && (
            <ResultsView
              matchResult={matchResult}
              allItems={detectedItems}
              previewUrl={previewUrl}
              sourceSummary={sourceSummary}
              onConfirmCondition={handleConfirmCondition}
              onRemoveItem={handleRemoveItem}
              onUpdateItem={handleUpdateItem}
              onAddItem={handleAddItem}
              onReset={handleReset}
            />
          )}
        </main>
      </div>

      {/* Recruiter & System Architecture Drawer Modal */}
      <PortfolioDrawer
        isOpen={isPortfolioOpen}
        onClose={() => setIsPortfolioOpen(false)}
      />
    </div>
  );
}
