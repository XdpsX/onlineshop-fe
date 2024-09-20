import React from 'react'

interface LoadingProps {
  className?: string
  size?: 'small' | 'medium' | 'large'
}

const Loading: React.FC<LoadingProps> = ({ className = '', size = 'small' }) => {
  const sizeClasses = {
    small: 'h-5 w-5',
    medium: 'h-12 w-12',
    large: 'h-20 w-20'
  }

  return (
    <div className={`flex h-full items-center justify-center bg-transparent`}>
      <div
        className={`animate-spin rounded-full border-4 border-solid border-t-transparent border-blue-600 ${sizeClasses[size]} ${className}`}
      ></div>
    </div>
  )
}

export default Loading
