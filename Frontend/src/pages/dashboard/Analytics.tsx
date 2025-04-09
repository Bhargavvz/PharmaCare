import React, { useState } from 'react';
import {
  LineChart,
  BarChart,
  PieChart,
  Calendar,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react';

const Analytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const stats = [
    {
      name: 'Adherence Rate',
      value: '92%',
      change: '+2.5%',
      trend: 'up',
    },
    {
      name: 'Missed Doses',
      value: '3',
      change: '-1',
      trend: 'down',
    },
    {
      name: 'On-time Rate',
      value: '88%',
      change: '+1.2%',
      trend: 'up',
    },
    {
      name: 'Active Medications',
      value: '8',
      change: '0',
      trend: 'neutral',
    },
  ];

  const medicationStats = [
    { name: 'Morning', value: 95 },
    { name: 'Afternoon', value: 85 },
    { name: 'Evening', value: 90 },
    { name: 'Night', value: 88 },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your medication adherence and health patterns
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="block rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50">
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              {stat.trend === 'up' ? (
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              ) : stat.trend === 'down' ? (
                <TrendingDown className="h-5 w-5 text-red-500" />
              ) : (
                <Activity className="h-5 w-5 text-gray-400" />
              )}
            </div>
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-semibold text-gray-900">{stat.value}</p>
              <span
                className={`ml-2 text-sm font-medium ${
                  stat.trend === 'up'
                    ? 'text-emerald-600'
                    : stat.trend === 'down'
                    ? 'text-red-600'
                    : 'text-gray-500'
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Adherence Trend */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Adherence Trend</h2>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Filter className="h-5 w-5" />
            </button>
          </div>
          <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center">
              <LineChart className="h-8 w-8 text-gray-400 mx-auto" />
              <p className="mt-2 text-sm text-gray-500">Adherence Chart Placeholder</p>
            </div>
          </div>
        </div>

        {/* Medication Timing */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Medication Timing</h2>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Filter className="h-5 w-5" />
            </button>
          </div>
          <div className="h-80">
            <div className="grid grid-cols-4 gap-4 h-full">
              {medicationStats.map((stat) => (
                <div key={stat.name} className="flex flex-col justify-end">
                  <div
                    className="bg-teal-400 rounded-t-lg"
                    style={{ height: `${stat.value}%` }}
                  ></div>
                  <div className="text-center mt-2">
                    <span className="text-sm font-medium text-gray-900">
                      {stat.value}%
                    </span>
                    <span className="block text-xs text-gray-500">{stat.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Medication Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Medication Distribution
            </h2>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Filter className="h-5 w-5" />
            </button>
          </div>
          <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center">
              <PieChart className="h-8 w-8 text-gray-400 mx-auto" />
              <p className="mt-2 text-sm text-gray-500">Distribution Chart Placeholder</p>
            </div>
          </div>
        </div>

        {/* Monthly Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Monthly Overview</h2>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Filter className="h-5 w-5" />
            </button>
          </div>
          <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-center">
              <BarChart className="h-8 w-8 text-gray-400 mx-auto" />
              <p className="mt-2 text-sm text-gray-500">Overview Chart Placeholder</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Medication Calendar</h2>
          <div className="flex items-center space-x-4">
            <select className="block rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option>All Medications</option>
              <option>Prescription Only</option>
              <option>Supplements</option>
            </select>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Calendar className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="h-96 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
          <div className="text-center">
            <Calendar className="h-8 w-8 text-gray-400 mx-auto" />
            <p className="mt-2 text-sm text-gray-500">Calendar View Placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
