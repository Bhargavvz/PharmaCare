import React, { useState } from 'react';
import { Camera, Mail, Phone, User, MapPin, Calendar, Shield, X, Plus } from 'lucide-react';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-01-01',
    address: '123 Main St, City, State 12345',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'Spouse',
      phone: '+1 (555) 987-6543',
    },
    allergies: ['Penicillin', 'Peanuts'],
    bloodType: 'O+',
  });

  const handleRemoveAllergy = (indexToRemove: number) => {
    setProfileData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleAddAllergy = () => {
    const newAllergy = window.prompt('Enter new allergy:');
    if (newAllergy?.trim()) {
      setProfileData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information and preferences
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      {/* Profile Picture Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-teal-600" />
            </div>
            <button className="absolute bottom-0 right-0 p-1.5 bg-teal-600 rounded-full text-white hover:bg-teal-700">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {profileData.firstName} {profileData.lastName}
            </h2>
            <p className="text-sm text-gray-500">Update your photo and personal details</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              value={profileData.firstName}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              value={profileData.lastName}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 flex items-center">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="email"
                value={profileData.email}
                disabled={!isEditing}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <div className="mt-1 flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="tel"
                value={profileData.phone}
                disabled={!isEditing}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <div className="mt-1 flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="date"
                value={profileData.dateOfBirth}
                disabled={!isEditing}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <div className="mt-1 flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="text"
                value={profileData.address}
                disabled={!isEditing}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Medical Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Blood Type</label>
            <select
              value={profileData.bloodType}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option>O+</option>
              <option>O-</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Allergies</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {profileData.allergies.map((allergy, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
                >
                  {allergy}
                  {isEditing && (
                    <button 
                      onClick={() => handleRemoveAllergy(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </span>
              ))}
              {isEditing && (
                <button 
                  onClick={handleAddAllergy}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                  type="button"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Allergy
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={profileData.emergencyContact.name}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Relationship</label>
            <input
              type="text"
              value={profileData.emergencyContact.relationship}
              disabled={!isEditing}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <div className="mt-1 flex items-center">
              <Phone className="h-5 w-5 text-gray-400 mr-2" />
              <input
                type="tel"
                value={profileData.emergencyContact.phone}
                disabled={!isEditing}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Account Security</h3>
            <p className="text-sm text-gray-500">Manage your password and security settings</p>
          </div>
          <Shield className="h-6 w-6 text-blue-600" />
        </div>
        <div className="space-y-4">
          <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50">
            <div className="font-medium text-gray-900">Change Password</div>
            <div className="text-sm text-gray-500">Update your password regularly to keep your account secure</div>
          </button>
          <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-300 hover:bg-gray-50">
            <div className="font-medium text-gray-900">Two-Factor Authentication</div>
            <div className="text-sm text-gray-500">Add an extra layer of security to your account</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
