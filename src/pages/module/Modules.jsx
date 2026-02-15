// src/pages/modules/Modules.jsx
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useForm } from "react-hook-form";
import { moduleApi, courseApi } from "../../api";

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm();

  // -------------------- Fetch Modules --------------------
  const fetchModules = async () => {
    setLoading(true);
    try {
      const res = await moduleApi.getAllModules();

      // Ensure module._id and course._id exist
      const mappedModules = res.data.map((m) => ({
        ...m,
        _id: m._id || m.id, // module id
        course: m.course ? { ...m.course, _id: m.course.id } : null,
      }));

      setModules(mappedModules);
    } catch (err) {
      console.error("Failed to fetch modules", err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Fetch Courses --------------------
  const fetchCourses = async () => {
    try {
      const res = await courseApi.getAll();
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  useEffect(() => {
    fetchModules();
    fetchCourses();
  }, []);

  // -------------------- Open/Close Modal --------------------
  const openModal = (module = null) => {
    setEditingModule(module);
    reset({
      title: module?.title || "",
      course: module?.course?._id || "",
      description: module?.description || "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingModule(null);
    setModalOpen(false);
  };

  // -------------------- Submit Form --------------------
  const onSubmit = async (data) => {
    if (!data.title || !data.course) return;
    setSubmitting(true);
    try {
      if (editingModule && editingModule._id) {
        // Update module
        const res = await moduleApi.update(editingModule._id, data);
        setModules((prev) =>
          prev.map((m) => (m._id === editingModule._id ? res.data : m))
        );
      } else {
        // Create module
        const res = await moduleApi.create(data);
        setModules((prev) => [res.data, ...prev]);
      }
      closeModal();
    } catch (err) {
      console.error("Failed to save module", err);
      alert(err.response?.data?.message || "Failed to save module");
    } finally {
      setSubmitting(false);
    }
  };

  // -------------------- Delete Module --------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;
    try {
      await moduleApi.delete(id);
      setModules((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Failed to delete module", err);
      alert(err.response?.data?.message || "Failed to delete module");
    }
  };

  // -------------------- Filtered Modules --------------------
  const filteredModules = modules.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modules</h1>
          <p className="text-gray-500 text-sm">Manage course modules</p>
        </div>
        <Button className="gap-2" onClick={() => openModal()}>
          <Plus size={18} /> Add Module
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search modules..."
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
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8">
                    Loading...
                  </td>
                </tr>
              ) : filteredModules.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">
                    No modules found
                  </td>
                </tr>
              ) : (
                filteredModules.map((module) => (
                  <tr key={module._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{module.title}</td>
                    <td className="px-6 py-4 text-gray-600">{module.course?.name || "-"}</td>
                    <td className="px-6 py-4 text-gray-600">{module.description || "-"}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(module)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(module._id)}
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
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-6">
              {editingModule ? "Edit Module" : "Create Module"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Module Title */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Module Title</label>
                <input
                  type="text"
                  placeholder="Enter module title"
                  {...register("title", { required: true })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Course Select */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Course</label>
                <select
                  {...register("course", { required: true })}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Description</label>
                <textarea
                  placeholder="Enter module description"
                  {...register("description")}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {editingModule ? "Update Module" : "Create Module"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modules;
