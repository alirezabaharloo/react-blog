import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ArticleCart({ article, ...props }){
    return (  
      <motion.div 
      key={article.id} 
      className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group"
      {...props}
      >
      <div className="relative h-48 overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transform transition-all duration-300 group-hover:scale-[1.1]"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            {article.category.name}
          </span>
        </div>
      </div>
      <div className="p-6 transform transition-all duration-300 group-hover:bg-gray-50">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>{article.date}</span>
          <span className="mx-2">•</span>
          <span>{article.readTime}</span>
        </div>
        <h2 className="text-xl font-semibold cursor-pointer text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
          <Link to={`/articles/${article.id}`}>{article.title}</Link>
        </h2>
        <p className="text-gray-600 mb-4">
          {article.excerpt}
        </p>
      </div>
    </motion.div>
    )
}