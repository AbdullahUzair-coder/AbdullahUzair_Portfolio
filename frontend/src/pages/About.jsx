import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaCode, FaServer, FaTools, FaGraduationCap, FaBriefcase, FaRocket, FaHeart, FaDownload } from 'react-icons/fa'
import { SiReact, SiNodedotjs, SiMongodb, SiTailwindcss, SiJavascript, SiTypescript, SiGit, SiDocker } from 'react-icons/si'
import { settingsAPI } from '../services/apiService'

const About = () => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get()
      // Handle both nested response formats
      const data = response?.data?.settings || response?.settings || response
      console.log('About page - Settings data:', data)
      console.log('About page - Profile image URL:', data?.profileImage)
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const scaleVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  const highlights = [
    { icon: FaBriefcase, title: "Experience", value: "3+", subtitle: "Years of Development", color: "from-blue-500 to-cyan-500" },
    { icon: FaRocket, title: "Projects", value: "20+", subtitle: "Successfully Delivered", color: "from-purple-500 to-pink-500" },
    { icon: FaHeart, title: "Focus", value: "100%", subtitle: "Full Stack Development", color: "from-orange-500 to-red-500" },
  ]

  const techStack = [
    { 
      category: "Frontend", 
      icon: FaCode, 
      color: "from-blue-500 to-cyan-400",
      techs: [
        { name: "React", icon: SiReact },
        { name: "JavaScript", icon: SiJavascript },
        { name: "TypeScript", icon: SiTypescript },
        { name: "Tailwind CSS", icon: SiTailwindcss },
      ]
    },
    { 
      category: "Backend", 
      icon: FaServer, 
      color: "from-green-500 to-emerald-400",
      techs: [
        { name: "Node.js", icon: SiNodedotjs },
        { name: "MongoDB", icon: SiMongodb },
        { name: "Express.js", icon: SiNodedotjs },
        { name: "REST APIs", icon: FaServer },
      ]
    },
    { 
      category: "Tools", 
      icon: FaTools, 
      color: "from-purple-500 to-pink-400",
      techs: [
        { name: "Git", icon: SiGit },
        { name: "Docker", icon: SiDocker },
        { name: "CI/CD", icon: FaRocket },
        { name: "AWS", icon: FaServer },
      ]
    },
  ]

  // Use dynamic experience from settings or fallback to default
  const timeline = settings?.experience?.length > 0 
    ? settings.experience.map(exp => ({
        year: exp.year,
        title: exp.title,
        desc: exp.description
      }))
    : [
        { year: "2024", title: "Senior Full Stack Developer", desc: "Leading development teams and architecting solutions" },
        { year: "2023", title: "Full Stack Developer", desc: "Building scalable web applications" },
        { year: "2022", title: "Frontend Developer", desc: "Creating responsive user interfaces" },
        { year: "2021", title: "Started Coding Journey", desc: "Learning fundamentals of web development" },
      ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <motion.div 
          className="container mx-auto px-4 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Profile Image */}
            <motion.div 
              className="lg:w-1/3"
              variants={scaleVariants}
            >
              <div className="relative group">
                {/* Glowing ring */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-spin-slow"></div>
                
                {/* Profile card */}
                <div className="relative w-64 h-64 mx-auto bg-gradient-to-br from-dark-700 to-dark-800 rounded-full border-4 border-dark-600 shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
                  {settings?.profileImage ? (
                    <img 
                      src={`${import.meta.env.VITE_API_URL}${settings.profileImage}`} 
                      alt={settings?.name || 'Profile'} 
                      className="w-full h-full object-cover"
                      onLoad={() => console.log('Image loaded successfully:', `${import.meta.env.VITE_API_URL}${settings.profileImage}`)}
                      onError={(e) => console.error('Image failed to load:', e.target.src)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {settings?.name ? settings.name.split(' ').map(n => n[0]).join('') : 'AU'}
                      </span>
                    </div>
                  )}
                  {/* Decorative elements */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-blue-500/20 to-transparent"></div>
                </div>

                {/* Status badge */}
                {(settings?.availability !== false) && (
                  <motion.div 
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 rounded-full shadow-lg"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-white text-sm font-medium flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      Available for Work
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* About Text */}
            <motion.div 
              className="lg:w-2/3 text-center lg:text-left"
              variants={itemVariants}
            >
              <motion.span 
                className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-4"
                whileHover={{ scale: 1.05 }}
              >
                👋 Welcome to my portfolio
              </motion.span>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-white">Hi, I'm </span>
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {settings?.name || 'Abdullah Uzair'}
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                A passionate <span className="text-blue-400 font-semibold">{settings?.title || 'Full Stack Developer'}</span> crafting 
                {settings?.bio || ' beautiful and functional web applications. I transform ideas into elegant, scalable digital solutions that make a difference.'}
              </p>
              
              <p className="text-gray-400 mb-8 leading-relaxed">
                {settings?.shortBio || 'My journey in web development began with curiosity and evolved into a deep passion for creating seamless user experiences. I specialize in modern technologies like React, Node.js, and MongoDB, always staying at the forefront of web innovation.'}
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                {settings?.cvUrl && (
                  <motion.a 
                    href={`${import.meta.env.VITE_API_URL}${settings.cvUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium shadow-lg shadow-blue-500/25 flex items-center gap-2"
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaDownload /> Download CV
                  </motion.a>
                )}
                <motion.a 
                  href="/contact"
                  className="px-6 py-3 bg-dark-700 border border-dark-500 text-white rounded-lg font-medium hover:border-blue-500/50 transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Let's Talk 💬
                </motion.a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {highlights.map((item, index) => (
              <motion.div
                key={index}
                className="relative group"
                variants={scaleVariants}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${item.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                <div className="relative bg-dark-800/80 backdrop-blur-sm border border-dark-600 rounded-2xl p-8 text-center hover:border-blue-500/30 transition-all duration-500 group-hover:-translate-y-2">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <item.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-4xl font-bold text-white mb-2">{item.value}</h3>
                  <p className="text-gray-400 font-medium">{item.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-400 font-medium mb-2 block">My Arsenal</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Technologies I Work With</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              I leverage cutting-edge technologies to build robust, scalable, and beautiful applications
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {techStack.map((stack, index) => (
              <motion.div
                key={index}
                className="group"
                variants={itemVariants}
              >
                <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-2xl p-6 h-full hover:border-blue-500/30 transition-all duration-500 group-hover:-translate-y-2">
                  <div className={`w-14 h-14 bg-gradient-to-r ${stack.color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stack.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-6">{stack.category}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {stack.techs.map((tech, techIndex) => (
                      <motion.div
                        key={techIndex}
                        className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg hover:bg-dark-600/50 transition-colors"
                        whileHover={{ scale: 1.05, x: 5 }}
                      >
                        <tech.icon className="text-xl text-gray-400 group-hover:text-blue-400 transition-colors" />
                        <span className="text-gray-300 text-sm">{tech.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-blue-400 font-medium mb-2 block">My Journey</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Career Timeline</h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                className="relative pl-8 pb-12 last:pb-0"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {/* Line */}
                {index !== timeline.length - 1 && (
                  <div className="absolute left-[11px] top-8 w-0.5 h-full bg-gradient-to-b from-blue-500 to-transparent"></div>
                )}
                
                {/* Dot */}
                <div className="absolute left-0 top-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-dark-800 shadow-lg shadow-blue-500/30"></div>
                
                {/* Content */}
                <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-xl p-6 ml-4 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1">
                  <span className="text-blue-400 font-semibold">{item.year}</span>
                  <h3 className="text-xl font-bold text-white mt-1">{item.title}</h3>
                  <p className="text-gray-400 mt-2">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="relative bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-dark-600 rounded-3xl p-12 text-center overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Background decoration */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Let's Build Something Amazing Together
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              </p>
              <motion.a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25"
                whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                Start a Conversation
                <span className="text-xl">→</span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About
