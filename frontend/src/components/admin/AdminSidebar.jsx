import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaTachometerAlt, FaProjectDiagram, FaStar, FaCertificate, FaEnvelope, FaUser, FaSignOutAlt, FaHome } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'

const AdminSidebar = () => {
  const { logout } = useAuth()

  const menuItems = [
    { path: '/admin/dashboard', icon: FaTachometerAlt, label: 'Dashboard' },
    { path: '/admin/about', icon: FaUser, label: 'About' },
    { path: '/admin/projects', icon: FaProjectDiagram, label: 'Projects' },
    { path: '/admin/skills', icon: FaStar, label: 'Skills' },
    { path: '/admin/certificates', icon: FaCertificate, label: 'Certificates' },
    { path: '/admin/messages', icon: FaEnvelope, label: 'Messages' },
  ]

  return (
    <aside className="w-64 min-h-screen bg-dark-800/50 backdrop-blur-xl border-r border-dark-600 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-dark-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">AU</span>
          </div>
          <div>
            <h2 className="text-white font-bold">Admin Panel</h2>
            <p className="text-gray-500 text-xs">Portfolio Manager</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-dark-700/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`text-lg ${isActive ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div 
                    className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full"
                    layoutId="activeIndicator"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dark-600 space-y-2">
        <a
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-dark-700/50 transition-all duration-300"
        >
          <FaHome className="text-lg" />
          <span className="font-medium">View Portfolio</span>
        </a>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
