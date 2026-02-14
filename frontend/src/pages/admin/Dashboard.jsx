import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaProjectDiagram, FaStar, FaEnvelope, FaChartLine, FaUser, FaFileAlt, FaArrowRight, FaCog } from 'react-icons/fa'
import { projectsAPI, skillsAPI, messagesAPI } from '../../services/apiService'

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentMessages, setRecentMessages] = useState([])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const [projectsData, skillsData, messagesData] = await Promise.all([
        projectsAPI.getAll(),
        skillsAPI.getAll(),
        messagesAPI.getAll(),
      ])

      const messages = messagesData.data.messages || []
      setRecentMessages(messages.slice(0, 3))

      setStats({
        projects: projectsData.data.results || projectsData.data.projects?.length || 0,
        skills: skillsData.data.results || skillsData.data.skills?.length || 0,
        messages: messagesData.data.results || messages.length || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  const statCards = [
    { title: 'Total Projects', value: stats.projects, icon: FaProjectDiagram, color: 'from-blue-500 to-cyan-500', link: '/admin/projects' },
    { title: 'Total Skills', value: stats.skills, icon: FaStar, color: 'from-amber-500 to-orange-500', link: '/admin/skills' },
    { title: 'Messages', value: stats.messages, icon: FaEnvelope, color: 'from-green-500 to-emerald-500', link: '/admin/messages' },
    { title: 'Portfolio Views', value: '1.2K', icon: FaChartLine, color: 'from-purple-500 to-pink-500', link: null },
  ]

  const quickActions = [
    { title: 'Manage Projects', desc: 'Add, edit, or remove projects', icon: FaProjectDiagram, link: '/admin/projects', color: 'from-blue-500 to-cyan-500' },
    { title: 'Manage Skills', desc: 'Update your technical skills', icon: FaStar, link: '/admin/skills', color: 'from-amber-500 to-orange-500' },
    { title: 'View Messages', desc: 'Check contact submissions', icon: FaEnvelope, link: '/admin/messages', color: 'from-green-500 to-emerald-500' },
    { title: 'Edit About', desc: 'Update bio and CV', icon: FaUser, link: '/admin/about', color: 'from-purple-500 to-pink-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 p-6">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's an overview of your portfolio.</p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <Link to={stat.link || '#'} className="block">
                  <div className="relative bg-dark-800/80 backdrop-blur-sm border border-dark-600 rounded-2xl p-6 overflow-hidden hover:border-blue-500/30 transition-all duration-300">
                    {/* Background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                    
                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">{stat.title}</p>
                        <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                      </div>
                      <div className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className="text-2xl text-white" />
                      </div>
                    </div>
                    
                    {stat.link && (
                      <div className="mt-4 pt-4 border-t border-dark-600">
                        <span className="text-sm text-blue-400 group-hover:text-blue-300 flex items-center gap-2">
                          View Details <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link 
                    to={action.link}
                    className="group block bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-5 hover:border-blue-500/30 transition-all duration-300"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="text-xl text-white" />
                    </div>
                    <h3 className="text-white font-semibold mb-1">{action.title}</h3>
                    <p className="text-gray-400 text-sm">{action.desc}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Messages */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Recent Messages</h2>
              <Link to="/admin/messages" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2">
                View All <FaArrowRight />
              </Link>
            </div>
            
            {recentMessages.length === 0 ? (
              <div className="bg-dark-800/50 border border-dark-600 rounded-xl p-8 text-center">
                <FaEnvelope className="text-4xl text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No messages yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentMessages.map((message, index) => (
                  <motion.div
                    key={message._id}
                    className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-5 hover:border-blue-500/30 transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {message.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{message.name}</h4>
                          <p className="text-gray-400 text-sm">{message.email}</p>
                          <p className="text-gray-300 text-sm mt-2 line-clamp-2">{message.message}</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Dashboard
