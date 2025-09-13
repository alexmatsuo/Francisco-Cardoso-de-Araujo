'use client';

import { useState, useEffect } from "react";
import { Edit, Trash2, Save, X, Plus, Calendar, MapPin, Clock } from "lucide-react";

interface AdminEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  eventType: string;
  isUpcoming: boolean;
  time?: string;
  venue?: string;
  works?: string;
  performers?: string;
  website?: string;
  description?: string;
}

export default function AdminEvents() {
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<AdminEvent>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '19:30',
    location: '',
    venue: '',
    description: '',
    eventType: 'concert',
    works: '',
    performers: '',
    website: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Fetch events from your DB on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      if (!res.ok) throw new Error('Failed to fetch');
      
      const data = await res.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (event: AdminEvent) => {
    setEditingId(event.id);
    
    // Extract date and time from ISO string
    const eventDate = new Date(event.date);
    const date = eventDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const time = eventDate.toTimeString().substring(0, 5); // HH:MM
    
    setDraft({ 
      ...event,
      date: date,
      time: time
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    
    setIsSaving(true);
    try {
      // Combine date and time into ISO string
      const dateStr = draft.date || events.find(e => e.id === editingId)?.date || '';
      const timeStr = draft.time || '12:00';
      
      let isoDateString = '';
      if (dateStr) {
        const [year, month, day] = dateStr.split('-');
        const [hours, minutes] = timeStr.split(':');
        
        // Create date in local timezone but output as ISO string
        const eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 
                                  parseInt(hours), parseInt(minutes));
        
        isoDateString = eventDate.toISOString();
      }

      const updatedDraft = {
        ...draft,
        date: isoDateString,
        isUpcoming: dateStr ? new Date(dateStr + 'T' + timeStr) > new Date() : undefined
      };

      const updatedEvents = events.map(event => 
        event.id === editingId 
          ? { ...event, ...updatedDraft }
          : event
      );

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: updatedEvents }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save events');
      }

      await fetchEvents();
      cancelEdit();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const removeEvent = async (id: number) => {
    try {
      const updatedEvents = events.filter(e => e.id !== id);
      
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: updatedEvents }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete event');
      }

      setEvents(updatedEvents);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event. Please try again.');
    }
  };

  const addEvent = async () => {
    if (!newEvent.title.trim() || !newEvent.location.trim() || !newEvent.date) {
      alert('Please fill in title, date, and location');
      return;
    }

    // Combine date and time into ISO string
    const [year, month, day] = newEvent.date.split('-');
    const [hours, minutes] = newEvent.time.split(':');
    
    const eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 
                              parseInt(hours), parseInt(minutes));

    const event: AdminEvent = {
      id: Date.now(),
      title: newEvent.title.trim(),
      date: eventDate.toISOString(),
      location: newEvent.location.trim(),
      venue: newEvent.venue.trim() || undefined,
      description: newEvent.description.trim() || undefined,
      eventType: newEvent.eventType,
      works: newEvent.works.trim() || undefined,
      performers: newEvent.performers.trim() || undefined,
      website: newEvent.website.trim() || undefined,
      isUpcoming: eventDate > new Date()
    };

    try {
      const updatedEvents = [...events, event];
      
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: updatedEvents }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save event');
      }

      await fetchEvents();
      
      // Reset form
      setNewEvent({
        title: '',
        date: '',
        time: '19:30',
        location: '',
        venue: '',
        description: '',
        eventType: 'concert',
        works: '',
        performers: '',
        website: ''
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Error adding event. Please try again.');
    }
  };

  const updateDraft = (field: keyof AdminEvent, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <main className="p-6 text-gray-100">
        <div className="text-center">Loading events...</div>
      </main>
    );
  }

  return (
    <main className="p-6 text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Events</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      {/* Add Event Form */}
      {showAddForm && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
          <h2 className="text-lg font-semibold mb-4">Add New Event</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Title *</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Event title"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Date *</label>
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Time *</label>
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Event Type</label>
              <select
                value={newEvent.eventType}
                onChange={(e) => setNewEvent({ ...newEvent, eventType: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="concert">Concert</option>
                <option value="premiere">Premiere</option>
                <option value="workshop">Workshop</option>
                <option value="masterclass">Masterclass</option>
                <option value="festival">Festival</option>
                <option value="recital">Recital</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Location *</label>
              <input
                type="text"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="City, Country"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Venue</label>
              <input
                type="text"
                value={newEvent.venue}
                onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Venue name"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Website</label>
              <input
                type="url"
                value={newEvent.website}
                onChange={(e) => setNewEvent({ ...newEvent, website: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Works</label>
              <input
                type="text"
                value={newEvent.works}
                onChange={(e) => setNewEvent({ ...newEvent, works: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Musical works"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Performers</label>
              <input
                type="text"
                value={newEvent.performers}
                onChange={(e) => setNewEvent({ ...newEvent, performers: e.target.value })}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Collaborators"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">Description</label>
            <textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none resize-vertical"
              rows={3}
              placeholder="Event description"
            />
            </div>
          <div className="flex gap-2">
            <button
              onClick={addEvent}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Events Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="w-full border-collapse">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-3 text-left text-sm text-gray-400">Event</th>
              <th className="p-3 text-left text-sm text-gray-400">Date & Time</th>
              <th className="p-3 text-left text-sm text-gray-400">Location</th>
              <th className="p-3 text-left text-sm text-gray-400">Type</th>
              <th className="p-3 text-left text-sm text-gray-400">Status</th>
              <th className="p-3 text-left text-sm text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <>
                <tr key={event.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                  <td className="p-3">
                    <div className="font-medium text-gray-200">{event.title}</div>
                    {event.venue && (
                      <div className="text-sm text-gray-400">{event.venue}</div>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {formatDateTime(event.date)}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {event.location}
                    </div>
                  </td>
                  <td className="p-3 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium uppercase ${
                      event.eventType === 'concert' ? 'bg-blue-500/20 text-blue-400' :
                      event.eventType === 'premiere' ? 'bg-green-500/20 text-green-400' :
                      event.eventType === 'workshop' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {event.eventType}
                    </span>
                  </td>
                  <td className="p-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        event.isUpcoming
                          ? "bg-green-900 text-green-200"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {event.isUpcoming ? "Upcoming" : "Past"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(event)}
                        disabled={editingId === event.id}
                        className="p-1 rounded hover:bg-gray-600 disabled:opacity-50"
                      >
                        <Edit className="w-4 h-4 text-blue-400" />
                      </button>
                      <button
                        onClick={() => removeEvent(event.id)}
                        className="p-1 rounded hover:bg-red-900"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded row for editing */}
                {editingId === event.id && (
                  <tr>
                    <td colSpan={6} className="p-6 bg-gray-900 border-b border-gray-700">
                      <h3 className="text-lg font-medium mb-4">Edit Event</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Title</label>
                          <input
                            type="text"
                            value={draft.title || ""}
                            onChange={(e) => updateDraft("title", e.target.value)}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Date</label>
                          <input
                            type="date"
                            value={draft.date || ""}
                            onChange={(e) => updateDraft("date", e.target.value)}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Time</label>
                          <input
                            type="time"
                            value={draft.time || ""}
                            onChange={(e) => updateDraft("time", e.target.value)}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Event Type</label>
                          <select
                            value={draft.eventType || ""}
                            onChange={(e) => updateDraft("eventType", e.target.value)}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                          >
                            <option value="concert">Concept</option>
                            <option value="premiere">Premiere</option>
                            <option value="workshop">Workshop</option>
                            <option value="masterclass">Masterclass</option>
                            <option value="festival">Festival</option>
                            <option value="recital">Recital</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Location</label>
                          <input
                            type="text"
                            value={draft.location || ""}
                            onChange={(e) => updateDraft("location", e.target.value)}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Venue</label>
                          <input
                            type="text"
                            value={draft.venue || ""}
                            onChange={(e) => updateDraft("venue", e.target.value)}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Website</label>
                          <input
                            type="url"
                            value={draft.website || ""}
                            onChange={(e) => updateDraft("website", e.target.value)}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Works</label>
                          <input
                            type="text"
                            value={draft.works || ""}
                            onChange={(e) => updateDraft("works", e.target.value)}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Performers</label>
                          <input
                            type="text"
                            value={draft.performers || ""}
                            onChange={(e) => updateDraft("performers", e.target.value)}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                          />
                        </div>
                        <div className="col-span-full">
                          <label className="block text-xs text-gray-400 mb-1">Description</label>
                          <textarea
                            value={draft.description || ""}
                            onChange={(e) => updateDraft("description", e.target.value)}
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none resize-vertical"
                            rows={3}
                          />
                        </div>
                      </div>

                      {/* Save / Cancel buttons */}
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={saveEdit}
                          disabled={isSaving}
                          className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 rounded text-sm transition-colors"
                        >
                          <Save className="w-4 h-4" /> 
                          {isSaving ? 'Saving...' : 'Save'}
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                        >
                          <X className="w-4 h-4" /> Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-400">
        Total events: {events.length} ({events.filter(e => e.isUpcoming).length} upcoming, {events.filter(e => !e.isUpcoming).length} past)
      </div>
    </main>
  );
}