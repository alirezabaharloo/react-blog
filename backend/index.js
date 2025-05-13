const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { articles, categories } = require('./data/dummyData');
// Load environment variables
dotenv.config();

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
// Get all articles
app.get('/articles', (req, res) => {
    const articlesWithCategories = articles.map(article => ({
        ...article,
        category: categories.find(c => c.id === article.categoryId)
    }));
    res.json(articlesWithCategories);
});

// Search articles endpoint
app.get('/articles/search', (req, res) => {

    const searchTerm = req.query.q ? req.query.q.toLowerCase() : '';
    
    if (!searchTerm) {
        return res.status(400).json({ error: 'Search term is required' });
    }
    
    const searchResults = articles
        .filter(article => 
            article.title.toLowerCase().includes(searchTerm) || 
            article.excerpt.toLowerCase().includes(searchTerm) ||
            article.content.toLowerCase().includes(searchTerm)
        )
        .map(article => ({
            ...article,
            category: categories.find(c => c.id === article.categoryId)
        }));
    
    res.json(searchResults);
});

// Get single article with related articles
app.get('/articles/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const article = articles.find(article => article.id === id);
  
  if (!article) {
    return res.status(404).json('Article not found');
  }

  // Find related articles based on category
  const relatedArticles = articles
    .filter(a => a.categoryId === article.categoryId && a.id !== id)
    .map(a => ({
        ...a,
        category: categories.find(c => c.id === a.categoryId)
    }))
    .slice(0, 3); // Limit to 3 related articles
  
  article.category = categories.find(c => c.id === article.categoryId);

  res.json({
    article: article,
    relatedArticles
  });
});

// Welcome route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// If this file is being required by another module, export the app
if (module.parent) {
  module.exports = app;
} else {
  // Start server if this file is being run directly
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}