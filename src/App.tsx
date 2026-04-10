import { useState } from 'react';
import LandingPage from './pages/LandingPage';
import MenuPage from './pages/MenuPage';
import VisualizationPage from './pages/VisualizationPage';

export type ViewState = 'landing' | 'menu' | 'visualization';
export type ConceptType = 'binary-search' | 'stack' | 'linked-list' | 'binary-tree' | null;

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [selectedConcept, setSelectedConcept] = useState<ConceptType>(null);

  const navigateTo = (view: ViewState, concept?: ConceptType) => {
    setCurrentView(view);
    if (concept !== undefined) {
      setSelectedConcept(concept);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[var(--color-dark-bg)] text-white font-sans selection:bg-[var(--color-neon-cyan)] selection:text-black">
      {currentView === 'landing' && <LandingPage onStart={() => navigateTo('menu')} />}
      {currentView === 'menu' && (
        <MenuPage 
          onSelectConcept={(concept) => navigateTo('visualization', concept)} 
          onBack={() => navigateTo('landing')}
        />
      )}
      {currentView === 'visualization' && selectedConcept && (
        <VisualizationPage 
          concept={selectedConcept} 
          onBack={() => navigateTo('menu')}
        />
      )}
    </div>
  );
}
