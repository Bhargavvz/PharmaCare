import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Package, Plus, Search, Filter, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth, isPharmacyStaffUser } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { inventoryService, pharmacyService, PharmacyDto, InventoryItemDto } from '../../services/api';

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [pharmacies, setPharmacies] = useState<PharmacyDto[]>([]);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<number | null>(null);
  const [inventoryItems, setInventoryItems] = useState<InventoryItemDto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    // Redirect if not logged in or not a pharmacy staff
    if (!currentUser) {
      navigate('/pharmacy/login');
      return;
    }
    
    if (!isPharmacyStaffUser(currentUser)) {
      toast.error('Access denied. Please log in as pharmacy staff.');
      navigate('/pharmacy/login');
      return;
    }
    
    // Check if pharmacyId was passed in location state
    const locationState = location.state as { pharmacyId?: number };
    if (locationState?.pharmacyId) {
      setSelectedPharmacyId(locationState.pharmacyId);
    } else if (isPharmacyStaffUser(currentUser) && currentUser.pharmacyId) {
      // Use the pharmacyId from the user's context if available
      setSelectedPharmacyId(currentUser.pharmacyId);
    }
    
    fetchPharmacies();
  }, [currentUser, navigate, location]);

  useEffect(() => {
    if (selectedPharmacyId) {
      fetchInventoryItems();
    }
  }, [selectedPharmacyId, currentPage, pageSize]);

  const fetchPharmacies = async () => {
    setIsLoading(true);
    try {
      // Get pharmacies from API service
      const pharmacyList = await pharmacyService.getMyPharmacies();
      
      setPharmacies(pharmacyList);
      
      // If no pharmacy is selected yet but we have pharmacies, select the first one
      if (!selectedPharmacyId && pharmacyList.length > 0) {
        setSelectedPharmacyId(pharmacyList[0].id);
      }
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      toast.error('Failed to load pharmacies');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchInventoryItems = async () => {
    if (!selectedPharmacyId) return;
    
    setIsLoading(true);
    try {
      // Get inventory items from API service
      const response = await inventoryService.getInventoryItems(
        selectedPharmacyId,
        currentPage,
        pageSize,
        searchTerm || undefined
      );
      
      setInventoryItems(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      toast.error('Failed to load inventory items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(0); // Reset to first page when searching
    fetchInventoryItems();
  };

  const handleAddItem = () => {
    if (!selectedPharmacyId) {
      toast.error('Please select a pharmacy first');
      return;
    }
    navigate('/pharmacy/inventory/add', { state: { pharmacyId: selectedPharmacyId } });
  };

  const handleEditItem = (itemId: number) => {
    navigate(`/pharmacy/inventory/edit/${itemId}`, { state: { pharmacyId: selectedPharmacyId } });
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!selectedPharmacyId) return;
    
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        // Delete item using API service
        await inventoryService.deleteInventoryItem(selectedPharmacyId, itemId);
        
        // Update local state by fetching updated list
        fetchInventoryItems();
        toast.success('Item deleted successfully');
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item');
      }
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    // Apply type filter
    if (filterType === 'all') return true;
    if (filterType === 'low-stock') return item.lowStock;
    if (filterType === 'expiring') return item.expiringWithin30Days;
    return true;
  });

  if (isLoading && !selectedPharmacyId) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <div className="flex items-center space-x-4">
              {pharmacies.length > 0 ? (
                <div className="relative">
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={selectedPharmacyId?.toString() || ''}
                    onChange={(e) => {
                      const pharmacyId = parseInt(e.target.value, 10);
                      setSelectedPharmacyId(pharmacyId);
                      setCurrentPage(0); // Reset to first page when changing pharmacy
                    }}
                  >
                    {pharmacies.map((pharmacy) => (
                      <option key={pharmacy.id} value={pharmacy.id.toString()}>
                        {pharmacy.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : null}
              <button
                onClick={handleAddItem}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner />
          </div>
        ) : pharmacies.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No pharmacies found</h3>
            <p className="mt-1 text-sm text-gray-500">You need to create a pharmacy before managing inventory.</p>
            <div className="mt-6">
              <button
                onClick={() => navigate('/pharmacy/dashboard')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="relative rounded-md shadow-sm w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search inventory..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="all">All Items</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="expiring">Expiring Soon</option>
                  </select>
                </div>
                <button
                  onClick={handleSearch}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Search
                </button>
              </div>
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No inventory items found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterType !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by adding your first inventory item.'}
                </p>
                {!searchTerm && filterType === 'all' && (
                  <div className="mt-6">
                    <button
                      onClick={handleAddItem}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Item
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {filteredItems.map((item) => (
                      <li key={item.id}>
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-md font-medium text-blue-600 truncate">{item.medicationName}</p>
                              <p className="mt-1 flex items-center text-sm text-gray-500">
                                <span>Batch: {item.batchNumber}</span>
                                <span className="mx-2">•</span>
                                <span>Qty: {item.quantity}</span>
                                <span className="mx-2">•</span>
                                <span>Expires: {new Date(item.expiryDate).toLocaleDateString()}</span>
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${item.lowStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {item.lowStock ? 'Low Stock' : 'In Stock'}
                              </span>
                              {item.expiringWithin30Days && (
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                  Expiring Soon
                                </span>
                              )}
                            </div>
                            <div className="ml-5 flex-shrink-0 flex space-x-2">
                              <button
                                onClick={() => handleEditItem(item.id)}
                                className="p-2 rounded-full text-gray-400 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-gray-100 focus:outline-none"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </div>
                          <div className="mt-2 flex justify-between">
                            <p className="text-sm text-gray-500">
                              {item.manufacturer ? `Manufacturer: ${item.manufacturer}` : ''}
                              {item.category ? (item.manufacturer ? ' • ' : '') + `Category: ${item.category}` : ''}
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              Price: ${item.sellingPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white ${
                          currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                        }`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                        disabled={currentPage === totalPages - 1}
                        className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white ${
                          currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing page <span className="font-medium">{currentPage + 1}</span> of{' '}
                          <span className="font-medium">{totalPages}</span>
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => setCurrentPage(0)}
                            disabled={currentPage === 0}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
                              currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                            }`}
                          >
                            <span className="sr-only">First</span>
                            <span>⟪</span>
                          </button>
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                            disabled={currentPage === 0}
                            className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
                              currentPage === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                            }`}
                          >
                            <span className="sr-only">Previous</span>
                            <span>◀</span>
                          </button>
                          
                          {/* Page numbers */}
                          {[...Array(totalPages).keys()].map(page => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`relative inline-flex items-center px-4 py-2 border ${
                                currentPage === page
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                              } text-sm font-medium`}
                            >
                              {page + 1}
                            </button>
                          ))}
                          
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                            disabled={currentPage === totalPages - 1}
                            className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
                              currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                            }`}
                          >
                            <span className="sr-only">Next</span>
                            <span>▶</span>
                          </button>
                          <button
                            onClick={() => setCurrentPage(totalPages - 1)}
                            disabled={currentPage === totalPages - 1}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${
                              currentPage === totalPages - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                            }`}
                          >
                            <span className="sr-only">Last</span>
                            <span>⟫</span>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Inventory; 