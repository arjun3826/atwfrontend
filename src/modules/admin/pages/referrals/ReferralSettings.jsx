import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  Percent,
  IndianRupee,
  ShieldCheck,
  ShieldOff,
  Users,
  Building2,
  Settings2,
  ToggleLeft,
} from "lucide-react";

import Breadcrumb from "../../../../common/components/Breadcrumb";
import {
  containerVariants,
  itemVariants,
} from "../../../../common/utils/motionVariants";

/**
 * TODO: Replace mock state with a real hook, e.g.
 * const { settings, setSettings, saveSettings, loading } = useReferralSettings();
 * `saveSettings` would call POST /api/referral-settings with the current
 * `settings` object; the initial value below would come from
 * GET /api/referral-settings. No other UI code needs to change.
 */
const INITIAL_SETTINGS = {
  worker: {
    rewardType: "fixed",
    rewardValue: 200,

    releaseConditions: {
      registration: true,
      kyc: true,
      companyJoin: true,
      salary: true,
      adminApproval: true,
    },

    fraud: {
      selfReferral: true,
      duplicateMobile: true,
      duplicateDevice: true,
      minimumSalary: 1000,
    },
  },

  agentWorker: {
    commissionType: "percentage",
    commissionValue: 10,
    recurring: "monthly",

    releaseConditions: {
      invoicePaid: true,
    },
  },

  agentCompany: {
    commissionType: "percentage",
    commissionValue: 5,
    recurring: "monthly",

    releaseConditions: {
      companyApproved: true,
      vacancyCreated: true,
      invoiceGenerated: true,
      invoicePaid: true,
    },
  },

  general: {
    enabled: true,
    workerReferral: true,
    agentReferral: true,
    companyReferral: true,
    allowReferralCode: true,
    autoRelease: false,
    requireApproval: true,
  },
};

