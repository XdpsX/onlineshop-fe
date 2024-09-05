import { ReactNode, useEffect, useRef, useState } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(isOpen)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && event.target instanceof Node && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      setIsVisible(true)
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  // Use a class to control the transition
  const modalClasses = `fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-9999 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`
  const contentClasses = `bg-white -mt-30 max-w-[340px] md:max-w-fit md:min-w-[420px] rounded-lg p-3 md:p-6 shadow-lg transform transition-transform duration-300 ${isOpen ? 'scale-100' : 'scale-95'}`

  if (!isVisible) return null

  return (
    <div className={modalClasses}>
      <div ref={modalRef} className={contentClasses}>
        {children}
      </div>
    </div>
  )
}

export default Modal
