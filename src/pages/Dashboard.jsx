import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EventCard from '../components/EventCard';
import { useEvents } from '../hooks/useEvents';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const { events, loading, error, deleteEvent } = useEvents(user?.uid, searchTerm);

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
      } catch (err) {
        alert('Error deleting event: ' + err.message);
      }
    }
  };

  const handleEdit = (event) => {
    alert(`Edit functionality - Navigate to edit form with event ID: ${event.id}`);
    // TODO: Implement edit modal or navigate to edit page
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">Loading events...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Events Feed
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Discover and manage events in your hostel community
            </p>
          </div>
          <Link
            to="/create-event"
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:from-emerald-600 hover:to-emerald-700 transform hover:-translate-y-1 transition-all duration-300 whitespace-nowrap"
          >
            + Create New Event
          </Link>
        </div>

        {/* Search */}
        <div className="max-w-2xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all duration-200 text-lg"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="text-center py-20">
          <div className="mx-auto h-24 w-24 bg-gray-200 rounded-3xl flex items-center justify-center mb-6">
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No events yet</h3>
          <p className="text-lg text-gray-600 mb-6">Be the first to create an event in your community!</p>
          <Link
            to="/create-event"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            Create First Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              currentUserId={user.uid}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;