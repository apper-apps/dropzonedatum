import React from 'react'
import Icon from '@/components/atoms/Icon'
import Title from '@/components/atoms/Title'
import Button from '@/components/atoms/Button'
import ViewModeToggle from '@/components/molecules/ViewModeToggle'

const Header = ({ darkMode, toggleDarkMode, viewMode, setViewMode }) => {
  return (
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
              <Icon name="Upload" className="w-6 h-6 text-primary" />
            </div>
            <Title as="h1" className="text-xl">DropZone</Title>
          </div>
          
          <div className="flex items-center space-x-4">
            <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} darkMode={darkMode} />
            
            <Button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-surface-400 hover:text-surface-200' 
                  : 'text-surface-600 hover:text-surface-900'
              }`}
            >
              <Icon name={darkMode ? 'Sun' : 'Moon'} size={16} />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header