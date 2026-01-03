# Quick Start Testing Guide

## 🚀 Server Status

**Backend Server**: Running on `http://localhost:5000`

To verify the server is running, visit this link in your browser:
[http://localhost:5000/api/health](http://localhost:5000/api/health)

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-XX...",
  "environment": "development"
}
```

---

## 📋 Quick Test Commands

### 1. Health Check ✅
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

### 5. Get All Social Links
```bash
curl http://localhost:5000/api/social-links
```

### 6. Get All Media Files
```bash
curl http://localhost:5000/api/media
```

### 7. Get Subscriber Stats
```bash
curl http://localhost:5000/api/subscribe/stats
```

---

## 🧪 Test Create Operations

### Create a Category
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Web Development",
    "slug": "web-development",
    "description": "Web development tools and frameworks",
    "icon": "🌐",
    "order": 1
  }'
```

### Create a Tag
```bash
curl -X POST http://localhost:5000/api/tags \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JavaScript",
    "slug": "javascript",
    "description": "JavaScript programming language and tools"
  }'
```

### Create a Blog Post
```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Getting Started with React",
    "slug": "getting-started-with-react",
    "excerpt": "Learn the basics of React framework",
    "content": "React is a JavaScript library for building user interfaces with components.",
    "category": "web-development",
    "tags": ["javascript", "react"],
    "author": "Tech Writer",
    "image": "https://via.placeholder.com/600x400",
    "isPublished": true
  }'
```

### Subscribe to Newsletter
```bash
curl -X POST http://localhost:5000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "reader@example.com",
    "preferences": {
      "weeklyDigest": true,
      "newPosts": true
    }
  }'
```

### Create a Social Link
```bash
curl -X POST http://localhost:5000/api/social-links \
  -H "Content-Type: application/json" \
  -d '{
    "platform": "twitter",
    "url": "https://twitter.com/techtoolreviews",
    "displayName": "Follow us on Twitter",
    "order": 1
  }'
```

---

## 📁 Upload Media File

### Using curl (Linux/Mac)
```bash
curl -X POST http://localhost:5000/api/media/upload \
  -F "file=@/path/to/image.jpg" \
  -F "alt=Example Image" \
  -F "caption=Example image for article" \
  -F "uploadedBy=admin"
```

### Using PowerShell (Windows)
```powershell
$filePath = "C:\path\to\image.jpg"
$form = @{
    file = Get-Item $filePath
    alt = "Example Image"
    caption = "Example image for article"
    uploadedBy = "admin"
}

$body = $form | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/media/upload" `
  -Method Post `
  -Form $form
```

---

## 🔗 Test Filter & Search

### Get Posts with Filtering
```bash
# Get page 1 with 5 items per page
curl "http://localhost:5000/api/posts?page=1&limit=5"

# Search posts
curl "http://localhost:5000/api/posts?search=react"

# Filter by category
curl "http://localhost:5000/api/posts?category=web-development"

# Filter by tag
curl "http://localhost:5000/api/posts?tag=javascript"

# Combination
curl "http://localhost:5000/api/posts?search=javascript&category=web-development&page=1&limit=10"
```

### Get Media with Filters
```bash
# Get all images
curl "http://localhost:5000/api/media?type=image"

# Get documents
curl "http://localhost:5000/api/media?type=document"

# Filter by tags
curl "http://localhost:5000/api/media?tags=tutorial,guide"

# With pagination
curl "http://localhost:5000/api/media?page=1&limit=20"
```

---

## 🔄 Test Update Operations

### Update a Post
```bash
# Note: Replace POST_ID with actual MongoDB ID
curl -X PUT http://localhost:5000/api/posts/POST_ID \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "excerpt": "Updated excerpt",
    "isPublished": true
  }'
```

### Update a Category
```bash
curl -X PUT http://localhost:5000/api/categories/CATEGORY_ID \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "description": "Updated description"
  }'
```

### Update Media Metadata
```bash
curl -X PUT http://localhost:5000/api/media/MEDIA_ID \
  -H "Content-Type: application/json" \
  -d '{
    "alt": "Updated alt text",
    "caption": "Updated caption",
    "tags": ["new", "tags"]
  }'
```

---

## ❌ Test Delete Operations

### Delete a Post
```bash
curl -X DELETE http://localhost:5000/api/posts/POST_ID
```

### Delete a Category
```bash
curl -X DELETE http://localhost:5000/api/categories/CATEGORY_ID
```

### Delete a Tag
```bash
curl -X DELETE http://localhost:5000/api/tags/TAG_ID
```

### Delete Media
```bash
curl -X DELETE http://localhost:5000/api/media/MEDIA_ID
```

### Delete Social Link
```bash
curl -X DELETE http://localhost:5000/api/social-links/twitter
```

---

## 🧩 Integration Testing Workflow

### 1. Create Data
1. Create a category: `web-development`
2. Create tags: `javascript`, `react`, `frontend`
3. Create a blog post linking to category and tags
4. Create social media links

### 2. Verify Data
1. Get all posts and verify the new post appears
2. Get category by slug and verify post count updated
3. Get tags and verify post counts updated
4. Get social links

### 3. Test Subscriptions
1. Subscribe user: `test@example.com`
2. Get subscription stats
3. Verify email verification would be sent

### 4. Test Media
1. Upload an image file
2. Get all media and verify upload
3. Update media metadata
4. Delete media

### 5. Test Search & Filter
1. Search posts by keyword
2. Filter by category
3. Filter by tag
4. Test pagination

---

## 📊 Expected Response Examples

### Successful POST (201 Created)
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Web Development",
    "slug": "web-development",
    ...
  },
  "message": "Category created successfully"
}
```

### Successful GET (200 OK)
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Getting Started with React",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Error Response (400 Bad Request)
```json
{
  "success": false,
  "message": "Validation errors",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Post not found"
}
```

---

## 🛠️ Tools Recommended for Testing

1. **Postman** - Professional API testing tool
2. **Insomnia** - User-friendly REST client
3. **Thunder Client** - VS Code extension
4. **cURL** - Command-line tool
5. **Swagger UI** - Interactive API documentation (optional)

---

## 🐛 Troubleshooting

### Server Won't Start
```bash
# Check if port 5000 is in use
netstat -an | find ":5000"

# Kill process on port 5000 (if needed)
npx kill-port 5000
```

### Database Connection Error
```bash
# Test database connection
npm run test:db
```

### Validation Errors
- Check request body format (JSON)
- Verify required fields are included
- Check field value types (string, number, boolean, etc.)

### CORS Errors
- Ensure CORS is enabled in server
- Check `FRONTEND_URL` environment variable
- Verify request origin matches allowed origins

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Start server | `node server/index.js` |
| Test DB | `npm run test:db` |
| Check health | `curl http://localhost:5000/api/health` |
| Get all posts | `curl http://localhost:5000/api/posts` |
| Get categories | `curl http://localhost:5000/api/categories` |
| Get tags | `curl http://localhost:5000/api/tags` |
| Get media | `curl http://localhost:5000/api/media` |
| Get subscribers | `curl http://localhost:5000/api/subscribe/stats` |

---

**Happy Testing! 🚀**

For detailed API documentation, see `API_TESTING_GUIDE.md`
For implementation details, see `BACKEND_IMPLEMENTATION_COMPLETE.md`
