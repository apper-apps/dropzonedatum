import React from 'react'

const Title = ({ children, className = '', as = 'h2', ...props }) => {
  const Component = as
  return (
    <Component className={`font-heading font-semibold ${className}`} {...props}>
      {children}
    </Component>
  )
}

export default Title