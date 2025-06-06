import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { fileService } from '@/services'
import Header from '@/components/organisms/Header'
import FileFilterBar from '@/components/organisms/FileFilterBar'
import FileUploadZone from '@/components/molecules/FileUploadZone'
import FileDisplayArea from '@/components/organisms/FileDisplayArea'

const HomePage = ({ darkMode, toggleDarkMode }) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [filter, setFilter] = useState('all')
  const [dragActive, setDragActive] = useState(false)

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
    
    handleFileUpload(processedFiles)
  }

  return (
    <div className="min-h-screen">
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <FileFilterBar
        filter={filter}
        setFilter={setFilter}
        filterOptions={filterOptions}
        darkMode={darkMode}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FileUploadZone
          dragActive={dragActive}
          handleDrag={handleDrag}
          handleDrop={handleDrop}
          handleFileSelect={handleFileSelect}
          darkMode={darkMode}
        />

        <FileDisplayArea 
          files={filteredFiles}
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

export default HomePage