const RECURRING_OPTIONS = [
  { value: "onetime", label: "One Time" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

/* -------------------------------------------------------------------------
 * Reusable primitives
 * ---------------------------------------------------------------------- */

const ToggleSwitch = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between gap-4 py-2.5">
    <div className="min-w-0">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      {description ? (
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      ) : null}
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? "bg-blue-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

const RadioButtonGroup = ({ name, options, value, onChange }) => (
  <div className="flex flex-wrap items-center gap-5">
    {options.map((option) => {
      const isActive = value === option.value;
      return (
        <label
          key={option.value}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <span
            className={`flex items-center justify-center w-4 h-4 rounded-full border-2 transition-colors ${
              isActive ? "border-blue-600" : "border-gray-300"
            }`}
          >
            {isActive ? (
              <span className="w-2 h-2 rounded-full bg-blue-600" />
            ) : null}
          </span>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={isActive}
            onChange={() => onChange(option.value)}
            className="sr-only"
          />
          <span
            className={`text-sm ${
              isActive ? "text-gray-800 font-medium" : "text-gray-500"
            }`}
          >
            {option.label}
          </span>
        </label>
      );
    })}
  </div>
);

const NumberInput = ({ label, value, onChange, prefix, placeholder }) => (
  <div>
    {label ? (
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        {label}
      </label>
    ) : null}
    <div className="relative">
      {prefix ? (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
          {prefix}
        </span>
      ) : null}
      <input
        type="number"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full ${
          prefix ? "pl-8" : "pl-3"
        } pr-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
      />
    </div>
  </div>
);

const SelectInput = ({ label, value, onChange, options }) => (
  <div>
    {label ? (
      <label className="block text-xs font-medium text-gray-500 mb-1.5">
        {label}
      </label>
    ) : null}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const SectionLabel = ({ children }) => (
  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">
    {children}
  </p>
);

const StatCard = ({ icon: Icon, label, value, iconBg, iconColor }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center gap-4">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}
    >
      <Icon className={`w-6 h-6 ${iconColor}`} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const SettingCard = ({ icon: Icon, title, subtitle, children }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ y: -2 }}
    transition={{ type: "spring", stiffness: 300, damping: 24 }}
    className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col gap-5"
  >
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
      </div>
    </div>

    <div className="flex flex-col gap-5">{children}</div>
  </motion.div>
);

/* -------------------------------------------------------------------------
 * Page
 * ---------------------------------------------------------------------- */

const ReferralSettings = () => {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  /* ---------- generic patch helpers (keep API-ready shape) ---------- */

  const patchSection = (section, patch) =>
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...patch },
    }));

  const patchNested = (section, group, key, value) =>
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [group]: {
          ...prev[section][group],
          [key]: value,
        },
      },
    }));

  const handleSave = () => {
    // eslint-disable-next-line no-console
    console.log(settings);
  };

  const handleCancel = () => {
    setSettings(INITIAL_SETTINGS);
  };

  /* ---------- derived summary values ---------- */

  const summary = useMemo(() => {
    const workerPrefix = settings.worker.rewardType === "percentage" ? "%" : "\u20B9";
    const agentPrefix =
      settings.agentWorker.commissionType === "percentage" ? "%" : "\u20B9";
    const companyPrefix =
      settings.agentCompany.commissionType === "percentage" ? "%" : "\u20B9";

    const fraudEnabled =
      settings.worker.fraud.selfReferral ||
      settings.worker.fraud.duplicateMobile ||
      settings.worker.fraud.duplicateDevice;

    return {
      workerReward:
        workerPrefix === "%"
          ? `${settings.worker.rewardValue}%`
          : `\u20B9${settings.worker.rewardValue}`,
      agentCommission:
        agentPrefix === "%"
          ? `${settings.agentWorker.commissionValue}%`
          : `\u20B9${settings.agentWorker.commissionValue}`,
      companyCommission:
        companyPrefix === "%"
          ? `${settings.agentCompany.commissionValue}%`
          : `\u20B9${settings.agentCompany.commissionValue}`,
      fraudEnabled,
    };
  }, [settings]);

  return (
    <motion.div
      className="flex-1 bg-gray-50 p-4 pb-28"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Breadcrumb
        items={[
          { label: "Referral Management", path: "/admin/referrals/manage" },
          { label: "Referral Settings" },
        ]}
      />

      {/* Header */}
      <motion.div variants={itemVariants} className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Referral Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Configure worker rewards, agent commissions and referral
          eligibility rules.
        </p>
      </motion.div>

      {/* Top Summary */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"
      >
        <StatCard
          icon={Wallet}
          label="Worker Reward"
          value={summary.workerReward}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          icon={Percent}
          label="Agent Commission"
          value={summary.agentCommission}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatCard
          icon={IndianRupee}
          label="Company Commission"
          value={summary.companyCommission}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          icon={summary.fraudEnabled ? ShieldCheck : ShieldOff}
          label="Fraud Protection"
          value={summary.fraudEnabled ? "Enabled" : "Disabled"}
          iconBg={summary.fraudEnabled ? "bg-blue-100" : "bg-gray-100"}
          iconColor={summary.fraudEnabled ? "text-blue-600" : "text-gray-500"}
        />
      </motion.div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Card 1: Worker -> Worker Reward */}
        <SettingCard
          icon={Users}
          title="Worker \u2192 Worker Reward"
          subtitle="Reward given to a worker for referring another worker"
        >
          <div>
            <SectionLabel>Reward Type</SectionLabel>
            <RadioButtonGroup
              name="worker-reward-type"
              value={settings.worker.rewardType}
              onChange={(value) => patchSection("worker", { rewardType: value })}
              options={[
                { value: "fixed", label: "Fixed Amount" },
                { value: "percentage", label: "Percentage" },
              ]}
            />
          </div>

          <NumberInput
            label="Reward Value"
            value={settings.worker.rewardValue}
            placeholder="200"
            prefix={settings.worker.rewardType === "percentage" ? "%" : "\u20B9"}
            onChange={(value) => patchSection("worker", { rewardValue: value })}
          />

          <div>
            <SectionLabel>Release Conditions</SectionLabel>
            <div className="divide-y divide-gray-100">
              <ToggleSwitch
                label="Registration Completed"
                checked={settings.worker.releaseConditions.registration}
                onChange={(v) =>
                  patchNested("worker", "releaseConditions", "registration", v)
                }
              />
              <ToggleSwitch
                label="KYC Completed"
                checked={settings.worker.releaseConditions.kyc}
                onChange={(v) =>
                  patchNested("worker", "releaseConditions", "kyc", v)
                }
              />
              <ToggleSwitch
                label="Joined Company"
                checked={settings.worker.releaseConditions.companyJoin}
                onChange={(v) =>
                  patchNested("worker", "releaseConditions", "companyJoin", v)
                }
              />
              <ToggleSwitch
                label="First Salary Earned"
                checked={settings.worker.releaseConditions.salary}
                onChange={(v) =>
                  patchNested("worker", "releaseConditions", "salary", v)
                }
              />
              <ToggleSwitch
                label="Manual Admin Approval"
                checked={settings.worker.releaseConditions.adminApproval}
                onChange={(v) =>
                  patchNested("worker", "releaseConditions", "adminApproval", v)
                }
              />
            </div>
          </div>

          <div>
            <SectionLabel>Fraud Prevention</SectionLabel>
            <div className="divide-y divide-gray-100">
              <ToggleSwitch
                label="Block Self Referral"
                checked={settings.worker.fraud.selfReferral}
                onChange={(v) => patchNested("worker", "fraud", "selfReferral", v)}
              />
              <ToggleSwitch
                label="Block Duplicate Mobile"
                checked={settings.worker.fraud.duplicateMobile}
                onChange={(v) =>
                  patchNested("worker", "fraud", "duplicateMobile", v)
                }
              />
              <ToggleSwitch
                label="Block Duplicate Device"
                checked={settings.worker.fraud.duplicateDevice}
                onChange={(v) =>
                  patchNested("worker", "fraud", "duplicateDevice", v)
                }
              />
            </div>
            <div className="mt-3">
              <NumberInput
                label="Minimum Salary Required"
                value={settings.worker.fraud.minimumSalary}
                prefix="\u20B9"
                onChange={(v) => patchNested("worker", "fraud", "minimumSalary", v)}
              />
            </div>
          </div>
        </SettingCard>

        {/* Card 2: Agent -> Worker Commission */}
        <SettingCard
          icon={Building2}
          title="Agent \u2192 Worker Commission"
          subtitle="Commission paid to an agent for referring a worker"
        >
          <div>
            <SectionLabel>Commission Type</SectionLabel>
            <RadioButtonGroup
              name="agent-worker-commission-type"
              value={settings.agentWorker.commissionType}
              onChange={(value) =>
                patchSection("agentWorker", { commissionType: value })
              }
              options={[
                { value: "fixed", label: "Fixed" },
                { value: "percentage", label: "Percentage" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberInput
              label="Commission Value"
              value={settings.agentWorker.commissionValue}
              prefix={
                settings.agentWorker.commissionType === "percentage"
                  ? "%"
                  : "\u20B9"
              }
              onChange={(value) =>
                patchSection("agentWorker", { commissionValue: value })
              }
            />
            <SelectInput
              label="Recurring Type"
              value={settings.agentWorker.recurring}
              options={RECURRING_OPTIONS}
              onChange={(value) => patchSection("agentWorker", { recurring: value })}
            />
          </div>

          <div>
            <SectionLabel>Release Condition</SectionLabel>
            <div className="divide-y divide-gray-100">
              <ToggleSwitch
                label="Invoice Paid"
                checked={settings.agentWorker.releaseConditions.invoicePaid}
                onChange={(v) =>
                  patchNested("agentWorker", "releaseConditions", "invoicePaid", v)
                }
              />
            </div>
          </div>
        </SettingCard>

        {/* Card 3: Agent -> Company Commission */}
        <SettingCard
          icon={Building2}
          title="Agent \u2192 Company Commission"
          subtitle="Commission paid to an agent for referring a company"
        >
          <div>
            <SectionLabel>Commission Type</SectionLabel>
            <RadioButtonGroup
              name="agent-company-commission-type"
              value={settings.agentCompany.commissionType}
              onChange={(value) =>
                patchSection("agentCompany", { commissionType: value })
              }
              options={[
                { value: "fixed", label: "Fixed" },
                { value: "percentage", label: "Percentage" },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberInput
              label="Commission Value"
              value={settings.agentCompany.commissionValue}
              prefix={
                settings.agentCompany.commissionType === "percentage"
                  ? "%"
                  : "\u20B9"
              }
              onChange={(value) =>
                patchSection("agentCompany", { commissionValue: value })
              }
            />
            <SelectInput
              label="Recurring Type"
              value={settings.agentCompany.recurring}
              options={RECURRING_OPTIONS}
              onChange={(value) =>
                patchSection("agentCompany", { recurring: value })
              }
            />
          </div>

          <div>
            <SectionLabel>Release Conditions</SectionLabel>
            <div className="divide-y divide-gray-100">
              <ToggleSwitch
                label="Company Approved"
                checked={settings.agentCompany.releaseConditions.companyApproved}
                onChange={(v) =>
                  patchNested(
                    "agentCompany",
                    "releaseConditions",
                    "companyApproved",
                    v,
                  )
                }
              />
              <ToggleSwitch
                label="Vacancy Created"
                checked={settings.agentCompany.releaseConditions.vacancyCreated}
                onChange={(v) =>
                  patchNested(
                    "agentCompany",
                    "releaseConditions",
                    "vacancyCreated",
                    v,
                  )
                }
              />
              <ToggleSwitch
                label="Invoice Generated"
                checked={settings.agentCompany.releaseConditions.invoiceGenerated}
                onChange={(v) =>
                  patchNested(
                    "agentCompany",
                    "releaseConditions",
                    "invoiceGenerated",
                    v,
                  )
                }
              />
              <ToggleSwitch
                label="Invoice Paid"
                checked={settings.agentCompany.releaseConditions.invoicePaid}
                onChange={(v) =>
                  patchNested("agentCompany", "releaseConditions", "invoicePaid", v)
                }
              />
            </div>
          </div>
        </SettingCard>

        {/* Card 4: General Referral Rules */}
        <SettingCard
          icon={Settings2}
          title="General Referral Rules"
          subtitle="Global switches that control the referral system"
        >
          <div className="divide-y divide-gray-100">
            <ToggleSwitch
              label="Enable Referral System"
              description="Master switch for all referral types"
              checked={settings.general.enabled}
              onChange={(v) => patchSection("general", { enabled: v })}
            />
            <ToggleSwitch
              label="Enable Worker Referral"
              checked={settings.general.workerReferral}
              onChange={(v) => patchSection("general", { workerReferral: v })}
            />
            <ToggleSwitch
              label="Enable Agent Referral"
              checked={settings.general.agentReferral}
              onChange={(v) => patchSection("general", { agentReferral: v })}
            />
            <ToggleSwitch
              label="Enable Company Referral"
              checked={settings.general.companyReferral}
              onChange={(v) => patchSection("general", { companyReferral: v })}
            />
            <ToggleSwitch
              label="Allow Referral Code Sharing"
              checked={settings.general.allowReferralCode}
              onChange={(v) => patchSection("general", { allowReferralCode: v })}
            />
            <ToggleSwitch
              label="Auto Release Rewards"
              description="Skip manual approval once conditions are met"
              checked={settings.general.autoRelease}
              onChange={(v) => patchSection("general", { autoRelease: v })}
            />
            <ToggleSwitch
              label="Require Admin Approval"
              checked={settings.general.requireApproval}
              onChange={(v) => patchSection("general", { requireApproval: v })}
            />
          </div>
        </SettingCard>
      </div>

      {/* Sticky Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.04)] px-4 py-3 z-20">
        <div className="flex items-center justify-end gap-3 max-w-6xl ml-auto">
          <button
            onClick={handleCancel}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <ToggleLeft size={16} />
            Save Settings
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReferralSettings;