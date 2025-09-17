import { useState } from 'react'

function usePhotoUpload() {
  const [photos, setPhotos] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const uploadPhotos = (files) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const newPhoto = {
            id: Date.now() + Math.random(),
            name: file.name,
            size: formatFileSize(file.size),
            src: e.target.result,
            file: file
          }
          setPhotos(prev => [...prev, newPhoto])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const formatFileSize = (bytes) => {
    const sizes = ['B', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const nextPhoto = () => {
    setCurrentIndex(prev => prev + 1)
  }

  const getCurrentPhoto = () => {
    return photos[currentIndex]
  }

  const hasMorePhotos = () => {
    return currentIndex < photos.length
  }

  return {
    photos,
    currentIndex,
    uploadPhotos,
    nextPhoto,
    getCurrentPhoto,
    hasMorePhotos,
    totalPhotos: photos.length
  }
}

export default usePhotoUpload