# TechToolReviews Backend API Testing Guide

## 🚀 Server Status

The backend server is now fully functional and running on **port 5000**.

### Health Check
- **Endpoint**: `GET /api/health`
- **URL**: http://localhost:5000/api/health

---

## 📝 API Routes

### Blog Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all posts (paginated, filterable) |
| GET | `/api/posts/:slug` | Get post by slug |
| POST | `/api/posts` | Create new post (admin) |
| PUT | `/api/posts/:id` | Update post (admin) |
| DELETE | `/api/posts/:id` | Delete post (admin) |

**Query Parameters for GET /api/posts**:
- `page` (default: 1) - Page number for pagination
- `limit` (default: 10) - Items per page
- `category` - Filter by category slug
- `tag` - Filter by tag name
- `search` - Search in title and content

**Example**:
```
GET /api/posts?page=1&limit=10&search=javascript
```

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:slug` | Get category by slug |
| POST | `/api/categories` | Create category (admin) |
| PUT | `/api/categories/:id` | Update category (admin) |
| DELETE | `/api/categories/:id` | Delete category (admin) |

### Tags
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tags` | Get all tags |
| GET | `/api/tags/:slug` | Get tag by slug |
| POST | `/api/tags` | Create tag (admin) |
| PUT | `/api/tags/:id` | Update tag (admin) |
| DELETE | `/api/tags/:id` | Delete tag (admin) |

### Email Subscriptions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/subscribe` | Subscribe to newsletter |
| POST | `/api/subscribe/verify` | Verify email subscription |
| POST | `/api/subscribe/unsubscribe` | Unsubscribe from newsletter |
| GET | `/api/subscribe/stats` | Get subscription statistics (admin) |

**Subscribe Request Body**:
```json
{
  "email": "user@example.com",
  "preferences": {
    "weeklyDigest": true,
    "newPosts": true
  }
}
```

**Verify Request Body**:
```json
{
  "token": "verification_token_from_email"
}
```

### Social Links
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/social-links` | Get all social links |
| POST | `/api/social-links` | Create social link (admin) |
| PUT | `/api/social-links/:platform` | Update social link (admin) |
| DELETE | `/api/social-links/:platform` | Delete social link (admin) |
| GET | `/api/redirect/:platform` | Redirect to social platform (tracks clicks) |

**Social Link Request Body**:
```json
{
  "platform": "twitter",
  "url": "https://twitter.com/techtoolreviews",
  "displayName": "Twitter",
  "order": 1
}
```

### Media Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/media` | Get all media (paginated) |
| GET | `/api/media/:id` | Get media by ID |
| POST | `/api/media/upload` | Upload media file |
| PUT | `/api/media/:id` | Update media metadata |
| DELETE | `/api/media/:id` | Delete media |

**Query Parameters for GET /api/media**:
- `page` (default: 1) - Page number for pagination
- `limit` (default: 20) - Items per page
- `tags` - Filter by comma-separated tag names
- `type` - Filter by 'image' or 'document'

**Upload Request** (multipart/form-data):
- `file` - The file to upload (max 10MB)
- `uploadedBy` - User who uploaded (optional)
- `alt` - Alt text for images (optional)
- `caption` - Image caption (optional)
- `tags` - Comma-separated tags (optional)

---

## 🧪 Testing with cURL

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

### 2. Get All Posts
```bash
curl http://localhost:5000/api/posts
```

### 3. Get All Categories
```bash
curl http://localhost:5000/api/categories
```

### 4. Get All Tags
```bash
curl http://localhost:5000/api/tags
```

### 5. Subscribe to Newsletter
```bash
curl -X POST http://localhost:5000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "preferences": {
      "weeklyDigest": true,
      "newPosts": true
    }
  }'
```

### 6. Get Social Links
```bash
curl http://localhost:5000/api/social-links
```

### 7. Get All Media
```bash
curl http://localhost:5000/api/media
```

