import React, { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import Title from '@/components/atoms/Title'
import Button from '@/components/atoms/Button'
import FileCard from '@/components/molecules/FileCard'
import FileListItem from '@/components/molecules/FileListItem'
import FilePreviewModal from '@/components/molecules/FilePreviewModal'

const FileDisplayArea = ({ files, onDeleteFile, viewMode, loading, error, darkMode }) => {
  const [previewFile, setPreviewFile] = useState(null)

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

  const handleClearSelection = () => {
    // In a real application, you might manage selection state here.
    // For this app, it simply means "no files currently selected"
    // as there's no multi-select UI.
    console.log('Clear selection clicked (functionality not implemented in this version)')
  }

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className={`text-center py-12 ${
          darkMode ? 'text-surface-400' : 'text-surface-600'
        }`}>
          <Icon name="AlertCircle" className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <Text>{error}</Text>
        </div>
      ) : files.length === 0 ? (
        <div className={`text-center py-12 ${
          darkMode ? 'text-surface-400' : 'text-surface-600'
        }`}>
          <Icon name="Inbox" className="w-12 h-12 mx-auto mb-4" />
          <Text>No files uploaded yet</Text>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <Title as="h2" className="text-lg">
              Uploaded Files ({files.length})
            </Title>
            <Button
              onClick={handleClearSelection}
              className={`text-sm ${
                darkMode 
                  ? 'text-surface-400 hover:text-surface-200' 
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              Clear Selection
            </Button>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {files.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    isImageFile={isImageFile}
                    getFileIcon={getFileIcon}
                    formatFileSize={formatFileSize}
                    onPreview={setPreviewFile}
                    onDelete={onDeleteFile}
                    darkMode={darkMode}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence>
                {files.map((file) => (
                  <FileListItem
                    key={file.id}
                    file={file}
                    getFileIcon={getFileIcon}
                    formatFileSize={formatFileSize}
                    onPreview={setPreviewFile}
                    onDelete={onDeleteFile}
                    darkMode={darkMode}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      <FilePreviewModal
        previewFile={previewFile}
        onClose={() => setPreviewFile(null)}
        getFileIcon={getFileIcon}
        isImageFile={isImageFile}
        darkMode={darkMode}
      />
    </>
  )
}

export default FileDisplayArea