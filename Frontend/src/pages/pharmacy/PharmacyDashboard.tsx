import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Package,
  Receipt,
  Heart,
  BarChart3,
  Users,
  Plus,
  AlertTriangle,
  Clock,
  TrendingUp,
  DollarSign,
  Pill,
  FileText,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  ChevronDown,
  Search,
  Menu,
  X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth, isPharmacyStaffUser } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { API_URL } from '../../config';
import { formatDistanceToNow } from 'date-fns';

interface PharmacyDto {
  id: number;
  name: string;
  registrationNumber: string;
  address: string;
  phone?: string;
  email?: string;
  website?: string;
  active: boolean;
  ownerId?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface DashboardStats {
  totalInventoryItems: number;
  lowStockItems: number;
  expiringItems: number;
  totalSales: number;
}

interface SalesDataPoint {
  date: string;
  amount: number;
}

interface InventoryOverviewDataPoint {
  category: string;
  value: number;
}

interface ActivityItemDto {
  id: string;
  description: string;
  timestamp: string;
  type: string;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'BILL_CREATED':
      return { icon: Receipt, color: 'bg-blue-100 text-blue-600' };
    case 'STOCK_LOW':
      return { icon: AlertTriangle, color: 'bg-yellow-100 text-yellow-600' };
    case 'DONATION_RECEIVED':
      return { icon: Heart, color: 'bg-purple-100 text-purple-600' };
    default:
      return { icon: Bell, color: 'bg-gray-100 text-gray-600' };
  }
};

const PharmacyDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, logout, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [pharmacies, setPharmacies] = useState<PharmacyDto[]>([]);
  const [selectedPharmacy, setSelectedPharmacy] = useState<PharmacyDto | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalInventoryItems: 0,
    lowStockItems: 0,
    expiringItems: 0,
    totalSales: 0,
  });
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [salesTrendData, setSalesTrendData] = useState<SalesDataPoint[]>([]);
  const [inventoryOverviewData, setInventoryOverviewData] = useState<InventoryOverviewDataPoint[]>([]);
  const [statsPeriodDays, setStatsPeriodDays] = useState(7);
  const [recentActivity, setRecentActivity] = useState<ActivityItemDto[]>([]);
  const [isActivityLoading, setIsActivityLoading] = useState(false);

  useEffect(() => {
    if (!currentUser || !isPharmacyStaffUser(currentUser)) {
       if (!isLoading) {
         toast.error('Access denied. Please log in as pharmacy staff.');
         navigate('/pharmacy/login');
       }
       return;
    }
    
    if (currentUser && token) { 
        fetchPharmacies();
    }
  }, [currentUser, token, navigate, isLoading]);

  useEffect(() => {
    if (selectedPharmacy && token) {
      fetchAllDashboardData();
    } else {
      setStats({ totalInventoryItems: 0, lowStockItems: 0, expiringItems: 0, totalSales: 0 });
      setSalesTrendData([]);
      setInventoryOverviewData([]);
      setRecentActivity([]);
    }
  }, [selectedPharmacy, statsPeriodDays, token]);

  const fetchPharmacies = async () => {
    try {
      setIsLoading(true);
      const url = `${API_URL}/pharmacies/mine`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pharmacies');
      }

      const data = await response.json();
      setPharmacies(data);
      if (data.length > 0 && !selectedPharmacy) {
        setSelectedPharmacy(data[0]);
      }
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      toast.error('Failed to load your pharmacies');
      setPharmacies([]);
      setSelectedPharmacy(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllDashboardData = async () => {
    if (!selectedPharmacy || !token) return;
    
    console.log(`Fetching all dashboard data for pharmacy ID: ${selectedPharmacy.id}`);
    setIsStatsLoading(true);
    setIsActivityLoading(true);
    try {
      const [invStatsRes, salesSummaryRes, salesTrendRes, invOverviewRes, activityRes] = await Promise.all([
        fetch(`${API_URL}/inventories/stats?pharmacyId=${selectedPharmacy.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/analytics/sales/summary?pharmacyId=${selectedPharmacy.id}&period=week`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/analytics/sales/trend?pharmacyId=${selectedPharmacy.id}&days=${statsPeriodDays}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/inventories/overview?pharmacyId=${selectedPharmacy.id}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/pharmacies/${selectedPharmacy.id}/activity?limit=5`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      if (!invStatsRes.ok || !salesSummaryRes.ok || !salesTrendRes.ok || !invOverviewRes.ok || !activityRes.ok) {
        if (!invStatsRes.ok) console.error("Inventory Stats fetch failed:", invStatsRes.status);
        if (!salesSummaryRes.ok) console.error("Sales Summary fetch failed:", salesSummaryRes.status);
        if (!salesTrendRes.ok) console.error("Sales Trend fetch failed:", salesTrendRes.status);
        if (!invOverviewRes.ok) console.error("Inventory Overview fetch failed:", invOverviewRes.status);
        if (!activityRes.ok) console.error("Activity fetch failed:", activityRes.status);
        throw new Error('Failed to fetch some dashboard data');
      }
      
      const invStats = await invStatsRes.json();
      const salesSummary = await salesSummaryRes.json();
      const salesTrend = await salesTrendRes.json();
      const invOverview = await invOverviewRes.json();
      const activityData = await activityRes.json();

      setStats({
        totalInventoryItems: invStats.totalItems || 0,
        lowStockItems: invStats.lowStockCount || 0,
        expiringItems: invStats.expiringSoonCount || 0,
        totalSales: salesSummary.totalAmount || 0,
      });
      setSalesTrendData(salesTrend || []);
      setInventoryOverviewData(invOverview || []);
      setRecentActivity(activityData || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load some dashboard data');
      setStats({ totalInventoryItems: 0, lowStockItems: 0, expiringItems: 0, totalSales: 0 });
      setSalesTrendData([]);
      setInventoryOverviewData([]);
      setRecentActivity([]);
    } finally {
      setIsStatsLoading(false);
      setIsActivityLoading(false);
    }
  };

  const handleCreatePharmacy = () => {
    navigate('/pharmacy/create');
  };

  const handleSelectPharmacy = (pharmacy: PharmacyDto) => {
    setSelectedPharmacy(pharmacy);
  };

  const navigateTo = (path: string, queryParams: Record<string, string> = {}) => {
    if (selectedPharmacy) {
      const queryString = new URLSearchParams(queryParams).toString();
      const finalPath = `${path}${queryString ? `?${queryString}` : ''}`;
      console.log(`Navigating to: ${finalPath}`);
      navigate(finalPath, { state: { pharmacyId: selectedPharmacy.id } });
    } else {
      toast.error('Please select or create a pharmacy first');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  const sidebarItems = [
    { name: 'Dashboard', icon: BarChart3, path: '/pharmacy/dashboard', active: location.pathname === '/pharmacy/dashboard' },
    { name: 'Inventory', icon: Package, path: '/pharmacy/inventory' },
    { name: 'Billing', icon: Receipt, path: '/pharmacy/billing' },
    { name: 'Donations', icon: Heart, path: '/pharmacy/donations' },
    { name: 'Analytics', icon: TrendingUp, path: '/pharmacy/analytics' },
    { name: 'Staff', icon: Users, path: '/pharmacy/staff' },
  ];

  const quickStats = [
    { name: 'Total Items', value: stats.totalInventoryItems, icon: Package, color: 'bg-blue-500', path: '/pharmacy/inventory' },
    { name: 'Low Stock', value: stats.lowStockItems, icon: AlertTriangle, color: 'bg-yellow-500', path: '/pharmacy/inventory', queryParams: { filter: 'low-stock' } },
    { name: 'Expiring Soon', value: stats.expiringItems, icon: Clock, color: 'bg-red-500', path: '/pharmacy/inventory', queryParams: { filter: 'expiring' } },
    { name: 'Total Sales', value: `$${stats.totalSales.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500', path: '/pharmacy/analytics' },
  ];

  if (isLoading || !currentUser) {
    return <LoadingSpinner />;
  }

  if (pharmacies.length === 0) {
     return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Building2 className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Pharmacy Found</h2>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          You don't seem to be associated with any pharmacies yet. 
          Create your first pharmacy to start managing your inventory and sales.
        </p>
        <button
          onClick={handleCreatePharmacy}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Plus className="w-5 h-5 mr-2 -ml-1" />
          Create New Pharmacy
        </button>
         <button onClick={handleLogout} className="mt-4 text-sm text-gray-500 hover:text-gray-700">
          Log Out
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-green-600" />
              <span className="ml-2 text-xl font-semibold text-gray-800">PharmaCare+</span>
            </div>
            <button 
              className="p-1 rounded-md lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
        </div>
        
        <div className="flex-grow overflow-y-auto">
            <div className="px-4 py-6">
                <div className="mb-6">
                  <label htmlFor="pharmacy-select" className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">Pharmacy</label>
                  <div className="relative">
                    <select
                      id="pharmacy-select"
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md appearance-none"
                      value={selectedPharmacy ? selectedPharmacy.id.toString() : ''}
                      onChange={(e) => {
                        const pharmacyId = parseInt(e.target.value, 10);
                        const selected = pharmacies.find(p => p.id === pharmacyId);
                        if (selected) handleSelectPharmacy(selected);
                      }}
                    >
                      {pharmacies.map((pharmacy) => (
                        <option key={pharmacy.id} value={pharmacy.id.toString()}>
                          {pharmacy.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                  <button
                    onClick={handleCreatePharmacy}
                    className="mt-2 w-full inline-flex items-center justify-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Pharmacy
                  </button>
                </div>

                <nav className="space-y-1">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => navigateTo(item.path)}
                      className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out ${
                        item.active
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <item.icon className={`w-5 h-5 mr-3 flex-shrink-0 ${item.active ? 'text-green-600' : 'text-gray-400 group-hover:text-gray-500'}`} aria-hidden="true" />
                      {item.name}
                    </button>
                  ))}
                </nav>
            </div>
        </div>
        
        <div className="border-t border-gray-200 p-4 flex-shrink-0">
             <div className="flex items-center">
                <span className="inline-block h-9 w-9 rounded-full overflow-hidden bg-gray-100">
                  <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 truncate">
                      {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700 truncate">
                      {currentUser.email}
                  </p>
                </div>
             </div>
            <button
              onClick={handleLogout}
              className="mt-4 w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <LogOut className="w-5 h-5 mr-2 text-gray-400" />
              Log Out
            </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:pl-64">
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200">
          <button 
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1 flex">
                <h1 className="text-xl font-semibold text-gray-900">Dashboard Overview</h1>
            </div>
             <div className="ml-4 flex items-center md:ml-6">
                <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    <Bell className="h-6 w-6" />
                </button>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            {quickStats.map((item) => (
              <div 
                 key={item.name} 
                 className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:shadow-md transition-shadow duration-200"
                 onClick={() => navigateTo(item.path, item.queryParams)}
              >
                <div className="p-5">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 p-3 rounded-md ${item.color}`}>
                      <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {item.name}
                        </dt>
                        <dd className="text-2xl font-semibold text-gray-900">
                          {item.value}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <button onClick={() => navigateTo('/pharmacy/inventory/add')} className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                    <Package className="h-8 w-8 text-green-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Add Item</span>
                </button>
                <button onClick={() => navigateTo('/pharmacy/billing/new')} className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                    <Receipt className="h-8 w-8 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">New Bill</span>
                </button>
                 <button onClick={() => navigateTo('/pharmacy/donations/pending')} className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                    <Heart className="h-8 w-8 text-purple-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">View Donations</span>
                </button>
                 <button onClick={() => navigateTo('/pharmacy/staff')} className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200">
                    <Users className="h-8 w-8 text-indigo-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Manage Staff</span>
                </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                 <h3 className="text-base font-medium text-gray-900 mb-4">Sales Trend (Last 7 Days)</h3>
                 <div className="h-64 flex items-center justify-center text-gray-400">
                    Chart Placeholder
                 </div>
              </div>
              <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                 <h3 className="text-base font-medium text-gray-900 mb-4">Inventory Overview</h3>
                 <div className="h-64 flex items-center justify-center text-gray-400">
                     Chart Placeholder
                 </div>
              </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            {isActivityLoading ? (
                <div className="h-40 flex items-center justify-center text-gray-400"><LoadingSpinner /></div>
            ) : recentActivity.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No recent activity found.</p>
            ) : (
                <ul className="divide-y divide-gray-200">
                  {recentActivity.map((activity) => {
                    const { icon: Icon, color } = getActivityIcon(activity.type);
                    return (
                        <li key={activity.id} className="py-3 flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${color}`}>
                              <Icon className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-800">{activity.description}</p>
                                <p className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                                </p>
                            </div>
                          </div>
                        </li>
                    );
                  })}
                </ul>
            )}
            {recentActivity.length > 0 && (
                <div className="mt-4 text-right">
                    <button className="text-sm font-medium text-green-600 hover:text-green-500">View All Activity</button>
                </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PharmacyDashboard; 