import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="mb-8">
          <ApperIcon name="FileX" className="w-24 h-24 text-surface-400 mx-auto mb-4" />
          <h1 className="text-6xl font-bold text-surface-900 dark:text-white mb-4">404</h1>
          <p className="text-xl text-surface-600 dark:text-surface-300 mb-8">
            The page you're looking for doesn't exist.
          </p>
        </div>
        
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          <ApperIcon name="Home" size={16} />
          <span>Go Home</span>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound