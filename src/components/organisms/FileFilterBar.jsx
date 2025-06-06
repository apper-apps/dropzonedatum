import React from 'react'
import FileFilterButton from '@/components/molecules/FileFilterButton'

const FileFilterBar = ({ filter, setFilter, filterOptions, darkMode }) => {
  return (
    <div className={`sticky top-16 z-40 backdrop-blur-sm border-b transition-colors duration-300 ${
      darkMode 
        ? 'bg-surface-900/80 border-surface-800' 
        : 'bg-surface-50/80 border-surface-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 py-3 overflow-x-auto scrollbar-hide">
          {filterOptions.map((option) => (
            <FileFilterButton
              key={option.key}
              option={option}
              isActive={filter === option.key}
              onClick={setFilter}
              darkMode={darkMode}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default FileFilterBar