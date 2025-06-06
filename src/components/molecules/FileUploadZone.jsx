import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Title from '@/components/atoms/Title'
import Text from '@/components/atoms/Text'

const FileUploadZone = ({ dragActive, handleDrag, handleDrop, handleFileSelect, darkMode }) => {
  const fileInputRef = useRef(null)

  return (
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
          <Icon name={dragActive ? 'Download' : 'Upload'} size={24} />
        </motion.div>
        
        <Title as="h3" className="text-lg font-semibold mb-2">
          {dragActive ? 'Drop files here' : 'Drag & drop files here'}
        </Title>
        
        <Text className={`mb-4 ${
          darkMode ? 'text-surface-400' : 'text-surface-600'
        }`}>
          or click to browse files
        </Text>
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          <Icon name="FolderOpen" size={16} />
          <span>Choose Files</span>
        </Button>
      </div>
    </motion.div>
  )
}

export default FileUploadZone