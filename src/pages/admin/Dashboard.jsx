import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import useAuthHttp from '../../hooks/useAuthHttp';
import SpinLoader from '../../components/loaders/SpinLoader';
import AdminSomethingWentWrong from '../../components/admin/errors/AdminSomethingWentWrong';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentArticles, setRecentArticles] = useState([]);
  const [userGrowth, setUserGrowth] = useState({ 
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [12, 19, 25, 31, 42, 48]
  });
  
  const { 
    isLoading: statsLoading,
    isError: statsError,
    errorMessage: statsErrorMessage,
    data: stats,
  } = useAuthHttp('http://localhost:8000/api/admin/stats/');

  const {
    isLoading: profileLoading,
    isError: profileError,
    errorMessage: profileErrorMessage,
    data: profile,
  } = useAuthHttp('http://localhost:8000/api/auth/profile/');

  const {
    isLoading: articlesLoading,
    isError: articlesError,
    errorMessage: articlesErrorMessage,
    data: articles,
  } = useAuthHttp('http://localhost:8000/api/admin/articles/');

  useEffect(() => {
    if (articles) {
      // Get 5 most recent articles
      setRecentArticles(articles.slice(0, 5));
    }
  }, [articles]);

  if (statsLoading || profileLoading || articlesLoading || !stats || !profile) {
    return <SpinLoader />;
  }

  if (statsError || profileError || articlesError) {
    return <AdminSomethingWentWrong message={statsErrorMessage || profileErrorMessage || articlesErrorMessage} />;
  }

  // Simulate article status distribution
  const articleStatusData = [
    { name: 'Published', value: articles ? articles.filter(a => a.status === 'published').length : 0, color: '#10B981' },
    { name: 'Draft', value: articles ? articles.filter(a => a.status === 'draft').length : 0, color: '#F59E0B' }
  ];

  // Calculate system health metrics (simulated)
  const systemHealth = {
    serverUptime: '99.9%',
    responseTime: '120ms',
    errorRate: '0.1%',
    diskUsage: '42%'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {    
    hidden: { y: 20, opacity: 0 },    
    visible: {      
      y: 0,      
      opacity: 1,      
      transition: { type: "spring", stiffness: 300, damping: 24 }    
    },    
    hover: {      
      scale: 1.05,      
      transition: { type: "spring", stiffness: 250, damping: 10 }    
    }  
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const drawVariants = {
    hidden: { pathLength: 0 },
    visible: { 
      pathLength: 1,
      transition: { duration: 1.5, ease: "easeInOut" }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white px-4 py-2 rounded-lg shadow-sm flex items-center space-x-2"
        >
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <p className="text-sm font-medium">System Online</p>
        </motion.div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Normal Users Card */}
        <motion.div          
          variants={itemVariants}          
          whileHover="hover"          
          className="bg-white p-6 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl transform-gpu"
        >          
          <div className="flex items-center justify-between">            
            <div>              
              <p className="text-sm font-medium text-gray-600">Normal Users</p>              
              <p className="text-2xl font-semibold text-gray-800">{stats?.normalUsers}</p>            
            </div>            
            <div className="p-3 bg-blue-100 rounded-full cursor-pointer transition-colors duration-300 hover:bg-blue-200" 
              onClick={() =>{
                sessionStorage.setItem('adminUserListFilters', JSON.stringify({
                  type: 'normal', status: 'all'
                }));
               sessionStorage.setItem('adminUserListPage', 1);
               sessionStorage.setItem('adminUserListSearch', [])
              navigate('/admin/users')
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Admin Users Card */}
        <motion.div          
          variants={itemVariants}          
          whileHover="hover"          
          className="bg-white p-6 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl transform-gpu"
        >          
          <div className="flex items-center justify-between">            
            <div>              
              <p className="text-sm font-medium text-gray-600">Admin Users</p>              
              <p className="text-2xl font-semibold text-gray-800">{stats?.adminUsers}</p>            
            </div>            
            <div className="p-3 bg-purple-100 rounded-full cursor-pointer transition-colors duration-300 hover:bg-purple-200" 
              onClick={() =>{
                sessionStorage.setItem('adminUserListFilters', JSON.stringify({
                  type: 'admin', status: 'all'
                }));
                sessionStorage.setItem('adminUserListPage', 1);
                sessionStorage.setItem('adminUserListSearch', [])
                navigate('/admin/users')
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Articles Card */}
        <motion.div          
          variants={itemVariants} 
          whileHover="hover"  
          className="bg-white p-6 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl transform-gpu"
        >          
          <div className="flex items-center justify-between">            
            <div>              
              <p className="text-sm font-medium text-gray-600">Articles</p>              
              <p className="text-2xl font-semibold text-gray-800">{stats?.articles}</p>            
            </div>            
            <div 
              className="p-3 bg-green-100 rounded-full cursor-pointer transition-colors duration-300 hover:bg-green-200"
              onClick={() => navigate('/admin/articles')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* Categories Card */}
        <motion.div          
          variants={itemVariants}          
          whileHover="hover"          
          className="bg-white p-6 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-xl transform-gpu"
        >          
          <div className="flex items-center justify-between">            
            <div>              
              <p className="text-sm font-medium text-gray-600">Categories</p>              
              <p className="text-2xl font-semibold text-gray-800">{stats?.categories}</p>            
            </div>            
            <div 
              className="p-3 bg-yellow-100 rounded-full cursor-pointer transition-colors duration-300 hover:bg-yellow-200"
              onClick={() => navigate('/admin/categories')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Middle Section - Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Article Status Distribution */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-lg shadow-md col-span-1"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Content Status</h2>
          <div className="relative h-52 w-full">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="10"
                strokeDasharray="251.2"
                strokeDashoffset="0"
                variants={drawVariants}
                style={{ transformOrigin: 'center' }}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#10B981"
                strokeWidth="10"
                strokeDasharray="251.2"
                strokeDashoffset={
                  251.2 * (1 - (articleStatusData[0].value / (articleStatusData[0].value + articleStatusData[1].value)))
                }
                variants={drawVariants}
                style={{ transformOrigin: 'center' }}
              />
              <text x="50" y="45" textAnchor="middle" className="text-lg font-bold" fill="#4B5563">
                {articleStatusData[0].value}
              </text>
              <text x="50" y="60" textAnchor="middle" className="text-sm" fill="#4B5563">
                Published
              </text>
            </svg>
          </div>
          <div className="flex justify-around mt-4">
            {articleStatusData.map((entry, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm text-gray-600">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* User Growth (Simple Chart) */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-lg shadow-md col-span-1"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">User Growth</h2>
          <div className="h-52 w-full">
            <svg className="w-full h-full" viewBox="0 0 300 150">
              <motion.path
                d={`M 0,150 ${userGrowth.data.map((point, i) => 
                  `L ${(i * 50) + 10},${150 - point * 2}`).join(' ')}`}
                fill="none"
                stroke="#6366F1"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              {userGrowth.data.map((point, i) => (
                <motion.circle
                  key={i}
                  cx={(i * 50) + 10}
                  cy={150 - point * 2}
                  r="4"
                  fill="#6366F1"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + (i * 0.1), duration: 0.5 }}
                />
              ))}
              {userGrowth.labels.map((label, i) => (
                <text
                  key={i}
                  x={(i * 50) + 10}
                  y="170"
                  textAnchor="middle"
                  className="text-xs"
                  fill="#6B7280"
                >
                  {label}
                </text>
              ))}
            </svg>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-6 rounded-lg shadow-md col-span-1"
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentArticles.length > 0 ? (
              recentArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 border-b border-gray-100 pb-3 last:border-0"
                >
                  <div className={`p-2 rounded-full ${article.status === 'published' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${article.status === 'published' ? 'text-green-600' : 'text-yellow-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{article.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(article.updated_at).toLocaleDateString()} • {article.author_name}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No recent activity</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* System Health */}
      <motion.div
        variants={fadeInVariants}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">System Health</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(systemHealth).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <p className="text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              <p className="text-xl font-bold text-indigo-600 mt-1">{value}</p>
              <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-indigo-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: parseInt(value) ? `${parseInt(value)}%` : '80%' }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        variants={fadeInVariants}
        className="bg-gradient-to-br from-violet-500 to-purple-700 p-6 rounded-lg shadow-xl text-white overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
        
        <h2 className="text-xl font-bold mb-6 relative z-10 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Activity Timeline
        </h2>
        
        <div className="relative z-10">
          <div className="ml-6 border-l-2 border-white border-opacity-20 pl-8 pb-1">
            {[
              { 
                title: "New Article Published", 
                description: "Travel Guide: 10 Best Places to Visit",
                time: "Just now", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 0L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                ),
                color: "bg-emerald-400"
              },
              { 
                title: "New User Registered", 
                description: "Sarah Johnson joined the platform",
                time: "2 hours ago", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                ),
                color: "bg-blue-400"
              },
              { 
                title: "Category Updated", 
                description: "Technology category description changed",
                time: "Yesterday", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                ),
                color: "bg-amber-400"
              },
              { 
                title: "System Maintenance", 
                description: "Server optimization completed",
                time: "2 days ago", 
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                color: "bg-indigo-400"
              }
            ].map((activity, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                className="mb-8 relative"
              >
                <div className={`absolute -left-12 w-6 h-6 rounded-full ${activity.color} flex items-center justify-center shadow-md`}>
                  {activity.icon}
                </div>
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{activity.title}</h3>
                    <p className="text-white text-opacity-80">{activity.description}</p>
                  </div>
                  <span className="text-xs bg-white bg-opacity-20 rounded-full px-3 py-1 mt-2 md:mt-0 inline-block whitespace-nowrap">{activity.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="mt-4 bg-white bg-opacity-20 rounded-lg p-4 cursor-pointer hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center relative z-10"
          onClick={() => navigate('/admin/articles')}
        >
          <span className="font-medium">View All Activity</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard; 