import React, { useState } from 'react';
import { Calendar, Search, MessageCircle } from 'lucide-react';
import { DatePicker } from 'antd';
import { useGetFeedBackQuery } from '../../../redux/apiSlices/feedbackApi';
import { useGetUsersQuery } from '../../../redux/apiSlices/usersApi';


function Feedback() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: feedbackData, isLoading } = useGetFeedBackQuery();
  const { data: usersData } = useGetUsersQuery();

  // Extract feedbacks from API response
  const feedbacks = feedbackData?.data?.data || [];
  const totalFeedback = feedbackData?.data?.meta?.total || 0;
  const users = usersData?.data?.data || [];

  // Filter by search term (search in likedAspects, areasForImprovement, featureSuggestions, additionalFeedback)
  const filteredFeedback = feedbacks.filter(feedback => {
    const search = searchTerm.toLowerCase();
    return (
      feedback.likedAspects?.toLowerCase().includes(search) ||
      feedback.areasForImprovement?.toLowerCase().includes(search) ||
      feedback.featureSuggestions?.toLowerCase().includes(search) ||
      feedback.additionalFeedback?.toLowerCase().includes(search)
    );
  });

  const handleMonthChange = (date, dateString) => {
    console.log('Selected month:', dateString);
    console.log('Selected date object:', date);
  };

  return (
    <div className="max-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-2 pt-4">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Customer Feedback
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our customers are saying about their experience
          </p>
        </div>

        {/* Search & Month Picker */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500 rounded-full">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{totalFeedback}</p>
                <p className="text-gray-600">Total Feedbacks</p>
              </div>
            </div>
            <DatePicker 
              picker='month' 
              className='rounded-lg h-10'
              onChange={handleMonthChange}
            />
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-6 max-h-[65vh] rounded-lg overflow-auto">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">Loading feedbacks...</div>
          ) : filteredFeedback.length > 0 ? (
            filteredFeedback.map((feedback) => (
              <div key={feedback._id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  {/* Avatar Placeholder */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {
                      (() => {
                        const user = users.find(u => u._id === feedback.user);
                        if (user && user?.userName) {
                          return user?.userName.slice(0, 2).toUpperCase();
                        }
                        return 'UN';
                      })()
                    }
                  </div>
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {
                            (users.find(u => u._id === feedback.user)?.userName) || 'Unknown User'
                          }
                        </h3>
                        <p className="text-sm text-gray-500">
                          {
                            (users.find(u => u._id === feedback.user)?.email) || 'unknown@gmail.com'
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(feedback.category)}`}>{getCategoryLabel(feedback.category)}</span> */}
                        <div className="flex items-center gap-1">
                          <Calendar size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-500">{new Date(feedback.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    {/* Comment/Feedback Details */}
                    <div className="text-gray-700 leading-relaxed">
                      <div><strong>Liked Aspects:</strong> {feedback.likedAspects}</div>
                      <div><strong>Areas for Improvement:</strong> {feedback.areasForImprovement}</div>
                      <div><strong>Feature Suggestions:</strong> {feedback.featureSuggestions}</div>
                      <div><strong>Additional Feedback:</strong> {feedback.additionalFeedback}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No feedback found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Feedback;