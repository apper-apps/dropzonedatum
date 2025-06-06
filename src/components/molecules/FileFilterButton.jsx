import React from 'react'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'

const FileFilterButton = ({ option, isActive, onClick, darkMode }) => {
  return (
    <Button
      onClick={() => onClick(option.key)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
        isActive
          ? 'bg-primary text-white shadow-soft'
          : darkMode
            ? 'bg-surface-800 text-surface-300 hover:bg-surface-700'
            : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
      }`}
    >
      <Icon name={option.icon} size={14} />
      <Text as="span" className="text-sm font-medium">{option.label}</Text>
    </Button>
  )
}

export default FileFilterButton