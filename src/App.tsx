import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ModesDeepDive } from './components/ModesDeepDive';
import { ModelsMatrix } from './components/ModelsMatrix';
import { WorkflowSteps } from './components/WorkflowSteps';
import { InteractiveSimulator } from './components/InteractiveSimulator';
import { PromptFormatterTool } from './components/PromptFormatterTool';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { InstallModal } from './components/InstallModal';

export default function App() {
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);

  const handleScrollToSimulator = () => {
    const el = document.getElementById('simulador');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar onInstallClick={() => setIsInstallModalOpen(true)} />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          onInstallClick={() => setIsInstallModalOpen(true)}
          onScrollToSimulator={handleScrollToSimulator}
        />

        <InteractiveSimulator />

        <ModesDeepDive />

        <ModelsMatrix />

        <WorkflowSteps />

        <PromptFormatterTool />

        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Extension Installation Modal */}
      <InstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}
