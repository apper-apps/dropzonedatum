import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Icon = ({ name, size = 16, className = '' }) => {
  return <ApperIcon name={name} size={size} className={className} />
}

export default Icon