### 8. Upload Media File
```bash
curl -X POST http://localhost:5000/api/media/upload \
  -F "file=@path/to/image.jpg" \
  -F "alt=Example image" \
  -F "caption=An example" \
  -F "uploadedBy=admin"
```

---

## 🔑 Environment Variables

The following environment variables are configured:

```
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/techtoolreviews
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Email Service (Optional)
# For SendGrid:
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@techtoolreviews.com

# For SMTP (Alternative):
EMAIL_SERVICE=smtp
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

---

## 📚 Data Models

### Blog Post
```json
{
  "title": "Article Title",
  "slug": "article-title",
  "excerpt": "Short summary",
  "content": "Full article content",
  "category": "category-slug",
  "tags": ["tag1", "tag2"],
  "author": "Author Name",
  "image": "https://example.com/image.jpg",
  "isPublished": true,
  "views": 0
}
```

### Category
```json
{
  "name": "Category Name",
  "slug": "category-slug",
  "description": "Category description",
  "icon": "📱",
  "order": 1,
  "isActive": true
}
```

### Tag
```json
{
  "name": "Tag Name",
  "slug": "tag-slug",
  "description": "Tag description",
  "isActive": true,
  "postCount": 0
}
```

### Subscriber
```json
{
  "email": "subscriber@example.com",
  "isVerified": false,
  "isActive": true,
  "verificationToken": "token_hash",
  "unsubscribeToken": "unsub_token_hash",
  "preferences": {
    "weeklyDigest": true,
    "newPosts": true
  }
}
```

### Social Link
```json
{
  "platform": "twitter",
  "url": "https://twitter.com/techtoolreviews",
  "displayName": "Twitter",
  "order": 1,
  "isActive": true,
  "clickCount": 0
}
```

### Media
```json
{
  "filename": "filename-timestamp.jpg",
  "originalName": "original-filename.jpg",
  "mimeType": "image/jpeg",
  "size": 102400,
  "url": "http://localhost:5000/uploads/filename.jpg",
  "uploadedBy": "admin",
  "alt": "Alt text",
  "caption": "Image caption",
  "tags": ["tag1", "tag2"],
  "isActive": true
}
```

---

## ✅ Features Implemented

- ✅ MongoDB Atlas integration with Mongoose
- ✅ Express.js REST API with modular controllers and routes
- ✅ CRUD operations for all models
- ✅ Email subscription automation with SendGrid support
- ✅ Email verification and unsubscribe functionality
- ✅ Social link tracking with click analytics
- ✅ File upload with Multer (images and documents)
- ✅ Input validation with express-validator
- ✅ Security middleware (Helmet, CORS, Rate Limiting)
- ✅ Comprehensive error handling
- ✅ Pagination support for list endpoints
- ✅ Search and filtering capabilities
- ✅ Console logging for development debugging

---

## 🐛 Known Issues & Warnings

### Mongoose Index Warnings
The server shows warnings about duplicate schema indexes. This is due to declaring indexes using both `index: true` in the schema and calling `schema.index()`. These are non-critical warnings and don't affect functionality.

**Resolution**: Remove duplicate index declarations from model files if needed.

### Email Service
If `SENDGRID_API_KEY` is not configured, the system falls back to console logging for development. For production, set up SendGrid API credentials in `.env`.

---

## 🚀 Next Steps

1. **Add Authentication**: Implement JWT-based authentication for admin endpoints
2. **Add Admin Panel**: Create admin dashboard for content management
3. **Analytics Dashboard**: Track post views, subscriber growth, social clicks
4. **Search Optimization**: Implement full-text search indices
5. **CDN Integration**: Optimize media delivery with CDN
6. **Caching**: Add Redis for API response caching
7. **Rate Limiting**: Implement per-user rate limits

---

## 📞 Support

For issues or questions about the API:
- Check server logs at `npm run dev`
- Verify MongoDB connection with `npm run test:db`
- Review validation errors in API responses
- Check `.env` configuration is correct
