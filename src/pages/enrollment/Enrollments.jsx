import { useEffect, useState } from "react";
import { enrollmentApi } from "../../api/index";
import { Trash2 } from "lucide-react";

const statusColor = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await enrollmentApi.getAll();
      setEnrollments(res.data || []);
    } catch (err) {
      console.error("Failed to load enrollments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await enrollmentApi.updateStatus(id, status);
      fetchEnrollments();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this enrollment?")) return;
    try {
      await enrollmentApi.delete(id);
      fetchEnrollments();
    } catch (err) {
      alert("Failed to delete enrollment");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Course Enrollments</h1>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Course</th>
              <th className="p-4">Status</th>
              <th className="p-4">Enrolled At</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="5" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && enrollments.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500">
                  No enrollments found
                </td>
              </tr>
            )}

            {enrollments.map((en) => (
              <tr key={en._id} className="border-t">
                <td className="p-4">
                  <div className="font-medium">{en.user?.name}</div>
                  <div className="text-xs text-gray-500">
                    {en.user?.email}
                  </div>
                </td>

                <td className="p-4">{en.course?.title}</td>

                <td className="p-4">
                  <select
                    value={en.status}
                    onChange={(e) =>
                      handleStatusChange(en._id, e.target.value)
                    }
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${statusColor[en.status]}`}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>

                <td className="p-4 text-gray-500">
                  {new Date(en.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(en._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Enrollments;
