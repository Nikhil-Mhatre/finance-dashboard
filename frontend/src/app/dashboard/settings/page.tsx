// src/app/dashboard/settings/page.tsx
"use client";

import React, { useState } from "react";
import {
  CogIcon,
  BellIcon,
  EyeIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage(): React.JSX.Element {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      budgetAlerts: true,
      transactionAlerts: false,
      weeklyReports: true,
      marketUpdates: false,
    },
    privacy: {
      profileVisibility: "private",
      dataSharing: false,
    },
    preferences: {
      currency: "USD",
      language: "en",
      theme: "light",
    },
  });

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value,
      },
    }));
  };

  const SettingCard: React.FC<{
    icon: React.ElementType;
    title: string;
    description: string;
    children: React.ReactNode;
  }> = ({ icon: Icon, title, description, children }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-slate-900 mb-1">{title}</h3>
          <p className="text-sm text-slate-600 mb-4">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );

  const Toggle: React.FC<{
    checked: boolean;
    onChange: (checked: boolean) => void;
    label: string;
  }> = ({ checked, onChange, label }) => (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-slate-700">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-blue-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-sm text-slate-600">
          Manage your account preferences and privacy settings
        </p>
      </div>

      {/* Notifications */}
      <SettingCard
        icon={BellIcon}
        title="Notifications"
        description="Control when and how you receive alerts"
      >
        <div className="space-y-1">
          <Toggle
            checked={settings.notifications.budgetAlerts}
            onChange={(checked) => updateSetting("notifications", "budgetAlerts", checked)}
            label="Budget limit alerts"
          />
          <Toggle
            checked={settings.notifications.transactionAlerts}
            onChange={(checked) => updateSetting("notifications", "transactionAlerts", checked)}
            label="Large transaction alerts"
          />
          <Toggle
            checked={settings.notifications.weeklyReports}
            onChange={(checked) => updateSetting("notifications", "weeklyReports", checked)}
            label="Weekly spending reports"
          />
          <Toggle
            checked={settings.notifications.marketUpdates}
            onChange={(checked) => updateSetting("notifications", "marketUpdates", checked)}
            label="Investment market updates"
          />
        </div>
      </SettingCard>

      {/* Privacy */}
      <SettingCard
        icon={ShieldCheckIcon}
        title="Privacy & Security"
        description="Control your data privacy and account security"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Profile Visibility
            </label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => updateSetting("privacy", "profileVisibility", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
              <option value="public">Public</option>
            </select>
          </div>
          
          <Toggle
            checked={settings.privacy.dataSharing}
            onChange={(checked) => updateSetting("privacy", "dataSharing", checked)}
            label="Allow anonymous data sharing for insights"
          />
        </div>
      </SettingCard>

      {/* Preferences */}
      <SettingCard
        icon={CogIcon}
        title="Preferences"
        description="Customize your experience"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Currency
              </label>
              <select
                value={settings.preferences.currency}
                onChange={(e) => updateSetting("preferences", "currency", e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Language
              </label>
              <select
                value={settings.preferences.language}
                onChange={(e) => updateSetting("preferences", "language", e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="hi">Hindi</option>
              </select>
            </div>
          </div>
        </div>
      </SettingCard>

      {/* Account Information */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-slate-100 rounded-lg">
            <ShieldCheckIcon className="w-5 h-5 text-slate-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-slate-900 mb-1">Account Information</h3>
            <p className="text-sm text-slate-600 mb-4">Your Google account details</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-700">Email</span>
                <span className="text-sm font-medium text-slate-900">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-700">Account Type</span>
                <span className="text-sm font-medium text-slate-900">Google OAuth</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-700">Member Since</span>
                <span className="text-sm font-medium text-slate-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  );
}
