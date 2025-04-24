import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Building2, MapPin, Phone, Mail, Globe, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth, isPharmacyStaffUser } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { mockPharmacyService } from '../../services/mockDataService';

// Define interface for location state
interface LocationState {
  ownerFirstName?: string;
  ownerLastName?: string;
  ownerEmail?: string;
  pharmacyName?: string;
  pharmacyRegistrationNumber?: string;
  pharmacyAddress?: string;
}

const CreatePharmacy: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    address: '',
    phone: '',
    email: '',
    website: '',
  });

  useEffect(() => {
    // Redirect if not logged in
    if (!currentUser) {
      navigate('/pharmacy/login');
      return;
    }

    // Check if we have pre-filled data from signup
    const state = location.state as LocationState;
    if (state) {
      setFormData(prevData => ({
        ...prevData,
        name: state.pharmacyName || '',
        registrationNumber: state.pharmacyRegistrationNumber || '',
        address: state.pharmacyAddress || '',
        email: state.ownerEmail || '',
      }));
    }
  }, [currentUser, navigate, location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.registrationNumber || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create pharmacy using mock service
      mockPharmacyService.createPharmacy({
        name: formData.name,
        registrationNumber: formData.registrationNumber,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        active: true,
        ownerId: Number(currentUser?.id),
        ownerName: currentUser?.firstName ? `${currentUser.firstName} ${currentUser.lastName}` : 'Unknown',
      });
      
      toast.success('Pharmacy created successfully!');
      navigate('/pharmacy/dashboard');
    } catch (error) {
      console.error('Error creating pharmacy:', error);
      toast.error('Failed to create pharmacy');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-green-600">
            <h1 className="text-xl font-semibold text-white">Create New Pharmacy</h1>
            <p className="mt-1 text-sm text-green-100">
              Enter your pharmacy details to get started
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Pharmacy Name *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter pharmacy name"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                  Registration Number *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="registrationNumber"
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter registration number"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter full address"
                    required
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="url"
                    name="website"
                    id="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Enter website URL"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/pharmacy/dashboard')}
                className="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    <span className="ml-2">Creating...</span>
                  </>
                ) : (
                  'Create Pharmacy'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePharmacy; 