# Go-Next Starter Template 🚀

**Full-stack starter template** with Go Fiber (Backend) + Next.js (Frontend) + PostgreSQL + JSONB Multi-language Support

Perfect for building modern web applications with authentication, file upload, multi-language content, and more.

---

## ✨ Features

### Backend (Go Fiber)
- ✅ **Authentication & Authorization** - JWT with refresh tokens + RBAC
- ✅ **JSONB Multi-language** - `MultiLangText` type for i18n support
- ✅ **File Upload** - Cloudflare R2 (S3-compatible) integration
- ✅ **Email Service** - SMTP support
- ✅ **Database** - PostgreSQL + GORM ORM
- ✅ **Security** - CORS, Rate Limiting, Password Hashing (bcrypt)
- ✅ **Middleware** - Auth, Admin, Permission-based access control

### Frontend (Next.js)
- ✅ **TypeScript** - Type-safe development
- ✅ **API Client** - Axios with automatic token refresh
- ✅ **Multi-language** - `MultiLangText` type + helper functions
- ✅ **Tailwind CSS** - Utility-first styling
- ✅ **next-intl** - Internationalization

---

## 📂 Project Structure

```
go-next-template/
├── backend/                    # Go Fiber Backend
│   ├── cmd/app/main.go        # Entry point
│   ├── internal/
│   │   ├── config/            # Database configuration
│   │   ├── models/            # GORM models (with MultiLangText)
│   │   ├── handlers/          # HTTP handlers
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Auth, Admin, CORS
│   │   └── routes/            # Route definitions
│   ├── pkg/utils/             # Utilities (JWT, Password, Response)
│   ├── .env.example           # Environment variables template
│   ├── Dockerfile             # Docker configuration
│   └── go.mod
│
└── frontend/                  # Next.js Frontend
    ├── src/
    │   ├── app/               # Next.js App Router
    │   ├── components/        # React components
    │   ├── services/api.ts    # Axios API client
    │   └── types/common.ts    # TypeScript types (MultiLangText)
    ├── package.json
    └── .env.local.example
```

---

## 🚀 Quick Start

### Prerequisites
- **Go 1.22+**
- **Node.js 18+**
- **PostgreSQL 15+**
- **Docker** (optional)

### 1. Clone Template

```bash
git clone https://github.com/your-org/go-next-template.git my-project
cd my-project
rm -rf .git
git init
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
go mod download

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
# - DATABASE_URL
# - JWT_SECRET (generate with: openssl rand -base64 32)
# - R2 credentials (optional)
# - SMTP credentials (optional)

# Run PostgreSQL (Docker)
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15

# Run backend
go run cmd/app/main.go

# Backend API: http://localhost:8080
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1

# Run development server
npm run dev

# Frontend: http://localhost:3000
```

---

## 🗄️ Database Schema

### Core Tables

The template includes these core tables:

1. **users** - User authentication
2. **roles** - RBAC roles with JSONB permissions
3. **refresh_tokens** - JWT refresh tokens
4. **password_resets** - Password reset tokens
5. **settings** - Application settings
6. **media** - File uploads (R2)
7. **audit_logs** - Audit trail

### Auto-Migration

GORM auto-migration runs on startup. Models defined in `internal/models/` are automatically migrated.

---

## 🌍 Multi-language Support (JSONB)

### Backend (Go)

**MultiLangText Type:**
```go
// internal/models/multi_lang_text.go
type MultiLangText map[string]string

// Example usage
type Product struct {
    ID          string        `gorm:"primaryKey"`
    Name        MultiLangText `gorm:"type:jsonb;not null"` // {"th": "", "en": "Name", "de": ""}
    Description MultiLangText `gorm:"type:jsonb"`
}

// Get text in specific language
name := product.Name.Get("en") // Returns English text with fallback
```

**Database Schema:**
```sql
CREATE TABLE products (
    id UUID PRIMARY KEY,
    name JSONB NOT NULL,
    description JSONB,
    CHECK (name ? 'en' AND name->>'en' IS NOT NULL) -- English required
);
```

### Frontend (TypeScript)

**MultiLangText Type:**
```typescript
// src/types/common.ts
export type MultiLangText = {
  th?: string;
  en: string;  // Required
  de?: string;
};

// Helper function
export function getLocalizedText(
  text: MultiLangText | undefined,
  locale: string
): string {
  if (!text) return '';
  return text[locale] || text.en || '';
}

// Usage in component
import { useLocale } from 'next-intl';

export function ProductCard({ product }) {
  const locale = useLocale();

  return (
    <div>
      <h3>{getLocalizedText(product.name, locale)}</h3>
      <p>{getLocalizedText(product.description, locale)}</p>
    </div>
  );
}
```

