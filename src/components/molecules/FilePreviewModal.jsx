import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Icon from '@/components/atoms/Icon'
import Button from '@/components/atoms/Button'
import Title from '@/components/atoms/Title'
import Text from '@/components/atoms/Text'

const FilePreviewModal = ({ previewFile, onClose, getFileIcon, isImageFile, darkMode }) => {
  if (!previewFile) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
        onClick={onClose}
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
            <Title as="h3" className="font-semibold truncate">{previewFile.name}</Title>
            <Button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-surface-400 hover:text-surface-200 hover:bg-surface-700' 
                  : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
              }`}
            >
              <Icon name="X" size={16} />
            </Button>
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
                <Icon name={getFileIcon(previewFile.type)} size={64} className={
                  darkMode ? 'text-surface-400' : 'text-surface-600'
                } />
                <Text className={`mt-4 ${
                  darkMode ? 'text-surface-400' : 'text-surface-600'
                }`}>
                  Preview not available for this file type
                </Text>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default FilePreviewModal