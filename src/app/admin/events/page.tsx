'use client'

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Calendar, MapPin, ExternalLink, FileImage, Image, FileText, Save, X, Upload } from "lucide-react";

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
  isUpcoming: boolean;
  posterUrl?: string;
  imageUrls?: string[];
  pdfUrl?: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadType, setUploadType] = useState<'poster' | 'image' | 'pdf' | null>(null);

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
    try {
      const response = await fetch("/api/events");
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'poster' | 'image' | 'pdf') => {
    setUploadingFile(true);
    setUploadType(type);
    
    try {
      // Validate file size on frontend too
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        throw new Error(`File too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
      }
  
      // Validate file type
      if (type === 'pdf' && file.type !== 'application/pdf') {
        throw new Error('Please select a PDF file');
      }
      
      if ((type === 'poster' || type === 'image') && !file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }
  
      console.log('Uploading file:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
  
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type === 'pdf' ? 'pdf' : 'image');
  
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Upload failed:', data);
        throw new Error(data.error || `Upload failed with status ${response.status}`);
      }
  
      console.log('Upload successful:', data);
  
      // Update form data based on upload type
      if (type === 'poster') {
        setFormData(prev => ({ ...prev, posterUrl: data.url }));
      } else if (type === 'image') {
        setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, data.url] }));
      } else if (type === 'pdf') {
        setFormData(prev => ({ ...prev, pdfUrl: data.url }));
      }
  
      // Show success message
      console.log(`${type} uploaded successfully!`);
      
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Show user-friendly error message
      let errorMessage = 'Failed to upload file';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setUploadingFile(false);
      setUploadType(null);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    const dateObj = new Date(event.date);
    const formattedDate = dateObj.toISOString().slice(0, 16);
    
    setFormData({
      title: event.title,
      date: formattedDate,
      location: event.location,
      venue: event.venue || '',
      description: event.description || '',
      eventType: event.eventType,
      works: event.works || '',
      performers: event.performers || '',
      website: event.website || '',
      posterUrl: event.posterUrl || '',
      imageUrls: event.imageUrls || [],
      pdfUrl: event.pdfUrl || ''
    });
    setIsAddingNew(false);
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
        <div className="text-center">Loading events...</div>
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Events</h1>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add New Event
        </button>
      </div>

      {/* Edit/Add Form */}
      {(editingEvent || isAddingNew) && (
        <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date & Time *</label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Venue</label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Event Type</label>
              <select
                value={formData.eventType}
                onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded"
              >
                <option value="concert">Concert</option>
                <option value="premiere">Premiere</option>
                <option value="workshop">Workshop</option>
                <option value="masterclass">Masterclass</option>
                <option value="festival">Festival</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Works</label>
              <input
                type="text"
                value={formData.works}
                onChange={(e) => setFormData({ ...formData, works: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Performers</label>
              <input
                type="text"
                value={formData.performers}
                onChange={(e) => setFormData({ ...formData, performers: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-black/50 border border-white/20 rounded"
                rows={4}
              />
            </div>

            {/* File Uploads Section */}
            <div className="md:col-span-2 space-y-4 border-t border-white/10 pt-4">
              {/* Poster Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Event Poster</label>
                {formData.posterUrl ? (
                  <div className="flex items-center gap-4">
                    <img src={formData.posterUrl} alt="Poster" className="h-24 object-cover rounded" />
                    <button
                      onClick={() => setFormData({ ...formData, posterUrl: '' })}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-sm rounded"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'poster')}
                    disabled={uploadingFile}
                    className="text-sm"
                  />
                )}
                {uploadingFile && uploadType === 'poster' && <p className="text-sm text-gray-400 mt-1">Uploading poster...</p>}
              </div>

              {/* Gallery Images Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Gallery Images</label>
                <div className="space-y-2">
                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <img src={url} alt={`Gallery ${index + 1}`} className="h-20 object-cover rounded" />
                      <button
                        onClick={() => removeImage(index)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-sm rounded"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'image')}
                    disabled={uploadingFile}
                    className="text-sm"
                  />
                  {uploadingFile && uploadType === 'image' && <p className="text-sm text-gray-400">Uploading image...</p>}
                </div>
              </div>

              {/* PDF Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Program PDF</label>
                {formData.pdfUrl ? (
                  <div className="flex items-center gap-4">
                    <a href={formData.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                      View PDF
                    </a>
                    <button
                      onClick={() => setFormData({ ...formData, pdfUrl: '' })}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-sm rounded"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'pdf')}
                    disabled={uploadingFile}
                    className="text-sm"
                  />
                )}
                {uploadingFile && uploadType === 'pdf' && <p className="text-sm text-gray-400">Uploading PDF...</p>}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="p-4 bg-white/5 border border-white/10 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded ${
                    event.isUpcoming 
                      ? 'bg-green-600/20 text-green-400' 
                      : 'bg-gray-600/20 text-gray-400'
                  }`}>
                    {event.isUpcoming ? 'Upcoming' : 'Past'}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    event.eventType === 'concert' ? 'bg-blue-600/20 text-blue-400' :
                    event.eventType === 'premiere' ? 'bg-green-600/20 text-green-400' :
                    event.eventType === 'workshop' ? 'bg-purple-600/20 text-purple-400' :
                    'bg-gray-600/20 text-gray-400'
                  }`}>
                    {event.eventType}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDateTime(event.date)}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                </div>

                {/* Media indicators */}
                <div className="flex gap-2 mt-2">
                  {event.posterUrl && (
                    <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-1 rounded flex items-center gap-1">
                      <FileImage className="w-3 h-3" />
                      Poster
                    </span>
                  )}
                  {event.imageUrls && event.imageUrls.length > 0 && (
                    <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded flex items-center gap-1">
                      <Image className="w-3 h-3" />
                      {event.imageUrls.length} Images
                    </span>
                  )}
                  {event.pdfUrl && (
                    <span className="text-xs bg-amber-600/20 text-amber-400 px-2 py-1 rounded flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      PDF
                    </span>
                  )}
                  {event.website && (
                    <span className="text-xs bg-gray-600/20 text-gray-400 px-2 py-1 rounded flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      Website
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No events yet. Click "Add New Event" to create one.
        </div>
      )}
    </main>
  );
}