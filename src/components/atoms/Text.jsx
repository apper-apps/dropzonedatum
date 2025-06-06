import React from 'react'

const Text = ({ children, className = '', as = 'p', ...props }) => {
  const Component = as
  return (
    <Component className={className} {...props}>
      {children}
    </Component>
  )
}

export default Text