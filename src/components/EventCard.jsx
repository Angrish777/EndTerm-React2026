import PropTypes from 'prop-types';
import { formatDistanceToNow } from 'date-fns';

const EventCard = ({ event, currentUserId, onEdit, onDelete }) => {
  const [hovered, setHovered] = React.useState(false);
  const isOwner = event.creatorId === currentUserId;
  const isOngoing = event.status === 'ongoing' || new Date(event.date) > new Date();

  const getStatusColor = () => {
    if (isOngoing) return 'bg-green-100 border-green-400 text-green-800';
    return 'bg-gray-100 border-gray-300 text-gray-700';
  };

  return (
    <div 
      className={`
        bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden
        border border-gray-200 hover:border-gray-300 group
        ${hovered ? 'scale-[1.02] ring-2 ring-blue-100' : ''}
      `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header */}
      <div className="p-8">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-bold text-gray-900 line-clamp-2 leading-tight pr-8">
            {event.title}
          </h3>
          {isOwner && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 ml-4">
              <button
                onClick={() => onEdit(event)}
                className="p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-2xl transition-all duration-200 flex items-center justify-center hover:scale-110"
                title="Edit"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(event.id)}
                className="p-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-2xl transition-all duration-200 flex items-center justify-center hover:scale-110"
                title="Delete"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <p className="text-gray-600 mb-6 text-lg leading-relaxed line-clamp-3">
          {event.description}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap gap-4 mb-8">
          <span className={`px-4 py-2 rounded-2xl text-sm font-semibold border-2 ${getStatusColor()}`}>
            {isOngoing ? '🔥 Ongoing' : '✅ Completed'}
          </span>
          <span className="px-4 py-2 bg-gray-100 rounded-2xl text-sm text-gray-700 border">
            {event.date ? formatDistanceToNow(new Date(event.date), { addSuffix: true }) : 'No date'}
          </span>
          {event.location && (
            <span className="px-4 py-2 bg-blue-50 rounded-2xl text-sm text-blue-700 border border-blue-200">
              📍 {event.location}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <span className="text-lg font-semibold text-gray-900">
            Posted by {event.creatorName || 'Anonymous'}
          </span>
          {isOngoing && (
            <span className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer">
              Join Event
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.object.isRequired,
  currentUserId: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

EventCard.defaultProps = {
  onEdit: () => {},
  onDelete: () => {}
};

export default EventCard;