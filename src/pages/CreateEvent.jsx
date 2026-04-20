import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../hooks/useEvents';
import { useAuth } from '../context/AuthContext';

const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createEvent, loading } = useEvents(user?.uid);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  });
  
  const titleRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createEvent({
        ...formData,
        creatorName: user.displayName || user.email,
        creatorId: user.uid
      });
      navigate('/dashboard');
    } catch (error) {
      alert('Error creating event: ' + error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-12">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium mb-4"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Create New Event</h1>
        <p className="text-xl text-gray-600">Share your event with the hostel community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            Event Title *
          </label>
          <input
            ref={titleRef}
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            placeholder="e.g. Basketball Tournament Finals"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            required
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg resize-vertical"
            placeholder="Tell everyone about your event..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
              Date & Time *
            </label>
            <input
              id="date"
              name="date"
              type="datetime-local"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              placeholder="e.g. Hostel Basketball Court"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-lg font-semibold rounded-3xl shadow-xl hover:shadow-2xl hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-300"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
              Creating Event...
            </>
          ) : (
            'Create Event'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;