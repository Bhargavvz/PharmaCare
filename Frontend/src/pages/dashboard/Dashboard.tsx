import React, { useEffect, useState } from 'react';
import {
  Bell,
  Heart,
  LineChart,
  Pill,
  QrCode,
  ChevronRight,
  Users,
  Gift,
  Plus,
  CheckCircle,
  Activity,
  TrendingUp,
  TrendingDown,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { reminderService, analyticsService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { format, parseISO } from 'date-fns';

interface DashboardStats {
  activeMedicationsCount: number;
  pendingRemindersCount: number;
  adherenceRate: number;
  missedRemindersCount: number;
}

interface Reminder {
  id: number;
  medicationName: string;
  dosage: string;
  reminderTime: string;
  reminderDateTime: string;
  notes?: string;
  completed: boolean;
}

interface ActivityItem {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

interface ReminderData {
  id: number;
  medication?: {
    name: string;
    dosage: string;
  };
  reminderTime: string;
  notes?: string;
  completed: boolean;
}

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    activeMedicationsCount: 0,
    pendingRemindersCount: 0,
    adherenceRate: 0,
    missedRemindersCount: 0,
  });
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [analyticsData, remindersData] = await Promise.all([
        analyticsService.getDashboard(),
        reminderService.getPending()
      ]);

      setStats({
        activeMedicationsCount: analyticsData.activeMedicationsCount,
        pendingRemindersCount: analyticsData.pendingRemindersCount,
        adherenceRate: Math.round(analyticsData.adherenceRate),
        missedRemindersCount: analyticsData.missedRemindersCount
      });
      
      setUpcomingReminders(remindersData.slice(0, 5).map((reminder: ReminderData): Reminder => ({
        id: reminder.id,
        medicationName: reminder.medication?.name || 'Unknown Medication',
        dosage: reminder.medication?.dosage || '',
        reminderTime: format(parseISO(reminder.reminderTime), 'h:mm a'),
        reminderDateTime: reminder.reminderTime,
        notes: reminder.notes,
        completed: reminder.completed,
      })).sort((a: Reminder, b: Reminder) => new Date(a.reminderDateTime).getTime() - new Date(b.reminderDateTime).getTime()));
      
      setRecentActivity([
        { id: 1, type: 'reminder', title: 'Aspirin marked as taken', description: 'Dosage: 100mg', time: '2 hours ago', icon: CheckCircle, iconBg: 'bg-teal-100', iconColor: 'text-teal-600' },
        { id: 2, type: 'donation', title: 'Medicine donation confirmed', description: 'Thank you for your contribution!', time: '5 hours ago', icon: Heart, iconBg: 'bg-rose-100', iconColor: 'text-rose-600' },
        { id: 3, type: 'prescription', title: 'Prescription for Metformin added', description: 'Scanned via QR code', time: '1 day ago', icon: QrCode, iconBg: 'bg-violet-100', iconColor: 'text-violet-600' },
        { id: 4, type: 'medication', title: 'New medication added', description: 'Lisinopril 10mg', time: '2 days ago', icon: Plus, iconBg: 'bg-sky-100', iconColor: 'text-sky-600' },
      ]);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { name: 'Add Medication', icon: Plus, color: 'text-sky-600', bgColor: 'bg-sky-100', hoverColor: 'hover:bg-sky-200', path: '/dashboard/medications' },
    { name: 'Set Reminder', icon: Bell, color: 'text-violet-600', bgColor: 'bg-violet-100', hoverColor: 'hover:bg-violet-200', path: '/dashboard/reminders' },
    { name: 'Scan Prescription', icon: QrCode, color: 'text-emerald-600', bgColor: 'bg-emerald-100', hoverColor: 'hover:bg-emerald-200', path: '/dashboard/prescriptions' },
    { name: 'View Analytics', icon: LineChart, color: 'text-amber-600', bgColor: 'bg-amber-100', hoverColor: 'hover:bg-amber-200', path: '/dashboard/analytics' },
  ];

  const getAdherenceColor = (rate: number) => {
    if (rate >= 90) return { text: 'text-green-700', bg: 'bg-green-100', icon: TrendingUp };
    if (rate >= 70) return { text: 'text-yellow-700', bg: 'bg-yellow-100', icon: Activity };
    return { text: 'text-red-700', bg: 'bg-red-100', icon: TrendingDown };
  };

  const adherenceInfo = getAdherenceColor(stats.adherenceRate);

  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-8">
      <div className="h-8 bg-gray-200 rounded w-1/3"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-gray-200 rounded-xl"></div>)}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="h-64 bg-gray-200 rounded-xl"></div>
        <div className="h-64 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <>
          {/* Welcome section - Personalized */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
                Welcome back, {currentUser?.firstName || 'User'}!
              </h1>
              <p className="mt-1 text-base text-gray-600">
                Here's your medication summary for today.
              </p>
            </div>
          </div>

          {/* Stats Grid - Enhanced Styling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Active Medications Card */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-start space-x-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex-shrink-0 p-3 bg-sky-100 rounded-lg">
                <Pill className="h-6 w-6 text-sky-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Active Medications</h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.activeMedicationsCount}
                </p>
              </div>
            </div>
            
            {/* Upcoming Reminders Card */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-start space-x-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex-shrink-0 p-3 bg-violet-100 rounded-lg">
                <Bell className="h-6 w-6 text-violet-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Pending Reminders</h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.pendingRemindersCount}
                </p>
              </div>
            </div>
            
            {/* Adherence Rate Card */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-start space-x-4 hover:shadow-md transition-shadow duration-200">
              <div className={`flex-shrink-0 p-3 ${adherenceInfo.bg} rounded-lg`}>
                <adherenceInfo.icon className={`h-6 w-6 ${adherenceInfo.text}`} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Adherence Rate</h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.adherenceRate}%
                </p>
              </div>
            </div>
            
            {/* Missed Doses Card */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-start space-x-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex-shrink-0 p-3 bg-red-100 rounded-lg">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Missed Doses (Total)</h3>
                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.missedRemindersCount}
                </p>
              </div>
            </div>
          </div>

          {/* Quick actions - Themed */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {quickActions.map((action) => (
              <Link
                key={action.name}
                to={action.path}
                className={`group flex flex-col items-center justify-center text-center p-5 ${action.bgColor} rounded-xl shadow-sm border border-transparent ${action.hoverColor} transition-all duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-md`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 transform group-hover:scale-110 transition-transform duration-200`}
                >
                  <action.icon className={`w-6 h-6 ${action.color}`} />
                </div>
                <h3 className={`text-sm font-semibold ${action.color}`}>{action.name}</h3>
              </Link>
            ))}
          </div>

          {/* Reminders and Activity Feed Section */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Upcoming reminders - Enhanced */}
            <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  Upcoming Reminders
                </h2>
                <Link to="/dashboard/reminders" className="inline-flex items-center text-sm font-medium text-teal-600 hover:text-teal-700">
                  View all
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingReminders.length > 0 ? (
                  upcomingReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-violet-100 rounded-full">
                          <Bell className="w-5 h-5 text-violet-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {reminder.medicationName}
                          </p>
                          <p className="text-xs text-gray-500">{reminder.dosage}</p>
                          {reminder.notes && <p className="text-xs text-gray-500 italic mt-0.5">{reminder.notes}</p>}
                        </div>
                      </div>
                      <div className="text-right flex items-center space-x-3">
                        <p className="text-sm font-medium text-gray-700">
                          {reminder.reminderTime}
                        </p>
                        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
                    <Bell className="mx-auto h-10 w-10 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming reminders</h3>
                    <p className="mt-1 text-sm text-gray-500">You're all caught up!</p>
                    <div className="mt-6">
                      <Link
                        to="/dashboard/reminders"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      >
                        <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Set New Reminder
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Activity feed - Enhanced */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-800">
                  Recent Activity
                </h2>
              </div>
              <div className="flow-root">
                <ul className="-mb-6">
                  {recentActivity.slice(0, 4).map((activity, index) => (
                    <li key={activity.id} className={`relative ${index < recentActivity.length - 1 ? 'pb-6' : ''}`}>
                      {index < recentActivity.length - 1 ? (
                        <div className="absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-200"></div>
                      ) : null}
                      <div className="relative flex items-start space-x-3">
                        <div>
                          <span className={`h-8 w-8 rounded-full ${activity.iconBg} flex items-center justify-center ring-4 ring-white`}>
                            <activity.icon className={`h-4 w-4 ${activity.iconColor}`} aria-hidden="true" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5">
                          <p className="text-sm text-gray-800">
                            {activity.title}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              {recentActivity.length === 0 && (
                <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
                  <Activity className="mx-auto h-10 w-10 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                  <p className="mt-1 text-sm text-gray-500">Updates will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
