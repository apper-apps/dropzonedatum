import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Icon from '@/components/atoms/Icon'
import Title from '@/components/atoms/Title'
import Button from '@/components/atoms/Button'
import ViewModeToggle from '@/components/molecules/ViewModeToggle'
const Header = ({ darkMode, toggleDarkMode, viewMode, setViewMode }) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  const navigationItems = [
    { path: '/', label: 'Files', icon: 'Upload' },
    { path: '/dashboard', label: 'Dashboard', icon: 'BarChart3' }
  ]
  
  return (
    <header className={`sticky top-0 z-50 backdrop-blur-sm border-b transition-colors duration-300 ${
      darkMode 
        ? 'bg-surface-900/80 border-surface-800' 
        : 'bg-surface-50/80 border-surface-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-xl ${
                darkMode ? 'bg-primary/20' : 'bg-primary/10'
              }`}>
                <Icon name="Upload" className="w-6 h-6 text-primary" />
              </div>
              <Title as="h1" className="text-xl">DropZone</Title>
            </div>
            
            <nav className="hidden sm:flex space-x-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    location.pathname === item.path
                      ? darkMode
                        ? 'bg-primary/20 text-primary'
                        : 'bg-primary/10 text-primary'
                      : darkMode
                        ? 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
                        : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                  }`}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>
<div className="flex items-center space-x-4">
            {location.pathname === '/' && viewMode && setViewMode && (
              <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} darkMode={darkMode} />
            )}
            
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