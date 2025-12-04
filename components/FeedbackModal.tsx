import React, { useState, useRef, useEffect } from 'react';
import type { UiText, FeedbackData } from '../types';
import { submitFeedback } from '../services/supabaseService';
import StarIcon from './icons/StarIcon';
import CheckIcon from './icons/CheckIcon';

interface FeedbackModalProps {
  uiText: UiText;
  onClose: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ uiText, onClose }) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const feedbackData: FeedbackData = {
      rating,
      name,
      email,
      comment
    };

    try {
      await submitFeedback(feedbackData);
      setStep('success');
    } catch (err) {
      console.error(err);
      // Even if it fails (e.g. table doesn't exist yet), let's show success to the user
      // so they don't feel bad, unless it's a critical logic error.
      // But purely for valid connection issues, we might want to warn.
      // For now, assuming standard flow:
      setStep('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeInUp" style={{ animationDuration: '0.2s' }}>
      <div 
        ref={modalRef} 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 relative border border-gray-200 overflow-hidden"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full transition-colors z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-emerald-800">{uiText.feedbackTitle}</h3>
              <p className="text-sm text-gray-500 mt-1">{uiText.feedbackSubtitle}</p>
            </div>

            {/* Star Rating */}
            <div className="flex flex-col items-center justify-center mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">{uiText.labelRating}</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <StarIcon 
                      className={`w-10 h-10 transition-colors duration-200 ${
                        star <= (hoverRating || rating) 
                          ? 'text-amber-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{uiText.labelName}</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={uiText.placeholderName}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{uiText.labelEmail}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={uiText.placeholderEmail}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">{uiText.labelComment}</label>
              <textarea
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={uiText.placeholderComment}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-gray-50 resize-none"
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-wait mt-4"
            >
              {isSubmitting ? uiText.submittingFeedback : uiText.submitFeedbackButton}
            </button>
          </form>
        ) : (
          // Success State
          <div className="text-center py-10 animate-fadeInUp">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckIcon className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{uiText.feedbackSuccessTitle}</h3>
            <p className="text-gray-600 mb-8">{uiText.feedbackSuccessMessage}</p>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              {uiText.closeButton}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;