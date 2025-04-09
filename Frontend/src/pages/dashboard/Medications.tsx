import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Pill, Edit, Trash2, AlertCircle, X as CloseIcon } from 'lucide-react';
import { medicationService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { format, parseISO, isValid } from 'date-fns';

// Define our own Medication interface to match the backend model
interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  active: boolean;
}

// Define the shape of the new medication form data
interface NewMedicationForm {
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  notes: string;
  active: boolean;
}

const Medications: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [newMedication, setNewMedication] = useState<NewMedicationForm>({
    name: '',
    dosage: '',
    frequency: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
    notes: '',
    active: true,
  });

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      setIsLoading(true);
      const response = await medicationService.getAll();
      // Format dates carefully, handle invalid dates
      const formattedMedications = response.map((med: any) => {
        const parsedStartDate = med.startDate ? parseISO(med.startDate) : null;
        const parsedEndDate = med.endDate ? parseISO(med.endDate) : null;
        return {
          ...med,
          id: med.id, // Ensure id is present
          name: med.name || '',
          dosage: med.dosage || '',
          frequency: med.frequency || '',
          startDate: parsedStartDate && isValid(parsedStartDate) ? format(parsedStartDate, 'yyyy-MM-dd') : '',
          endDate: parsedEndDate && isValid(parsedEndDate) ? format(parsedEndDate, 'yyyy-MM-dd') : undefined,
          notes: med.notes || undefined,
          active: med.active !== undefined ? med.active : true, // Default active to true if undefined
        };
      });
      setMedications(formattedMedications as Medication[]);
    } catch (error) {
      console.error('Error fetching medications:', error);
      toast.error('Failed to load medications');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Omit endDate from payload if it's empty
      const { endDate, ...restPayload } = newMedication;
      const payloadToSend: any = restPayload;
      if (endDate && endDate.trim() !== '') {
        payloadToSend.endDate = endDate;
      }
      
      await medicationService.create(payloadToSend);
      setShowAddModal(false);
      setNewMedication({ // Reset form
        name: '',
        dosage: '',
        frequency: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: '',
        notes: '',
        active: true,
      });
      toast.success('Medication added successfully');
      fetchMedications(); // Refresh list
    } catch (error) {
      console.error('Error adding medication:', error);
      // Provide more specific error feedback if possible (e.g., from API response)
      toast.error('Failed to add medication. Please check the details and try again.');
    }
  };

  const handleDeleteMedication = async () => {
    if (!selectedMedication) return;
    
    try {
      await medicationService.delete(selectedMedication.id);
      setShowDeleteModal(false);
      setSelectedMedication(null);
      toast.success('Medication deleted successfully');
      fetchMedications();
    } catch (error) {
      console.error('Error deleting medication:', error);
      toast.error('Failed to delete medication');
    }
  };

  const filteredMedications = medications.filter(
    (medication) =>
      (medication.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (medication.dosage?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (medication.frequency?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  // Skeleton Loader for table rows
  const TableSkeletonLoader = ({ rows = 5 }: { rows?: number }) => (
    <>
      {[...Array(rows)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          <td className="px-6 py-4 whitespace-nowrap"><div className="h-6 bg-gray-200 rounded w-3/4"></div></td>
          <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
          <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
          <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded w-1/3"></div></td>
          <td className="px-6 py-4 whitespace-nowrap"><div className="h-6 w-16 bg-gray-200 rounded-full"></div></td>
          <td className="px-6 py-4 whitespace-nowrap"><div className="h-6 w-16 bg-gray-200 rounded"></div></td>
        </tr>
      ))}
    </>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medications</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your medications and prescriptions.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Medication
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
        {/* Search and Filter Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Search by name, dosage..."
            />
          </div>
          <button className="inline-flex items-center justify-center sm:justify-start px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-teal-500 transition duration-150 ease-in-out">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Medications Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Medication', 'Dosage', 'Frequency', 'Start Date', 'Status', 'Actions'].map((header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <TableSkeletonLoader rows={5} />
              ) : filteredMedications.length > 0 ? (
                filteredMedications.map((medication) => (
                  <tr key={medication.id} className="hover:bg-teal-50/50 transition-colors duration-150">
                    {/* Medication Name & Notes */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-teal-100">
                          <Pill className="h-5 w-5 text-teal-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {medication.name}
                          </div>
                          {medication.notes && (
                            <div className="text-xs text-gray-500 truncate max-w-xs">
                              {medication.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Dosage */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {medication.dosage}
                    </td>
                    {/* Frequency */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {medication.frequency}
                    </td>
                    {/* Start Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {medication.startDate && isValid(parseISO(medication.startDate)) ? format(parseISO(medication.startDate), 'MMM d, yyyy') : '-'}
                    </td>
                    {/* Status Badge */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${
                          medication.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {medication.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-3">
                        {/* Link to edit page - requires creating an edit page/route */}
                        <Link
                          to={`/dashboard/medications/${medication.id}`}
                          className="p-1.5 text-teal-600 hover:text-teal-800 hover:bg-teal-100 rounded-md transition-colors duration-150"
                          title="Edit Medication"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedMedication(medication);
                            setShowDeleteModal(true);
                          }}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-md transition-colors duration-150"
                          title="Delete Medication"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="rounded-full bg-teal-100 p-4 mb-4">
                        <Pill className="h-8 w-8 text-teal-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900">No medications found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm
                          ? `No medications matching "${searchTerm}"`
                          : "Get started by adding your first medication."}
                      </p>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Medication
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Medication Modal - Themed - Corrected Structure */}
      {showAddModal && (
        <div className="fixed inset-0 overflow-y-auto z-[60]">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowAddModal(false)}></div>
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg w-full">
              <form onSubmit={handleAddMedication}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                  <h3 className="text-lg font-semibold text-gray-900">Add New Medication</h3>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
                    aria-label="Close modal"
                  >
                    <CloseIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Medication Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="name"
                      value={newMedication.name}
                      onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition duration-150 ease-in-out"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-1">Dosage <span className="text-red-500">*</span></label>
                    <input type="text" id="dosage" value={newMedication.dosage} onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition duration-150 ease-in-out" placeholder="e.g., 10mg, 1 tablet" required />
                  </div>
                  <div>
                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">Frequency <span className="text-red-500">*</span></label>
                    <input type="text" id="frequency" value={newMedication.frequency} onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition duration-150 ease-in-out" placeholder="e.g., Once daily, Twice daily" required />
                  </div>
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date <span className="text-red-500">*</span></label>
                    <input type="date" id="startDate" value={newMedication.startDate} onChange={(e) => setNewMedication({ ...newMedication, startDate: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition duration-150 ease-in-out" required />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date (Optional)</label>
                    <input type="date" id="endDate" value={newMedication.endDate} onChange={(e) => setNewMedication({ ...newMedication, endDate: e.target.value })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition duration-150 ease-in-out" />
                  </div>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                    <textarea id="notes" value={newMedication.notes} onChange={(e) => setNewMedication({ ...newMedication, notes: e.target.value })} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition duration-150 ease-in-out" placeholder="e.g., Take with food"></textarea>
                  </div>
                  <div className="flex items-center">
                    <input id="active" name="active" type="checkbox" checked={newMedication.active} onChange={(e) => setNewMedication({ ...newMedication, active: e.target.checked })} className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                    <label htmlFor="active" className="ml-2 block text-sm text-gray-900">Mark as Active</label>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse rounded-b-lg">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-150"
                  >
                    Add Medication
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-150"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - Themed - Corrected Structure */}
      {showDeleteModal && selectedMedication && (
        <div className="fixed inset-0 overflow-y-auto z-[60]">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowDeleteModal(false)}></div>
          <div className="flex items-center justify-center min-h-screen p-4 text-center">
            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-semibold text-gray-900">
                      Delete Medication
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Are you sure you want to delete "<span className="font-medium">{selectedMedication?.name || 'this medication'}</span>"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteMedication}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-150"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-150"
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

export default Medications;
