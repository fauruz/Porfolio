import { useState, useEffect, useCallback, useMemo } from 'react';

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  bytes: number;
  format: string;
}

interface UseCloudinaryReturn {
  images: CloudinaryImage[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  clearCache: () => void; // 👈 NEW: Xóa cache thủ công
}

// 📦 Cache configuration
const CACHE_DURATION = 30 * 60 * 1000; // 30 phút
const API_CALL_LIMIT = 50; // 👈 Giảm từ 100 xuống 50

// 📊 Track API calls (để debug)
let apiCallCount = 0;

const useCloudinary = (folder?: string): UseCloudinaryReturn => {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔑 Cache key dựa trên folder
  const cacheKey = useMemo(() => 
    folder ? `cloudinary_images_${folder.replace(/\//g, '_')}` : null, 
    [folder]
  );

  // 📦 Get cached data
  const getCachedData = useCallback((): CloudinaryImage[] | null => {
    if (!cacheKey) return null;

    try {
      const cachedData = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);

      if (cachedData && cachedTimestamp) {
        const age = Date.now() - parseInt(cachedTimestamp);
        
        if (age < CACHE_DURATION) {
          console.log(`📦 Cache HIT for folder: ${folder} (age: ${Math.round(age/1000/60)}min)`);
          return JSON.parse(cachedData);
        } else {
          console.log(`⏰ Cache EXPIRED for folder: ${folder} (age: ${Math.round(age/1000/60)}min)`);
          // Xóa cache hết hạn
          localStorage.removeItem(cacheKey);
          localStorage.removeItem(`${cacheKey}_timestamp`);
        }
      }
    } catch (err) {
      console.warn('❌ Cache read error:', err);
      // Xóa cache lỗi
      if (cacheKey) {
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(`${cacheKey}_timestamp`);
      }
    }

    return null;
  }, [cacheKey, folder]);

  // 💾 Set cached data
  const setCachedData = useCallback((data: CloudinaryImage[]) => {
    if (!cacheKey || !data.length) return;

    try {
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
      console.log(`💾 Cached ${data.length} images for folder: ${folder}`);
    } catch (err) {
      console.warn('❌ Cache write error:', err);
      // Có thể do localStorage full, thử xóa cache cũ
      if (err instanceof Error && err.name === 'QuotaExceededError') {
        console.log('🧹 Clearing old cache due to storage full');
        clearOldCache();
      }
    }
  }, [cacheKey, folder]);

  // 🧹 Clear old cache entries
  const clearOldCache = () => {
    const keys = Object.keys(localStorage);
    const cloudinaryKeys = keys.filter(key => key.startsWith('cloudinary_images_'));
    
    // Xóa những cache cũ nhất
    cloudinaryKeys.forEach(key => {
      const timestampKey = `${key}_timestamp`;
      const timestamp = localStorage.getItem(timestampKey);
      
      if (timestamp) {
        const age = Date.now() - parseInt(timestamp);
        if (age > CACHE_DURATION) {
          localStorage.removeItem(key);
          localStorage.removeItem(timestampKey);
          console.log(`🗑️ Removed old cache: ${key}`);
        }
      }
    });
  };

  // 🌐 Fetch images từ API
  const fetchImages = useCallback(async (useCache = true) => {
    // ❌ Không fetch nếu folder undefined/empty
    if (folder === undefined || folder === '') {
      setImages([]);
      setError(null);
      return;
    }

    // 📦 Kiểm tra cache trước khi gọi API
    if (useCache) {
      const cachedImages = getCachedData();
      if (cachedImages) {
        setImages(cachedImages);
        setError(null);
        return; // 👈 RETURN sớm = KHÔNG gọi API = TIẾT KIỆM quota!
      }
    }

    // 🚦 Track API calls
    apiCallCount++;
    console.log(`🌐 API Call #${apiCallCount} - Folder: ${folder}`);

    setLoading(true);
    setError(null);

    try {
      const url = `http://localhost:3000/api/images?folder=${encodeURIComponent(folder)}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 420) {
          throw new Error('Rate Limit Exceeded! Chờ đến 17h mai để reset quota.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const imagesData = data.resources || data || [];

      setImages(imagesData);
      
      // 💾 Cache kết quả nếu có data
      if (imagesData.length > 0) {
        setCachedData(imagesData);
      }

      console.log(`✅ Loaded ${imagesData.length} images for folder: ${folder}`);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Fetch error:', errorMessage);
      setError(errorMessage);

      // 🆘 Nếu lỗi rate limit, thử dùng cache cũ (stale cache)
      if (errorMessage.includes('Rate Limit')) {
        const staleCache = getCachedData();
        if (staleCache) {
          console.log('⚠️ Using stale cache due to rate limit');
          setImages(staleCache);
          setError('Using cached data (API limit reached)');
          return;
        }
      }
      
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [folder, getCachedData, setCachedData]);

  // 🗑️ Clear cache cho folder hiện tại
  const clearCache = useCallback(() => {
    if (cacheKey) {
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(`${cacheKey}_timestamp`);
      console.log(`🗑️ Cleared cache for folder: ${folder}`);
    }
  }, [cacheKey, folder]);

  // 🔄 Refetch = force fetch mới (bypass cache)
  const refetch = useCallback(() => {
    fetchImages(false); // useCache = false
  }, [fetchImages]);

  // 🚀 Auto load khi folder thay đổi
  useEffect(() => {
    if (folder && folder !== '') {
      fetchImages(true); // useCache = true
    } else {
      setImages([]);
      setError(null);
    }
  }, [folder, fetchImages]);

  return { 
    images, 
    loading, 
    error, 
    refetch,
    clearCache 
  };
};
export default useCloudinary;