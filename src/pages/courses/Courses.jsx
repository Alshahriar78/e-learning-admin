import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useForm } from "react-hook-form";
import { courseApi, categoryApi } from "../../api";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { register, handleSubmit, reset, watch } = useForm();

  // Fetch courses
 const fetchCourses = async () => {
  setLoading(true);
  try {
    const res = await courseApi.getAll();
    console.log(res.data); // check if courses array is correct
    setCourses(res.data);
  } catch (err) {
    console.error("Failed to fetch courses", err);
  } finally {
    setLoading(false);
  }
};


  // Fetch categories for dropdown
  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  // Open modal
  const openModal = (course = null) => {
    setEditingCourse(course);
    reset({
      title: course?.title || "",
      description: course?.description || "",
      price: course?.price || 0,
      isFree: course?.isFree || false,
      category: course?.category || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingCourse(null);
    setModalOpen(false);
  };

  // Submit form
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("isFree", data.isFree);
      formData.append("category", data.category);
      if (data.thumbnail[0]) formData.append("thumbnail", data.thumbnail[0]);

      if (editingCourse) {
        await courseApi.update(editingCourse._id, formData);
      } else {
        await courseApi.create(formData);
      }
      fetchCourses();
      closeModal();
    } catch (err) {
      console.error("Failed to save course", err);
      alert("Failed to save course");
    }
  };

  // Delete course
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await courseApi.delete(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Failed to delete course", err);
      alert("Failed to delete course");
    }
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-500 text-sm">Manage your courses</p>
        </div>
        <Button className="gap-2" onClick={() => openModal()}>
          <Plus size={18} /> Create New Course
        </Button>
      </div>

      {/* Search + Filters */}
      <Card>
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Free</th>
                <th className="px-6 py-4">Published</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    Loading...
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No courses found
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{course.title}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {course.category?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-900">${course.price}</td>
                    <td className="px-6 py-4">{course.isFree ? "Yes" : "No"}</td>
                    <td className="px-6 py-4">{course.isPublished ? "Yes" : "No"}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(course)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(course._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ---------- MODAL ---------- */}
      {/* ---------- MODAL ---------- */}
{modalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
    <div className="bg-white w-full max-w-lg rounded-lg shadow-lg overflow-y-auto max-h-[90vh] p-6">
      <h2 className="text-xl font-bold mb-6">
        {editingCourse ? "Edit Course" : "Create New Course"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Course Title</label>
          <input
            type="text"
            placeholder="Enter course title"
            {...register("title", { required: true })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Thumbnail */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Course Image</label>
          <input type="file" accept="image/*" {...register("thumbnail")} />
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Description</label>
          <textarea
            placeholder="Enter course description"
            {...register("description")}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Category</label>
          <select
            {...register("category", { required: true })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Price</label>
          <input
            type="number"
            placeholder="Enter price"
            {...register("price")}
            disabled={watch("isFree")}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Free Course Checkbox */}
        <div className="flex items-center gap-2">
          <input type="checkbox" {...register("isFree")} id="isFree" />
          <label htmlFor="isFree">Free Course</label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="submit">{editingCourse ? "Update Course" : "Create Course"}</Button>
        </div>
      </form>
    </div>
  </div>
)}

    </div>
  );
};

export default Courses;
