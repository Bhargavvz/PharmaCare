import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, Download, Share2, FileText, QrCode } from 'lucide-react';
import AddPrescriptionModal from '../../components/modals/AddPrescriptionModal';

interface Prescription {
  id: number;
  name: string;
  doctor: string;
  hospital: string;
  date: string;
  status: 'active' | 'expired' | 'pending';
  medications: string[];
  qrCode: string;
}

const Prescriptions: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleAddPrescription = (prescriptionData: any) => {
    // TODO: Implement API call to save prescription
    console.log('Adding prescription:', prescriptionData);
  };

  const prescriptions: Prescription[] = [
    {
      id: 1,
      name: 'General Checkup Prescription',
      doctor: 'Dr. Sarah Johnson',
      hospital: 'City General Hospital',
      date: '2024-02-15',
      status: 'active',
      medications: ['Amoxicillin', 'Ibuprofen'],
      qrCode: '/qr-placeholder.png',
    },
    {
      id: 2,
      name: 'Monthly Medication Renewal',
      doctor: 'Dr. Michael Chen',
      hospital: 'Medical Center',
      date: '2024-02-10',
      status: 'active',
      medications: ['Metformin', 'Lisinopril'],
      qrCode: '/qr-placeholder.png',
    },
    {
      id: 3,
      name: 'Specialist Consultation',
      doctor: 'Dr. Emily Brown',
      hospital: 'Specialty Clinic',
      date: '2024-01-20',
      status: 'expired',
      medications: ['Prednisone'],
      qrCode: '/qr-placeholder.png',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Prescriptions</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your prescriptions and renewals</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="h-5 w-5" />
          Add Prescription
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
            placeholder="Search prescriptions..."
          />
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="pending">Pending</option>
          </select>
          <button className="p-2 text-gray-400 hover:text-gray-500">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="space-y-4">
        {prescriptions.map((prescription) => (
          <div
            key={prescription.id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-teal-500 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center">
                  <QrCode className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {prescription.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {prescription.doctor} • {prescription.hospital}
                  </p>
                </div>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  prescription.status
                )}`}
              >
                {prescription.status}
              </span>
            </div>

            <div className="mt-4 flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              Prescribed on {prescription.date}
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">Medications</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {prescription.medications.map((medication, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
                  >
                    {medication}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="flex space-x-4">
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </button>
                <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                  <FileText className="h-4 w-4 mr-2" />
                  View Details
                </button>
              </div>
              <img
                src={prescription.qrCode}
                alt="QR Code"
                className="h-16 w-16 bg-gray-100 rounded-lg p-2"
              />
            </div>
          </div>
        ))}
      </div>

      {/* QR Code Scanner Section */}
      <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <QrCode className="h-6 w-6 text-teal-600" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-teal-900">
              Scan Prescription QR Code
            </h3>
            <p className="mt-1 text-sm text-teal-800">
              Use our mobile app to quickly scan and add new prescriptions to your
              account. Download the app to get started.
            </p>
            <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-teal-600 hover:bg-teal-700">
              Download Mobile App
            </button>
          </div>
        </div>
      </div>

      <AddPrescriptionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddPrescription}
      />
    </div>
  );
};

export default Prescriptions;
