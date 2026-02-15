import React, { useEffect, useState } from 'react';
import { adminApi, courseApi } from '../../api/index'; // make sure to add the new API function
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const AdminEnrollment = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseApi.getAll();
         console.log(res);
        setCourses(res.data);
      } catch (err) {
        console.error('Failed to fetch courses', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleApprove = async (courseId, enrollmentId) => {
    try {
      setApprovingId(enrollmentId);
      const res = await adminApi.approveEnrollment(courseId, enrollmentId);

      // Update local state
      setCourses((prev) =>
        prev.map((course) =>
          course._id === courseId
            ? {
                ...course,
                enrollments: course.enrollments.map((enroll) =>
                  enroll._id === enrollmentId
                    ? { ...enroll, status: res.data.status, approvedAt: res.data.approvedAt }
                    : enroll
                )
              }
            : course
        )
      );
    } catch (err) {
      console.error('Failed to approve enrollment', err);
      alert('Failed to approve enrollment');
    } finally {
      setApprovingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-gray-500">
        Loading courses...
      </div>
    );

  return (
    <div className="space-y-6 px-3 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">Course Enrollments</h1>
      <p className="text-gray-500 text-sm">Approve pending course enrollments</p>

      {courses.map((course) => (
        <Card key={course._id}>
          <CardHeader>
            <h3 className="font-bold text-gray-900">{course.title}</h3>
            <p className="text-gray-500 text-sm">{course.description}</p>
          </CardHeader>
          <CardContent>
            {course.enrollments.length === 0 ? (
              <p className="text-gray-400 text-sm">No enrollments yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-2">Student ID</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Requested At</th>
                      <th className="px-4 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {course.enrollments.map((enroll) => (
                      <tr key={enroll._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{enroll.user}</td>
                        <td className="px-4 py-2 capitalize">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              enroll.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {enroll.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">{new Date(enroll.requestedAt).toLocaleString()}</td>
                        <td className="px-4 py-2 text-right">
                          {enroll.status === 'pending' ? (
                            <Button
                              size="sm"
                              onClick={() => handleApprove(course._id, enroll._id)}
                              disabled={approvingId === enroll._id}
                            >
                              {approvingId === enroll._id ? 'Approving...' : 'Approve'}
                            </Button>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminEnrollment;
