import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ImageItem from './ImageItem';
import useCloudinary from '../../hooks/useCloudinary';
import './Modal.css';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  folder?: string;
  children?: React.ReactNode;
};

interface SelectedImage {
  public_id: string;
  secure_url: string;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, folder, children }) => {
  const { images, loading, error, refetch } = useCloudinary(folder);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(-1);

  // Tìm index của ảnh được chọn
  useEffect(() => {
    if (selectedImage && images.length > 0) {
      const index = images.findIndex(img => img.public_id === selectedImage.public_id);
      setSelectedImageIndex(index);
    }
  }, [selectedImage, images]);

  // Xử lý điều hướng ảnh
  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    if (images.length === 0) return;
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = selectedImageIndex <= 0 ? images.length - 1 : selectedImageIndex - 1;
    } else {
      newIndex = selectedImageIndex >= images.length - 1 ? 0 : selectedImageIndex + 1;
    }
    
    setSelectedImage(images[newIndex]);
  }, [selectedImageIndex, images]);

  // ⌨️ Keyboard handler với useCallback
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (selectedImage) {
        setSelectedImage(null); // ← ESC để tắt ảnh phóng to
      } else {
        onClose(); // ← ESC để tắt modal
      }
    } else if (selectedImage) {
      // Thêm điều hướng bằng bàn phím
      if (e.key === 'ArrowLeft') {
        navigateImage('prev');
      } else if (e.key === 'ArrowRight') {
        navigateImage('next');
      }
    }
  }, [selectedImage, onClose, navigateImage]);

  // 🔧 Modal backdrop click handler
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (selectedImage) {
        setSelectedImage(null); // ← Click ngoài để tắt ảnh phóng to
      } else {
        onClose(); // ← Click ngoài để tắt modal
      }
    }
  }, [selectedImage, onClose]);

  // 🖼️ Handle image click để phóng to
  const handleImageClick = useCallback((image: SelectedImage) => {
    setSelectedImage(image);
  }, []);

  // 🔄 Refresh handler
  const handleRefresh = useCallback(() => {
    console.log('🔄 User manually refreshing gallery');
    refetch();
  }, [refetch]);

  // 📊 Memoize gallery stats
  const galleryStats = useMemo(() => {
    return {
      totalImages: images.length,
      folderName: folder || 'Unknown',
      hasImages: images.length > 0,
      isEmpty: !loading && !error && images.length === 0
    };
  }, [images.length, folder, loading, error]);

  // ⌨️ Setup keyboard listener
  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [open, handleKeyDown]);

  // 🚫 Don't render if not open
  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>
        
        <div className="modal-body">
          <div className="gallery-header">
            <h2>
              📁 {galleryStats.folderName} 
              {!loading && (
                <span className="image-count">({galleryStats.totalImages})</span>
              )}
            </h2>
            
            <div className="gallery-actions">
              <button 
                onClick={handleRefresh} 
                className="refresh-btn"
                disabled={loading}
                title="Refresh gallery"
              >
                {loading ? '⏳' : '🔄'} Refresh
              </button>
            </div>
          </div>

          {/* 🔄 Loading State */}
          {loading && (
            <div className="loading">
              <div className="loading-spinner"></div>
              <span>Đang tải ảnh từ {galleryStats.folderName}...</span>
            </div>
          )}
          
          {/* ❌ Error State */}
          {error && !loading && (
            <div className="error">
              <span className="error-icon">⚠️</span>
              <div className="error-content">
                <p>{error}</p>
                <button onClick={handleRefresh} className="retry-btn">
                  🔄 Thử lại
                </button>
              </div>
            </div>
          )}

          {/* 📂 Empty State */}
          {galleryStats.isEmpty && (
            <div className="empty">
              <span className="empty-icon">📂</span>
              <p>Không có ảnh trong folder "{galleryStats.folderName}"</p>
              <button onClick={handleRefresh} className="retry-btn">
                🔄 Làm mới
              </button>
            </div>
          )}

          {/* 🖼️ Image Grid */}
          {galleryStats.hasImages && !loading && (
            <>
              <div className="image-grid">
                {images.map((image) => (
                  <ImageItem 
                    key={image.public_id} 
                    image={image} 
                    onImageClick={handleImageClick} // ← Truyền callback xuống
                  />
                ))}
              </div>
              
              <div className="gallery-footer">
                <small>
                  📷 {galleryStats.totalImages} ảnh được tải từ cache/API
                </small>
              </div>
            </>
          )}

          {children}
        </div>
      </div>

      {/* 🖼️ Overlay phóng to ảnh */}
      {selectedImage && (
        <div 
          className="image-overlay" 
          onClick={() => setSelectedImage(null)}
        >
          <div className="image-overlay-content">
            <button 
              className="nav-arrow nav-arrow-left"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              aria-label="Previous image"
            >
              &#8249;
            </button>
            
            <img 
              src={selectedImage.secure_url} 
              alt={selectedImage.public_id}
              onClick={(e) => e.stopPropagation()} // ← Ngăn click trên ảnh đóng overlay
            />
            
            <button 
              className="nav-arrow nav-arrow-right"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              aria-label="Next image"
            >
              &#8250;
            </button>
            
            <button 
              className="close-overlay"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;