---

## 🔐 Authentication

### Login Flow

**1. Register:**
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**2. Login:**
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "user": { ... }
  }
}
```

**3. Access Protected Endpoint:**
```http
GET /api/v1/auth/me
Authorization: Bearer {access_token}
```

**4. Refresh Token:**
```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGc..."
}

Response:
{
  "success": true,
  "data": {
    "access_token": "new_token..."
  }
}
```

### Frontend Authentication

The Axios interceptor **automatically handles token refresh**:

```typescript
// src/services/api.ts
// Automatically adds Authorization header
// Automatically refreshes expired tokens
import api from '@/services/api';

// Just call API - auth is handled automatically
const user = await api.get('/auth/me');
```

---

## 🔧 Customization Guide

### 1. Add New Model with Multi-language

**Backend:**
```go
// internal/models/post.go
package models

type Post struct {
    ID          uuid.UUID     `gorm:"type:uuid;primaryKey"`
    Title       MultiLangText `gorm:"type:jsonb;not null"`
    Content     MultiLangText `gorm:"type:jsonb"`
    AuthorID    uuid.UUID     `gorm:"type:uuid"`
    Author      User          `gorm:"foreignKey:AuthorID"`
    CreatedAt   time.Time
    UpdatedAt   time.Time
}
```

**Migration:**
```sql
-- Add to migrations/002_posts.sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title JSONB NOT NULL,
    content JSONB,
    author_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (title ? 'en' AND title->>'en' IS NOT NULL)
);
```

**Frontend:**
```typescript
// src/types/post.ts
export interface Post {
  id: string;
  title: MultiLangText;
  content: MultiLangText;
  author_id: string;
  created_at: string;
  updated_at: string;
}
```

### 2. Add New Endpoint

**Handler:**
```go
// internal/handlers/post_handler.go
func (h *PostHandler) GetPosts(c *fiber.Ctx) error {
    var posts []models.Post
    if err := config.DB.Find(&posts).Error; err != nil {
        return utils.ErrorResponse(c, fiber.StatusInternalServerError, err.Error())
    }
    return utils.SuccessResponse(c, posts)
}
```

**Route:**
```go
// internal/routes/routes.go
posts := api.Group("/posts")
posts.Get("/", postHandler.GetPosts)
posts.Post("/", middleware.AuthRequired, postHandler.CreatePost)
```

### 3. Add Admin-Only Endpoint

```go
admin := api.Group("/admin", middleware.AuthRequired, middleware.AdminOnly)
admin.Get("/users", userHandler.GetAllUsers)
admin.Delete("/users/:id", userHandler.DeleteUser)
```

---

## 🐳 Deployment

### Backend (Railway)

1. **Push to GitHub**
2. **Connect Railway**:
   - New Project → Deploy from GitHub
   - Add PostgreSQL plugin
3. **Set Environment Variables** (from `.env.example`)
4. **Deploy!**

Railway automatically uses the `Dockerfile`.

### Frontend (Vercel)

1. **Push to GitHub**
2. **Import to Vercel**
3. **Set Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api/v1
   ```
4. **Deploy!**

---

## 📝 Environment Variables

### Backend (.env)

```env
PORT=8080
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-super-secret-key
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

---

## 🧪 Testing

```bash
# Backend tests
cd backend
go test ./...

# Frontend tests
cd frontend
npm test
```

---

## 📚 Documentation

- **Backend Documentation**: `/backend/README.md`
- **API Documentation**: See `D:\syaco\WAT-PROFILE\docs\backend\README.md` for comprehensive API examples
- **Multi-language Guide**: See `D:\syaco\WAT-PROFILE\docs\template\README.md`

---

## 🤝 Contributing

This is a template project. Fork it, customize it, make it your own!

---

## 📄 License

MIT License - Free to use for any project

---

## 🎯 Next Steps

1. ✅ Clone this template
2. ✅ Customize models for your domain (Blog, E-commerce, etc.)
3. ✅ Add your business logic
4. ✅ Deploy to production
5. ✅ Build something awesome!

---

**Built with ❤️ using Go Fiber and Next.js**

For questions or issues, refer to the comprehensive documentation in `/docs/template/README.md`
#   g o - n e x t - t e m p l a t e  
 #   g o - n e x t - t e m p l a t e  
 