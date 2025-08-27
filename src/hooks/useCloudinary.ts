import { useState, useEffect, useCallback, useMemo } from 'react';
import { API_BASE_URL } from "../config";

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
  clearCache: () => void;
}

// 📦 Cache configuration
const CACHE_DURATION = 30 * 60 * 1000; // 30 phút
const API_CALL_LIMIT = 50;

// 📊 Track API calls
let apiCallCount = 0;

const useCloudinary = (folder?: string): UseCloudinaryReturn => {
  const [images, setImages] = useState<CloudinaryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔑 Cache key
  const cacheKey = useMemo(
    () => (folder ? `cloudinary_images_${folder.replace(/\//g, "_")}` : null),
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
          console.log(
            `📦 Cache HIT for folder: ${folder} (age: ${Math.round(age / 1000 / 60)}min)`
          );
          return JSON.parse(cachedData);
        } else {
          console.log(
            `⏰ Cache EXPIRED for folder: ${folder} (age: ${Math.round(age / 1000 / 60)}min)`
          );
          localStorage.removeItem(cacheKey);
          localStorage.removeItem(`${cacheKey}_timestamp`);
        }
      }
    } catch (err) {
      console.warn("❌ Cache read error:", err);
      if (cacheKey) {
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(`${cacheKey}_timestamp`);
      }
    }

    return null;
  }, [cacheKey, folder]);

  // 💾 Set cached data
  const setCachedData = useCallback(
    (data: CloudinaryImage[]) => {
      if (!cacheKey || !data.length) return;

      try {
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
        console.log(`💾 Cached ${data.length} images for folder: ${folder}`);
      } catch (err) {
        console.warn("❌ Cache write error:", err);
        if (err instanceof Error && err.name === "QuotaExceededError") {
          console.log("🧹 Clearing old cache due to storage full");
          clearOldCache();
        }
      }
    },
    [cacheKey, folder]
  );

  // 🧹 Clear old cache
  const clearOldCache = () => {
    const keys = Object.keys(localStorage);
    const cloudinaryKeys = keys.filter((key) =>
      key.startsWith("cloudinary_images_")
    );

    cloudinaryKeys.forEach((key) => {
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

  // 🌐 Fetch images
  const fetchImages = useCallback(
    async (useCache = true) => {
      if (!folder) {
        setImages([]);
        setError(null);
        return;
      }

      // 📦 Cache first
      if (useCache) {
        const cachedImages = getCachedData();
        if (cachedImages) {
          setImages(cachedImages);
          setError(null);
          return;
        }
      }

      apiCallCount++;
      console.log(`🌐 API Call #${apiCallCount} - Folder: ${folder}`);

      setLoading(true);
      setError(null);

      try {
        const url = `${API_BASE_URL}/api/images?folder=${encodeURIComponent(folder)}`;
        const response = await fetch(url);

        if (!response.ok) {
          if (response.status === 420) {
            throw new Error("Rate Limit Exceeded! Chờ đến 17h mai để reset quota.");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const imagesData: CloudinaryImage[] = data.resources || data || [];

        setImages(imagesData);

        if (imagesData.length > 0) {
          setCachedData(imagesData);
        }

        console.log(`✅ Loaded ${imagesData.length} images for folder: ${folder}`);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error("❌ Fetch error:", errorMessage);
        setError(errorMessage);

        if (errorMessage.includes("Rate Limit")) {
          const staleCache = getCachedData();
          if (staleCache) {
            console.log("⚠️ Using stale cache due to rate limit");
            setImages(staleCache);
            setError("Using cached data (API limit reached)");
            return;
          }
        }

        setImages([]);
      } finally {
        setLoading(false);
      }
    },
    [folder, getCachedData, setCachedData]
  );

  // 🗑️ Clear cache cho folder hiện tại
  const clearCache = useCallback(() => {
    if (cacheKey) {
      localStorage.removeItem(cacheKey);
      localStorage.removeItem(`${cacheKey}_timestamp`);
      console.log(`🗑️ Cleared cache for folder: ${folder}`);
    }
  }, [cacheKey, folder]);

  // 🔄 Refetch
  const refetch = useCallback(() => {
    fetchImages(false);
  }, [fetchImages]);

  // 🚀 Auto load khi folder thay đổi
  useEffect(() => {
    if (folder) {
      fetchImages(true);
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
    clearCache,
  };
};

export default useCloudinary;
