import React, { useState } from 'react';
import {
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Mail,
  Smartphone,
  Zap,
  Eye,
  Lock,
  Trash2,
} from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'en',
    notifications: {
      email: true,
      push: true,
      reminders: true,
      updates: false,
    },
    privacy: {
      profileVisibility: 'public',
      shareData: true,
      allowAnalytics: true,
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Appearance */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Appearance</h2>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Theme</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                className={`flex items-center justify-center px-4 py-3 border rounded-lg ${
                  settings.theme === 'light'
                    ? 'border-teal-500 bg-teal-50 text-teal-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSettings({ ...settings, theme: 'light' })}
              >
                <Sun className="h-5 w-5 mr-2" />
                Light
              </button>
              <button
                className={`flex items-center justify-center px-4 py-3 border rounded-lg ${
                  settings.theme === 'dark'
                    ? 'border-teal-500 bg-teal-50 text-teal-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSettings({ ...settings, theme: 'dark' })}
              >
                <Moon className="h-5 w-5 mr-2" />
                Dark
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Language</label>
            <div className="flex items-center">
              <Globe className="h-5 w-5 text-gray-400 mr-2" />
              <select
                value={settings.language}
                onChange={(e) =>
                  setSettings({ ...settings, language: e.target.value })
                }
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
          <Bell className="h-6 w-6 text-gray-400" />
        </div>
        <div className="space-y-6">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center">
                {key === 'email' && <Mail className="h-5 w-5 text-gray-400 mr-3" />}
                {key === 'push' && <Smartphone className="h-5 w-5 text-gray-400 mr-3" />}
                {key === 'reminders' && <Bell className="h-5 w-5 text-gray-400 mr-3" />}
                {key === 'updates' && <Zap className="h-5 w-5 text-gray-400 mr-3" />}
                <div>
                  <div className="font-medium text-gray-900 capitalize">{key} Notifications</div>
                  <div className="text-sm text-gray-500">
                    Receive updates via {key}
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        [key]: e.target.checked,
                      },
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Privacy</h2>
          <Shield className="h-6 w-6 text-gray-400" />
        </div>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Profile Visibility</label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  privacy: {
                    ...settings.privacy,
                    profileVisibility: e.target.value,
                  },
                })
              }
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-teal-500 focus:ring-teal-500"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="friends">Friends Only</option>
            </select>
          </div>
          
          {Object.entries(settings.privacy)
            .filter(([key]) => key !== 'profileVisibility')
            .map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center">
                  {key === 'shareData' && <Eye className="h-5 w-5 text-gray-400 mr-3" />}
                  {key === 'allowAnalytics' && <Lock className="h-5 w-5 text-gray-400 mr-3" />}
                  <div>
                    <div className="font-medium text-gray-900">
                      {key === 'shareData' ? 'Share Usage Data' : 'Allow Analytics'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {key === 'shareData'
                        ? 'Help us improve by sharing usage data'
                        : 'Allow us to collect analytics data'}
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value as boolean}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        privacy: {
                          ...settings.privacy,
                          [key]: e.target.checked,
                        },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
            ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-red-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-red-600">Danger Zone</h2>
            <p className="mt-1 text-sm text-gray-500">
              Irreversible and destructive actions
            </p>
          </div>
          <Trash2 className="h-6 w-6 text-red-500" />
        </div>
        <button className="w-full sm:w-auto px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200">
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default Settings;
