 # SPA Blog Backend API

A Node.js backend API for a SPA blog with in-memory dummy data.

## Setup Instructions

1. Install dependencies:
```
npm install
```

2. Create a `.env` file in the root directory with the following:
```
PORT=5000
NODE_ENV=development
```

3. Start the server:
```
npm run dev
```

## API Endpoints

- `GET /api/articles` - Get all articles
- `GET /api/articles/:id` - Get a single article with related articles

## Data Structure

The application uses in-memory data arrays:

1. **Articles** - Contains blog articles with fields:
   - id
   - title
   - excerpt
   - content
   - author
   - date
   - readTime
   - categoryId
   - image

2. **Categories** - Contains article categories with fields:
   - id
   - name
   - description

## Notes for Development

When requesting a single article via `/api/articles/:id`, the response will include both the requested article and up to 3 related articles from the same category.