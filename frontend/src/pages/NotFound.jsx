import { Link } from 'react-router-dom'
import { FaHome } from 'react-icons/fa'
import './NotFound.css'

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <div className="not-found-content">
          <h1 className="error-code">404</h1>
          <h2 className="error-title">Page Not Found</h2>
          <p className="error-description">
            Oops! The page you're looking for doesn't exist.
            It might have been moved or deleted.
          </p>
          <Link to="/" className="btn btn-primary">
            <FaHome /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
