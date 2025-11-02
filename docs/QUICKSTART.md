# 🚀 Quick Start Guide

Hướng dẫn chạy Medical Deep-Research Chat System với Docker.

## 📋 Yêu cầu hệ thống

- Docker và Docker Compose
- Ít nhất 4GB RAM
- 10GB dung lượng trống

## 🔧 Cài đặt và chạy

### 1. Clone dự án và di chuyển vào thư mục

```bash
cd "Medical Deep-Research Chat System"
```

### 2. Kiểm tra file cấu hình

Đảm bảo file `.env` chứa API keys:

```bash
SERPER_API_KEY=ebb93c8f37924c0ebb979860e8409e39b275b6d2
GEMINI_API_KEY=AlzaSyAjBABJxT7FCDy8zIOSUBcMrQYQoKiVN3M
```

### 3. Build và chạy tất cả services

```bash
# Build và start tất cả containers
docker-compose up -d --build

# Hoặc chạy từng bước:
# Build images
docker-compose build

# Start services
docker-compose up -d
```

### 4. Kiểm tra trạng thái services

```bash
# Xem logs
docker-compose logs -f

# Kiểm tra trạng thái containers
docker-compose ps

# Kiểm tra health của các services
docker-compose exec backend curl http://localhost:8000/api/health
```

### 5. Truy cập ứng dụng

- **Frontend**: http://localhost:1000
- **Backend API**: http://localhost:2000
- **API Docs**: http://localhost:2000/docs
- **Qdrant DB**: http://localhost:6333/dashboard

## 🧪 Test hệ thống

### Test API endpoint

```bash
# Health check
curl http://localhost:2000/api/health

# Test chat endpoint
curl -X POST http://localhost:2000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is diabetes?", "include_web_search": true}'
```

### Test file upload

```bash
# Upload a test file
curl -X POST http://localhost:2000/api/upload \
  -F "file=@/path/to/your/document.pdf"
```

## 🔍 Troubleshooting

### Container không start được

```bash
# Xem logs chi tiết
docker-compose logs backend
docker-compose logs frontend
docker-compose logs qdrant

# Restart services
docker-compose restart

# Clean build (nếu có vấn đề với cache)
docker-compose down -v
docker-compose up -d --build --force-recreate
```

### Frontend không load được

1. Kiểm tra backend có chạy không:
   ```bash
   curl http://localhost:2000/api/health
   ```

2. Kiểm tra CORS settings trong backend

3. Clear browser cache

### API calls bị lỗi

1. Kiểm tra API keys trong `.env`
2. Kiểm tra network connectivity
3. Xem logs backend: `docker-compose logs backend`

### Qdrant connection issues

```bash
# Kiểm tra Qdrant health
curl http://localhost:6333/health

# Restart Qdrant
docker-compose restart qdrant
```

## 📊 Development Mode

Để chạy ở development mode với hot reload:

```bash
# Backend only (với code reload)
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 2000

# Frontend only (với hot reload)
cd frontend
npm install
npm start
```

## 🛠️ Commands hữu ích

```bash
# Stop tất cả services
docker-compose down

# Stop và xóa volumes (reset data)
docker-compose down -v

# View resource usage
docker stats

# Access container shell
docker-compose exec backend bash
docker-compose exec frontend sh

# Update một service cụ thể
docker-compose up -d --build backend
```

## 🎯 Next Steps

1. **Test basic chat**: Hỏi câu hỏi y khoa đơn giản
2. **Upload documents**: Thử upload PDF/DOCX
3. **Check citations**: Xem sources và links
4. **Monitor performance**: Theo dõi logs và metrics

## 🚨 Production Deployment

Để deploy production:

1. Cập nhật `.env` với production values
2. Setup SSL certificates trong `nginx/ssl/`
3. Enable HTTPS trong nginx config
4. Configure proper domain names
5. Setup monitoring và backup

## 🆘 Hỗ trợ

Nếu gặp vấn đề:

1. Kiểm tra logs: `docker-compose logs -f`
2. Verify API keys trong `.env`
3. Ensure ports không bị conflict
4. Check Docker và system resources
