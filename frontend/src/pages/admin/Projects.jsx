import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaGithub, FaExternalLinkAlt, FaTimes, FaImage, FaSearch } from 'react-icons/fa'
import { projectsAPI } from '../../services/apiService'
import { toast } from 'react-toastify'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    githubLink: '',
    liveLink: '',
    image: '',
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const data = await projectsAPI.getAll()
      setProjects(data.data.projects || [])
    } catch (error) {
      toast.error('Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const projectData = {
      ...formData,
      techStack: formData.techStack.split(',').map((tech) => tech.trim()),
    }

    try {
      if (editingProject) {
        await projectsAPI.update(editingProject._id, projectData)
        toast.success('Project updated successfully')
      } else {
        await projectsAPI.create(projectData)
        toast.success('Project created successfully')
      }
      closeModal()
      fetchProjects()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(', '),
      githubLink: project.githubLink || '',
      liveLink: project.liveLink || '',
      image: project.image || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return

    try {
      await projectsAPI.delete(id)
      toast.success('Project deleted successfully')
      fetchProjects()
    } catch (error) {
      toast.error('Failed to delete project')
    }
  }

  const openModal = () => setShowModal(true)

  const closeModal = () => {
    setShowModal(false)
    setEditingProject(null)
    setFormData({
      title: '',
      description: '',
      techStack: '',
      githubLink: '',
      liveLink: '',
      image: '',
    })
  }

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 p-6">
      {/* Header */}
      <motion.div 
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Manage Projects</h1>
          <p className="text-gray-400">Create, edit, and delete your portfolio projects</p>
        </div>
        <motion.button 
          onClick={openModal} 
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaPlus /> Add New Project
        </motion.button>
      </motion.div>

      {/* Search */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-dark-800/50 border border-dark-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredProjects.length === 0 ? (
        <motion.div 
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-dark-800/50 rounded-full flex items-center justify-center">
            <FaImage className="text-3xl text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm ? 'Try a different search term' : 'Create your first project to get started'}
          </p>
          {!searchTerm && (
            <motion.button 
              onClick={openModal}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold"
              whileHover={{ scale: 1.02 }}
            >
              <FaPlus className="inline mr-2" /> Add Project
            </motion.button>
          )}
        </motion.div>
      ) : (
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project._id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all duration-300"
            >
              {/* Image */}
              <div className="h-48 bg-gradient-to-br from-dark-700 to-dark-800 relative overflow-hidden">
                {project.image ? (
                  <img src={project.image.startsWith('http') ? project.image : `${import.meta.env.VITE_API_URL}${project.image}`} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-dark-600 group-hover:text-dark-500 transition-colors">
                      {project.title[0]}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Quick Actions */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-end gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-dark-800/90 rounded-lg flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
                      <FaGithub />
                    </a>
                  )}
                  {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-dark-800/90 rounded-lg flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                      <FaExternalLinkAlt />
                    </a>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.techStack?.slice(0, 4).map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                      {tech}
                    </span>
                  ))}
                  {project.techStack?.length > 4 && (
                    <span className="px-3 py-1 bg-dark-700 text-gray-400 text-xs rounded-full">
                      +{project.techStack.length - 4}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-dark-600">
                  <motion.button 
                    onClick={() => handleEdit(project)} 
                    className="flex-1 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaEdit /> Edit
                  </motion.button>
                  <motion.button 
                    onClick={() => handleDelete(project._id)} 
                    className="py-2 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FaTrash />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div 
              className="bg-dark-800 border border-dark-600 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-dark-600">
                <h2 className="text-2xl font-bold text-white">
                  {editingProject ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Tech Stack * (comma separated)</label>
                  <input
                    type="text"
                    name="techStack"
                    value={formData.techStack}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="React, Node.js, MongoDB"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">GitHub Link</label>
                    <input
                      type="url"
                      name="githubLink"
                      value={formData.githubLink}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Live Link</label>
                    <input
                      type="url"
                      name="liveLink"
                      value={formData.liveLink}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Image URL</label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="https://..."
                  />
                  {formData.image && (
                    <div className="mt-3 rounded-xl overflow-hidden h-32">
                      <img src={formData.image.startsWith('http') ? formData.image : `${import.meta.env.VITE_API_URL}${formData.image}`} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button 
                    type="button" 
                    onClick={closeModal} 
                    className="flex-1 py-3 bg-dark-700 text-white rounded-xl font-medium hover:bg-dark-600 transition-colors"
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    type="submit" 
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editingProject ? 'Update Project' : 'Create Project'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Projects
