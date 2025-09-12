// src/app/dashboard/profile/page.tsx
"use client";

import React, { useState } from "react";
import {
  UserIcon,
  CameraIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage(): React.JSX.Element {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    bio: "",
    location: "",
    website: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle profile update
    setIsEditing(false);
  };

  const stats = [
    { label: "Transactions", value: "247" },
    { label: "Categories", value: "12" },
    { label: "Accounts", value: "4" },
    { label: "Goals Met", value: "8" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <p className="text-sm text-slate-600">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Cover & Avatar */}
        <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
          <div className="absolute -bottom-16 left-6">
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-slate-200 flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-slate-500" />
                </div>
              )}
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-slate-200 hover:bg-slate-50">
                <CameraIcon className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 pb-6 px-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-slate-600">{user?.email}</p>
              <p className="text-sm text-slate-500 mt-1">
                Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : "2025"}
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
            >
              <PencilIcon className="w-4 h-4" />
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4 bg-slate-50 rounded-lg">
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Edit Form */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Email cannot be changed for Google OAuth accounts
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-2">About</h3>
                <p className="text-sm text-slate-600">
                  {formData.bio || "No bio added yet. Click Edit Profile to add one."}
                </p>
              </div>
              
              {(formData.location || formData.website) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.location && (
                    <div>
                      <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                        Location
                      </h4>
                      <p className="text-sm text-slate-900">{formData.location}</p>
                    </div>
                  )}
                  {formData.website && (
                    <div>
                      <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                        Website
                      </h4>
                      <a
                        href={formData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        {formData.website}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
