import React, { useState, useEffect } from 'react';
import { UserRole, InspectionRecord, LegalRuleDefinition } from './types';
import { INITIAL_RULES } from './data/rulesStore';
import { SEED_INSPECTION_DATASET } from './data/seedDataset';
import { Navbar } from './components/Navbar';
import { ScanInspection } from './components/ScanInspection';
import { OverchargeCrossCheck } from './components/OverchargeCrossCheck';
import { RuleConfigEditor } from './components/RuleConfigEditor';
import { DatasetLibrary } from './components/DatasetLibrary';
import { E2ETestRunner } from './components/E2ETestRunner';
import { NoticeModal } from './components/NoticeModal';
import { MobileConnectModal } from './components/MobileConnectModal';
import {
  evaluateExemption,
  validateRule6Declarations,
  validateFontSpecifications,
  gradeStatutoryNotice,
} from './lib/ruleEngine';

export default function App() {
  // Application State
  const [currentRole, setCurrentRole] = useState<UserRole>('field_officer');
  const [activeTab, setActiveTab] = useState<string>('inspect');
  const [rules, setRules] = useState<LegalRuleDefinition[]>(INITIAL_RULES);
  const [activeRecord, setActiveRecord] = useState<InspectionRecord>(SEED_INSPECTION_DATASET[0]);
  const [noticeModalRecord, setNoticeModalRecord] = useState<InspectionRecord | null>(null);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  // Fetch active rules from server API on mount
  const fetchRules = async () => {
    try {
      const response = await fetch('/api/rules');
      if (response.ok) {
        const data = await response.json();
        if (data.rules && Array.isArray(data.rules)) {
          setRules(data.rules);
        }
      }
    } catch (err) {
      console.warn('Using local fallback rules store:', err);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  // When rules are updated by admin, recalculate active record compliance
  const handleRuleUpdated = (updatedRule: LegalRuleDefinition) => {
    const updatedRules = rules.map((r) =>
      r.ruleCode === updatedRule.ruleCode ? updatedRule : r
    );
    setRules(updatedRules);

    // Re-evaluate active record against updated rules dynamically
    const exemption = evaluateExemption(activeRecord.declarations, updatedRules);
    const { violations: rule6Violations } = exemption.isExempt
      ? { violations: [] }
      : validateRule6Declarations(activeRecord.declarations, updatedRules);

    const fontValidations = exemption.isExempt
      ? []
      : validateFontSpecifications(
          activeRecord.declarations,
          activeRecord.packageHeightMm,
          updatedRules
        );

    const noticeGrading = gradeStatutoryNotice(
      rule6Violations,
      fontValidations,
      activeRecord.overchargeCheck,
      updatedRules,
      'FIRST_OFFENCE'
    );

    setActiveRecord({
      ...activeRecord,
      exemption,
      fontValidations,
      noticeGrading,
      status: noticeGrading.violationCount > 0 ? 'PENDING_REVIEW' : 'VERIFIED',
    });
  };

  // Switch to item and open in inspect view
  const handleInspectDatasetItem = (item: InspectionRecord) => {
    setActiveRecord(item);
    setActiveTab('inspect');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Supervisor approval workflow
  const handleApproveNotice = () => {
    if (noticeModalRecord) {
      const updated = {
        ...noticeModalRecord,
        status: 'NOTICE_ISSUED' as const,
      };
      setNoticeModalRecord(updated);
      if (activeRecord.id === updated.id) {
        setActiveRecord(updated);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Govt & Navigation Bar */}
      <Navbar
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        ruleCount={rules.filter((r) => r.enabled).length}
        onOpenMobileModal={() => setIsMobileModalOpen(true)}
      />

      {/* Main App Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'inspect' && (
          <ScanInspection
            currentRole={currentRole}
            activeRecord={activeRecord}
            setActiveRecord={setActiveRecord}
            onOpenNoticeModal={(rec) => setNoticeModalRecord(rec)}
            onSelectDatasetItem={handleInspectDatasetItem}
          />
        )}

        {activeTab === 'overcharge' && (
          <OverchargeCrossCheck
            currentRole={currentRole}
            onOpenNoticeModal={(rec) => setNoticeModalRecord(rec)}
          />
        )}

        {activeTab === 'rules' && (
          <RuleConfigEditor
            currentRole={currentRole}
            rules={rules}
            onRuleUpdated={handleRuleUpdated}
            onReloadRules={fetchRules}
          />
        )}

        {activeTab === 'dataset' && (
          <DatasetLibrary
            onSelectItem={(item) => setActiveRecord(item)}
            onInspectItem={handleInspectDatasetItem}
            onOpenNotice={(item) => setNoticeModalRecord(item)}
          />
        )}

        {activeTab === 'e2e' && <E2ETestRunner />}
      </main>

      {/* Official Show Cause Notice & Compounding Modal */}
      <NoticeModal
        record={noticeModalRecord}
        onClose={() => setNoticeModalRecord(null)}
        onApproveAndSign={handleApproveNotice}
        userRole={currentRole}
      />

      {/* Mobile Pairing & Instructions Modal with QR Code */}
      <MobileConnectModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
      />

      {/* Govt Footer - Geometric Balance */}
      <footer className="h-14 bg-slate-950 border-t border-slate-800 px-6 sm:px-8 flex flex-wrap items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest gap-2">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-400">Legal Metrology Engine v2.4.0 (Vision &amp; OCR Pipeline)</span>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <span className="hidden sm:inline">PCR 2011 / Legal Metrology Act, 2009</span>
        </div>
        <div className="flex items-center gap-3 font-mono">
          <span className="text-emerald-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            System Ready: 127.0.0.1:3000
          </span>
          <span className="text-slate-700">•</span>
          <span className="text-amber-500">e-Maap Active</span>
        </div>
      </footer>
    </div>
  );
}
