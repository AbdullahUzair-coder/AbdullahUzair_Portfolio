import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCode, FaServer, FaDatabase, FaTools, FaCog, FaLayerGroup } from 'react-icons/fa'
import { skillsAPI } from '../../services/apiService'
import { toast } from 'react-toastify'

const Skills = () => {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [formData, setFormData] = useState({
    name: '',
    category: 'frontend',
    proficiency: 50,
    icon: '',
  })

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      setLoading(true)
      const data = await skillsAPI.getAll({ all: true })
      setSkills(data.data.skills || [])
    } catch (error) {
      toast.error('Failed to fetch skills')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.type === 'number' || e.target.type === 'range' ? Number(e.target.value) : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingSkill) {
        await skillsAPI.update(editingSkill._id, formData)
        toast.success('Skill updated successfully')
      } else {
        await skillsAPI.create(formData)
        toast.success('Skill created successfully')
      }
      closeModal()
      fetchSkills()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (skill) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      icon: skill.icon || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return

    try {
      await skillsAPI.delete(id)
      toast.success('Skill deleted successfully')
      fetchSkills()
    } catch (error) {
      toast.error('Failed to delete skill')
    }
  }

  const openModal = () => setShowModal(true)

  const closeModal = () => {
    setShowModal(false)
    setEditingSkill(null)
    setFormData({
      name: '',
      category: 'frontend',
      proficiency: 50,
      icon: '',
    })
  }

  const categoryIcons = {
    frontend: FaCode,
    backend: FaServer,
    database: FaDatabase,
    devops: FaCog,
    tools: FaTools,
    other: FaLayerGroup,
  }

  const categoryColors = {
    frontend: 'from-blue-500 to-cyan-500',
    backend: 'from-green-500 to-emerald-500',
    database: 'from-purple-500 to-pink-500',
    devops: 'from-orange-500 to-red-500',
    tools: 'from-yellow-500 to-amber-500',
    other: 'from-gray-500 to-slate-500',
  }

  const categories = ['all', 'frontend', 'backend', 'database', 'devops', 'tools', 'other']

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === activeCategory)

  // Group skills by category for display
  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    const category = skill.category || 'other'
    if (!acc[category]) acc[category] = []
    acc[category].push(skill)
    return acc
  }, {})

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const getProgressColor = (value) => {
    if (value >= 80) return 'from-green-500 to-emerald-500'
    if (value >= 60) return 'from-blue-500 to-cyan-500'
    if (value >= 40) return 'from-yellow-500 to-amber-500'
    return 'from-orange-500 to-red-500'
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Manage Skills</h1>
          <p className="text-gray-400">Add and manage your technical skills</p>
        </div>
        <motion.button 
          onClick={openModal} 
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaPlus /> Add New Skill
        </motion.button>
      </motion.div>

      {/* Category Tabs */}
      <motion.div 
        className="flex flex-wrap gap-2 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {categories.map((category) => {
          const Icon = categoryIcons[category] || FaLayerGroup
          const count = category === 'all' ? skills.length : skills.filter(s => s.category === category).length
          return (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-dark-800/50 text-gray-400 hover:bg-dark-700/50 border border-dark-600'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {category !== 'all' && <Icon className="text-sm" />}
              <span className="capitalize">{category}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeCategory === category ? 'bg-white/20' : 'bg-dark-600'
              }`}>
                {count}
              </span>
            </motion.button>
          )
        })}
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredSkills.length === 0 ? (
        <motion.div 
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-dark-800/50 rounded-full flex items-center justify-center">
            <FaTools className="text-3xl text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No skills found</h3>
          <p className="text-gray-400 mb-6">Add your first skill to get started</p>
          <motion.button 
            onClick={openModal}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold"
            whileHover={{ scale: 1.02 }}
          >
            <FaPlus className="inline mr-2" /> Add Skill
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {Object.entries(groupedSkills).map(([category, categorySkills]) => {
            const Icon = categoryIcons[category] || FaLayerGroup
            const color = categoryColors[category] || categoryColors.other
            
            return (
              <motion.div key={category} variants={itemVariants} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
                    <Icon className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white capitalize">{category}</h2>
                  <span className="text-gray-500 text-sm">({categorySkills.length} skills)</span>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySkills.map((skill) => (
                    <motion.div
                      key={skill._id}
                      className="group bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-5 hover:border-blue-500/30 transition-all duration-300"
                      whileHover={{ y: -3 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {skill.icon ? (
                            <img src={skill.icon.startsWith('http') ? skill.icon : `${import.meta.env.VITE_API_URL}${skill.icon}`} alt={skill.name} className="w-10 h-10 rounded-lg object-contain" />
                          ) : (
                            <div className={`w-10 h-10 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
                              <span className="text-white font-bold">{skill.name[0]}</span>
                            </div>
                          )}
                          <div>
                            <h3 className="text-white font-semibold">{skill.name}</h3>
                            <p className="text-gray-400 text-sm capitalize">{skill.category}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(skill)}
                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(skill._id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-400">Proficiency</span>
                          <span className="text-sm font-semibold text-white">{skill.proficiency}%</span>
                        </div>
                        <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full bg-gradient-to-r ${getProgressColor(skill.proficiency)} rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.proficiency}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
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
              className="bg-dark-800 border border-dark-600 rounded-2xl w-full max-w-md"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-dark-600">
                <h2 className="text-2xl font-bold text-white">
                  {editingSkill ? 'Edit Skill' : 'Add New Skill'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Skill Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="e.g., React, Node.js"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Category *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['frontend', 'backend', 'database', 'devops', 'tools', 'other'].map((cat) => {
                      const Icon = categoryIcons[cat]
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat })}
                          className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                            formData.category === cat
                              ? `bg-gradient-to-r ${categoryColors[cat]} text-white`
                              : 'bg-dark-700/50 text-gray-400 hover:bg-dark-600/50 border border-dark-500'
                          }`}
                        >
                          <Icon />
                          <span className="text-xs capitalize">{cat}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Proficiency: {formData.proficiency}%</label>
                  <div className="relative">
                    <input
                      type="range"
                      name="proficiency"
                      value={formData.proficiency}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-purple-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Beginner</span>
                      <span>Expert</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Icon URL (optional)</label>
                  <input
                    type="url"
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="https://..."
                  />
                  {formData.icon && (
                    <div className="mt-3 flex items-center gap-3 p-3 bg-dark-700/50 rounded-xl">
                      <img src={formData.icon.startsWith('http') ? formData.icon : `${import.meta.env.VITE_API_URL}${formData.icon}`} alt="Icon Preview" className="w-10 h-10 rounded-lg object-contain" />
                      <span className="text-sm text-gray-400">Icon preview</span>
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
                    {editingSkill ? 'Update Skill' : 'Create Skill'}
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

export default Skills
