import React, { useState } from 'react';
import {
  Gift,
  Award,
  Star,
  TrendingUp,
  Clock,
  ChevronRight,
  Gift as GiftIcon,
  Heart,
  Users,
  Calendar,
} from 'lucide-react';

interface Reward {
  id: number;
  name: string;
  description: string;
  points: number;
  category: string;
  expiryDate: string;
  status: 'available' | 'claimed' | 'expired';
}

const Rewards: React.FC = () => {
  const [activeTab, setActiveTab] = useState('available');

  const rewards: Reward[] = [
    {
      id: 1,
      name: '10% Off Next Prescription',
      description: 'Get 10% off your next prescription refill at participating pharmacies',
      points: 500,
      category: 'Discount',
      expiryDate: '2024-03-31',
      status: 'available',
    },
    {
      id: 2,
      name: 'Free Health Check',
      description: 'Complimentary basic health check at partner clinics',
      points: 1000,
      category: 'Health',
      expiryDate: '2024-04-15',
      status: 'available',
    },
    {
      id: 3,
      name: 'Premium Membership Month',
      description: 'One month of premium membership features',
      points: 750,
      category: 'Membership',
      expiryDate: '2024-03-20',
      status: 'claimed',
    },
  ];

  const achievements = [
    {
      title: 'Perfect Week',
      description: 'Take all medications on time for a week',
      progress: 5,
      total: 7,
      points: 100,
    },
    {
      title: 'Donation Hero',
      description: 'Donate medicines 3 times',
      progress: 2,
      total: 3,
      points: 150,
    },
    {
      title: 'Family Care',
      description: 'Add and manage 3 family members',
      progress: 1,
      total: 3,
      points: 200,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Rewards Program</h1>
        <p className="mt-1 text-sm text-gray-500">
          Earn points and unlock rewards for maintaining good medication adherence
        </p>
      </div>

      {/* Points Overview */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-teal-100">Available Points</p>
            <p className="mt-2 text-4xl font-bold">1,250</p>
          </div>
          <div className="h-16 w-16 bg-white/10 rounded-lg flex items-center justify-center">
            <Award className="h-8 w-8" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-teal-100">Earned this month</p>
            <p className="mt-1 text-lg font-semibold">350</p>
          </div>
          <div>
            <p className="text-sm text-teal-100">Lifetime earned</p>
            <p className="mt-1 text-lg font-semibold">2,500</p>
          </div>
          <div>
            <p className="text-sm text-teal-100">Current streak</p>
            <p className="mt-1 text-lg font-semibold">7 days</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Star className="h-5 w-5 text-teal-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Level</p>
              <p className="text-lg font-semibold text-gray-900">Gold</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Adherence</p>
              <p className="text-lg font-semibold text-gray-900">92%</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Clock className="h-5 w-5 text-teal-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Streak</p>
              <p className="text-lg font-semibold text-gray-900">7 Days</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <GiftIcon className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Rewards</p>
              <p className="text-lg font-semibold text-gray-900">5 Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Current Achievements</h2>
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.title}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <Award className="h-5 w-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {achievement.points} points
                  </p>
                  <p className="text-sm text-gray-500">
                    {achievement.progress}/{achievement.total} completed
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full"
                    style={{
                      width: `${(achievement.progress / achievement.total) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Available Rewards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Available Rewards</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('available')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'available'
                  ? 'bg-teal-100 text-teal-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Available
            </button>
            <button
              onClick={() => setActiveTab('claimed')}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === 'claimed'
                  ? 'bg-teal-100 text-teal-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Claimed
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards
            .filter((reward) =>
              activeTab === 'available'
                ? reward.status === 'available'
                : reward.status === 'claimed'
            )
            .map((reward) => (
              <div
                key={reward.id}
                className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-teal-100 rounded-lg mr-3">
                      <Gift className="h-5 w-5 text-teal-600" />
                    </div>
                    <span className="text-xs font-medium text-teal-700 uppercase tracking-wider bg-teal-50 px-2 py-1 rounded">
                      {reward.category}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    {reward.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {reward.description}
                  </p>
                </div>
                <div className="border-t border-gray-100 pt-3 mt-auto">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      <p><span className="font-semibold text-teal-600">{reward.points}</span> points</p>
                      {reward.status === 'available' && <p>Expires: {reward.expiryDate}</p>}
                    </div>
                    {reward.status === 'available' && (
                      <button className="px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500">
                        Claim
                      </button>
                    )}
                    {reward.status === 'claimed' && (
                      <span className="px-3 py-1.5 text-sm font-medium rounded-md text-green-700 bg-green-100">
                        Claimed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
