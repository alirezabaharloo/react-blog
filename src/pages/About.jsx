import { motion } from 'framer-motion';
import { ABOUT_VALUES_DATA } from '../data/PAGE_DATAS.jsx';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your Trusted Source for News and Information
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              At News Portal, we are committed to delivering accurate, timely, and engaging news content
              to our readers. Our mission is to keep you informed about the most important events and
              stories from around the world.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe in the power of quality journalism and its role in fostering an informed society.
              Our team of experienced journalists and editors work tirelessly to bring you the most
              relevant and reliable news coverage.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Our Values</h2>
            <ul className="space-y-6">
              {ABOUT_VALUES_DATA.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.3 + index * 0.1 }}

                >
                  <motion.li
                    className='flex items-start space-x-4'
                    transition={{ type: "spring", stiffness: 300 }}
                    whileHover={{ x: 10 }}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 text-xl font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{value.title}</h3>
                    <p className="text-gray-600 mt-1">{value.description}</p>
                  </div>
                </motion.li>
                </motion.div>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">Join Our Team</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            We're always looking for talented individuals who share our passion for journalism
            and commitment to excellence.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            View Open Positions
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default About; 