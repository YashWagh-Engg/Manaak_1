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
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 flex flex-col font-sans selection:bg-[#FF9933] selection:text-slate-950">
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
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 focus:outline-none" tabIndex={-1}>
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

      {/* Standard Government of India Footer Pattern */}
      <footer className="bg-[#002244] border-t-4 border-[#FF9933] text-slate-300 py-6 px-4 sm:px-8 text-xs font-sans mt-auto">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Footer Links Row */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-y-2 gap-x-3 text-[11px] text-slate-300 border-b border-blue-900/60 pb-3">
            <span className="text-[#FF9933] font-semibold">Maanak Portal</span>
            <span className="text-slate-600">|</span>
            <span className="hover:underline cursor-pointer">Website Policies</span>
            <span className="text-slate-600">|</span>
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="text-slate-600">|</span>
            <span className="hover:underline cursor-pointer">Terms &amp; Conditions</span>
            <span className="text-slate-600">|</span>
            <span className="hover:underline cursor-pointer">Hyperlinking Policy</span>
            <span className="text-slate-600">|</span>
            <span className="hover:underline cursor-pointer">Accessibility Statement</span>
            <span className="text-slate-600">|</span>
            <span className="hover:underline cursor-pointer">Help &amp; FAQ</span>
            <span className="text-slate-600">|</span>
            <span className="hover:underline cursor-pointer">Sitemap</span>
          </div>

          {/* Ownership and Copyright Information */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="text-center sm:text-left space-y-0.5">
              <p className="font-medium text-slate-300">
                Content owned, maintained, and updated by Department of Consumer Affairs, Ministry of Consumer Affairs, Food &amp; Public Distribution, Government of India.
              </p>
              <p className="text-[10px] text-slate-400">
                Statutory Authority: Legal Metrology (Packaged Commodities) Rules, 2011 &amp; Legal Metrology Act, 2009.
              </p>
            </div>

            <div className="text-center sm:text-right shrink-0 font-sans text-[10px] text-slate-400">
              <div>Last Updated: <span className="text-slate-200 font-semibold">06 Sep 2026</span></div>
              <div className="text-emerald-400 font-medium flex items-center justify-center sm:justify-end gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                National Informatics Network Active
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
