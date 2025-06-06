import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Icon from '@/components/atoms/Icon'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'

const FileCard = ({ file, isImageFile, getFileIcon, formatFileSize, onPreview, onDelete, darkMode }) => {
  return (
    <motion.div
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
            <Icon name={getFileIcon(file.type)} size={48} className={
              darkMode ? 'text-surface-400' : 'text-surface-600'
            } />
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
          <Button
            onClick={() => onPreview(file)}
            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
          >
            <Icon name="Eye" size={16} className="text-white" />
          </Button>
          <Button
            onClick={() => onDelete(file.id)}
            className="p-2 bg-red-500/80 rounded-lg hover:bg-red-500 transition-colors"
          >
            <Icon name="Trash2" size={16} className="text-white" />
          </Button>
        </div>
      </div>
      
      <div className="p-3">
        <Text as="h3" className="font-medium text-sm truncate mb-1">{file.name}</Text>
        <Text className={`text-xs ${
          darkMode ? 'text-surface-400' : 'text-surface-600'
        }`}>
          {formatFileSize(file.size)}
        </Text>
      </div>
    </motion.div>
  )
}

export default FileCard