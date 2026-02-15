import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt, FaSearch, FaRocket, FaEye, FaTimes, FaFolder, FaStar, FaCode } from 'react-icons/fa'
import { projectsAPI } from '../services/apiService'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const data = await projectsAPI.getAll()
      setProjects(data.data?.projects || data.projects || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.techStack?.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filter === 'all' || project.category?.toLowerCase() === filter
    return matchesSearch && matchesFilter
  })

  const categories = ['all', ...new Set(projects.map(p => p.category?.toLowerCase()).filter(Boolean))]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }} 
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-400 text-sm font-medium mb-6"
          >
            <FaRocket className="animate-bounce" /> Featured Work
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">My </span>
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">Projects</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">Explore my latest work and creative endeavors</p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }} 
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <FaSearch />
              </div>
              <input
                type="text"
                placeholder="Search by name, description, or technology..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
              />
              {searchTerm && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <FaTimes />
                </motion.button>
              )}
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-5 py-3 rounded-xl font-medium capitalize whitespace-nowrap transition-all duration-300 ${
                    filter === category
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25'
                      : 'bg-dark-800/50 text-gray-400 hover:bg-dark-700/50 border border-dark-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category === 'all' ? 'All Projects' : category}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        {!loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
            <span className="text-gray-400">
              Showing <span className="text-purple-400 font-semibold">{filteredProjects.length}</span> 
              {filteredProjects.length === 1 ? ' project' : ' projects'}
              {searchTerm && <span> for "<span className="text-white">{searchTerm}</span>"</span>}
            </span>
          </motion.div>
        )}

        {/* Projects Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              <div className="w-14 h-14 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin absolute top-3 left-3" style={{ animationDirection: 'reverse', animationDuration: '0.7s' }}></div>
            </div>
            <p className="text-gray-400 mt-6 animate-pulse">Loading amazing projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="text-center py-20"
          >
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-7xl mb-6">
              <FaFolder className="mx-auto text-gray-600" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">No Projects Found</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            <motion.button
              onClick={() => { setSearchTerm(''); setFilter('all'); }}
              className="mt-6 px-6 py-3 bg-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-500/30 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear Filters
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants} 
            initial="hidden" 
            animate="visible" 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project, index) => (
              <motion.div key={project._id} variants={cardVariants} className="group" layout>
                <div className="relative h-full bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10">
                  {/* Project Image */}
                  <div className="relative h-52 overflow-hidden">
                    {project.image ? (
                      <motion.img 
                        src={project.image.startsWith('http') ? project.image : `${import.meta.env.VITE_API_URL}${project.image}`} 
                        alt={project.title} 
                        className="w-full h-full object-cover" 
                        whileHover={{ scale: 1.1 }} 
                        transition={{ duration: 0.5 }} 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-900/30 via-dark-800 to-pink-900/30 flex items-center justify-center">
                        <FaCode className="text-6xl text-purple-500/30" />
                      </div>
                    )}
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent opacity-60"></div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <motion.button
                        onClick={() => setSelectedProject(project)}
                        className="px-6 py-3 bg-white text-dark-900 rounded-xl font-semibold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <FaEye /> Quick View
                      </motion.button>
                    </div>

                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-dark-900 text-xs font-bold rounded-full flex items-center gap-1">
                        <FaStar /> Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">{project.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>

                    {/* Tech Stack */}
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {project.techStack.slice(0, 4).map((tech, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + i * 0.05 }}
                            className="px-3 py-1 text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-full"
                          >
                            {tech}
                          </motion.span>
                        ))}
                        {project.techStack.length > 4 && (
                          <span className="px-3 py-1 text-xs font-medium bg-dark-600 text-gray-400 rounded-full">
                            +{project.techStack.length - 4}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex gap-3 pt-4 border-t border-dark-600">
                      {project.githubLink && (
                        <motion.a 
                          href={project.githubLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-dark-700 hover:bg-dark-600 border border-dark-500 hover:border-gray-500 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-all duration-300" 
                          whileHover={{ y: -2 }} 
                          whileTap={{ scale: 0.98 }}
                        >
                          <FaGithub /> Code
                        </motion.a>
                      )}
                      {project.liveLink && (
                        <motion.a 
                          href={project.liveLink} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-sm font-medium text-white shadow-lg shadow-purple-500/25 transition-all duration-300" 
                          whileHover={{ y: -2 }} 
                          whileTap={{ scale: 0.98 }}
                        >
                          <FaExternalLinkAlt /> Live Demo
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/90 backdrop-blur-sm" 
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 50 }} 
              transition={{ type: "spring", stiffness: 200, damping: 25 }} 
              className="relative w-full max-w-3xl bg-dark-800 border border-dark-600 rounded-3xl overflow-hidden shadow-2xl" 
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProject(null)} 
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-dark-700/80 hover:bg-dark-600 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all"
              >
                <FaTimes />
              </button>

              {/* Image */}
              <div className="relative h-64 md:h-80">
                {selectedProject.image ? (
                  <img src={selectedProject.image.startsWith('http') ? selectedProject.image : `${import.meta.env.VITE_API_URL}${selectedProject.image}`} alt={selectedProject.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-pink-900/50 flex items-center justify-center">
                    <FaCode className="text-8xl text-purple-500/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-8 -mt-20 relative">
                <h2 className="text-3xl font-bold text-white mb-4">{selectedProject.title}</h2>
                <p className="text-gray-400 leading-relaxed mb-6">{selectedProject.description}</p>

                {selectedProject.techStack && selectedProject.techStack.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm text-gray-500 uppercase tracking-wider mb-3">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.techStack.map((tech, i) => (
                        <span key={i} className="px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-lg text-sm font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  {selectedProject.githubLink && (
                    <a 
                      href={selectedProject.githubLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-dark-700 hover:bg-dark-600 border border-dark-500 rounded-xl text-white font-medium transition-all"
                    >
                      <FaGithub /> View Code
                    </a>
                  )}
                  {selectedProject.liveLink && (
                    <a 
                      href={selectedProject.liveLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-medium shadow-lg shadow-purple-500/25 transition-all"
                    >
                      <FaExternalLinkAlt /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Projects
