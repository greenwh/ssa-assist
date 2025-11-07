/**
 * Report Wizard - Main wizard container
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { WizardProvider, useWizard } from './WizardContext';
import { WizardProgress } from './WizardProgress';
import { WizardNavigation } from './WizardNavigation';
import { BlueBookSelection } from './steps/BlueBookSelection';
import { FunctionalInputs } from './steps/FunctionalInputs';
import { AIGeneration } from './steps/AIGeneration';
import { Button } from '@/components/ui/Button';

interface ReportWizardProps {
  reportId?: string;
  onClose: () => void;
}

const WizardContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const {
    currentStep,
    draftData,
    isAutoSaving,
    lastSaved,
    goToStep,
    nextStep,
    previousStep,
    saveDraft,
  } = useWizard();

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (draftData && Object.keys(draftData).length > 0) {
        saveDraft();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [draftData, saveDraft]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BlueBookSelection />;
      case 2:
        return <FunctionalInputs />;
      case 3:
        return <AIGeneration />;
      case 4:
        return (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Step 4: Review & Export</h3>
            <p className="text-text-muted">Coming in Phase 3...</p>
          </div>
        );
      default:
        return null;
    }
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 1:
        return (draftData.selectedBlueBookListings?.length ?? 0) > 0;
      case 2:
        // Check if there's any data in functionalInputs
        return draftData.functionalInputs && Object.keys(draftData.functionalInputs).length > 0;
      case 3:
        // Check if there are any generated sections
        return draftData.generatedSections && Object.keys(draftData.generatedSections).length > 0;
      default:
        return true;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-hidden flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Create New Report</h2>
            <p className="text-sm text-text-muted">Complete all steps to generate your report</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="border-b border-border p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <WizardProgress currentStep={currentStep} onStepClick={goToStep} />
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-6">{renderStep()}</div>
      </div>

      {/* Navigation */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <WizardNavigation
            currentStep={currentStep}
            totalSteps={4}
            canGoNext={canGoNext()}
            canGoBack={currentStep > 1}
            isAutoSaving={isAutoSaving}
            lastSaved={lastSaved}
            onNext={nextStep}
            onBack={previousStep}
          />
        </div>
      </div>
    </div>
  );
};

export const ReportWizard: React.FC<ReportWizardProps> = ({ reportId, onClose }) => {
  return (
    <WizardProvider reportId={reportId}>
      <WizardContent onClose={onClose} />
    </WizardProvider>
  );
};
