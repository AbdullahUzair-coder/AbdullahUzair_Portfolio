import api from './api'

// ==================== AUTH API ====================

export const authAPI = {
  // Admin Login
  login: async (email, password) => {
    const response = await api.post('/api/admin/auth/login', { email, password })
    return response.data
  },

  // Get Current Admin
  getCurrentAdmin: async () => {
    const response = await api.get('/api/admin/auth/me')
    return response.data
  },

  // Logout
  logout: async () => {
    const response = await api.post('/api/admin/auth/logout')
    return response.data
  },
}

// ==================== PROJECTS API ====================

export const projectsAPI = {
  // Get all projects (public)
  getAll: async (params = {}) => {
    const response = await api.get('/api/projects', { params })
    return response.data
  },

  // Get single project (public)
  getById: async (id) => {
    const response = await api.get(`/api/projects/${id}`)
    return response.data
  },

  // Create project (admin)
  create: async (projectData) => {
    const response = await api.post('/api/projects', projectData)
    return response.data
  },

  // Update project (admin)
  update: async (id, projectData) => {
    const response = await api.put(`/api/projects/${id}`, projectData)
    return response.data
  },

  // Delete project (admin)
  delete: async (id) => {
    const response = await api.delete(`/api/projects/${id}`)
    return response.data
  },
}

// ==================== SKILLS API ====================

export const skillsAPI = {
  // Get all skills (public)
  getAll: async (params = {}) => {
    const response = await api.get('/api/skills', { params })
    return response.data
  },

  // Get single skill (public)
  getById: async (id) => {
    const response = await api.get(`/api/skills/${id}`)
    return response.data
  },

  // Create skill (admin)
  create: async (skillData) => {
    const response = await api.post('/api/skills', skillData)
    return response.data
  },

  // Update skill (admin)
  update: async (id, skillData) => {
    const response = await api.put(`/api/skills/${id}`, skillData)
    return response.data
  },

  // Delete skill (admin)
  delete: async (id) => {
    const response = await api.delete(`/api/skills/${id}`)
    return response.data
  },
}

// ==================== CERTIFICATES API ====================

export const certificatesAPI = {
  // Get all certificates (public)
  getAll: async (params = {}) => {
    const response = await api.get('/api/certificates', { params })
    return response.data
  },

  // Get single certificate (public)
  getById: async (id) => {
    const response = await api.get(`/api/certificates/${id}`)
    return response.data
  },

  // Create certificate (admin)
  create: async (formData) => {
    const response = await api.post('/api/certificates', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Update certificate (admin)
  update: async (id, formData) => {
    const response = await api.put(`/api/certificates/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Delete certificate (admin)
  delete: async (id) => {
    const response = await api.delete(`/api/certificates/${id}`)
    return response.data
  },
}

// ==================== MESSAGES API ====================

export const messagesAPI = {
  // Submit contact message (public)
  submit: async (messageData) => {
    const response = await api.post('/api/messages', messageData)
    return response.data
  },

  // Get all messages (admin)
  getAll: async (params = {}) => {
    const response = await api.get('/api/messages', { params })
    return response.data
  },

  // Get single message (admin)
  getById: async (id) => {
    const response = await api.get(`/api/messages/${id}`)
    return response.data
  },

  // Delete message (admin)
  delete: async (id) => {
    const response = await api.delete(`/api/messages/${id}`)
    return response.data
  },
}

// ==================== ADMIN API ====================

export const adminAPI = {
  // Get admin profile
  getProfile: async () => {
    const response = await api.get('/api/admin/profile')
    return response.data
  },

  // Update admin profile
  updateProfile: async (profileData) => {
    const response = await api.put('/api/admin/profile', profileData)
    return response.data
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/api/admin/password', passwordData)
    return response.data
  },
}

// ==================== SETTINGS API ====================

export const settingsAPI = {
  // Get portfolio settings (public)
  get: async () => {
    const response = await api.get('/api/settings')
    return response.data
  },

  // Update portfolio settings (admin)
  update: async (settingsData) => {
    const response = await api.put('/api/settings', settingsData)
    return response.data
  },

  // Update experience/timeline (admin)
  updateExperience: async (experienceData) => {
    const response = await api.put('/api/settings/experience', experienceData)
    return response.data
  },

  // Upload profile image (admin)
  uploadProfileImage: async (file) => {
    const formData = new FormData()
    formData.append('profileImage', file)
    const response = await api.post('/api/settings/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // Upload CV/Resume (admin)
  uploadCV: async (file) => {
    const formData = new FormData()
    formData.append('cv', file)
    const response = await api.post('/api/settings/cv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}

export default {
  auth: authAPI,
  projects: projectsAPI,
  skills: skillsAPI,
  certificates: certificatesAPI,
  messages: messagesAPI,
  admin: adminAPI,
  settings: settingsAPI,
}
