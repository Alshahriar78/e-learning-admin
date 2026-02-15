import api from './axios';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
};

export const adminApi = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getRecentUsers: () => api.get('/admin/recent-users'),
  getRecentOrders: () => api.get('/admin/recent-orders'),
  getCourseStats: () => api.get('/admin/course-stats'),
  getProductStats: () => api.get('/admin/product-stats'),
  approveEnrollment: (courseId, userId) =>
  api.patch(`/courses/${courseId}/approve/${userId}`)
};


// --------------------- CATEGORY ---------------------
export const categoryApi = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// --------------------- COURSE ---------------------
export const courseApi = {
  getAll: () => api.get('/courses'),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  approveEnrollment: (courseId, userId) =>
    api.patch(`/courses/${courseId}/approve/${userId}`),
};

// --------------------- MODULE ---------------------
export const moduleApi = {
  getAllByCourse: (courseId) => api.get(`/modules/course/${courseId}`),
  getAllModules: ()=> api.get('/modules'),
  getById: (id) => api.get(`/modules/${id}`),
  create: (data) => api.post('/modules', data),
  update: (id, data) => api.patch(`/modules/${id}`, data),
  delete: (id) => api.delete(`/modules/${id}`),
  togglePublish: (id) => api.patch(`/modules/${id}/publish`),
};

// --------------------- VIDEO ---------------------
export const videoApi = {
  getAllByModule: (moduleId) => api.get(`/videos/module/${moduleId}`),
  getAllVideos:()=> api.get('/videos'),
  getById: (id) => api.get(`/videos/${id}`),
  create: (data) => api.post('/videos', data),
  update: (id, data) => api.put(`/videos/${id}`, data),
  delete: (id) => api.delete(`/videos/${id}`),
};


export const productApi = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
};


export const enrollmentApi = {
  getAll: () => api.get("/enrollments"),
  updateStatus: (id, status) =>
    api.patch(`/enrollments/${id}/status`, { status }),
  delete: (id) => api.delete(`/enrollments/${id}`),
};
