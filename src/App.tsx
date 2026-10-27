import React, { useState } from 'react';
import { 
  Smartphone, 
  Monitor, 
  RotateCcw, 
  HelpCircle, 
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  Flame,
  FileCode
} from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { OnboardingFlow } from './components/OnboardingFlow';
import { TopAppBar } from './components/common/TopAppBar';
import { BottomTabBar } from './components/common/BottomTabBar';
import { DashboardScreen } from './components/DashboardScreen';
import { WeeklyRoutineScreen } from './components/WeeklyRoutineScreen';
import { StudySessionScreen } from './components/StudySessionScreen';
import { ProgressScreen } from './components/ProgressScreen';
import { DocumentationModal } from './components/DocumentationModal';

const AppContent: React.FC = () => {
  const { state, resetDemoData, resetOnboarding, navigateTo } = useApp();
  const [isMobileFrameMode, setIsMobileFrameMode] = useState<boolean>(true);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);

  // If user hasn't completed onboarding, render the onboarding flow
  if (!state.profile.onboardingCompleted) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-2 sm:p-4">
        {/* Device frame preview during onboarding */}
        <div className="w-full max-w-[430px] min-h-[844px] bg-white dark:bg-slate-950 rounded-3xl shadow-2xl overflow-hidden border-8 border-slate-800 flex flex-col">
          <OnboardingFlow />
        </div>
      </div>
    );
  }

  const renderActiveScreen = () => {
    switch (state.activeScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'routine':
        return <WeeklyRoutineScreen />;
      case 'session':
        return <StudySessionScreen />;
      case 'progress':
        return <ProgressScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Top Prototype Controls Toolbar */}
      <header className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs px-4 py-2.5 z-50">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Brand & Prototype Tag */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-tight flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              EngFlow · Protótipo Educacional
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
              Validação de Produto (Prévia Android)
            </span>
          </div>

          {/* Demonstration Action Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Viewport switch */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => setIsMobileFrameMode(true)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                  isMobileFrameMode ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
                title="Visualização em Moldura de Smartphone (390px)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Smartphone</span>
              </button>
              <button
                onClick={() => setIsMobileFrameMode(false)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                  !isMobileFrameMode ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
                title="Visualização Responsiva Expandida"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Responsivo</span>
              </button>
            </div>

            {/* Reset Onboarding test */}
            <button
              onClick={resetOnboarding}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 transition-colors border border-slate-700"
              title="Testar o fluxo de onboarding inicial de 7 etapas"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Novo Onboarding</span>
            </button>

            {/* Load rich demo state */}
            <button
              onClick={resetDemoData}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center gap-1 transition-colors border border-slate-700"
              title="Carregar dados de demonstração com histórico e tokens"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Carregar Demo</span>
            </button>

            {/* Technical Docs Modal trigger */}
            <button
              onClick={() => setIsDocsOpen(true)}
              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors shadow-xs"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Documentação & Jetpack Compose</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Viewport Content Area */}
      <main className="flex-1 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-x-hidden">
        {isMobileFrameMode ? (
          /* Smartphone Hardware Bezel Frame */
          <div className="w-full max-w-[420px] min-h-[850px] max-h-[92vh] bg-slate-50 dark:bg-slate-900 rounded-[38px] shadow-2xl border-8 border-slate-800 dark:border-slate-800 flex flex-col relative overflow-hidden">
            {/* Phone Speaker & Dynamic Island Notch */}
            <div className="w-full bg-slate-900 h-6 shrink-0 flex items-center justify-between px-6 pt-1 text-[10px] text-white font-semibold">
              <span>9:41</span>
              <div className="w-20 h-3.5 bg-black rounded-full mx-auto" />
              <div className="flex items-center gap-1">
                <span>5G</span>
                <span className="w-4 h-2 border border-white rounded-xs inline-block relative">
                  <span className="w-2.5 h-full bg-white block" />
                </span>
              </div>
            </div>

            {/* Sticky Mobile Top App Bar */}
            <TopAppBar
              onOpenDocs={() => setIsDocsOpen(true)}
              onOpenSettings={() => navigateTo('routine')}
            />

            {/* Screen Body */}
            <div className="flex-1 overflow-y-auto px-4 pt-3 pb-20 no-scrollbar">
              {renderActiveScreen()}
            </div>

            {/* Fixed Mobile Bottom Tab Bar */}
            <BottomTabBar />

            {/* Mobile Home Bar indicator */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-400/60 rounded-full pointer-events-none z-50" />
          </div>
        ) : (
          /* Responsive Multi-Column Desktop/Tablet Container */
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 flex flex-col min-h-[800px] overflow-hidden my-4">
            <TopAppBar
              onOpenDocs={() => setIsDocsOpen(true)}
              onOpenSettings={() => navigateTo('routine')}
            />

            <div className="flex-1 p-6 md:p-8 overflow-y-auto pb-24">
              <div className="max-w-2xl mx-auto">
                {renderActiveScreen()}
              </div>
            </div>

            <BottomTabBar />
          </div>
        )}
      </main>

      {/* Architecture & Jetpack Compose Documentation Modal */}
      <DocumentationModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
