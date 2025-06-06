import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import ApperIcon from './ApperIcon'

function MainFeature({ files, onFileUpload, onDeleteFile, viewMode, loading, error, darkMode }) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previewFile, setPreviewFile] = useState(null)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    processFiles(selectedFiles)
  }

  const processFiles = (fileList) => {
    const processedFiles = fileList.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      status: 'completed',
      progress: 100,
      url: URL.createObjectURL(file),
      file: file
    }))
    
    onFileUpload(processedFiles)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) return 'Image'
    if (type?.startsWith('video/')) return 'Video'
    if (type?.includes('pdf')) return 'FileText'
    if (type?.includes('document') || type?.includes('word')) return 'FileText'
    if (type?.includes('spreadsheet') || type?.includes('excel')) return 'FileSpreadsheet'
    return 'File'
  }

  const isImageFile = (type) => type?.startsWith('image/')

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 transition-all duration-300 ${
          dragActive
            ? darkMode
              ? 'border-primary bg-primary/10'
              : 'border-primary bg-primary/5'
            : darkMode
              ? 'border-surface-700 hover:border-surface-600 bg-surface-800/50'
              : 'border-surface-300 hover:border-surface-400 bg-white/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="text-center">
          <motion.div
            animate={{ 
              scale: dragActive ? 1.1 : 1,
              rotate: dragActive ? 5 : 0 
            }}
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              dragActive
                ? 'bg-primary text-white'
                : darkMode
                  ? 'bg-surface-700 text-surface-300'
                  : 'bg-surface-100 text-surface-600'
            }`}
          >
            <ApperIcon name={dragActive ? 'Download' : 'Upload'} size={24} />
          </motion.div>
          
          <h3 className="text-lg font-semibold mb-2">
            {dragActive ? 'Drop files here' : 'Drag & drop files here'}
          </h3>
          
          <p className={`mb-4 ${
            darkMode ? 'text-surface-400' : 'text-surface-600'
          }`}>
            or click to browse files
          </p>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <ApperIcon name="FolderOpen" size={16} />
            <span>Choose Files</span>
          </button>
        </div>
      </motion.div>

      {/* Files Display */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className={`text-center py-12 ${
          darkMode ? 'text-surface-400' : 'text-surface-600'
        }`}>
          <ApperIcon name="AlertCircle" className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p>{error}</p>
        </div>
      ) : files.length === 0 ? (
        <div className={`text-center py-12 ${
          darkMode ? 'text-surface-400' : 'text-surface-600'
        }`}>
          <ApperIcon name="Inbox" className="w-12 h-12 mx-auto mb-4" />
          <p>No files uploaded yet</p>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">
              Uploaded Files ({files.length})
            </h2>
            <button
              onClick={() => setSelectedFiles([])}
              className={`text-sm ${
                darkMode 
                  ? 'text-surface-400 hover:text-surface-200' 
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              Clear Selection
            </button>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className={`group relative rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-all duration-200 ${
                      darkMode ? 'bg-surface-800' : 'bg-white'
                    }`}
                  >
                    <div className="aspect-square relative">
                      {isImageFile(file.type) ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full flex items-center justify-center ${
                          darkMode ? 'bg-surface-700' : 'bg-surface-100'
                        }`}>
                          <ApperIcon name={getFileIcon(file.type)} size={48} className={
                            darkMode ? 'text-surface-400' : 'text-surface-600'
                          } />
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setPreviewFile(file)}
                          className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                        >
                          <ApperIcon name="Eye" size={16} className="text-white" />
                        </button>
                        <button
                          onClick={() => onDeleteFile(file.id)}
                          className="p-2 bg-red-500/80 rounded-lg hover:bg-red-500 transition-colors"
                        >
                          <ApperIcon name="Trash2" size={16} className="text-white" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-3">
                      <h3 className="font-medium text-sm truncate mb-1">{file.name}</h3>
                      <p className={`text-xs ${
                        darkMode ? 'text-surface-400' : 'text-surface-600'
                      }`}>
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-200 ${
                      darkMode 
                        ? 'bg-surface-800 hover:bg-surface-700' 
                        : 'bg-white hover:bg-surface-50'
                    } shadow-card`}
                  >
                    <div className={`p-2 rounded-lg ${
                      darkMode ? 'bg-surface-700' : 'bg-surface-100'
                    }`}>
                      <ApperIcon name={getFileIcon(file.type)} size={20} className={
                        darkMode ? 'text-surface-400' : 'text-surface-600'
                      } />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{file.name}</h3>
                      <p className={`text-sm ${
                        darkMode ? 'text-surface-400' : 'text-surface-600'
                      }`}>
                        {formatFileSize(file.size)} • {format(new Date(file.uploadedAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPreviewFile(file)}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode 
                            ? 'text-surface-400 hover:text-surface-200 hover:bg-surface-700' 
                            : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                        }`}
                      >
                        <ApperIcon name="Eye" size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteFile(file.id)}
                        className="p-2 rounded-lg text-red-500 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={() => setPreviewFile(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className={`relative max-w-4xl max-h-full rounded-2xl overflow-hidden ${
                darkMode ? 'bg-surface-800' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`flex items-center justify-between p-4 border-b ${
                darkMode ? 'border-surface-700' : 'border-surface-200'
              }`}>
                <h3 className="font-semibold truncate">{previewFile.name}</h3>
                <button
                  onClick={() => setPreviewFile(null)}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'text-surface-400 hover:text-surface-200 hover:bg-surface-700' 
                      : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                  }`}
                >
                  <ApperIcon name="X" size={16} />
                </button>
              </div>
              
              <div className="p-4">
                {isImageFile(previewFile.type) ? (
                  <img
                    src={previewFile.url}
                    alt={previewFile.name}
                    className="max-w-full max-h-96 object-contain mx-auto"
                  />
                ) : (
                  <div className="text-center py-12">
                    <ApperIcon name={getFileIcon(previewFile.type)} size={64} className={
                      darkMode ? 'text-surface-400' : 'text-surface-600'
                    } />
                    <p className={`mt-4 ${
                      darkMode ? 'text-surface-400' : 'text-surface-600'
                    }`}>
                      Preview not available for this file type
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature