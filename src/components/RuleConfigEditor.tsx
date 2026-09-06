import React, { useState } from 'react';
import { LegalRuleDefinition, UserRole } from '../types';
import {
  BookOpen,
  Save,
  CheckCircle2,
  AlertTriangle,
  Lock,
  RefreshCw,
  Sliders,
  Shield,
  Layers,
  ChevronRight,
  Info,
} from 'lucide-react';

interface RuleConfigEditorProps {
  currentRole: UserRole;
  rules: LegalRuleDefinition[];
  onRuleUpdated: (updatedRule: LegalRuleDefinition) => void;
  onReloadRules: () => Promise<void>;
}

export const RuleConfigEditor: React.FC<RuleConfigEditorProps> = ({
  currentRole,
  rules,
  onRuleUpdated,
  onReloadRules,
}) => {
  const [selectedRuleCode, setSelectedRuleCode] = useState<string>(
    rules[0]?.ruleCode || 'RULE_6_MANDATORY_DECLARATIONS'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Local editable copy of selected rule
  const selectedRule = rules.find((r) => r.ruleCode === selectedRuleCode) || rules[0];
  const [localParameters, setLocalParameters] = useState<Record<string, any>>(
    selectedRule ? { ...selectedRule.parameters } : {}
  );
  const [localEnabled, setLocalEnabled] = useState<boolean>(selectedRule?.enabled ?? true);

  // When selection changes, sync local parameters
  const handleSelectRule = (code: string) => {
    setSelectedRuleCode(code);
    const rule = rules.find((r) => r.ruleCode === code);
    if (rule) {
      setLocalParameters({ ...rule.parameters });
      setLocalEnabled(rule.enabled);
    }
    setSaveSuccessMsg(null);
    setErrorMessage(null);
  };

  // Save changes to backend PUT /api/rules/:rule_code
  const handleSaveRule = async () => {
    if (currentRole !== 'admin') {
      setErrorMessage(
        'RBAC Enforcement: Only Chief Metrology Admin has permission to modify statutory rule engine parameters.'
      );
      return;
    }

    setIsSaving(true);
    setSaveSuccessMsg(null);
    setErrorMessage(null);

    try {
      const response = await fetch(`/api/rules/${selectedRule.ruleCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentRole,
          'x-user-name': 'Chief Metrology Admin',
        },
        body: JSON.stringify({
          enabled: localEnabled,
          parameters: localParameters,
        }),
      });

      const data = await response.json();
      if (response.ok && data.rule) {
        onRuleUpdated(data.rule);
        setSaveSuccessMsg(
          `Rule ${data.rule.ruleCode} successfully updated on server and hot-reloaded into live inspection engine!`
        );
      } else {
        setErrorMessage(data.error || 'Failed to update rule on server.');
      }
    } catch (err: any) {
      setErrorMessage('Network or server error while updating rule.');
    } finally {
      setIsSaving(false);
    }
  };

  const isAdmin = currentRole === 'admin';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white text-slate-800 rounded-lg p-6 border border-gray-200 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#003366] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              <Sliders className="w-3 h-3 text-[#003366]" />
              PCR 2011 Engine Rules
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Statutory Rule &amp; Compounding Configurator
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            Live read/write interface for statutory compliance rules. Modifications are instantly hot-reloaded into the backend inspection engine and affect all active evaluations.
          </p>
        </div>

        {/* RBAC State Pill */}
        <div className="flex items-center gap-3 shrink-0">
          {isAdmin ? (
            <div className="px-3 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-1.5 shadow-xs">
              <Shield className="w-4 h-4 text-emerald-700" />
              <span>Chief Admin (Full Edit Access)</span>
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-md bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-1.5 shadow-xs">
              <Lock className="w-4 h-4 text-amber-700" />
              <span>Read-Only Mode ({currentRole})</span>
            </div>
          )}
        </div>
      </div>

      {/* RBAC Notice if not admin */}
      {!isAdmin && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-start gap-3 shadow-xs">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-semibold text-xs text-amber-900">Role-Based Access Control Notice</div>
            <p className="leading-relaxed text-slate-700">
              You are currently viewing statutory rules as <strong className="text-slate-900">{currentRole}</strong>. In accordance with Legal Metrology administrative protocols, only the <strong className="text-[#003366]">Chief Metrology Admin</strong> has authority to alter statutory rule thresholds or compounding penalty slabs. Switch your role in the top-right corner to test admin editing and hot-reloading!
            </p>
          </div>
        </div>
      )}

      {/* Main Layout: Rule Selector (Left) & Rule Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Rule Directory */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 pb-2.5 border-b border-gray-100">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#003366]" />
                Active Rule Modules ({rules.length})
              </span>
              <button
                onClick={() => onReloadRules()}
                className="text-[#003366] hover:text-[#002244] transition cursor-pointer p-1 rounded hover:bg-slate-100"
                title="Reload from server"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2">
              {rules.map((rule) => {
                const isSelected = rule.ruleCode === selectedRuleCode;
                return (
                  <button
                    key={rule.ruleCode}
                    onClick={() => handleSelectRule(rule.ruleCode)}
                    className={`w-full text-left p-3 rounded-md border transition text-xs flex flex-col gap-1 cursor-pointer ${
                      isSelected
                        ? 'border-[#003366] bg-[#003366]/5 shadow-xs'
                        : 'border-gray-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{rule.title}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                          rule.enabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {rule.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <div className="text-xs text-[#003366] font-medium">{rule.ruleCode}</div>
                    <div className="text-xs text-slate-600 line-clamp-1">{rule.description}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Parameter Editor Form */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-gray-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#003366] bg-slate-100 px-2 py-0.5 rounded border border-gray-200">
                    {selectedRule.ruleCode}
                  </span>
                  <span className="text-xs text-slate-500">v{selectedRule.version}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{selectedRule.title}</h3>
                <p className="text-xs text-slate-600 max-w-xl leading-relaxed">{selectedRule.description}</p>
              </div>

              {/* Enabled Switch */}
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-md border border-gray-200">
                <label className="text-xs font-medium text-slate-700 cursor-pointer">
                  Rule Active:
                </label>
                <input
                  type="checkbox"
                  disabled={!isAdmin}
                  checked={localEnabled}
                  onChange={(e) => setLocalEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#003366] rounded focus:ring-[#003366] cursor-pointer disabled:opacity-50 accent-[#003366]"
                />
              </div>
            </div>

            {/* Dynamic Parameter Fields based on Rule Code */}
            <div className="space-y-4 text-xs">
              <h4 className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#003366]" />
                Statutory Parameters &amp; Thresholds
              </h4>

              {/* 1. RULE 6 CHECKLIST */}
              {selectedRule.ruleCode === 'RULE_6_MANDATORY_DECLARATIONS' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-gray-200">
                  <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={!isAdmin}
                      checked={localParameters.requireMrp ?? true}
                      onChange={(e) =>
                        setLocalParameters({ ...localParameters, requireMrp: e.target.checked })
                      }
                      className="w-4 h-4 accent-[#003366] rounded cursor-pointer"
                    />
                    Require Retail Price (Rule 6(1)(e))
                  </label>

                  <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={!isAdmin}
                      checked={localParameters.requireTaxInclusiveStatement ?? true}
                      onChange={(e) =>
                        setLocalParameters({
                          ...localParameters,
                          requireTaxInclusiveStatement: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-[#003366] rounded cursor-pointer"
                    />
                    Require "incl. of all taxes" statement
                  </label>

                  <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={!isAdmin}
                      checked={localParameters.requireNetQuantity ?? true}
                      onChange={(e) =>
                        setLocalParameters({
                          ...localParameters,
                          requireNetQuantity: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-[#003366] rounded cursor-pointer"
                    />
                    Require Standard Net Quantity
                  </label>

                  <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={!isAdmin}
                      checked={localParameters.requireMfgDate ?? true}
                      onChange={(e) =>
                        setLocalParameters({ ...localParameters, requireMfgDate: e.target.checked })
                      }
                      className="w-4 h-4 accent-[#003366] rounded cursor-pointer"
                    />
                    Require Month &amp; Year of Mfg/Packing
                  </label>

                  <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={!isAdmin}
                      checked={localParameters.requireConsumerCare ?? true}
                      onChange={(e) =>
                        setLocalParameters({
                          ...localParameters,
                          requireConsumerCare: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-[#003366] rounded cursor-pointer"
                    />
                    Require Consumer Care Cell Details
                  </label>

                  <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={!isAdmin}
                      checked={localParameters.requireCountryOfOrigin ?? true}
                      onChange={(e) =>
                        setLocalParameters({
                          ...localParameters,
                          requireCountryOfOrigin: e.target.checked,
                        })
                      }
                      className="w-4 h-4 accent-[#003366] rounded cursor-pointer"
                    />
                    Require Country of Origin (PCR 2020)
                  </label>
                </div>
              )}

              {/* 2. RULE 7 & 8 FONT TIERS */}
              {selectedRule.ruleCode === 'RULE_7_8_FONT_SPECIFICATIONS' && (
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg border border-gray-200 font-mono">
                  <div className="font-semibold text-slate-800 uppercase text-[10px] tracking-wider">
                    Rule 8 Table 1 Minimum Height Thresholds (mm):
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="text-slate-600 text-[10px] uppercase block">≤ 50g / ml Min:</span>
                      <input
                        type="number"
                        step="0.1"
                        disabled={!isAdmin}
                        value={localParameters.tiers?.[0]?.minHeightMm ?? 1.0}
                        onChange={(e) => {
                          const tiers = [...(localParameters.tiers || [])];
                          tiers[0] = { ...tiers[0], minHeightMm: Number(e.target.value) };
                          setLocalParameters({ ...localParameters, tiers });
                        }}
                        className="w-full mt-1 p-2 bg-white border border-gray-300 rounded font-mono font-bold text-[#003366] text-xs focus:outline-none focus:border-[#003366]"
                      />
                    </div>

                    <div>
                      <span className="text-slate-600 text-[10px] uppercase block">50g - 200g Min:</span>
                      <input
                        type="number"
                        step="0.1"
                        disabled={!isAdmin}
                        value={localParameters.tiers?.[1]?.minHeightMm ?? 2.0}
                        onChange={(e) => {
                          const tiers = [...(localParameters.tiers || [])];
                          tiers[1] = { ...tiers[1], minHeightMm: Number(e.target.value) };
                          setLocalParameters({ ...localParameters, tiers });
                        }}
                        className="w-full mt-1 p-2 bg-white border border-gray-300 rounded font-mono font-bold text-[#003366] text-xs focus:outline-none focus:border-[#003366]"
                      />
                    </div>

                    <div>
                      <span className="text-slate-600 text-[10px] uppercase block">200g - 1kg Min:</span>
                      <input
                        type="number"
                        step="0.1"
                        disabled={!isAdmin}
                        value={localParameters.tiers?.[2]?.minHeightMm ?? 4.0}
                        onChange={(e) => {
                          const tiers = [...(localParameters.tiers || [])];
                          tiers[2] = { ...tiers[2], minHeightMm: Number(e.target.value) };
                          setLocalParameters({ ...localParameters, tiers });
                        }}
                        className="w-full mt-1 p-2 bg-white border border-gray-300 rounded font-mono font-bold text-[#003366] text-xs focus:outline-none focus:border-[#003366]"
                      />
                    </div>

                    <div>
                      <span className="text-slate-600 text-[10px] uppercase block">&gt; 1kg / L Min:</span>
                      <input
                        type="number"
                        step="0.1"
                        disabled={!isAdmin}
                        value={localParameters.tiers?.[3]?.minHeightMm ?? 6.0}
                        onChange={(e) => {
                          const tiers = [...(localParameters.tiers || [])];
                          tiers[3] = { ...tiers[3], minHeightMm: Number(e.target.value) };
                          setLocalParameters({ ...localParameters, tiers });
                        }}
                        className="w-full mt-1 p-2 bg-white border border-gray-300 rounded font-mono font-bold text-[#003366] text-xs focus:outline-none focus:border-[#003366]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. RULE 26 EXEMPTIONS */}
              {selectedRule.ruleCode === 'RULE_26_EXEMPTIONS' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-gray-200 font-mono">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px] uppercase tracking-wider">
                      Small Package Threshold (Rule 26(a)):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        disabled={!isAdmin}
                        value={localParameters.smallPackageThresholdGramsOrMl ?? 10}
                        onChange={(e) =>
                          setLocalParameters({
                            ...localParameters,
                            smallPackageThresholdGramsOrMl: Number(e.target.value),
                          })
                        }
                        className="w-full p-2 bg-white border border-gray-300 rounded font-mono font-bold text-[#003366] text-xs focus:outline-none focus:border-[#003366]"
                      />
                      <span className="text-slate-600 font-medium">g / ml</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px] uppercase tracking-wider">
                      Bulk Agricultural Threshold (Rule 26(b)):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        disabled={!isAdmin}
                        value={localParameters.bulkAgricultureThresholdKg ?? 50}
                        onChange={(e) =>
                          setLocalParameters({
                            ...localParameters,
                            bulkAgricultureThresholdKg: Number(e.target.value),
                          })
                        }
                        className="w-full p-2 bg-white border border-gray-300 rounded font-mono font-bold text-[#003366] text-xs focus:outline-none focus:border-[#003366]"
                      />
                      <span className="text-slate-600 font-medium">kg</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. PENALTY SLABS & COMPOUNDING */}
              {selectedRule.ruleCode === 'NOTICE_GRADING_COMPOUNDING' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-lg border border-gray-200 font-mono">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px] uppercase tracking-wider">
                      Minor Penalty Base (₹):
                    </label>
                    <input
                      type="number"
                      disabled={!isAdmin}
                      value={localParameters.minorBaseFineInr ?? 5000}
                      onChange={(e) =>
                        setLocalParameters({
                          ...localParameters,
                          minorBaseFineInr: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 bg-white border border-gray-300 rounded font-mono font-bold text-[#003366] text-xs focus:outline-none focus:border-[#003366]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px] uppercase tracking-wider">
                      Moderate Penalty Base (₹):
                    </label>
                    <input
                      type="number"
                      disabled={!isAdmin}
                      value={localParameters.moderateBaseFineInr ?? 10000}
                      onChange={(e) =>
                        setLocalParameters({
                          ...localParameters,
                          moderateBaseFineInr: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 bg-white border border-gray-300 rounded font-mono font-bold text-[#003366] text-xs focus:outline-none focus:border-[#003366]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-[11px] uppercase tracking-wider">
                      Severe Penalty Base (₹):
                    </label>
                    <input
                      type="number"
                      disabled={!isAdmin}
                      value={localParameters.severeBaseFineInr ?? 25000}
                      onChange={(e) =>
                        setLocalParameters({
                          ...localParameters,
                          severeBaseFineInr: Number(e.target.value),
                        })
                      }
                      className="w-full p-2 bg-white border border-gray-300 rounded font-mono font-bold text-[#003366] text-xs focus:outline-none focus:border-[#003366]"
                    />
                  </div>
                </div>
              )}

              {/* 5. OVERCHARGE TOLERANCE */}
              {selectedRule.ruleCode === 'RULE_18_2_OVERCHARGING_CHECK' && (
                <div className="bg-slate-50 p-4 rounded-lg border border-gray-200 space-y-2">
                  <label className="block font-medium text-slate-700 text-xs">
                    Statutory Platform Price Tolerance (₹):
                  </label>
                  <input
                    type="number"
                    disabled={!isAdmin}
                    value={localParameters.defaultPlatformToleranceInr ?? 0}
                    onChange={(e) =>
                      setLocalParameters({
                        ...localParameters,
                        defaultPlatformToleranceInr: Number(e.target.value),
                      })
                    }
                    className="w-48 p-2 bg-white border border-gray-300 rounded font-mono font-bold text-[#003366] text-xs focus:outline-none focus:border-[#003366]"
                  />
                  <span className="text-xs text-slate-500 block">
                    Statutory standard is ₹0 tolerance (any listing price &gt; package MRP constitutes an offence under Rule 18(2)).
                  </span>
                </div>
              )}
            </div>

            {/* Status alerts */}
            {saveSuccessMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                {saveSuccessMsg}
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-md text-red-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                {errorMessage}
              </div>
            )}

            {/* Save Button */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-slate-500">
                Last modified: {new Date(selectedRule.lastUpdated).toLocaleString('en-IN')} by{' '}
                {selectedRule.updatedBy}
              </span>

              {isAdmin ? (
                <button
                  onClick={handleSaveRule}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#003366] hover:bg-[#002244] text-white font-medium rounded-md text-xs transition flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving to Server...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save &amp; Hot-Reload Engine
                    </>
                  )}
                </button>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 bg-slate-100 text-slate-400 border border-gray-200 font-medium rounded-md flex items-center gap-2 cursor-not-allowed text-xs"
                >
                  <Lock className="w-4 h-4" />
                  Admin Privilege Required
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
