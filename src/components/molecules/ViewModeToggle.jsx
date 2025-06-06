import React from 'react'
import Button from '@/components/atoms/Button'
import Icon from '@/components/atoms/Icon'

const ViewModeToggle = ({ viewMode, setViewMode, darkMode }) => {
  const getButtonClass = (mode) => `p-2 rounded-lg transition-colors ${
    viewMode === mode
      ? darkMode 
        ? 'bg-surface-700 text-primary' 
        : 'bg-surface-200 text-primary'
      : darkMode 
        ? 'text-surface-400 hover:text-surface-200' 
        : 'text-surface-600 hover:text-surface-900'
  }`

  return (
    <div className="hidden sm:flex items-center space-x-2">
      <Button
        onClick={() => setViewMode('grid')}
        className={getButtonClass('grid')}
      >
        <Icon name="Grid3X3" size={16} />
      </Button>
      <Button
        onClick={() => setViewMode('list')}
        className={getButtonClass('list')}
      >
        <Icon name="List" size={16} />
      </Button>
    </div>
  )
}

export default ViewModeToggle