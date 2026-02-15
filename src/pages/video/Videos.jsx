import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useForm } from "react-hook-form";
import { videoApi, courseApi, moduleApi } from "../../api";

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingModules, setLoadingModules] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Fetch videos
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await videoApi.getAllVideos();
      setVideos(res.data);
    } catch (err) {
      console.error("Failed to fetch videos", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const res = await courseApi.getAll();
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to fetch courses", err);
    }
  };

  useEffect(() => {
    fetchVideos();
    fetchCourses();
  }, []);

  // Fetch modules when course changes
  const handleCourseChange = async (courseId) => {
  setSelectedCourse(courseId);
  setValue("module", ""); // reset module

  if (!courseId) {
    setModules([]);
    return;
  }

  setLoadingModules(true);
  try {
    const res = await moduleApi.getAllByCourse(courseId); // must call this
    setModules(Array.isArray(res.data) ? res.data : []);
  } catch (err) {
    console.error("Failed to fetch modules", err);
    setModules([]);
  } finally {
    setLoadingModules(false);
  }
};


  // Open modal
  const openModal = (video = null) => {
    setEditingVideo(video);
    reset({
      title: video?.title || "",
      videoUrl: video?.videoUrl || "",
      course: video?.course?._id || "",
      module: video?.module?._id || "",
      description: video?.description || "",
    });

    if (video?.course?._id) {
      handleCourseChange(video.course._id);
    }

    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingVideo(null);
    setSelectedCourse("");
    setModules([]);
    reset();
    setModalOpen(false);
  };

  // Submit form
  const onSubmit = async (data) => {
    try {
      // If module is empty string, remove it from data
      const submitData = { ...data };
      if (!submitData.module) {
        delete submitData.module;
      }
      
      if (editingVideo) {
        const res = await videoApi.update(editingVideo._id, submitData);
        setVideos((prev) =>
          prev.map((v) => (v._id === editingVideo._id ? res.data : v))
        );
      } else {
        const res = await videoApi.create(submitData);
        setVideos((prev) => [res.data, ...prev]);
      }
      closeModal();
    } catch (err) {
      console.error("Failed to save video", err);
      alert("Failed to save video: " + (err.response?.data?.message || err.message));
    }
  };

  // Delete video
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await videoApi.delete(id);
      setVideos((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      console.error("Failed to delete video", err);
      alert("Failed to delete video");
    }
  };

  const filteredVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Videos</h1>
          <p className="text-gray-500 text-sm">Manage course videos</p>
        </div>
        <Button className="gap-2" onClick={() => openModal()}>
          <Plus size={18} /> Add Video
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search videos..."
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
                <th className="px-6 py-4">Module</th>
                <th className="px-6 py-4">URL</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    Loading...
                  </td>
                </tr>
              ) : filteredVideos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    No videos found
                  </td>
                </tr>
              ) : (
                filteredVideos.map((video) => (
                  <tr
                    key={video._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {video.title}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {video.course?.title || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {video.module?.title || "-"}
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                      {video.videoUrl}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openModal(video)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(video._id)}
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
              {editingVideo ? "Edit Video" : "Create New Video"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Video Title */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium">
                  Video Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter video title"
                  {...register("title", { required: "Video title is required" })}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.title ? "border-red-500" : ""
                  }`}
                />
                {errors.title && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </span>
                )}
              </div>

              {/* Video URL */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium">
                  Video URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter video URL"
                  {...register("videoUrl", { required: "Video URL is required" })}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.videoUrl ? "border-red-500" : ""
                  }`}
                />
                {errors.videoUrl && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.videoUrl.message}
                  </span>
                )}
              </div>

              {/* Course */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium">
                  Course <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("course", { required: "Please select a course" })}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.course ? "border-red-500" : ""
                  }`}
                  onChange={(e) => handleCourseChange(e.target.value)}
                >
                  <option value="">Select a course</option>
                  {courses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
                {errors.course && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.course.message}
                  </span>
                )}
              </div>

              {/* Module */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium">
                  Module {modules.length > 0 && <span className="text-red-500">*</span>}
                </label>
                <select
                  {...register("module", { 
                    required: modules.length > 0 ? "Please select a module" : false 
                  })}
                  className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.module ? "border-red-500" : ""
                  }`}
                  disabled={!selectedCourse || loadingModules}
                >
                  <option value="">
                    {!selectedCourse
                      ? "Select a course first"
                      : loadingModules
                      ? "Loading modules..."
                      : modules.length === 0
                      ? "No modules available"
                      : "Select a module"}
                  </option>
                  {modules.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.title}
                    </option>
                  ))}
                </select>
                {errors.module && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.module.message}
                  </span>
                )}
                {selectedCourse && !loadingModules && modules.length === 0 && (
                  <span className="text-amber-600 text-sm mt-1">
                    ⚠️ No modules found for this course. Please create a module first.
                  </span>
                )}
              </div>

              {/* Description (Optional) */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Description</label>
                <textarea
                  placeholder="Enter video description (optional)"
                  {...register("description")}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingVideo ? "Update Video" : "Create Video"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;