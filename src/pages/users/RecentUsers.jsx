import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/index';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';

const roleStyle = {
  ADMIN: 'bg-indigo-100 text-indigo-700',
  USER: 'bg-green-100 text-green-700',
};

const RecentUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminApi.getRecentUsers();
        setUsers(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
        Loading users...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 mt-10">{error}</div>
    );

  return (
    <div className="px-3 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Recent Users
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          List of recently registered users
        </p>
      </div>

      {/* ===================== DESKTOP TABLE ===================== */}
      <div className="hidden lg:block">
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Users List</h3>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead>
                  <tr className="text-xs uppercase text-gray-400 border-b">
                    <th className="py-3 px-3">Name</th>
                    <th className="py-3 px-3">Email</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Enrolled Courses</th>
                    <th className="py-3 px-3">Purchased Products</th>
                    <th className="py-3 px-3">Registered At</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="py-3 px-3 font-medium text-gray-900">{user.name}</td>
                      <td className="py-3 px-3 text-sm text-gray-500">{user.email}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${roleStyle[user.role]}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-sm">
                        {user.enrolledCourses.length || '—'}
                      </td>
                      <td className="py-3 px-3 text-sm">
                        {user.purchasedProducts.length || '—'}
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ===================== MOBILE CARDS ===================== */}
      <div className="space-y-4 lg:hidden">
        {users.map((user) => (
          <Card key={user._id}>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="font-semibold">{user.name}</p>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${roleStyle[user.role]}`}
                >
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-gray-500">{user.email}</p>
              <div className="flex flex-wrap gap-2 text-sm">
                <span>Enrolled: {user.enrolledCourses.length || '0'}</span>
                <span>Purchased: {user.purchasedProducts.length || '0'}</span>
              </div>
              <p className="text-xs text-gray-400">
                Registered: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentUsers;
