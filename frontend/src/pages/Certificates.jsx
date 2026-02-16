import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCertificate, FaExternalLinkAlt, FaDownload, FaCalendarAlt, FaSearch, FaTimes, FaAward, FaMicrosoft, FaAws } from 'react-icons/fa'
import { SiCoursera, SiUdemy, SiLinkedin, SiGoogle } from 'react-icons/si'
import { certificatesAPI } from '../services/apiService'

const Certificates = () => {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCertificate, setSelectedCertificate] = useState(null)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      setLoading(true)
      const data = await certificatesAPI.getAll()
      setCertificates(data.data?.certificates || data.certificates || [])
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'all', name: 'All', icon: FaAward },
    { id: 'coursera', name: 'Coursera', icon: SiCoursera },
    { id: 'udemy', name: 'Udemy', icon: SiUdemy },
    { id: 'linkedin', name: 'LinkedIn', icon: SiLinkedin },
    { id: 'google', name: 'Google', icon: SiGoogle },
    { id: 'microsoft', name: 'Microsoft', icon: FaMicrosoft },
    { id: 'aws', name: 'AWS', icon: FaAws },
    { id: 'other', name: 'Other', icon: FaCertificate },
  ]

  const categoryColors = {
    coursera: 'from-blue-500 to-blue-600',
    udemy: 'from-purple-500 to-purple-600',
    linkedin: 'from-blue-600 to-blue-700',
    google: 'from-red-500 to-yellow-500',
    microsoft: 'from-blue-400 to-green-400',
    aws: 'from-orange-500 to-yellow-500',
    other: 'from-gray-500 to-gray-600',
  }

  const filteredCertificates = certificates.filter(cert => {
    const matchesCategory = selectedCategory === 'all' || cert.category === selectedCategory
    const matchesSearch = cert.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.issuer?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 py-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <FaCertificate className="text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">My Achievements</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Certificates
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Professional certifications and courses I've completed to stay at the forefront of technology.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="max-w-md mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-800/50 border border-dark-600 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-dark-800/50 text-gray-400 border border-dark-600 hover:border-blue-500/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="text-sm" />
                {category.name}
              </motion.button>
            )
          })}
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Certificates Grid */}
            {filteredCertificates.length === 0 ? (
              <motion.div 
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FaCertificate className="text-6xl text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No certificates found</p>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredCertificates.map((certificate) => (
                  <motion.div
                    key={certificate._id}
                    variants={cardVariants}
                    className="group cursor-pointer"
                    onClick={() => setSelectedCertificate(certificate)}
                    layout
                  >
                    <div className="relative h-full bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
                      {/* Certificate Image/Preview */}
                      <div className="relative h-48 overflow-hidden">
                        {certificate.image ? (
                          <img
                            src={certificate.image.startsWith('http') ? certificate.image : `${import.meta.env.VITE_API_URL}${certificate.image}`}
                            alt={certificate.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className={`w-full h-full bg-gradient-to-br ${categoryColors[certificate.category] || categoryColors.other} flex items-center justify-center`}>
                            <FaCertificate className="text-6xl text-white/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 to-transparent"></div>
                        
                        {/* Category Badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${categoryColors[certificate.category] || categoryColors.other} text-white capitalize`}>
                            {certificate.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                          {certificate.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">{certificate.issuer}</p>
                        
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <FaCalendarAlt className="text-xs" />
                          <span>{formatDate(certificate.date)}</span>
                        </div>

                        {certificate.credentialId && (
                          <p className="text-gray-500 text-xs mt-2 truncate">
                            ID: {certificate.credentialId}
                          </p>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark-900 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2 justify-end">
                          {certificate.link && (
                            <motion.a
                              href={certificate.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-blue-500/20 rounded-lg text-blue-400 hover:bg-blue-500/30"
                              onClick={(e) => e.stopPropagation()}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FaExternalLinkAlt />
                            </motion.a>
                          )}
                          {certificate.pdfUrl && (
                            <motion.a
                              href={certificate.pdfUrl.startsWith('http') ? certificate.pdfUrl : `${import.meta.env.VITE_API_URL}${certificate.pdfUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 bg-green-500/20 rounded-lg text-green-400 hover:bg-green-500/30"
                              onClick={(e) => e.stopPropagation()}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <FaDownload />
                            </motion.a>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCertificate(null)}
          >
            <motion.div
              className="relative w-full max-w-2xl bg-dark-800 rounded-3xl overflow-hidden border border-dark-600"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 z-10 p-2 bg-dark-700/80 rounded-full text-gray-400 hover:text-white transition-colors"
                onClick={() => setSelectedCertificate(null)}
              >
                <FaTimes />
              </button>

              {/* Image */}
              <div className="relative h-64 md:h-80">
                {selectedCertificate.image ? (
                  <img
                    src={selectedCertificate.image.startsWith('http') ? selectedCertificate.image : `${import.meta.env.VITE_API_URL}${selectedCertificate.image}`}
                    alt={selectedCertificate.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${categoryColors[selectedCertificate.category] || categoryColors.other} flex items-center justify-center`}>
                    <FaCertificate className="text-8xl text-white/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-800 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-8 -mt-20 relative">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${categoryColors[selectedCertificate.category] || categoryColors.other} text-white capitalize mb-4`}>
                  {selectedCertificate.category}
                </span>
                
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedCertificate.title}</h2>
                <p className="text-blue-400 text-lg mb-4">{selectedCertificate.issuer}</p>
                
                <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt />
                    <span>{formatDate(selectedCertificate.date)}</span>
                  </div>
                  {selectedCertificate.credentialId && (
                    <span>ID: {selectedCertificate.credentialId}</span>
                  )}
                </div>

                {selectedCertificate.description && (
                  <p className="text-gray-400 mb-6">{selectedCertificate.description}</p>
                )}

                <div className="flex gap-3">
                  {selectedCertificate.link && (
                    <a
                      href={selectedCertificate.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    >
                      <FaExternalLinkAlt /> View Certificate
                    </a>
                  )}
                  {selectedCertificate.pdfUrl && (
                    <a
                      href={selectedCertificate.pdfUrl.startsWith('http') ? selectedCertificate.pdfUrl : `${import.meta.env.VITE_API_URL}${selectedCertificate.pdfUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    >
                      <FaDownload /> Download PDF
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

export default Certificates
