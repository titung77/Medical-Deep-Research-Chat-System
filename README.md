# Medical Deep-Research Chat System 🏥🔬

Một hệ thống chat AI chuyên sâu cho nghiên cứu y khoa, tương tự Perplexity nhưng tập trung vào lĩnh vực y tế.

## 🌟 Tính năng chính

- **Web & Domain Research**: Crawl và index nội dung từ các domain y khoa (PubMed, WHO, NIH, etc.)
- **File Upload Research**: Upload PDF/DOCX → trích xuất và embedding
- **Chat Interface**: Giao diện chat thông minh với citation và link nguồn
- **Hybrid Search**: Kết hợp Serper.dev + Gemini cho tìm kiếm real-time

## 🏗️ Kiến trúc

```
Frontend (React TS) → FastAPI Backend → Serper.dev + Gemini + Qdrant Vector DB
```

## 🚀 Cài đặt nhanh

```bash
# Clone project
git clone <repo-url>
cd "Medical Deep-Research Chat System"

# Chạy với Docker Compose
docker-compose up -d

# Truy cập ứng dụng
http://localhost:3000
```

## 📁 Cấu trúc thư mục

```
Medical Deep-Research Chat System/
├── backend/          # FastAPI Python backend
├── frontend/         # React TypeScript frontend  
├── nginx/           # Reverse proxy config
├── docs/            # Documentation
├── docker-compose.yml
└── README.md
```

## 🔧 Cấu hình

Tạo file `.env` với các API keys:

```bash
SERPER_API_KEY=your_serper_key
GEMINI_API_KEY=your_gemini_key
QDRANT_URL=http://qdrant:6333
```

## 📋 Roadmap

- [x] Phase 1: MVP - Core Chat + Serper Integration
- [ ] Phase 2: Medical Domain Enrichment
- [ ] Phase 3: File Upload & Document Research
- [ ] Phase 4: Multi-modal & Clinical Data
- [ ] Phase 5: Optimization & Deployment

## 🔗 API Endpoints

- `POST /api/chat` - Chat với AI
- `POST /api/upload` - Upload tài liệu
- `GET /api/search` - Tìm kiếm trong cơ sở dữ liệu
- `POST /api/index` - Index website mới

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request
