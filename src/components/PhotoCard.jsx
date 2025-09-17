import { useState } from 'react'

function PhotoCard({ photo, onSwipe, isActive }) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Mouse events
  const handleMouseDown = (e) => {
    if (!isActive) return
    setIsDragging(true)
    const startX = e.clientX
    const startY = e.clientY

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX
      const deltaY = e.clientY - startY
      setDragOffset({ x: deltaX, y: deltaY })
    }

    const handleMouseUp = () => {
      handleDragEnd()
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  // Touch events for mobile
  const handleTouchStart = (e) => {
    if (!isActive) return
    setIsDragging(true)
    const touch = e.touches[0]
    const startX = touch.clientX
    const startY = touch.clientY

    const handleTouchMove = (e) => {
      const touch = e.touches[0]
      const deltaX = touch.clientX - startX
      const deltaY = touch.clientY - startY
      setDragOffset({ x: deltaX, y: deltaY })
    }

    const handleTouchEnd = () => {
      handleDragEnd()
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }

    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    
    // If dragged far enough, trigger swipe
    if (Math.abs(dragOffset.x) > 100) {
      onSwipe(dragOffset.x > 0 ? 'right' : 'left')
    }
    
    setDragOffset({ x: 0, y: 0 })
  }

  const cardStyle = {
    transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y * 0.1}px) rotate(${dragOffset.x * 0.1}deg)`,
    opacity: isActive ? 1 - Math.abs(dragOffset.x) / 300 : 0.8,
    zIndex: isActive ? 10 : 1,
    cursor: isDragging ? 'grabbing' : 'grab'
  }

  // Show feedback while dragging
  const showKeepFeedback = dragOffset.x > 50
  const showDeleteFeedback = dragOffset.x < -50

  return (
    <div 
      className="photo-card"
      style={cardStyle}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {showKeepFeedback && (
        <div className="swipe-feedback keep-feedback">KEEP</div>
      )}
      {showDeleteFeedback && (
        <div className="swipe-feedback delete-feedback">DELETE</div>
      )}
      
      <div className="photo-image">
        <img 
          src={photo.src} 
          alt={photo.name}
          style={{
            width: '100%',
            height: '300px',
            objectFit: 'cover',
            borderRadius: '20px 20px 0 0',
            pointerEvents: 'none'
          }}
        />
      </div>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3 style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '5px' }}>
          {photo.name}
        </h3>
        <p style={{ color: '#666', fontSize: '14px' }}>
          {photo.size}
        </p>
      </div>
    </div>
  )
}

export default PhotoCard