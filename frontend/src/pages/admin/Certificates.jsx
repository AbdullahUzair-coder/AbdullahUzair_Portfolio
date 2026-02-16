import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlus, FaEdit, FaTrash, FaExternalLinkAlt, FaTimes, FaCertificate, FaSearch, FaDownload, FaUpload } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { certificatesAPI } from '../../services/apiService'

const Certificates = () => {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCertificate, setEditingCertificate] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    description: '',
    date: '',
    credentialId: '',
    link: '',
    category: 'other',
    isActive: true,
  })
  const [imageFile, setImageFile] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      setLoading(true)
      const data = await certificatesAPI.getAll({ all: true })
      setCertificates(data.data?.certificates || data.certificates || [])
    } catch (error) {
      console.error('Error fetching certificates:', error)
      toast.error('Failed to fetch certificates')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'coursera', name: 'Coursera' },
    { id: 'udemy', name: 'Udemy' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'google', name: 'Google' },
    { id: 'microsoft', name: 'Microsoft' },
    { id: 'aws', name: 'AWS' },
    { id: 'other', name: 'Other' },
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePdfChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPdfFile(file)
    }
  }

  const handleEdit = (certificate) => {
    setEditingCertificate(certificate)
    setFormData({
      title: certificate.title || '',
      issuer: certificate.issuer || '',
      description: certificate.description || '',
      date: certificate.date ? new Date(certificate.date).toISOString().split('T')[0] : '',
      credentialId: certificate.credentialId || '',
      link: certificate.link || '',
      category: certificate.category || 'other',
      isActive: certificate.isActive !== false,
    })
    if (certificate.image) {
      setImagePreview(certificate.image.startsWith('http') ? certificate.image : `${import.meta.env.VITE_API_URL}${certificate.image}`)
    }
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return

    try {
      await certificatesAPI.delete(id)
      toast.success('Certificate deleted successfully')
      fetchCertificates()
    } catch (error) {
      console.error('Error deleting certificate:', error)
      toast.error('Failed to delete certificate')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      issuer: '',
      description: '',
      date: '',
      credentialId: '',
      link: '',
      category: 'other',
      isActive: true,
    })
    setImageFile(null)
    setPdfFile(null)
    setImagePreview(null)
    setEditingCertificate(null)
    setShowModal(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const submitData = new FormData()
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key])
      })

      if (imageFile) {
        submitData.append('image', imageFile)
      }
      if (pdfFile) {
        submitData.append('pdf', pdfFile)
      }

      if (editingCertificate) {
        await certificatesAPI.update(editingCertificate._id, submitData)
        toast.success('Certificate updated successfully')
      } else {
        await certificatesAPI.create(submitData)
        toast.success('Certificate created successfully')
      }

      resetForm()
      fetchCertificates()
    } catch (error) {
      console.error('Error saving certificate:', error)
      toast.error(error.response?.data?.message || 'Failed to save certificate')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Certificates</h1>
          <p className="text-gray-400">Manage your professional certifications</p>
        </div>
        <motion.button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaPlus /> Add Certificate
        </motion.button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Certificates Grid */}
          {filteredCertificates.length === 0 ? (
            <div className="text-center py-20">
              <FaCertificate className="text-6xl text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No certificates found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertificates.map((certificate) => (
                <motion.div
                  key={certificate._id}
                  className="group bg-dark-800/50 border border-dark-600 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -3 }}
                >
                  {/* Image */}
                  <div className="h-40 bg-gradient-to-br from-dark-700 to-dark-800 relative overflow-hidden">
                    {certificate.image ? (
                      <img
                        src={certificate.image.startsWith('http') ? certificate.image : `${import.meta.env.VITE_API_URL}${certificate.image}`}
                        alt={certificate.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${categoryColors[certificate.category] || categoryColors.other} flex items-center justify-center`}>
                        <FaCertificate className="text-5xl text-white/30" />
                      </div>
                    )}
                    
                    {/* Status & Actions */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${certificate.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {certificate.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(certificate)}
                        className="p-2 bg-blue-500/80 rounded-lg text-white hover:bg-blue-500"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(certificate._id)}
                        className="p-2 bg-red-500/80 rounded-lg text-white hover:bg-red-500"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${categoryColors[certificate.category] || categoryColors.other} text-white capitalize mb-2`}>
                      {certificate.category}
                    </span>
                    <h3 className="text-white font-semibold mb-1 line-clamp-1">{certificate.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{certificate.issuer}</p>
                    <p className="text-gray-500 text-xs">{formatDate(certificate.date)}</p>
                    
                    <div className="flex gap-2 mt-3">
                      {certificate.link && (
                        <a
                          href={certificate.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                        >
                          <FaExternalLinkAlt className="text-xs" /> View
                        </a>
                      )}
                      {certificate.pdfUrl && (
                        <a
                          href={certificate.pdfUrl.startsWith('http') ? certificate.pdfUrl : `${import.meta.env.VITE_API_URL}${certificate.pdfUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1"
                        >
                          <FaDownload className="text-xs" /> PDF
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={resetForm}
          >
            <motion.div
              className="w-full max-w-2xl bg-dark-800 rounded-3xl border border-dark-600 my-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-dark-600">
                <h2 className="text-2xl font-bold text-white">
                  {editingCertificate ? 'Edit Certificate' : 'Add Certificate'}
                </h2>
                <button onClick={resetForm} className="text-gray-400 hover:text-white">
                  <FaTimes size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      placeholder="Certificate title"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Issuer *</label>
                    <input
                      type="text"
                      name="issuer"
                      value={formData.issuer}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      placeholder="e.g., Coursera, Google"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="Brief description of the certificate"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500"
                    >
                      {categories.slice(1).map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Credential ID</label>
                    <input
                      type="text"
                      name="credentialId"
                      value={formData.credentialId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      placeholder="Certificate ID"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Verification Link</label>
                    <input
                      type="url"
                      name="link"
                      value={formData.link}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Certificate Image</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-gray-400 cursor-pointer hover:border-blue-500 transition-colors">
                      <FaUpload />
                      <span>Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    {imagePreview && (
                      <div className="w-20 h-20 rounded-lg overflow-hidden">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>

                {/* PDF Upload */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Certificate PDF</label>
                  <label className="flex items-center gap-2 px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-gray-400 cursor-pointer hover:border-blue-500 transition-colors w-fit">
                    <FaUpload />
                    <span>{pdfFile ? pdfFile.name : 'Upload PDF'}</span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handlePdfChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-5 h-5 bg-dark-700 border-dark-500 rounded text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-gray-400">Active (visible on public site)</label>
                </div>

                <div className="flex gap-4 pt-4">
                  <motion.button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 bg-dark-700 text-gray-300 rounded-xl font-medium hover:bg-dark-600"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editingCertificate ? 'Update' : 'Create'}
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

export default Certificates
