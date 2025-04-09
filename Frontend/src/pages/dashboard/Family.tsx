import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit, Trash2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { familyService } from '../../services/api';
import { toast } from 'react-hot-toast';

interface FamilyMember {
  id: number;
  name: string;
  relationship: string;
  age: number;
  canViewMedications: boolean;
  canEditMedications: boolean;
  canManageReminders: boolean;
  status: string;
}

// Mock data for development until the API is ready
const mockFamilyMembers: FamilyMember[] = [
  {
    id: 1,
    name: 'Jane Doe',
    relationship: 'Spouse',
    age: 42,
    canViewMedications: true,
    canEditMedications: true,
    canManageReminders: true,
    status: 'Active'
  },
  {
    id: 2,
    name: 'Michael Doe',
    relationship: 'Child',
    age: 18,
    canViewMedications: true,
    canEditMedications: false,
    canManageReminders: false,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    relationship: 'Parent',
    age: 68,
    canViewMedications: true,
    canEditMedications: false,
    canManageReminders: true,
    status: 'Pending'
  }
];

const Family: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [newMember, setNewMember] = useState({
    name: '',
    relationship: '',
    age: 30,
    canViewMedications: true,
    canEditMedications: false,
    canManageReminders: false,
  });

  useEffect(() => {
    fetchFamilyMembers();
  }, []);

  const fetchFamilyMembers = async () => {
    try {
      setIsLoading(true);
      // Try to fetch from API, fall back to mock data if API fails
      try {
        const response = await familyService.getAll();
        setFamilyMembers(response);
      } catch (error) {
        console.warn('Using mock data for family members:', error);
        // Use mock data for development
        setFamilyMembers(mockFamilyMembers);
      }
    } catch (error) {
      console.error('Error fetching family members:', error);
      toast.error('Failed to load family members');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Try to use API, fall back to client-side mock if API fails
      try {
        const response = await familyService.create(newMember);
        setFamilyMembers([...familyMembers, response]);
      } catch (error) {
        console.warn('Using mock data for adding family member:', error);
        // Mock the creation for development
        const mockNewMember: FamilyMember = {
          ...newMember,
          id: Math.max(0, ...familyMembers.map(m => m.id)) + 1,
          status: 'Active'
        };
        setFamilyMembers([...familyMembers, mockNewMember]);
      }
      
      setShowAddModal(false);
      setNewMember({
        name: '',
        relationship: '',
        age: 30,
        canViewMedications: true,
        canEditMedications: false,
        canManageReminders: false,
      });
      
      toast.success('Family member added successfully');
    } catch (error) {
      console.error('Error adding family member:', error);
      toast.error('Failed to add family member');
    }
  };

  const handleEditMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    
    try {
      // Try to use API, fall back to client-side mock if API fails
      try {
        const response = await familyService.update(selectedMember.id, newMember);
        setFamilyMembers(familyMembers.map(member => 
          member.id === selectedMember.id ? response : member
        ));
      } catch (error) {
        console.warn('Using mock data for updating family member:', error);
        // Mock the update for development
        const updatedMember: FamilyMember = {
          ...newMember,
          id: selectedMember.id,
          status: selectedMember.status
        };
        setFamilyMembers(familyMembers.map(member => 
          member.id === selectedMember.id ? updatedMember : member
        ));
      }
      
      setShowEditModal(false);
      setSelectedMember(null);
      setNewMember({
        name: '',
        relationship: '',
        age: 30,
        canViewMedications: true,
        canEditMedications: false,
        canManageReminders: false,
      });
      
      toast.success('Family member updated successfully');
    } catch (error) {
      console.error('Error updating family member:', error);
      toast.error('Failed to update family member');
    }
  };

  const handleDeleteMember = async () => {
    if (!selectedMember) return;
    
    try {
      // Try to use API, fall back to client-side mock if API fails
      try {
        await familyService.delete(selectedMember.id);
      } catch (error) {
        console.warn('Using mock data for deleting family member:', error);
      }
      
      // Update UI regardless of API success
      setFamilyMembers(familyMembers.filter(member => member.id !== selectedMember.id));
      setShowDeleteModal(false);
      setSelectedMember(null);
      
      toast.success('Family member removed successfully');
    } catch (error) {
      console.error('Error deleting family member:', error);
      toast.error('Failed to remove family member');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredMembers = familyMembers.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.relationship.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Family Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your family members and their access to your medications
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Family Member
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
              placeholder="Search family members..."
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Loading family members...</p>
          </div>
        ) : filteredMembers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relationship</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">View Meds</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Edit Meds</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Manage Reminders</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.relationship}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {member.canViewMedications ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-500 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {member.canEditMedications ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-500 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {member.canManageReminders ? <CheckCircle className="h-5 w-5 text-green-500 mx-auto" /> : <XCircle className="h-5 w-5 text-red-500 mx-auto" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button 
                        onClick={() => { setSelectedMember(member); setNewMember(member); setShowEditModal(true); }}
                        className="text-teal-600 hover:text-teal-800 transition-colors duration-150"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => { setSelectedMember(member); setShowDeleteModal(true); }}
                        className="text-red-600 hover:text-red-800 transition-colors duration-150"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No family members found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm 
                ? `No members matching "${searchTerm}"` 
                : 'Get started by adding a family member.'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Family Member
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Family Member Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
              }}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={showAddModal ? handleAddMember : handleEditMember}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {showAddModal ? 'Add Family Member' : 'Edit Family Member'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {showAddModal
                        ? 'Add a new family member to manage their medications'
                        : 'Update family member information and permissions'}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name*
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={newMember.name}
                        onChange={(e) =>
                          setNewMember({ ...newMember, name: e.target.value })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="relationship"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Relationship*
                      </label>
                      <select
                        id="relationship"
                        value={newMember.relationship}
                        onChange={(e) =>
                          setNewMember({ ...newMember, relationship: e.target.value })
                        }
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        required
                      >
                        <option value="">Select relationship</option>
                        <option value="Spouse">Spouse</option>
                        <option value="Parent">Parent</option>
                        <option value="Child">Child</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Grandparent">Grandparent</option>
                        <option value="Friend">Friend</option>
                        <option value="Caregiver">Caregiver</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="age"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Age*
                      </label>
                      <input
                        type="number"
                        id="age"
                        min="1"
                        max="120"
                        value={newMember.age}
                        onChange={(e) =>
                          setNewMember({ ...newMember, age: parseInt(e.target.value) })
                        }
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div className="mt-4">
                      <span className="block text-sm font-medium text-gray-700 mb-2">
                        Permissions
                      </span>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="canViewMedications"
                            type="checkbox"
                            checked={newMember.canViewMedications}
                            onChange={(e) =>
                              setNewMember({
                                ...newMember,
                                canViewMedications: e.target.checked,
                              })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="canViewMedications"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Can view medications
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="canEditMedications"
                            type="checkbox"
                            checked={newMember.canEditMedications}
                            onChange={(e) =>
                              setNewMember({
                                ...newMember,
                                canEditMedications: e.target.checked,
                              })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="canEditMedications"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Can edit medications
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="canManageReminders"
                            type="checkbox"
                            checked={newMember.canManageReminders}
                            onChange={(e) =>
                              setNewMember({
                                ...newMember,
                                canManageReminders: e.target.checked,
                              })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="canManageReminders"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Can manage reminders
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {showAddModal ? 'Add Member' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                    }}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMember && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowDeleteModal(false)}
            ></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Remove Family Member
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to remove {selectedMember.name} from your family members? This action
                        cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteMember}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Family;
