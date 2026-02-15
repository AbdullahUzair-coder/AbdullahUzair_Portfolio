import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaArrowRight, FaCode, FaServer, FaLaptopCode, FaRocket, FaDownload } from 'react-icons/fa'
import { settingsAPI } from '../services/apiService'

const Home = () => {
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get()
      const data = response?.data?.settings || response?.settings || response
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const features = [
    {
      icon: <FaCode className="w-8 h-8" />,
      title: "Frontend Development",
      description: "Creating responsive and interactive user interfaces with React, Vue, and modern CSS frameworks.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaServer className="w-8 h-8" />,
      title: "Backend Development",
      description: "Building robust APIs and server-side applications with Node.js, Express, and databases.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <FaLaptopCode className="w-8 h-8" />,
      title: "Full Stack Solutions",
      description: "Delivering end-to-end web applications with seamless integration and deployment.",
      color: "from-green-500 to-emerald-500"
    }
  ]

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Hero Section with Gradient */}
      <section className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-primary-950 to-dark-900">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        <div className="relative container-custom py-20 md:py-32">
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Hero Content */}
            <motion.div variants={itemVariants} className="space-y-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-block"
              >
                <span className="px-4 py-2 bg-primary-600/20 border border-primary-600/30 rounded-full text-primary-400 text-sm font-medium">
                  👋 Welcome to my portfolio
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Hi, I'm{' '}
                <span className="bg-gradient-to-r from-primary-400 via-blue-500 to-primary-600 bg-clip-text text-transparent animate-gradient bg-300%">
                  {settings?.name || 'Abdullah Uzair'}
                </span>
              </h1>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-300">
                {settings?.title || 'Full Stack Developer'}
              </h2>

              <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl">
                {settings?.shortBio || 'I build exceptional digital experiences with modern web technologies. Passionate about creating clean, efficient, and user-friendly applications.'}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                {settings?.cvUrl && (
                  <a
                    href={`${import.meta.env.VITE_API_URL}${settings.cvUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group btn btn-primary flex items-center gap-2"
                  >
                    <FaDownload className="group-hover:translate-y-1 transition-transform" />
                    Download CV
                  </a>
                )}
                <Link
                  to="/projects"
                  className="group btn btn-secondary flex items-center gap-2"
                >
                  View My Work
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/contact" className="btn btn-secondary">
                  Get In Touch
                </Link>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4 pt-6">
                <span className="text-gray-400">Connect with me:</span>
                <a
                  href="https://github.com/AbdullahUzair-coder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center bg-dark-800 hover:bg-primary-600 border border-dark-700 hover:border-primary-600 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-glow"
                >
                  <FaGithub className="w-6 h-6" />
                </a>
                <a
                  href="https://linkedin.com/in/abdullah-uzair"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 flex items-center justify-center bg-dark-800 hover:bg-primary-600 border border-dark-700 hover:border-primary-600 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-glow"
                >
                  <FaLinkedin className="w-6 h-6" />
                </a>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              variants={itemVariants}
              className="relative"
            >
              <div className="relative">
                {/* Floating Code Card */}
                <div className="bg-dark-800 border border-dark-700 rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="space-y-3 font-mono text-sm">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="text-purple-400"
                    >
                      <span className="text-pink-500">const</span> developer = {'{'} 
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1, duration: 0.5 }}
                      className="pl-6 text-blue-400"
                    >
                      name: <span className="text-green-400">'Abdullah'</span>,
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                      className="pl-6 text-blue-400"
                    >
                      skills: <span className="text-yellow-400">['React', 'Node.js', 'MongoDB']</span>,
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4, duration: 0.5 }}
                      className="pl-6 text-blue-400"
                    >
                      passion: <span className="text-green-400">'Building amazing things'</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6, duration: 0.5 }}
                      className="text-purple-400"
                    >
                      {'}'}
                    </motion.div>
                  </div>
                </div>

                {/* Floating Badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 bg-primary-600 text-white px-4 py-2 rounded-full font-medium shadow-glow"
                >
                  <FaRocket className="inline mr-2" />
                  Available for work
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center">
            <div className="w-1.5 h-3 bg-primary-500 rounded-full mt-2 animate-bounce"></div>
          </div>
        </motion.div>
      </section>

      {/* What I Do Section */}
      <section className="py-20 bg-dark-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="section-title gradient-text">What I Do</h2>
            <p className="section-subtitle">
              Specialized in building modern web applications from concept to deployment
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group"
              >
                <div className="card card-hover h-full">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-primary-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
