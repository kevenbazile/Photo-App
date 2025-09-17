import { useState, useEffect } from 'react'
import PhotoCard from './components/PhotoCard'
import usePhotoUpload from './hooks/usePhotoUpload'

function App() {
  const { 
    photos, 
    currentIndex, 
    uploadPhotos, 
    nextPhoto, 
    getCurrentPhoto, 
    hasMorePhotos,
    totalPhotos 
  } = usePhotoUpload()

  const [keepCount, setKeepCount] = useState(0)
  const [deleteCount, setDeleteCount] = useState(0)
  const [photosToKeep, setPhotosToKeep] = useState([])
  const [photosToDelete, setPhotosToDelete] = useState([])

  // ✅ PWA Install Prompt state
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallButton, setShowInstallButton] = useState(false)

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallButton(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setShowInstallButton(false)
    }
  }

  const handleFileUpload = (event) => {
    uploadPhotos(event.target.files)
  }

  const handleSwipe = (direction) => {
    const currentPhoto = getCurrentPhoto()
    if (!currentPhoto) return

    if (direction === 'right') {
      setKeepCount(prev => prev + 1)
      setPhotosToKeep(prev => [...prev, currentPhoto])
    } else {
      setDeleteCount(prev => prev + 1)
      setPhotosToDelete(prev => [...prev, currentPhoto])
    }

    nextPhoto()
  }

  // ✅ Keyboard Shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!hasMorePhotos() || totalPhotos === 0) return
      
      switch(e.key) {
        case 'ArrowLeft':
        case 'x':
        case 'X':
          handleSwipe('left')
          break
        case 'ArrowRight':
        case ' ':
        case 'Enter':
          e.preventDefault()
          handleSwipe('right')
          break
        case 'r':
        case 'R':
          window.location.reload()
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [hasMorePhotos, totalPhotos])

  const currentPhoto = getCurrentPhoto()
  const remainingCount = totalPhotos - currentIndex

  if (totalPhotos === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center">
        <div className="app-container">
          <div className="header">
            <h1>📸 Photo Cleanup</h1>
            <p>Swipe to organize your photos</p>
          </div>
          
          {/* 🔥 Enhanced Upload Section */}
          <div className="upload-section">
            <h2>📱 Access Your Photos</h2>
            <p>Tap below to browse your photo gallery</p>
            
            <div 
              className="photo-picker-area"
              onClick={() => document.getElementById('fileInput').click()}
            >
              <div className="picker-icon">📷</div>
              <p>Tap to Open Photo Gallery</p>
              <span className="picker-subtitle">Select multiple photos at once</span>
            </div>
            
            <input 
              type="file" 
              id="fileInput" 
              multiple 
              accept="image/*" 
              capture="environment"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            
            <div className="features">
              <p>✅ Select multiple photos</p>
              <p>✅ Works offline</p>
              <p>✅ Nothing leaves your device</p>
            </div>
          </div>

          {/* ✅ Show Install Button if available */}
          {showInstallButton && (
            <button 
              className="install-btn"
              onClick={handleInstall}
            >
              📱 Install App
            </button>
          )}
        </div>
      </div>
    )
  }

  if (!hasMorePhotos()) {
    return (
      <div className="min-h-screen bg-gradient-to-br flex items-center justify-center">
        <div className="app-container">
          <div className="header">
            <h1>🎉 All Done!</h1>
            <p>You've organized all your photos</p>
            <div className="stats">
              <span>Kept: {keepCount}</span>
              <span>Deleted: {deleteCount}</span>
            </div>
          </div>
          
          <div className="results-section">
            <h2>Summary</h2>
            <p>✅ {keepCount} photos to keep</p>
            <p>🗑️ {deleteCount} photos to delete</p>
            
            <button 
              className="action-btn"
              onClick={() => window.location.reload()}
            >
              Start Over
            </button>

            {/* ✅ Install button here too */}
            {showInstallButton && (
              <button 
                className="install-btn"
                onClick={handleInstall}
              >
                📱 Install App
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br flex items-center justify-center">
      <div className="app-container">
        {/* ✅ Updated Header with progress bar */}
        <div className="header">
          <h1>📸 Photo Cleanup</h1>
          <p>Swipe to organize your photos</p>
          <div className="stats">
            <span>Kept: {keepCount}</span>
            <span>Deleted: {deleteCount}</span>
            <span>Remaining: {remainingCount}</span>
          </div>
          {totalPhotos > 0 && (
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(currentIndex / totalPhotos) * 100}%` }}
              ></div>
            </div>
          )}
        </div>
        
        <div className="card-container">
          {currentPhoto && (
            <PhotoCard 
              photo={currentPhoto}
              onSwipe={handleSwipe}
              isActive={true}
            />
          )}
        </div>
        
        <div className="action-buttons">
          <button 
            className="action-btn delete-btn"
            onClick={() => handleSwipe('left')}
          >
            ❌ Delete
          </button>
          <button 
            className="action-btn keep-btn"
            onClick={() => handleSwipe('right')}
          >
            💚 Keep
          </button>
        </div>

        {/* ✅ Floating Install Button */}
        {showInstallButton && (
          <button className="install-btn" onClick={handleInstall}>
            📱 Install App
          </button>
        )}

        {/* ✅ Shortcuts Helper */}
        {hasMorePhotos() && totalPhotos > 0 && (
          <div className="shortcuts-help">
            ← Delete | → Keep | R Restart
          </div>
        )}
      </div>
    </div>
  )
}

export default App
