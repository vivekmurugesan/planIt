'use client';

import { useEffect, useState } from 'react';
import { eventAPI } from '@/lib/api';
import { Plus, Trash2, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  eventType: string;
  startDate: string;
  endDate?: string;
}

interface DayEvent {
  date: number;
  events: Event[];
}

export default function EventTrackerPanel({ profileId }: { profileId: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    location: '',
    eventType: 'OTHER',
    startDate: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [profileId]);

  const fetchEvents = async () => {
    try {
      const response = await eventAPI.getAll(profileId);
      setEvents(response.data.events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await eventAPI.create({
        ...newEvent,
        profileId,
        startDate: new Date(newEvent.startDate).toISOString(),
      });
      setNewEvent({
        title: '',
        description: '',
        location: '',
        eventType: 'OTHER',
        startDate: '',
      });
      setShowForm(false);
      fetchEvents();
    } catch (error) {
      console.error('Failed to add event:', error);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await eventAPI.delete(id);
      fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getEventsForDate = (day: number): Event[] => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentMonth.getMonth() &&
        eventDate.getFullYear() === currentMonth.getFullYear()
      );
    });
  };

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);

  if (loading) return <div className="text-center py-8 text-gray-600">Loading events...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Event Tracker</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 btn-primary">
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {showForm && (
        <div className="card">
          <form onSubmit={handleAddEvent} className="space-y-3">
            <input
              type="text"
              placeholder="Event name"
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              className="input"
              required
            />
            <textarea
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="input"
              rows={2}
            />
            <input
              type="text"
              placeholder="Location"
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
              className="input"
            />
            <select
              value={newEvent.eventType}
              onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
              className="input"
            >
              <option value="GO_OUT">Outing</option>
              <option value="SCHOOL_EVENT">School Event</option>
              <option value="SOCIAL_VISIT">Social Visit</option>
              <option value="APPOINTMENT">Appointment</option>
              <option value="OTHER">Other</option>
            </select>
            <input
              type="datetime-local"
              value={newEvent.startDate}
              onChange={(e) => setNewEvent({ ...newEvent, startDate: e.target.value })}
              className="input"
              required
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 btn-primary">
                Add Event
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">{monthName}</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square"></div>
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDate(day);
            return (
              <div
                key={day}
                className={`aspect-square border rounded-lg p-2 text-center relative cursor-pointer transition-all ${
                  dayEvents.length > 0
                    ? 'bg-purple-100 border-purple-400 font-semibold text-purple-900'
                    : 'bg-white border-gray-200 text-gray-700'
                } ${hoveredDate === day ? 'ring-2 ring-purple-400' : ''}`}
                onMouseEnter={() => setHoveredDate(day)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <div className="text-sm">{day}</div>
                {dayEvents.length > 0 && (
                  <div className="absolute inset-2 top-6 overflow-hidden">
                    {hoveredDate === day && dayEvents.length > 0 && (
                      <div className="absolute inset-0 bg-white border border-purple-400 rounded p-1 shadow-lg z-10">
                        <div className="text-xs font-semibold text-gray-800 mb-1">
                          {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                        </div>
                        <div className="text-xs text-gray-600 space-y-1 max-h-20 overflow-y-auto">
                          {dayEvents.map((event) => (
                            <div key={event.id} className="truncate">
                              • {event.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {hoveredDate !== day && dayEvents.length > 0 && (
                      <div className="text-xs text-purple-600">•</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {events.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-800">All Events</h3>
          {events.map((event) => (
            <div key={event.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <p className="font-medium text-gray-800">{event.title}</p>
                  </div>
                  {event.description && <p className="text-sm text-gray-600">{event.description}</p>}
                  {event.location && <p className="text-sm text-gray-600">📍 {event.location}</p>}
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(event.startDate).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-red-500 flex-shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
