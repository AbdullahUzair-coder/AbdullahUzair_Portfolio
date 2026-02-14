import { useAuth } from '../../context/AuthContext'
import { useLocation } from 'react-router-dom'
import { FaBell, FaSearch } from 'react-icons/fa'

const AdminHeader = () => {
  const { user } = useAuth()
  const location = useLocation()

  const getPageTitle = () => {
    const path = location.pathname.split('/').pop()
    const titles = {
      dashboard: 'Dashboard',
      projects: 'Projects',
      skills: 'Skills',
      messages: 'Messages',
      about: 'About',
      profile: 'Profile',
    }
    return titles[path] || 'Admin'
  }

  return (
    <header className="bg-dark-800/50 backdrop-blur-xl border-b border-dark-600 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{getPageTitle()}</h1>
          <p className="text-gray-500 text-sm">Welcome back, {user?.username || 'Admin'}</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center bg-dark-700/50 border border-dark-600 rounded-xl px-4 py-2">
            <FaSearch className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-white placeholder-gray-500 focus:outline-none w-48"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-3 bg-dark-700/50 border border-dark-600 rounded-xl text-gray-400 hover:text-white hover:bg-dark-600/50 transition-colors">
            <FaBell />
            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>

          {/* User */}
          <div className="flex items-center gap-3 pl-4 border-l border-dark-600">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {user?.username?.charAt(0)?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-white font-medium text-sm">{user?.username || 'Admin'}</p>
              <p className="text-gray-500 text-xs">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader
