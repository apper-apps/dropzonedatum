import React from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Icon from '@/components/atoms/Icon'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import Title from '@/components/atoms/Title'

const FileListItem = ({ file, getFileIcon, formatFileSize, onPreview, onDelete, darkMode }) => {
  return (
    <motion.div
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
        <Icon name={getFileIcon(file.type)} size={20} className={
          darkMode ? 'text-surface-400' : 'text-surface-600'
        } />
      </div>
      
      <div className="flex-1 min-w-0">
        <Title as="h3" className="font-medium truncate">{file.name}</Title>
        <Text className={`text-sm ${
          darkMode ? 'text-surface-400' : 'text-surface-600'
        }`}>
          {formatFileSize(file.size)} • {format(new Date(file.uploadedAt), 'MMM d, yyyy')}
        </Text>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => onPreview(file)}
          className={`p-2 rounded-lg transition-colors ${
            darkMode 
              ? 'text-surface-400 hover:text-surface-200 hover:bg-surface-700' 
              : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
          }`}
        >
          <Icon name="Eye" size={16} />
        </Button>
        <Button
          onClick={() => onDelete(file.id)}
          className="p-2 rounded-lg text-red-500 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <Icon name="Trash2" size={16} />
        </Button>
      </div>
    </motion.div>
  )
}

export default FileListItem