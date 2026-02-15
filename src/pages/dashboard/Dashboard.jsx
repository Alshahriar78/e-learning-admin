import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingBag, 
  BookOpen, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { adminApi } from '../../api';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
  <Card>
    <CardContent className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        <div className="flex items-center gap-1 mt-2">
          {trend === 'up' ? (
            <span className="flex items-center text-xs font-medium text-green-600">
              <ArrowUpRight size={14} /> {trendValue}%
            </span>
          ) : (
            <span className="flex items-center text-xs font-medium text-red-600">
              <ArrowDownRight size={14} /> {trendValue}%
            </span>
          )}
          <span className="text-xs text-gray-400">vs last month</span>
        </div>
      </div>
      <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
        <Icon size={24} />
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.getDashboardStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
        // fallback mock
        setStats({
          totalUsers: 0,
          totalCourses: 0,
          totalProducts: 0,
          totalOrders: 0,
          totalRevenue: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const chartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ];

  if (loading) return <div className="flex items-center justify-center h-full text-gray-500">Loading...</div>;

  return (
    <div className="space-y-8 px-3 sm:px-6 lg:px-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-2">Welcome back! Here's your current stats.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} trend="up" trendValue="12" color="indigo" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingBag} trend="up" trendValue="8" color="blue" />
        <StatCard title="Total Courses" value={stats.totalCourses} icon={BookOpen} trend="down" trendValue="3" color="emerald" />
        <StatCard title="Total Products" value={stats.totalProducts} icon={BookOpen} trend="up" trendValue="5" color="purple" />
        <StatCard title="Revenue" value={`৳ ${stats.totalRevenue}`} icon={TrendingUp} trend="up" trendValue="15" color="orange" />
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h3 className="font-bold text-gray-900">Revenue Analysis</h3>
          <select className="text-sm border-gray-200 rounded-md focus:ring-indigo-500">
            <option>Last 6 Months</option>
            <option>Last Year</option>
          </select>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}/>
              <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;







{/* <Card>
          <CardHeader>
            <h3 className="font-bold text-gray-900">Recent Users</h3>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 px-2">User</th>
                    <th className="pb-3 px-2">Role</th>
                    <th className="pb-3 px-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentUsers.map((user) => (
                    <tr key={user.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600">{user.role}</td>
                      <td className="py-3 px-2 text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
</Card> */}