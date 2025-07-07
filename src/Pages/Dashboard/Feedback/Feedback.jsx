import React, { useState } from 'react';
import { Calendar, MessageCircle } from 'lucide-react';
import { useGetFeedBackQuery } from '../../../redux/apiSlices/feedbackApi';
import { useGetUsersQuery } from '../../../redux/apiSlices/usersApi';

function Feedback() {
  const [selectedMonth, setSelectedMonth] = useState('');
  const { data: feedbackData, isLoading } = useGetFeedBackQuery();
  const { data: usersData } = useGetUsersQuery();

  // Extract feedbacks and users from API response
  const feedbacks = feedbackData?.data?.data || [];
  const totalFeedback = feedbackData?.data?.meta?.total || 0;
  const users = usersData?.data?.data || [];

  // Display all feedbacks (no search filtering)
  const filteredFeedback = feedbacks;

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    console.log('Selected month:', e.target.value);
  };

  return (
    <div className="h-screen overflow-hidden">
      <div className=" mx-auto px-4 h-full flex flex-col">
        {/* Header */}
        <div className="text-center max-h-20 mb-4 pt-2 flex-shrink-0">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Customer Feedback
          </h1>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            See what our customers are saying about their experience
          </p>
        </div>

        

        {/* Feedback List */}
        <div className="flex-1 overflow-hidden">
          <div
            className="h-[78vh] overflow-y-auto p-2 bg-gray-50 rounded-xl"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e1 #f1f5f9'
            }}
          >
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Loading feedbacks...</div>
            ) : filteredFeedback.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6 p-4 ">
                {filteredFeedback.map((feedback) => {
                  const user = users.find(u => u._id === feedback.user);
                  return (
                    <div
                      key={feedback._id}
                      className="bg-white rounded-2xl p-10  shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 min-h-80"
                    >
                      {/* User Header */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {user?.userName ? user.userName.slice(0, 2).toUpperCase() : 'UN'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-800 truncate">
                            {user?.userName || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {user?.email || 'unknown@gmail.com'}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-200 mb-4"></div>

                      {/* Feedback Content */}
                      <div className="space-y-3">
                        <div>
                          <strong className="text-sm text-gray-700">Liked Aspects:</strong>
                          <p className="text-sm text-gray-600 mt-1">{feedback.likedAspects}</p>
                        </div>
                        <div>
                          <strong className="text-sm text-gray-700">Areas for Improvement:</strong>
                          <p className="text-sm text-gray-600 mt-1">{feedback.areasForImprovement}</p>
                        </div>
                        <div>
                          <strong className="text-sm text-gray-700">Feature Suggestions:</strong>
                          <p className="text-sm text-gray-600 mt-1">{feedback.featureSuggestions}</p>
                        </div>
                        <div>
                          <strong className="text-sm text-gray-700">Additional Feedback:</strong>
                          <p className="text-sm text-gray-600 mt-1">{feedback.additionalFeedback}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No feedback found</h3>
                <p className="text-gray-500">Try adjusting your filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;