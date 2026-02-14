import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCode, FaServer, FaDatabase, FaTools, FaCogs, FaLayerGroup, FaStar } from 'react-icons/fa'
import { skillsAPI } from '../services/apiService'

const Skills = () => {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [hoveredSkill, setHoveredSkill] = useState(null)

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      setLoading(true)
      const data = await skillsAPI.getAll()
      setSkills(data.data?.skills || data.skills || [])
    } catch (error) {
      console.error('Error fetching skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const categoryConfig = {
    frontend: { icon: FaCode, color: 'from-blue-500 to-cyan-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' },
    backend: { icon: FaServer, color: 'from-green-500 to-emerald-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30' },
    database: { icon: FaDatabase, color: 'from-purple-500 to-pink-400', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30' },
    devops: { icon: FaCogs, color: 'from-orange-500 to-amber-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30' },
    tools: { icon: FaTools, color: 'from-red-500 to-rose-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30' },
    other: { icon: FaLayerGroup, color: 'from-gray-500 to-slate-400', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500/30' }
  }

  const categories = ['all', ...new Set(skills.map(s => s.category?.toLowerCase() || 'other'))]

  const filteredSkills = activeCategory === 'all' 
    ? skills 
    : skills.filter(s => (s.category?.toLowerCase() || 'other') === activeCategory)

  const groupedSkills = filteredSkills.reduce((acc, skill) => {
    const category = skill.category?.toLowerCase() || 'other'
    if (!acc[category]) acc[category] = []
    acc[category].push(skill)
    return acc
  }, {})

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 12 } }
  }

  const getGradientClass = (color) => `bg-gradient-to-r ${color}`

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          className="text-center mb-16"
        >
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }} 
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6"
          >
            <FaStar className="animate-pulse" /> Technical Expertise
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-white">Skills & </span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Technologies</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">The tools and technologies I use to bring ideas to life</p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }} 
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => {
            const config = categoryConfig[category] || categoryConfig.other
            const isActive = activeCategory === category
            const CategoryIcon = config.icon
            
            return (
              <motion.button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 rounded-xl font-medium capitalize flex items-center gap-2 transition-all duration-300 ${
                  isActive 
                    ? `bg-gradient-to-r ${config.color} text-white shadow-lg` 
                    : 'bg-dark-800/50 text-gray-400 hover:bg-dark-700/50 border border-dark-600 hover:border-dark-500'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category !== 'all' && CategoryIcon && <CategoryIcon className="text-sm" />}
                {category === 'all' ? 'All Skills' : category}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin absolute top-2 left-2" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
            </div>
            <p className="text-gray-400 mt-6">Loading skills...</p>
          </div>
        ) : filteredSkills.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🎯</div>
            <p className="text-xl text-gray-400">Skills will be added soon!</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory} 
              variants={containerVariants} 
              initial="hidden" 
              animate="visible" 
              exit="hidden" 
              className="space-y-12"
            >
              {Object.entries(groupedSkills).map(([category, categorySkills]) => {
                const config = categoryConfig[category] || categoryConfig.other
                const CategoryIcon = config.icon

                return (
                  <motion.section key={category} variants={itemVariants} className="relative">
                    {/* Category Header */}
                    <div className="flex items-center gap-4 mb-8">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${config.color} flex items-center justify-center shadow-lg`}>
                        <CategoryIcon className="text-white text-xl" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white capitalize">{category}</h2>
                        <p className="text-gray-400 text-sm">{categorySkills.length} skill{categorySkills.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>

                    {/* Skills Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {categorySkills.map((skill, index) => (
                        <motion.div
                          key={skill._id}
                          variants={itemVariants}
                          onMouseEnter={() => setHoveredSkill(skill._id)}
                          onMouseLeave={() => setHoveredSkill(null)}
                          className="group relative"
                        >
                          <div className={`relative p-5 rounded-2xl bg-dark-800/50 backdrop-blur-sm border ${config.borderColor} hover:border-opacity-100 border-opacity-50 transition-all duration-500 hover:shadow-xl`}>
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${config.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                            
                            {/* Skill Header */}
                            <div className="flex items-center gap-4 mb-4 relative z-10">
                              <div className={`w-12 h-12 rounded-xl ${config.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                {skill.icon ? (
                                  <img src={skill.icon} alt={skill.name} className="w-7 h-7 object-contain" />
                                ) : (
                                  <span className={`text-xl font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
                                    {skill.name.charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-white">{skill.name}</h3>
                                <span className="text-xs text-gray-500 capitalize">{category}</span>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="relative z-10">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-400">Proficiency</span>
                                <motion.span 
                                  className={`text-sm font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: index * 0.05 + 0.3 }}
                                >
                                  {skill.proficiency || 0}%
                                </motion.span>
                              </div>
                              <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                                <motion.div
                                  className={`h-full rounded-full bg-gradient-to-r ${config.color}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${skill.proficiency || 0}%` }}
                                  transition={{ delay: index * 0.05 + 0.2, duration: 1, ease: "easeOut" }}
                                />
                              </div>
                            </div>

                            {/* Corner Accent */}
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-10 rounded-tr-2xl rounded-bl-full transition-all duration-500`}></div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>
                )
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Stats Section */}
        {!loading && skills.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5 }} 
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: 'Total Skills', value: skills.length, color: 'from-blue-500 to-cyan-400' },
              { label: 'Categories', value: categories.length - 1, color: 'from-purple-500 to-pink-400' },
              { label: 'Avg Proficiency', value: `${Math.round(skills.reduce((acc, s) => acc + (s.proficiency || 0), 0) / skills.length)}%`, color: 'from-green-500 to-emerald-400' },
              { label: 'Expert Level', value: skills.filter(s => (s.proficiency || 0) >= 80).length, color: 'from-orange-500 to-amber-400' },
            ].map((stat, index) => (
              <motion.div 
                key={stat.label} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.6 + index * 0.1 }} 
                className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-2xl p-6 text-center group hover:border-dark-500 transition-all duration-300"
              >
                <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Skills
