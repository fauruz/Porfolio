import { useState, useEffect, useCallback, useMemo } from 'react';

interface CloudinaryImage {
  public_id: string;
  secure_url: string;
}

interface UseLatestImageReturn {
  imageUrl: string;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// 📦 Cache ngắn hơn cho latest image
const LATEST_CACHE_DURATION = 10 * 60 * 1000; // 10 phút

const useLatestImage = (folder: string): UseLatestImageReturn => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔑 Cache key
  const cacheKey = useMemo(() => 
    folder ? `latest_image_${folder.replace(/\//g, '_')}` : null, 
    [folder]
  );

  // 📦 Get cached latest image
  const getCachedLatest = useCallback((): string | null => {
    if (!cacheKey) return null;

    try {
      const cachedUrl = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);

      if (cachedUrl && cachedTimestamp) {
        const age = Date.now() - parseInt(cachedTimestamp);
        
        if (age < LATEST_CACHE_DURATION) {
          console.log(`📦 Latest image cache HIT for: ${folder}`);
          return cachedUrl;
        } else {
          // Xóa cache hết hạn
          localStorage.removeItem(cacheKey);
          localStorage.removeItem(`${cacheKey}_timestamp`);
        }
      }
    } catch (err) {
      console.warn('❌ Latest image cache error:', err);
    }

    return null;
  }, [cacheKey, folder]);

  // 💾 Cache latest image
  const setCachedLatest = useCallback((url: string) => {
    if (!cacheKey || !url) return;

    try {
      localStorage.setItem(cacheKey, url);
      localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
      console.log(`💾 Cached latest image for: ${folder}`);
    } catch (err) {
      console.warn('❌ Latest image cache write error:', err);
    }
  }, [cacheKey, folder]);

  // 🌐 Fetch latest image
  const fetchLatestImage = useCallback(async (useCache = true) => {
    if (!folder) {
      setImageUrl('');
      setError(null);
      return;
    }

    // 📦 Check cache first
    if (useCache) {
      const cachedUrl = getCachedLatest();
      if (cachedUrl) {
        setImageUrl(cachedUrl);
        setError(null);
        return; // 👈 RETURN = No API call = Save quota!
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/api/latest-image/${folder}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setImageUrl('');
          setError('No images found');
          return;
        }
        if (response.status === 420) {
          throw new Error('Rate Limit Exceeded!');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CloudinaryImage = await response.json();
      
      if (data.secure_url && data.secure_url !== imageUrl) {
        setImageUrl(data.secure_url);
        setCachedLatest(data.secure_url);
        console.log(`✅ Latest image loaded for: ${folder}`);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ Latest image fetch error:', errorMessage);
      setError(errorMessage);

      // Try stale cache if rate limited
      if (errorMessage.includes('Rate Limit')) {
        const staleUrl = getCachedLatest();
        if (staleUrl) {
          console.log('⚠️ Using stale latest image cache');
          setImageUrl(staleUrl);
          setError('Using cached image (API limit reached)');
        }
      }
    } finally {
      setLoading(false);
    }
  }, [folder, imageUrl, getCachedLatest, setCachedLatest]);

  // 🔄 Refetch function
  const refetch = useCallback(() => {
    fetchLatestImage(false); // Bypass cache
  }, [fetchLatestImage]);

  useEffect(() => {
    if (folder) {
      fetchLatestImage(true); // Use cache
    } else {
      setImageUrl('');
      setError(null);
    }
  }, [folder, fetchLatestImage]);

  return { 
    imageUrl, 
    loading, 
    error, 
    refetch 
  };
};
export default useLatestImage;