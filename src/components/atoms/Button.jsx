import React from 'react'

const Button = ({ children, onClick, className = '', type = 'button', ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button