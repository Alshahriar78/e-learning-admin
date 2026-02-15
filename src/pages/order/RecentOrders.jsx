import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/index';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';

const statusStyle = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-green-100 text-green-700',
};

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await adminApi.getRecentOrders();
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load recent orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleApprove = async (orderId) => {
    try {
      setApprovingId(orderId);
      const res = await adminApi.approveOrder(orderId);

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, status: res.data.order.status }
            : order
        )
      );
    } catch (err) {
      console.error(err);
      alert('Failed to approve order');
    } finally {
      setApprovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 mt-10">
        {error}
      </div>
    );
  }

  return (
    <div className="px-3 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Recent Orders
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Manage and approve customer orders
        </p>
      </div>

      {/* ===================== DESKTOP TABLE ===================== */}
      <div className="hidden lg:block">
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-gray-900">Order List</h3>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead>
                  <tr className="text-xs uppercase text-gray-400 border-b">
                    <th className="py-3 px-3">Order ID</th>
                    <th className="py-3 px-3">Customer</th>
                    <th className="py-3 px-3">Products</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="py-3 px-3 text-sm font-mono">
                        {order._id.slice(-8)}
                      </td>

                      <td className="py-3 px-3">
                        <p className="text-sm font-medium">{order.user?.name}</p>
                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                      </td>

                      <td className="py-3 px-3">
                        {order.products.map((p) => (
                          <p key={p._id} className="text-sm">
                            {p.name}
                          </p>
                        ))}
                      </td>

                      <td className="py-3 px-3 font-semibold">
                        ৳ {order.totalAmount}
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle[order.status]}`}
                        >
                          {order.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        {order.status === 'PENDING' ? (
                          <button
                            onClick={() => handleApprove(order._id)}
                            disabled={approvingId === order._id}
                            className="px-3 py-1.5 rounded-md text-xs font-medium
                                       bg-indigo-600 text-white hover:bg-indigo-700
                                       disabled:opacity-50"
                          >
                            {approvingId === order._id ? 'Approving...' : 'Approve'}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
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
        {orders.map((order) => (
          <Card key={order._id}>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-gray-500">
                  #{order._id.slice(-8)}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyle[order.status]}`}
                >
                  {order.status}
                </span>
              </div>

              <div>
                <p className="text-sm font-semibold">{order.user?.name}</p>
                <p className="text-xs text-gray-500">{order.user?.email}</p>
              </div>

              <div className="text-sm">
                {order.products.map((p) => (
                  <p key={p._id}>• {p.name}</p>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold">৳ {order.totalAmount}</span>

                {order.status === 'PENDING' && (
                  <button
                    onClick={() => handleApprove(order._id)}
                    disabled={approvingId === order._id}
                    className="px-3 py-1.5 rounded-md text-xs font-medium
                               bg-indigo-600 text-white hover:bg-indigo-700
                               disabled:opacity-50"
                  >
                    {approvingId === order._id ? 'Approving...' : 'Approve'}
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;
