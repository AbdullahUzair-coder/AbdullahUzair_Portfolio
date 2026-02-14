import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaSave, FaUpload, FaFileAlt, FaUser, FaBriefcase, FaGraduationCap, FaPlus, FaTrash, FaCheck, FaTimes, FaImage } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { settingsAPI } from '../../services/apiService'

const About = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState({ image: false, cv: false })
  const [activeTab, setActiveTab] = useState('bio')
  
  const [bioData, setBioData] = useState({
    name: '',
    title: '',
    bio: '',
    shortBio: '',
    email: '',
    phone: '',
    location: '',
    availability: true,
    heroTitle: '',
    heroSubtitle: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      website: ''
    }
  })

  const [experience, setExperience] = useState([])
  const [profileImage, setProfileImage] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState('')
  const [cvFile, setCvFile] = useState(null)
  const [cvFileName, setCvFileName] = useState('')
  const [currentCvUrl, setCurrentCvUrl] = useState('')

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await settingsAPI.get()
      // Handle both nested response formats
      const settings = response?.data?.settings || response?.settings || null
      
      if (settings) {
        setBioData({
          name: settings.name || '',
          title: settings.title || '',
          bio: settings.bio || '',
          shortBio: settings.shortBio || '',
          email: settings.email || '',
          phone: settings.phone || '',
          location: settings.location || '',
          availability: settings.availability ?? true,
          heroTitle: settings.heroTitle || '',
          heroSubtitle: settings.heroSubtitle || '',
          socialLinks: settings.socialLinks || {
            github: '',
            linkedin: '',
            twitter: '',
            website: ''
          }
        })
        
        if (settings.experience && settings.experience.length > 0) {
          setExperience(settings.experience.map((exp, index) => ({
            id: exp._id || index,
            year: exp.year || '',
            title: exp.title || '',
            company: exp.company || '',
            desc: exp.description || ''
          })))
        }
        
        if (settings.profileImage) {
          setProfileImagePreview(`${import.meta.env.VITE_API_BASE_URL}${settings.profileImage}`)
        }
        
        if (settings.cvUrl) {
          setCurrentCvUrl(settings.cvUrl)
          setCvFileName(settings.cvUrl.split('/').pop())
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleBioChange = (e) => {
    setBioData({ ...bioData, [e.target.name]: e.target.value })
  }

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB')
        return
      }

      // Show preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Upload immediately
      try {
        setUploading(prev => ({ ...prev, image: true }))
        await settingsAPI.uploadProfileImage(file)
        toast.success('Profile image uploaded successfully!')
        await fetchSettings()
      } catch (error) {
        console.error('Error uploading image:', error)
        toast.error('Failed to upload profile image')
      } finally {
        setUploading(prev => ({ ...prev, image: false }))
      }
    }
  }

  const handleCvUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB')
        return
      }

      // Upload immediately
      try {
        setUploading(prev => ({ ...prev, cv: true }))
        await settingsAPI.uploadCV(file)
        toast.success('CV uploaded successfully!')
        await fetchSettings()
      } catch (error) {
        console.error('Error uploading CV:', error)
        toast.error('Failed to upload CV')
      } finally {
        setUploading(prev => ({ ...prev, cv: false }))
      }
    }
  }

  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      year: new Date().getFullYear().toString(),
      title: '',
      company: '',
      desc: ''
    }
    setExperience([newExp, ...experience])
  }

  const updateExperience = (id, field, value) => {
    setExperience(experience.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ))
  }

  const deleteExperience = (id) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      setExperience(experience.filter(exp => exp.id !== id))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const settingsData = {
        ...bioData,
        experience: experience.map(exp => ({
          year: exp.year,
          title: exp.title,
          company: exp.company,
          description: exp.desc
        }))
      }
      
      await settingsAPI.update(settingsData)
      toast.success('Changes saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'bio', label: 'Bio & Contact', icon: FaUser },
    { id: 'image', label: 'Profile Image', icon: FaImage },
    { id: 'experience', label: 'Experience', icon: FaBriefcase },
    { id: 'cv', label: 'CV / Resume', icon: FaFileAlt },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900 p-6">
      {/* Header */}
      <motion.div 
        className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Edit About Page</h1>
          <p className="text-gray-400">Manage your bio, experience, and CV</p>
        </div>
        <motion.button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 flex items-center gap-2 disabled:opacity-50"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {saving ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <FaSave /> Save Changes
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        className="flex flex-wrap gap-2 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 rounded-xl font-medium flex items-center gap-2 transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                : 'bg-dark-800/50 text-gray-400 hover:bg-dark-700/50 border border-dark-600'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon /> {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'bio' && (
          <motion.div
            key="bio"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid lg:grid-cols-2 gap-6"
          >
            {/* Personal Info */}
            <motion.div variants={itemVariants} className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <FaUser className="text-blue-400" /> Personal Information
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={bioData.name}
                    onChange={handleBioChange}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Professional Title</label>
                  <input
                    type="text"
                    name="title"
                    value={bioData.title}
                    onChange={handleBioChange}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Bio</label>
                  <textarea
                    name="bio"
                    value={bioData.bio}
                    onChange={handleBioChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Short Bio</label>
                  <textarea
                    name="shortBio"
                    value={bioData.shortBio}
                    onChange={handleBioChange}
                    rows={2}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />
                </div>

                <div className="flex items-center justify-between bg-dark-700/30 rounded-xl p-4">
                  <div>
                    <p className="text-white font-medium">Available for Work</p>
                    <p className="text-gray-400 text-sm">Show availability badge on portfolio</p>
                  </div>
                  <button
                    onClick={() => setBioData({ ...bioData, availability: !bioData.availability })}
                    className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${
                      bioData.availability ? 'bg-green-500' : 'bg-dark-500'
                    }`}
                  >
                    <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-all duration-300 ${
                      bioData.availability ? 'left-7' : 'left-1'
                    }`}></div>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div variants={itemVariants} className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Contact Information</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={bioData.email}
                    onChange={handleBioChange}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={bioData.phone}
                    onChange={handleBioChange}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={bioData.location}
                    onChange={handleBioChange}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Preview Card */}
              <div className="mt-8 pt-6 border-t border-dark-600">
                <p className="text-gray-400 text-sm mb-4">Preview</p>
                <div className="bg-dark-700/50 rounded-xl p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {bioData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{bioData.name}</h3>
                      <p className="text-blue-400 text-sm">{bioData.title}</p>
                    </div>
                    {bioData.availability && (
                      <span className="ml-auto px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                        Available
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">{bioData.bio.substring(0, 100)}...</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'experience' && (
          <motion.div
            key="experience"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Career Timeline</h2>
              <motion.button
                onClick={addExperience}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl flex items-center gap-2 hover:bg-blue-500/30 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaPlus /> Add Experience
              </motion.button>
            </motion.div>

            <div className="space-y-4">
              {experience.map((exp, index) => (
                <motion.div
                  key={exp.id}
                  variants={itemVariants}
                  className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-2xl p-6 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="grid md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Year</label>
                      <input
                        type="text"
                        value={exp.year}
                        onChange={(e) => updateExperience(exp.id, 'year', e.target.value)}
                        className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                        placeholder="2024"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-400 text-sm mb-2">Position</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                        className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                        placeholder="Full Stack Developer"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-400 text-sm mb-2">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                        className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                        placeholder="Company Name"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex gap-4">
                    <div className="flex-1">
                      <label className="block text-gray-400 text-sm mb-2">Description</label>
                      <input
                        type="text"
                        value={exp.desc}
                        onChange={(e) => updateExperience(exp.id, 'desc', e.target.value)}
                        className="w-full px-4 py-3 bg-dark-700/50 border border-dark-500 rounded-xl text-white focus:outline-none focus:border-blue-500 transition-all"
                        placeholder="Brief description of your role"
                      />
                    </div>
                    <button
                      onClick={() => deleteExperience(exp.id)}
                      className="self-end p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'image' && (
          <motion.div
            key="image"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="max-w-2xl mx-auto"
          >
            <motion.div variants={itemVariants} className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-2">Upload Profile Image</h2>
              <p className="text-gray-400 mb-8">Upload your profile photo. This will replace the "AU" placeholder on your portfolio.</p>

              {/* Current Image Preview */}
              {profileImagePreview && (
                <div className="mb-8">
                  <p className="text-sm text-gray-400 mb-3">Current Profile Image</p>
                  <div className="relative w-48 h-48 mx-auto">
                    <img 
                      src={profileImagePreview} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover border-4 border-blue-500/30"
                    />
                    {uploading.image && (
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  className="hidden"
                  disabled={uploading.image}
                />
                <div className="border-2 border-dashed border-dark-500 rounded-2xl p-12 text-center hover:border-blue-500/50 transition-colors">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <FaImage className="text-2xl text-blue-400" />
                  </div>
                  <p className="text-white font-medium mb-2">
                    {uploading.image ? 'Uploading...' : 'Click to upload new profile image'}
                  </p>
                  <p className="text-gray-400 text-sm">JPG, PNG or GIF (max. 5MB)</p>
                </div>
              </label>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <p className="text-blue-400 text-sm">
                  💡 <strong>Tip:</strong> Use a square image for best results. The image will be displayed in a circular frame.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'cv' && (
          <motion.div
            key="cv"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="max-w-2xl mx-auto"
          >
            <motion.div variants={itemVariants} className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-2">Upload CV / Resume</h2>
              <p className="text-gray-400 mb-8">Upload your latest CV in PDF format. This will be available for visitors to download.</p>

              {/* Current CV */}
              {currentCvUrl && (
                <div className="mb-8">
                  <p className="text-sm text-gray-400 mb-3">Current CV</p>
                  <div className="flex items-center justify-between bg-dark-700/50 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <FaCheck className="text-green-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{cvFileName}</p>
                        <p className="text-gray-400 text-sm">Currently uploaded</p>
                      </div>
                    </div>
                    <a
                      href={`${import.meta.env.VITE_API_BASE_URL}${currentCvUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      Download
                    </a>
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <label className="block cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleCvUpload}
                  className="hidden"
                  disabled={uploading.cv}
                />
                <div className="border-2 border-dashed border-dark-500 rounded-2xl p-12 text-center hover:border-blue-500/50 transition-colors">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                    {uploading.cv ? (
                      <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
                    ) : (
                      <FaUpload className="text-2xl text-blue-400" />
                    )}
                  </div>
                  <p className="text-white font-medium mb-2">
                    {uploading.cv ? 'Uploading...' : (currentCvUrl ? 'Click to upload new CV' : 'Click to upload or drag and drop')}
                  </p>
                  <p className="text-gray-400 text-sm">PDF (max. 5MB)</p>
                </div>
              </label>

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <p className="text-blue-400 text-sm">
                  💡 <strong>Tip:</strong> Your  CV will be instantly available for download on your public About page.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default About
