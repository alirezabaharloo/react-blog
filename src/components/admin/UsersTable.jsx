import { AnimatePresence } from 'framer-motion';  
import { motion } from 'framer-motion';

export default function UsersTable({ filteredUsers, firstLastIndex, handleUserEdit, handleDeactivate }) {
  return (
    <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Permission
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Operations
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <AnimatePresence>
              {filteredUsers && filteredUsers.length > 0 && firstLastIndex.lastIndex ? (
                filteredUsers.slice(firstLastIndex.firstIndex, firstLastIndex.lastIndex).map((user) => (
                  <motion.tr
                    key={user.id || user._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        (user.permission === 'admin' || user.is_superuser) ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {(user.permission === 'admin' || user.is_superuser) ? 'Admin' : 'Regular'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleUserEdit(user.id || user._id)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {handleDeactivate(user.id || user._id)}}
                        className={`${
                          user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                        }`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found matching the selected filters
                  </td>
                </motion.tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
  )
}