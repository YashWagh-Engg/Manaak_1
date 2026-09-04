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
      <div className="bg-slate-900 text-slate-200 rounded-lg p-5 border border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-widest">
              Module 3: Dynamic Rule Engine
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
              Packaged Commodities Rules, 2011
            </span>
          </div>
          <h2 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
            Statutory Rule &amp; Compounding Configurator
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Live read/write interface for statutory compliance rules. Modifications are instantly hot-reloaded into the backend inspection engine and affect all active evaluations.
          </p>
        </div>

        {/* RBAC State Pill */}
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <div className="px-3.5 py-2 rounded bg-emerald-950/60 border border-emerald-700/60 text-emerald-400 text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Chief Admin (Full Edit Access)</span>
            </div>
          ) : (
            <div className="px-3.5 py-2 rounded bg-amber-950/60 border border-amber-700/60 text-amber-400 text-xs font-mono font-semibold flex items-center gap-1.5 shadow-sm">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Read-Only Mode ({currentRole})</span>
            </div>
          )}
        </div>
      </div>

      {/* RBAC Notice if not admin */}
      {!isAdmin && (
        <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-lg text-amber-300 text-xs flex items-start gap-3 font-mono">
          <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold uppercase tracking-wider text-[11px]">Role-Based Access Control Notice</div>
            <p className="leading-relaxed text-slate-400">
              You are currently viewing statutory rules as <strong className="text-slate-200">{currentRole}</strong>. In accordance with Legal Metrology administrative protocols, only the <strong className="text-amber-400">Chief Metrology Admin</strong> has authority to alter statutory rule thresholds or compounding penalty slabs. Switch your role in the top-right corner to test admin editing and hot-reloading!
            </p>
          </div>
        </div>
      )}

      {/* Main Layout: Rule Selector (Left) & Rule Form (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Rule Directory */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-slate-900 rounded-lg border border-slate-800 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 pb-2 border-b border-slate-800 uppercase tracking-widest font-mono text-[10px]">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                Active Rule Modules ({rules.length})
              </span>
              <button
                onClick={() => onReloadRules()}
                className="text-amber-400 hover:text-amber-300 transition"
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
                    className={`w-full text-left p-3 rounded border transition text-xs flex flex-col gap-1 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 shadow-xs'
                        : 'border-slate-800 bg-slate-950 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{rule.title}</span>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold ${
                          rule.enabled ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {rule.enabled ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-amber-400">{rule.ruleCode}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1">{rule.description}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Parameter Editor Form */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 rounded-lg border border-slate-800 shadow-sm p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {selectedRule.ruleCode}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">v{selectedRule.version}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{selectedRule.title}</h3>
                <p className="text-xs text-slate-400 max-w-xl">{selectedRule.description}</p>
              </div>

              {/* Enabled Switch */}
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded border border-slate-800">
                <label className="text-xs font-semibold text-slate-400 font-mono cursor-pointer">
                  Rule Active:
                </label>
                <input
                  type="checkbox"
                  disabled={!isAdmin}
                  checked={localEnabled}
                  onChange={(e) => setLocalEnabled(e.target.checked)}
                  className="w-4 h-4 text-amber-500 rounded focus:ring-amber-500 cursor-pointer disabled:opacity-50 accent-amber-500"
                />
              </div>
            </div>

            {/* Dynamic Parameter Fields based on Rule Code */}
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] font-mono flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-500" />
                Statutory Parameters &amp; Thresholds
              </h4>

              {/* 1. RULE 6 CHECKLIST */}
              {selectedRule.ruleCode === 'RULE_6_MANDATORY_DECLARATIONS' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
                  <label className="flex items-center gap-2 font-medium text-slate-300">
                    <input
                      type="checkbox"
                      disabled={!isAdmin}
                      checked={localParameters.requireMrp ?? true}
                      onChange={(e) =>
                        setLocalParameters({ ...localParameters, requireMrp: e.target.checked })
                      }
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    Require Retail Price (Rule 6(1)(e))
                  </label>

                  <label className="flex items-center gap-2 font-medium text-slate-300">
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
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    Require "incl. of all taxes" statement
                  </label>

                  <label className="flex items-center gap-2 font-medium text-slate-300">
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
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    Require Standard Net Quantity
                  </label>

                  <label className="flex items-center gap-2 font-medium text-slate-300">
                    <input
                      type="checkbox"
                      disabled={!isAdmin}
                      checked={localParameters.requireMfgDate ?? true}
                      onChange={(e) =>
                        setLocalParameters({ ...localParameters, requireMfgDate: e.target.checked })
                      }
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    Require Month &amp; Year of Mfg/Packing
                  </label>

                  <label className="flex items-center gap-2 font-medium text-slate-300">
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
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    Require Consumer Care Cell Details
                  </label>

                  <label className="flex items-center gap-2 font-medium text-slate-300">
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
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    Require Country of Origin (PCR 2020)
                  </label>
                </div>
              )}

              {/* 2. RULE 7 & 8 FONT TIERS */}
              {selectedRule.ruleCode === 'RULE_7_8_FONT_SPECIFICATIONS' && (
                <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono">
                  <div className="font-semibold text-slate-300 uppercase text-[10px] tracking-wider">
                    Rule 8 Table 1 Minimum Height Thresholds (mm):
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">≤ 50g / ml Min:</span>
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
                        className="w-full mt-1 p-2 bg-slate-900 border border-slate-700 rounded font-mono font-bold text-amber-400 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">50g - 200g Min:</span>
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
                        className="w-full mt-1 p-2 bg-slate-900 border border-slate-700 rounded font-mono font-bold text-amber-400 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">200g - 1kg Min:</span>
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
                        className="w-full mt-1 p-2 bg-slate-900 border border-slate-700 rounded font-mono font-bold text-amber-400 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <span className="text-slate-500 text-[10px] uppercase block">&gt; 1kg / L Min:</span>
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
                        className="w-full mt-1 p-2 bg-slate-900 border border-slate-700 rounded font-mono font-bold text-amber-400 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 3. RULE 26 EXEMPTIONS */}
              {selectedRule.ruleCode === 'RULE_26_EXEMPTIONS' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1 text-[11px] uppercase tracking-wider">
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
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded font-mono font-bold text-amber-400 text-xs focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-slate-400 font-medium">g / ml</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1 text-[11px] uppercase tracking-wider">
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
                        className="w-full p-2 bg-slate-900 border border-slate-700 rounded font-mono font-bold text-amber-400 text-xs focus:outline-none focus:border-amber-500"
                      />
                      <span className="text-slate-400 font-medium">kg</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. PENALTY SLABS & COMPOUNDING */}
              {selectedRule.ruleCode === 'NOTICE_GRADING_COMPOUNDING' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1 text-[11px] uppercase tracking-wider">
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
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded font-mono font-bold text-amber-400 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1 text-[11px] uppercase tracking-wider">
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
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded font-mono font-bold text-amber-400 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1 text-[11px] uppercase tracking-wider">
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
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded font-mono font-bold text-amber-400 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* 5. OVERCHARGE TOLERANCE */}
              {selectedRule.ruleCode === 'RULE_18_2_OVERCHARGING_CHECK' && (
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 font-mono">
                  <label className="block font-medium text-slate-300 text-[11px] uppercase tracking-wider">
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
                    className="w-48 p-2 bg-slate-900 border border-slate-700 rounded font-mono font-bold text-amber-400 text-xs focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    Statutory standard is ₹0 tolerance (any listing price &gt; package MRP constitutes an offence under Rule 18(2)).
                  </span>
                </div>
              )}
            </div>

            {/* Status alerts */}
            {saveSuccessMsg && (
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs flex items-center gap-2 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                {saveSuccessMsg}
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 bg-red-950/40 border border-red-500/40 rounded-lg text-red-300 text-xs flex items-center gap-2 font-mono">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                {errorMessage}
              </div>
            )}

            {/* Save Button */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 font-mono">
                Last modified: {new Date(selectedRule.lastUpdated).toLocaleString('en-IN')} by{' '}
                {selectedRule.updatedBy}
              </span>

              {isAdmin ? (
                <button
                  onClick={handleSaveRule}
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
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
                  className="px-5 py-2.5 bg-slate-800 text-slate-500 font-bold rounded flex items-center gap-2 cursor-not-allowed text-xs font-mono"
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
