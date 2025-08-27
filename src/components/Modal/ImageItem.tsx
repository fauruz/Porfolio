// ImageItem.tsx
import React, { useState } from 'react';

type ImageItemProps = {
  image: {
    public_id: string;
    secure_url: string;
  };
  onImageClick?: (image: ImageItemProps['image']) => void; // ← Thêm dòng này
};

const ImageItem: React.FC<ImageItemProps> = React.memo(({ image, onImageClick }) => {
  const [loaded, setLoaded] = useState(false);

  const handleClick = () => {
    onImageClick?.(image); // ← Gọi callback khi click
  };

  return (
    <div 
      className="image-item" 
      onClick={handleClick} // ← Thêm onClick ở đây
      style={{ cursor: onImageClick ? 'pointer' : 'default' }} // ← Thêm cursor pointer
    >
      <img
        src={image.secure_url}
        alt={image.public_id}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        style={{ 
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease'
        }}
      />
      {!loaded && <div className="image-skeleton"></div>}
    </div>
  );
});

export default ImageItem;