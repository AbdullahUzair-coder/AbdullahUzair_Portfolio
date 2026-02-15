import { FaGithub, FaLinkedin, FaEnvelope, FaHeart } from 'react-icons/fa'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    {
      icon: <FaGithub className="w-5 h-5" />,
      href: 'https://github.com/AbdullahUzair-coder',
      label: 'GitHub'
    },
    {
      icon: <FaLinkedin className="w-5 h-5" />,
      href: 'https://www.linkedin.com/in/abdullah-uzair-163a05374/',
      label: 'LinkedIn'
    },
    {
      icon: <FaEnvelope className="w-5 h-5" />,
      href: 'mailto:contact@abdullahuzair.com',
      label: 'Email'
    }
  ]

  return (
    <footer className="bg-dark-950 border-t border-dark-800 py-12">
      <div className="container-custom">
        <div className="flex flex-col items-center space-y-6">
          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-dark-800 hover:bg-primary-600 border border-dark-700 hover:border-primary-600 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-glow group"
                aria-label={social.label}
              >
                <span className="group-hover:scale-110 transition-transform">
                  {social.icon}
                </span>
              </a>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <a
              href="/privacy"
              className="hover:text-primary-400 transition-colors"
            >
              Privacy Policy
            </a>
            <span>•</span>
            <a
              href="/terms"
              className="hover:text-primary-400 transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
