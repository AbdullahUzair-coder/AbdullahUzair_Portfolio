import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaEnvelope, FaTrash, FaClock, FaReply, FaInbox, FaCheck, FaEye, FaSearch, FaTimes } from 'react-icons/fa'
import { messagesAPI } from '../../services/apiService'
import { toast } from 'react-toastify'

const Messages = () => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDetail, setShowDetail] = useState(false)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const data = await messagesAPI.getAll()
      setMessages(data.data.messages || [])
    } catch (error) {
      toast.error('Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return

    try {
      await messagesAPI.delete(id)
      toast.success('Message deleted successfully')
      fetchMessages()
      if (selectedMessage?._id === id) {
        setSelectedMessage(null)
        setShowDetail(false)
      }
    } catch (error) {
      toast.error('Failed to delete message')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  const selectMessage = (message) => {
    setSelectedMessage(message)
    setShowDetail(true)
  }

  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.message.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Messages</h1>
          <p className="text-gray-400">Contact form submissions from visitors</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-dark-800/50 border border-dark-600 rounded-xl flex items-center gap-2">
            <FaInbox className="text-blue-400" />
            <span className="text-white font-semibold">{messages.length}</span>
            <span className="text-gray-400">Messages</span>
          </div>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-dark-800/50 border border-dark-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : filteredMessages.length === 0 ? (
        <motion.div 
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-dark-800/50 rounded-full flex items-center justify-center">
            <FaEnvelope className="text-3xl text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No messages yet</h3>
          <p className="text-gray-400">
            {searchTerm ? 'Try a different search term' : 'When visitors contact you, their messages will appear here'}
          </p>
        </motion.div>
      ) : (
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Messages List */}
          <motion.div 
            className={`lg:col-span-2 space-y-3 ${showDetail ? 'hidden lg:block' : ''}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredMessages.map((message) => (
              <motion.div
                key={message._id}
                variants={itemVariants}
                onClick={() => selectMessage(message)}
                className={`group bg-dark-800/50 backdrop-blur-sm border rounded-xl p-4 cursor-pointer transition-all duration-300 ${
                  selectedMessage?._id === message._id 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-dark-600 hover:border-blue-500/30'
                }`}
                whileHover={{ x: 5 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                    {message.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white font-semibold truncate">{message.name}</h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {getRelativeTime(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm truncate mb-2">{message.email}</p>
                    <p className="text-gray-300 text-sm line-clamp-2">{message.message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Message Detail */}
          <AnimatePresence mode="wait">
            {selectedMessage && (
              <motion.div 
                className={`lg:col-span-3 ${!showDetail ? 'hidden lg:block' : ''}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                key={selectedMessage._id}
              >
                <div className="bg-dark-800/50 backdrop-blur-sm border border-dark-600 rounded-2xl overflow-hidden h-full">
                  {/* Detail Header */}
                  <div className="flex items-center justify-between p-6 border-b border-dark-600">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setShowDetail(false)}
                        className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <FaTimes />
                      </button>
                      <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {selectedMessage.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">{selectedMessage.name}</h2>
                        <a 
                          href={`mailto:${selectedMessage.email}`} 
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {selectedMessage.email}
                        </a>
                      </div>
                    </div>
                    <motion.button
                      onClick={() => handleDelete(selectedMessage._id)}
                      className="p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaTrash />
                    </motion.button>
                  </div>

                  {/* Detail Meta */}
                  <div className="px-6 py-4 border-b border-dark-600 bg-dark-700/30">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <FaClock />
                      <span>{formatDate(selectedMessage.createdAt)}</span>
                    </div>
                  </div>

                  {/* Detail Content */}
                  <div className="p-6">
                    <h3 className="text-gray-400 text-sm mb-3 flex items-center gap-2">
                      <FaEnvelope /> Message
                    </h3>
                    <div className="bg-dark-700/50 rounded-xl p-5">
                      <p className="text-white whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
                    </div>
                  </div>

                  {/* Detail Actions */}
                  <div className="p-6 pt-0">
                    <div className="flex flex-wrap gap-3">
                      <motion.a
                        href={`mailto:${selectedMessage.email}?subject=Re: Your message&body=Hi ${selectedMessage.name},%0D%0A%0D%0A`}
                        className="flex-1 min-w-[200px] py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FaReply /> Reply via Email
                      </motion.a>
                      <motion.button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedMessage.email)
                          toast.success('Email copied to clipboard')
                        }}
                        className="py-3 px-6 bg-dark-700 text-white rounded-xl font-medium hover:bg-dark-600 transition-colors flex items-center gap-2"
                        whileTap={{ scale: 0.98 }}
                      >
                        <FaCheck /> Copy Email
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {!selectedMessage && (
              <motion.div 
                className="lg:col-span-3 hidden lg:flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-dark-800/50 rounded-full flex items-center justify-center">
                    <FaEye className="text-4xl text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Select a message</h3>
                  <p className="text-gray-400">Click on a message to view its details</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export default Messages
