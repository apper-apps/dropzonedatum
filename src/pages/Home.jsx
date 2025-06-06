import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { fileService } from '../services'

function Home({ darkMode, toggleDarkMode }) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const loadFiles = async () => {
      setLoading(true)
      try {
        const result = await fileService.getAll()
        setFiles(result || [])
      } catch (err) {
        setError(err.message)
        toast.error('Failed to load files')
      } finally {
        setLoading(false)
      }
    }
    loadFiles()
  }, [])

  const handleFileUpload = async (newFiles) => {
    try {
      const uploadPromises = newFiles.map(file => fileService.create(file))
      const uploadedFiles = await Promise.all(uploadPromises)
      setFiles(prev => [...prev, ...uploadedFiles])
      toast.success(`Successfully uploaded ${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''}`)
    } catch (err) {
      toast.error('Failed to upload files')
    }
  }

  const handleDeleteFile = async (id) => {
    try {
      await fileService.delete(id)
      setFiles(prev => prev.filter(file => file.id !== id))
      toast.success('File deleted successfully')
    } catch (err) {
      toast.error('Failed to delete file')
    }
  }

  const filteredFiles = files.filter(file => {
    if (filter === 'all') return true
    if (filter === 'images') return file.type?.startsWith('image/')
    if (filter === 'documents') return file.type?.includes('pdf') || file.type?.includes('document')
    if (filter === 'videos') return file.type?.startsWith('video/')
    return true
  })

  const filterOptions = [
    { key: 'all', label: 'All Files', icon: 'Files' },
    { key: 'images', label: 'Images', icon: 'Image' },
    { key: 'documents', label: 'Documents', icon: 'FileText' },
    { key: 'videos', label: 'Videos', icon: 'Video' }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-sm border-b transition-colors duration-300 ${
        darkMode 
          ? 'bg-surface-900/80 border-surface-800' 
          : 'bg-surface-50/80 border-surface-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${
                darkMode ? 'bg-primary/20' : 'bg-primary/10'
              }`}>
                <ApperIcon name="Upload" className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-xl font-heading font-semibold">DropZone</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? darkMode 
                        ? 'bg-surface-700 text-primary' 
                        : 'bg-surface-200 text-primary'
                      : darkMode 
                        ? 'text-surface-400 hover:text-surface-200' 
                        : 'text-surface-600 hover:text-surface-900'
                  }`}
                >
                  <ApperIcon name="Grid3X3" size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? darkMode 
                        ? 'bg-surface-700 text-primary' 
                        : 'bg-surface-200 text-primary'
                      : darkMode 
                        ? 'text-surface-400 hover:text-surface-200' 
                        : 'text-surface-600 hover:text-surface-900'
                  }`}
                >
                  <ApperIcon name="List" size={16} />
                </button>
              </div>
              
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'text-surface-400 hover:text-surface-200' 
                    : 'text-surface-600 hover:text-surface-900'
                }`}
              >
                <ApperIcon name={darkMode ? 'Sun' : 'Moon'} size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className={`sticky top-16 z-40 backdrop-blur-sm border-b transition-colors duration-300 ${
        darkMode 
          ? 'bg-surface-900/80 border-surface-800' 
          : 'bg-surface-50/80 border-surface-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 py-3 overflow-x-auto scrollbar-hide">
            {filterOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setFilter(option.key)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  filter === option.key
                    ? 'bg-primary text-white shadow-soft'
                    : darkMode
                      ? 'bg-surface-800 text-surface-300 hover:bg-surface-700'
                      : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                }`}
              >
                <ApperIcon name={option.icon} size={14} />
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MainFeature 
          files={filteredFiles}
          onFileUpload={handleFileUpload}
          onDeleteFile={handleDeleteFile}
          viewMode={viewMode}
          loading={loading}
          error={error}
          darkMode={darkMode}
        />
      </main>
    </div>
  )
}

export default Home