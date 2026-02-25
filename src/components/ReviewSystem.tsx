import React, { useState, useEffect } from 'react';
import { Star, Send } from 'lucide-react';
import { storage } from '../utils/storage';
import { Review, User } from '../types';

interface ReviewSystemProps {
  homestayId: string;
  user: User | null;
}

export default function ReviewSystem({ homestayId, user }: ReviewSystemProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    const allReviews = storage.getReviews();
    setReviews(allReviews.filter(r => r.homestayId === homestayId));
  }, [homestayId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== 'Tourist') return;

    const newReview: Review = {
      id: Date.now().toString(),
      homestayId,
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      date: new Date().toISOString()
    };

    storage.saveReview(newReview);
    setReviews([newReview, ...reviews]);
    setComment('');
    setRating(5);

    // Update homestay average rating would be ideal, but for now we just store it
  };

  return (
    <div className="space-y-8">
      <div className="border-t border-gray-100 pt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Reviews & Ratings</h3>
        
        {user?.role === 'Tourist' ? (
          <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-2xl mb-8">
            <p className="text-sm font-medium text-gray-700 mb-2">Share your experience</p>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star 
                    className={`w-6 h-6 ${
                      (hoveredRating || rating) >= star 
                        ? 'fill-yellow-400 text-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                </button>
              ))}
            </div>
            <div className="relative">
              <textarea
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review here..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none h-24"
              />
              <button 
                type="submit"
                className="absolute bottom-3 right-3 bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl mb-8 text-sm">
            Only tourists can submit reviews.
          </div>
        )}

        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="flex gap-4">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold shrink-0">
                  {review.userName[0]}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                    <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`w-3.5 h-3.5 ${
                          review.rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                        }`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
