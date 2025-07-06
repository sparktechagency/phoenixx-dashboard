import React, { useState } from 'react';
import { User, Calendar, Filter, Search, MessageCircle } from 'lucide-react';
import { DatePicker } from 'antd';

function Feedback() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample feedback data
  const feedbackData = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      rating: 5,
      comment: "Absolutely love this product! The user interface is intuitive and the features are exactly what I needed. Customer service is also top-notch.",
      date: "2025-01-15",
      category: "general",
      avatar: "SJ"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@example.com",
      rating: 4,
      comment: "Really good experience overall. The app works smoothly and has great functionality. Would love to see more customization options in the future.",
      date: "2025-01-14",
      category: "feature",
      avatar: "MC"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      email: "emma.r@example.com",
      rating: 5,
      comment: "Outstanding service! The team went above and beyond to help me with my requirements. Highly recommend to anyone looking for quality solutions.",
      date: "2025-01-13",
      category: "compliment",
      avatar: "ER"
    },
    {
      id: 4,
      name: "David Wilson",
      email: "d.wilson@example.com",
      rating: 3,
      comment: "Good product but I encountered some bugs during the checkout process. The payment flow needs improvement. Otherwise, it's decent.",
      date: "2025-01-12",
      category: "bug",
      avatar: "DW"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      email: "lisa.t@example.com",
      rating: 4,
      comment: "Very satisfied with the purchase. The delivery was quick and the product quality exceeded my expectations. Great value for money.",
      date: "2025-01-11",
      category: "general",
      avatar: "LT"
    },
    {
      id: 6,
      name: "Alex Kumar",
      email: "alex.k@example.com",
      rating: 5,
      comment: "Perfect! Everything worked exactly as described. The documentation is clear and the support team is very responsive.",
      date: "2025-01-10",
      category: "compliment",
      avatar: "AK"
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'All Feedback', count: feedbackData.length },
    { value: 'recent', label: 'Recent', count: feedbackData.filter(f => new Date(f.date) > new Date('2025-01-13')).length }
  ];

  const filteredFeedback = feedbackData.filter(feedback => {
    const matchesSearch = feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'recent') return matchesSearch && new Date(feedback.date) > new Date('2025-01-13');
    
    return matchesSearch;
  });

  const totalFeedback = feedbackData.length;

  const getCategoryColor = (category) => {
    switch (category) {
      case 'general': return 'bg-blue-100 text-blue-800';
      case 'feature': return 'bg-purple-100 text-purple-800';
      case 'bug': return 'bg-red-100 text-red-800';
      case 'compliment': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'general': return 'General';
      case 'feature': return 'Feature Request';
      case 'bug': return 'Bug Report';
      case 'compliment': return 'Compliment';
      default: return 'Other';
    }
  };

  return (
    <div className="max-h-screen ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4 pt-4">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Customer Feedback
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our customers are saying about their experience
          </p>
        </div>

      

        {/*  Search */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
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
            
           
            <DatePicker picker='month' className='rounded-lg h-10'/>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-6 max-h-[65vh] border overflow-auto">
          {filteredFeedback.map((feedback) => (
            <div key={feedback.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {feedback.avatar}
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">{feedback.name}</h3>
                      <p className="text-sm text-gray-500">{feedback.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(feedback.category)}`}>
                        {getCategoryLabel(feedback.category)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-500">{new Date(feedback.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Comment */}
                  <p className="text-gray-700 leading-relaxed">{feedback.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredFeedback.length === 0 && (
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
  );
}

export default Feedback;