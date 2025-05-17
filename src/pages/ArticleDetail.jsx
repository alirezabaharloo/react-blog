import { useParams, Link } from 'react-router-dom';
import ArticleCart from '../components/ArticleCart';
import { ArticleContext } from '../context/ArticleContext';
import { useContext } from 'react';
import useHttp from '../hooks/useHttp';
import ArticleNotFound from '../components/errors/ArticleNotFound';
import SpinLoader from '../components/loaders/SpinLoader';
import SomethingWentWrong from '../components/errors/SomethingWentWrong';

export default function ArticleDetail() {
  const { articleId } = useParams();
  
  const { data, isLoading, isError, errorMessage } = useHttp(`http://localhost:8000/articles/${parseInt(articleId)}`);

  const article = data.article || null;
  const relatedArticles = data.relatedArticles || [];

  if (isLoading) {
    return <SpinLoader />;
  }
  
  

  if (isError && errorMessage === 'Article not found') {
    return <ArticleNotFound />;
  } else if (isError) {
    return <SomethingWentWrong />;
  }

  // Make sure article exists before rendering the content
  if (!article) {
    return <ArticleNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div className='absolute inset-0 bg-black opacity-[50%] z-[20]'></div>
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover relative z-[10]"
        />
        <div className="absolute inset-0 bg-opacity-50 flex items-center justify-center z-[30]">
          <div className="text-center text-white max-w-4xl px-4">
            <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-4 inline-block">
              {article.category.name}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <span className="ml-2 text-white bg-gray-500 px-4 py-2 rounded-full text-sm font-medium">{article.author}</span>
              </div>
              <span className="text-gray-300">•</span>
              <span className="text-gray-300">{article.date}</span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-300">{article.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            {article.excerpt}
          </p>
          
          {/* Dummy content for demonstration */}
          <div className="prose prose-lg max-w-none">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Key Points</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>First important point about the topic</li>
              <li>Second key insight to consider</li>
              <li>Third major takeaway from the article</li>
            </ul>
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {
              relatedArticles.map((relatedArticle) => {
                return (
                  <ArticleCart key={relatedArticle.id} article={relatedArticle} />
                )
              })
            }
          </div>
        </div>

        {/* Back to Articles Button */}
        <div className="mt-8 text-center">
          <Link
            to="/articles"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Articles
          </Link>
        </div>
      </div>
    </div>
  );
} 