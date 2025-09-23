'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Calendar, 
  MapPin, 
  FileImage, 
  Image, 
  FileText, 
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Save,
  X
} from 'lucide-react';

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  venue?: string;
  description?: string;
  eventType: string;
  works?: string;
  performers?: string;
  website?: string;
  posterUrl?: string;
  imageUrls?: string[];
  pdfUrl?: string;
  isUpcoming: boolean;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    venue: '',
    description: '',
    eventType: 'concert',
    works: '',
    performers: '',
    website: '',
    posterUrl: '',
    imageUrls: [] as string[],
    pdfUrl: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Move event functionality (similar to works admin)
  const moveEvent = (index: number, direction: "up" | "down") => {
    const newEvents = [...events];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= events.length) return;

    [newEvents[index], newEvents[targetIndex]] = [newEvents[targetIndex], newEvents[index]];
    setEvents(newEvents);
  };

  // Save events order to backend
  const saveEventsOrder = async () => {
    setIsSaving(true);
    try {
      console.log('Saving events:', events);
      
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save events order');
      }

      const data = await response.json();
      console.log('Events saved:', data);
      alert('Events order saved successfully!');
      await fetchEvents();
      
    } catch (error) {
      console.error('Error saving events order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || '',
      date: event.date || '',
      location: event.location || '',
      venue: event.venue || '',
      description: event.description || '',
      eventType: event.eventType || 'concert',
      works: event.works || '',
      performers: event.performers || '',
      website: event.website || '',
      posterUrl: event.posterUrl || '',
      imageUrls: event.imageUrls || [],
      pdfUrl: event.pdfUrl || ''
    });
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingEvent(null);
    setFormData({
      title: '',
      date: '',
      location: '',
      venue: '',
      description: '',
      eventType: 'concert',
      works: '',
      performers: '',
      website: '',
      posterUrl: '',
      imageUrls: [],
      pdfUrl: ''
    });
  };

  const handleCancel = () => {
    setEditingEvent(null);
    setIsAddingNew(false);
    setFormData({
      title: '',
      date: '',
      location: '',
      venue: '',
      description: '',
      eventType: 'concert',
      works: '',
      performers: '',
      website: '',
      posterUrl: '',
      imageUrls: [],
      pdfUrl: ''
    });
  };

  const handleSave = async () => {
    try {
      if (editingEvent) {
        // Update existing event
        const response = await fetch(`/api/events/${editingEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to update event');
        
        alert('Event updated successfully!');
      } else if (isAddingNew) {
        // Create new event
        const response = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to create event');
        
        alert('Event created successfully!');
      }

      handleCancel();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete event');
      
      alert('Event deleted successfully!');
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <main className="p-8">
        <div className="text-center text-gray-300">Loading events...</div>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Admin - Manage Events</h1>
        <div className="flex gap-4">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors text-white"
          >
            <Plus className="w-5 h-5" />
            Add New Event
          </button>
          <button
            onClick={saveEventsOrder}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded transition-colors text-white"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Edit/Add Form */}
      {(editingEvent || isAddingNew) && (
        <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Date & Time *</label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Venue</label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Event Type</label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded text-white"
              >
                <option value="concert">Concert</option>
                <option value="premiere">Premiere</option>
                <option value="workshop">Workshop</option>
                <option value="masterclass">Masterclass</option>
                <option value="festival">Festival</option>
                <option value="conference">Conference</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Website URL</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded text-white"
                placeholder="https://example.com"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-300">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded text-white"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Works Performed</label>
              <textarea
                value={formData.works}
                onChange={(e) => setFormData({ ...formData, works: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded text-white"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-300">Performers</label>
              <textarea
                value={formData.performers}
                onChange={(e) => setFormData({ ...formData, performers: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded text-white"
                rows={2}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-white"
            >
              {editingEvent ? 'Update Event' : 'Create Event'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="bg-white/5 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Event Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date & Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Type & Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {events.map((event, index) => (
                <tr key={event.id} className="hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-white">{event.title}</div>
                      {event.venue && (
                        <div className="text-sm text-gray-400">{event.venue}</div>
                      )}
                      {event.description && (
                        <div className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {event.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Calendar className="w-4 h-4" />
                      {formatDateTime(event.date)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <span className={`px-2 py-1 text-xs rounded w-fit ${
                        event.isUpcoming 
                          ? 'bg-green-600/20 text-green-400' 
                          : 'bg-gray-600/20 text-gray-400'
                      }`}>
                        {event.isUpcoming ? 'Upcoming' : 'Past'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded w-fit ${
                        event.eventType === 'concert' ? 'bg-blue-600/20 text-blue-400' :
                        event.eventType === 'premiere' ? 'bg-green-600/20 text-green-400' :
                        event.eventType === 'workshop' ? 'bg-purple-600/20 text-purple-400' :
                        'bg-gray-600/20 text-gray-400'
                      }`}>
                        {event.eventType}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveEvent(index, "up")}
                        disabled={index === 0}
                        className="text-blue-400 hover:text-blue-300 disabled:text-gray-600 transition-colors p-1"
                        title="Move up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveEvent(index, "down")}
                        disabled={index === events.length - 1}
                        className="text-blue-400 hover:text-blue-300 disabled:text-gray-600 transition-colors p-1"
                        title="Move down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(event)}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors p-1"
                        title="Edit event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                        title="Delete event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {events.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No events yet. Click "Add New Event" to create one.
        </div>
      )}

      <div className="mt-6 text-sm text-gray-400">
        Total events: {events.length}
      </div>
    </main>
  );
}