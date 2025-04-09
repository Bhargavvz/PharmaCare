import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Package, Plus, Search, Filter, Trash2, Edit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { mockPharmacyService, mockInventoryService, Pharmacy, InventoryItem } from '../../services/mockDataService';

const Inventory: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<number | null>(null);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/pharmacy/login');
      return;
    }
    
    // Check if pharmacyId was passed in location state
    const locationState = location.state as { pharmacyId?: number };
    if (locationState?.pharmacyId) {
      setSelectedPharmacyId(locationState.pharmacyId);
    }
    
    fetchPharmacies();
  }, [user, navigate, location]);

  useEffect(() => {
    if (selectedPharmacyId) {
      fetchInventoryItems();
    }
  }, [selectedPharmacyId]);

  const fetchPharmacies = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get pharmacies from mock service
      const mockPharmacies = mockPharmacyService.getPharmacies();
      
      // Filter pharmacies by current user if needed
      const userPharmacies = user?.id 
        ? mockPharmacies.filter(p => p.ownerId === Number(user.id))
        : mockPharmacies;
      
      setPharmacies(userPharmacies);
      
      // If no pharmacy is selected yet but we have pharmacies, select the first one
      if (!selectedPharmacyId && userPharmacies.length > 0) {
        setSelectedPharmacyId(userPharmacies[0].id);
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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get inventory items from mock service
      const items = mockInventoryService.getInventoryItems(selectedPharmacyId);
      setInventoryItems(items);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      toast.error('Failed to load inventory items');
    } finally {
      setIsLoading(false);
    }
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
        // Delete item using mock service
        await mockInventoryService.deleteInventoryItem(selectedPharmacyId, itemId);
        
        // Update local state
        setInventoryItems(prevItems => prevItems.filter(item => item.id !== itemId));
        toast.success('Item deleted successfully');
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item');
      }
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    // Apply search filter
    const matchesSearch = item.medicationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply type filter
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'low-stock') return matchesSearch && item.lowStock;
    if (filterType === 'expiring') {
      return matchesSearch && item.expiringWithin30Days;
    }
    return matchesSearch;
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
                onClick={() => navigate('/pharmacy/create')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Pharmacy
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
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <li key={item.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center">
                              <Package className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-blue-600">{item.medicationName}</div>
                              <div className="text-sm text-gray-500">SKU: {item.batchNumber}</div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="mr-8 text-right">
                              <div className="text-sm font-medium text-gray-900">
                                ${item.sellingPrice.toFixed(2)}
                              </div>
                              <div className={`text-sm ${item.lowStock ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                                {item.quantity} in stock
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditItem(item.id)}
                                className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteItem(item.id)}
                                className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <div className="flex items-center text-sm text-gray-500">
                              <div>Category: {item.medicationType}</div>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <div>
                              Expires: {new Date(item.expiryDate).toLocaleDateString()}
                              {item.expiringWithin30Days && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                  Expiring Soon
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Inventory; 