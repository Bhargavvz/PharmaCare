import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Building2, MapPin, Phone, Globe, Asterisk } from 'lucide-react';
import { useAuth, isPharmacyStaffUser } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';
import { API_URL } from '../../config';

interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string>;
    };
  };
  message: string;
}

interface PharmacySignupFormData {
  pharmacyName: string;
  registrationNumber: string;
  address: string;
  phone: string;
  pharmacyEmail: string;
  website: string;
  adminFirstName: string;
  adminLastName: string;
  adminEmail: string;
  adminPassword: string;
}

const PharmacySignup: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, setToken } = useAuth();
  const [formData, setFormData] = useState<PharmacySignupFormData>({
    pharmacyName: '',
    registrationNumber: '',
    address: '',
    phone: '',
    pharmacyEmail: '',
    website: '',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPassword: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser && isPharmacyStaffUser(currentUser)) { 
      navigate('/pharmacy/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields: (keyof PharmacySignupFormData)[] = [
      'pharmacyName', 'registrationNumber', 'address', 
      'adminFirstName', 'adminLastName', 'adminEmail', 'adminPassword'
    ];
    for (const field of requiredFields) {
      if (!formData[field]?.trim()) {
        toast.error(`Please fill in all required fields.`);
        return;
      }
    }
    if (formData.adminPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/pharmacy/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pharmacyName: formData.pharmacyName.trim(),
          registrationNumber: formData.registrationNumber.trim(),
          address: formData.address.trim(),
          phone: formData.phone.trim() || null,
          pharmacyEmail: formData.pharmacyEmail.trim().toLowerCase() || null,
          website: formData.website.trim() || null,
          adminFirstName: formData.adminFirstName.trim(),
          adminLastName: formData.adminLastName.trim(),
          adminEmail: formData.adminEmail.trim().toLowerCase(),
          adminPassword: formData.adminPassword.trim(),
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Pharmacy registration failed. Please try again.');
      }
      
      setCurrentUser(data.pharmacyStaff);
      setToken(data.token);
      toast.success('Pharmacy registration successful! Welcome!');
      navigate('/pharmacy/dashboard');

    } catch (error) {
      console.error('Pharmacy registration error:', error);
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const FormInput = ({
    id,
    label,
    type = 'text',
    Icon,
    required = false,
    span = 1 // Default span
  }: { 
    id: keyof PharmacySignupFormData;
    label: string;
    type?: string;
    Icon: React.ElementType;
    required?: boolean;
    span?: number;
  }) => (
    <div className={`col-span-1 md:col-span-${span}`}>
      <label htmlFor={id} className="sr-only">{label}{required ? '*' : ''}</label>
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          value={formData[id]}
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 pl-10 py-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 transition duration-150 ease-in-out"
          placeholder={label + (required ? '*' : '')}
          minLength={type === 'password' ? 6 : undefined}
        />
      </div>
    </div>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center mb-4">
             <Building2 className="h-8 w-8 text-emerald-600" />
             <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
               PharmaCare+ Pharmacy
             </span>
          </Link>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
            Register Your Pharmacy
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Already registered?{' '}
            <Link to="/pharmacy/login" className="font-medium text-emerald-600 hover:text-emerald-500">
              Sign in here
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6 border-b pb-2">Pharmacy Details</h3>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                 <FormInput id="pharmacyName" label="Pharmacy Name" Icon={Building2} required span={1} />
                 <FormInput id="registrationNumber" label="Registration/License Number" Icon={Asterisk} required span={1} />
                 <FormInput id="address" label="Address" Icon={MapPin} required span={2} />
                 <FormInput id="phone" label="Phone Number" type="tel" Icon={Phone} span={1} />
                 <FormInput id="pharmacyEmail" label="Pharmacy Email" type="email" Icon={Mail} span={1} />
                 <FormInput id="website" label="Website" type="url" Icon={Globe} span={2} />
              </div>
            </section>

            <section>
              <h3 className="text-lg font-medium leading-6 text-gray-900 mb-6 border-b pb-2">Administrator Account</h3>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
                 <FormInput id="adminFirstName" label="Admin First Name" Icon={User} required />
                 <FormInput id="adminLastName" label="Admin Last Name" Icon={User} required />
                 <FormInput id="adminEmail" label="Admin Email Address" type="email" Icon={Mail} required />
                 <FormInput id="adminPassword" label="Password" type="password" Icon={Lock} required />
              </div>
            </section>

            <div>
              <button
                type="submit"
                disabled={loading}
                 className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-300 ease-in-out transform ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:from-emerald-700 active:to-teal-800 hover:shadow-md hover:-translate-y-px'}`}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                Register Pharmacy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PharmacySignup; 