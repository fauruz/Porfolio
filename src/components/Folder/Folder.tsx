import React, { memo } from 'react';
import "./Folder.css";

type FolderProps = {
  imageSrc?: string;
  title?: string;
  loading?: boolean;
  error?: string | null;
  onOpen?: () => void;
};

// 🚀 Memo để tránh re-render không cần thiết
const Folder: React.FC<FolderProps> = memo(({ 
  imageSrc = "/main.jpg", 
  title = "Collection", 
  loading = false,
  error = null,
  onOpen 
}) => {
  // 🖼️ Handle image loading states
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    // Fallback to default image
    if (target.src !== '/main.jpg') {
      target.src = '/main.jpg';
    }
  };

  return (
    <div className="folder-wrapper">
      <button 
        className="folder-custom" 
        onClick={onOpen} 
        aria-label={`Open ${title}`}
        disabled={loading} // 🚫 Disable khi đang loading
      >
        {/* LỚP 1 */}
        <div className="layer-1">
          <div className="layer-1-body"></div>
          <div className="layer-1-top-edge"></div>
          <div className="layer-1-bottom-edge"></div>
        </div>

        <div className="folder-image-container">
          {loading ? (
            // 🔄 Loading state
            <div className="folder-loading">
              <div className="loading-spinner"></div>
              <span>Loading...</span>
            </div>
          ) : error ? (
            // ❌ Error state
            <div className="folder-error">
              <span>❌</span>
              <small>Error loading image</small>
            </div>
          ) : (
            // ✅ Normal state
            <img 
              src={imageSrc} 
              alt={title} 
              className="folder-image"
              onError={handleImageError}
              loading="lazy" // 🚀 Lazy loading
            />
          )}
        </div>

        {/* LỚP 2 */}
        <div className="layer-2">
          <div className="layer-2-body"></div>
          <div className="layer-2-top-edge"></div>
          <div className="layer-2-bottom-edge"></div>
        </div>
      </button>
      
      <h1 className="folder-title">
        {title}
        {loading && <span className="title-loading"> ⏳</span>}
        {error && <span className="title-error"> ❌</span>}
      </h1>
    </div>
  );
});

// 🏷️ Display name for debugging
Folder.displayName = 'Folder';

export default Folder;