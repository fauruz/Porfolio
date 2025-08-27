const express = require('express');
const cloudinary = require('cloudinary').v2;
const cors = require('cors');
require('dotenv').config(); // 👈 load biến môi trường

const app = express();
const PORT = process.env.PORT || 3000;

// Cấu hình Cloudinary
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Middleware
app.use(cors());
app.use(express.json());

// API lấy danh sách ảnh
app.get('/api/images', async (req, res) => {
  try {
    const { folder } = req.query;
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: folder ? `${folder}/` : '',
      max_results: 100,
      timestamp: Date.now()
    });
    res.json(result.resources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API lấy ảnh mới nhất
app.get('/api/latest-image/:folder', async (req, res) => {
  try {
    const { folder } = req.params;
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: `${folder}/`,
      max_results: 100,
      timestamp: Date.now()
    });

    if (result.resources && result.resources.length > 0) {
      const sortedImages = result.resources.sort((a, b) =>
        b.public_id.localeCompare(a.public_id)
      );
      res.json(sortedImages[0]);
    } else {
      res.status(404).json({ error: 'No images found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API debug
app.get('/api/debug/:folder', async (req, res) => {
  try {
    const { folder } = req.params;
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: `${folder}/`,
      max_results: 100,
      timestamp: Date.now()
    });

    if (result.resources && result.resources.length > 0) {
      const sortedImages = result.resources.sort((a, b) =>
        b.public_id.localeCompare(a.public_id)
      );
      res.json({
        total: sortedImages.length,
        images: sortedImages.map(img => ({
          public_id: img.public_id,
          created_at: img.created_at,
          uploaded_at: img.uploaded_at
        }))
      });
    } else {
      res.json({ total: 0, images: [] });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Khởi động server
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
