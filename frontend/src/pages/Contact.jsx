import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaGithub, FaLinkedin, FaTwitter, FaCheckCircle } from 'react-icons/fa'
import { messagesAPI, settingsAPI } from '../services/apiService'
import { toast } from 'react-toastify'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState(null)
  const [submitted, setSubmitted] = useState(false)
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields')
      return
    }

    if (formData.message.length < 10) {
      toast.error('Message must be at least 10 characters')
      return
    }

    try {
      setLoading(true)
      await messagesAPI.submit(formData)
      setSubmitted(true)
      toast.success('Message sent successfully!')
      
      setTimeout(() => {
        setSubmitted(false)
        setFormData({ name: '', email: '', message: '' })
      }, 3000)
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send message'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
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

  const contactInfo = [
    { 
      icon: FaEnvelope, 
      label: "Email", 
      value: settings?.email || "abdullahozair000@gmail.com", 
      href: `mailto:${settings?.email || "abdullahozair000@gmail.com"}`, 
      color: "from-blue-500 to-cyan-500" 
    },
    { 
      icon: FaPhone, 
      label: "Phone", 
      value: settings?.phone || "+1 (234) 567-890", 
      href: settings?.phone ? `tel:${settings.phone}` : "tel:+1234567890", 
      color: "from-green-500 to-emerald-500" 
    },
    { 
      icon: FaMapMarkerAlt, 
      label: "Location", 
      value: settings?.location || "Your City, Country", 
      href: null, 
      color: "from-purple-500 to-pink-500" 
    },
  ]

  const socialLinks = [
    { 
      icon: FaGithub, 
      label: "GitHub", 
      href: settings?.socialLinks?.github || "https://github.com", 
      color: "hover:text-gray-100" 
    },
    { 
      icon: FaLinkedin, 
      label: "LinkedIn", 
      href: settings?.socialLinks?.linkedin || "https://linkedin.com", 
      color: "hover:text-blue-400" 
    },
    // { 
    //   icon: FaTwitter, 
    //   label: "Twitter", 
    //   href: settings?.socialLinks?.twitter || "https://twitter.com", 
    //   color: "hover:text-cyan-400" 
    // },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.span 
              className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-4"
              whileHover={{ scale: 1.05 }}
            >
              💬 Let's Connect
            </motion.span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-white">Get In </span>
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Have a project in mind? I'd love to hear from you. Let's create something amazing together.
            </p>
          </motion.div>

          <motion.div 
            className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Contact Info Side */}
            <motion.div 
              className="lg:col-span-2 space-y-6"
              variants={itemVariants}
            >
              {/* Info Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-dark-800/80 backdrop-blur-sm border border-dark-600 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Contact Information</h2>
                  <p className="text-gray-400 mb-8">Fill up the form and I'll get back to you within 24 hours.</p>
                  
                  <div className="space-y-6">
                    {contactInfo.map((item, index) => (
                      <motion.div 
                        key={index}
                        className="flex items-center gap-4 group/item cursor-pointer"
                        whileHover={{ x: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-transform duration-300`}>
                          <item.icon className="text-white text-lg" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">{item.label}</p>
                          {item.href ? (
                            <a href={item.href} className="text-white font-medium hover:text-blue-400 transition-colors">
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-white font-medium">{item.value}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Social Links */}
                  <div className="mt-10 pt-8 border-t border-dark-600">
                    <p className="text-gray-400 text-sm mb-4">Connect with me</p>
                    <div className="flex gap-4">
                      {socialLinks.map((social, index) => (
                        <motion.a
                          key={index}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-12 h-12 bg-dark-700 rounded-xl flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:bg-dark-600`}
                          whileHover={{ scale: 1.1, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <social.icon className="text-xl" />
                        </motion.a>
                      ))}
                    </div>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-tl-full"></div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              className="lg:col-span-3"
              variants={itemVariants}
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-dark-800/80 backdrop-blur-sm border border-dark-600 rounded-2xl p-8">
                  {submitted ? (
                    <motion.div 
                      className="text-center py-16"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.div
                        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 0.5 }}
                      >
                        <FaCheckCircle className="text-4xl text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                      <p className="text-gray-400">Thank you for reaching out. I'll get back to you soon!</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Name Field */}
                        <div className="relative">
                          <label 
                            htmlFor="name" 
                            className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                              focusedField === 'name' || formData.name 
                                ? '-top-2 text-xs text-blue-400 bg-dark-800 px-2' 
                                : 'top-4 text-gray-400'
                            }`}
                          >
                            Your Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full px-4 py-4 bg-dark-700/50 border border-dark-500 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                            required
                            minLength={2}
                            maxLength={100}
                          />
                        </div>

                        {/* Email Field */}
                        <div className="relative">
                          <label 
                            htmlFor="email" 
                            className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                              focusedField === 'email' || formData.email 
                                ? '-top-2 text-xs text-blue-400 bg-dark-800 px-2' 
                                : 'top-4 text-gray-400'
                            }`}
                          >
                            Your Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            className="w-full px-4 py-4 bg-dark-700/50 border border-dark-500 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                            required
                          />
                        </div>
                      </div>

                      {/* Message Field */}
                      <div className="relative">
                        <label 
                          htmlFor="message" 
                          className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                            focusedField === 'message' || formData.message 
                              ? '-top-2 text-xs text-blue-400 bg-dark-800 px-2 z-10' 
                              : 'top-4 text-gray-400'
                          }`}
                        >
                          Your Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => setFocusedField('message')}
                          onBlur={() => setFocusedField(null)}
                          className="w-full px-4 py-4 bg-dark-700/50 border border-dark-500 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 resize-none"
                          required
                          minLength={10}
                          maxLength={1000}
                          rows={6}
                        />
                        <span className="absolute bottom-3 right-3 text-xs text-gray-500">
                          {formData.message.length}/1000
                        </span>
                      </div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                        whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)" }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <FaPaperPlane className="text-lg" />
                            Send Message
                          </>
                        )}
                      </motion.button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Map/CTA Section */}
      <section className="py-16">
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
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl mb-6"
              >
                🚀
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                I'm currently available for freelance work and exciting new opportunities. 
                Let's discuss how I can help bring your ideas to life.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <motion.a
                  href="mailto:abdullahozair000@gmail.com"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25"
                  whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaEnvelope />
                  Email Me Directly
                </motion.a>
                <motion.a
                  href="/projects"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-dark-700 border border-dark-500 text-white rounded-xl font-semibold hover:border-blue-500/50 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View My Work →
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact
