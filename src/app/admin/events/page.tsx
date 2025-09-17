'use client';

import { useState, useEffect, useRef } from "react";
import { Edit, Trash2, Save, X, Plus, Calendar, MapPin, Clock, Upload, File, Image } from "lucide-react";
import React from 'react';

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
  imageFileNames?: string[]; // Changed from imageFileName to array
  pdfFileName?: string;
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
    website: '',
    imageFiles: [] as File[], // Changed to array
    pdfFile: null as File | null
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [editFiles, setEditFiles] = useState({
    imageFiles: [] as File[], // Changed to array
    pdfFile: null as File | null
  });
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const editImageInputRef = useRef<HTMLInputElement>(null);
  const editPdfInputRef = useRef<HTMLInputElement>(null);

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

  const uploadFile = async (file: File, type: 'image' | 'pdf'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const data = await response.json();
    return data.filename;
  };

  const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
    const uploadPromises = files.map(file => uploadFile(file, 'image'));
    return Promise.all(uploadPromises);
  };

  // CORRECTED removeImage function
  const removeImage = async (eventId: number, imageFileName: string) => {
    if (!confirm('Remove this image from the event?')) return;

    try {
      // Find the current event
      const currentEvent = events.find(e => e.id === eventId);
      if (!currentEvent) {
        throw new Error('Event not found');
      }

      // Create updated event with image removed
      const updatedImageFileNames = (currentEvent.imageFileNames || []).filter(name => name !== imageFileName);
      
      // Prepare the data for the API call - need to include ALL event fields
      const updatedEventData = {
        title: currentEvent.title,
        date: currentEvent.date, // Keep as ISO string
        location: currentEvent.location,
        venue: currentEvent.venue || undefined,
        description: currentEvent.description || undefined,
        eventType: currentEvent.eventType,
        works: currentEvent.works || undefined,
        performers: currentEvent.performers || undefined,
        website: currentEvent.website || undefined,
        imageFileNames: updatedImageFileNames.length > 0 ? updatedImageFileNames : undefined,
        pdfFileName: currentEvent.pdfFileName || undefined,
        isUpcoming: currentEvent.isUpcoming
      };

      // Save to server using PUT to update the specific event
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update event');
      }

      // Update local state
      setEvents(events.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            imageFileNames: updatedImageFileNames.length > 0 ? updatedImageFileNames : undefined
          };
        }
        return event;
      }));

      // Also update the draft if we're currently editing this event
      if (editingId === eventId) {
        setDraft(prev => ({
          ...prev,
          imageFileNames: updatedImageFileNames.length > 0 ? updatedImageFileNames : undefined
        }));
      }

    } catch (error) {
      console.error('Error removing image:', error);
      alert(`Error removing image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Refresh events to get the correct state from server
      fetchEvents();
    }
  };

  const startEdit = (event: AdminEvent) => {
    setEditingId(event.id);
    
    const eventDate = new Date(event.date);
    const date = eventDate.toISOString().split('T')[0];
    const time = eventDate.toTimeString().substring(0, 5);
    
    setDraft({ 
      ...event,
      date: date,
      time: time
    });
    setEditFiles({ imageFiles: [], pdfFile: null });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft({});
    setEditFiles({ imageFiles: [], pdfFile: null });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    
    setIsSaving(true);
    try {
      let updatedData = { ...draft };

      // Upload new images if selected
      if (editFiles.imageFiles.length > 0) {
        const imageFileNames = await uploadMultipleImages(editFiles.imageFiles);
        // Append to existing images or create new array
        const existingImages = updatedData.imageFileNames || [];
        updatedData.imageFileNames = [...existingImages, ...imageFileNames];
      }

      if (editFiles.pdfFile) {
        const pdfFileName = await uploadFile(editFiles.pdfFile, 'pdf');
        updatedData.pdfFileName = pdfFileName;
      }

      // Combine date and time into ISO string
      const dateStr = updatedData.date || events.find(e => e.id === editingId)?.date || '';
      const timeStr = updatedData.time || '12:00';
      
      let isoDateString = '';
      if (dateStr) {
        const [year, month, day] = dateStr.split('-');
        const [hours, minutes] = timeStr.split(':');
        
        const eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 
                                  parseInt(hours), parseInt(minutes));
        
        isoDateString = eventDate.toISOString();
      }

      updatedData = {
        ...updatedData,
        date: isoDateString,
        isUpcoming: dateStr ? new Date(dateStr + 'T' + timeStr) > new Date() : undefined
      };

      // Use PUT to update specific event
      const response = await fetch(`/api/events/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update event');
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
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      // Use DELETE method for deleting
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete event');
      }

      // Update local state
      setEvents(events.filter(e => e.id !== id));
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

    try {
      let imageFileNames: string[] = [];
      let pdfFileName = undefined;

      // Upload images if selected
      if (newEvent.imageFiles.length > 0) {
        imageFileNames = await uploadMultipleImages(newEvent.imageFiles);
      }

      if (newEvent.pdfFile) {
        pdfFileName = await uploadFile(newEvent.pdfFile, 'pdf');
      }

      // Combine date and time into ISO string
      const [year, month, day] = newEvent.date.split('-');
      const [hours, minutes] = newEvent.time.split(':');
      
      const eventDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 
                                parseInt(hours), parseInt(minutes));

      // Create event data for the API
      const eventData = {
        title: newEvent.title.trim(),
        date: eventDate.toISOString(),
        location: newEvent.location.trim(),
        venue: newEvent.venue.trim() || undefined,
        description: newEvent.description.trim() || undefined,
        eventType: newEvent.eventType,
        works: newEvent.works.trim() || undefined,
        performers: newEvent.performers.trim() || undefined,
        website: newEvent.website.trim() || undefined,
        imageFileNames: imageFileNames.length > 0 ? imageFileNames : undefined,
        pdfFileName,
        isUpcoming: eventDate > new Date()
      };

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
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
        website: '',
        imageFiles: [],
        pdfFile: null
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

  const handleMultipleFileSelect = (files: FileList | null, isEditing = false) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    if (isEditing) {
      setEditFiles(prev => ({ ...prev, imageFiles: [...prev.imageFiles, ...fileArray] }));
    } else {
      setNewEvent(prev => ({ ...prev, imageFiles: [...prev.imageFiles, ...fileArray] }));
    }
  };

  const removeFileFromList = (index: number, isEditing = false) => {
    if (isEditing) {
      setEditFiles(prev => ({
        ...prev,
        imageFiles: prev.imageFiles.filter((_, i) => i !== index)
      }));
    } else {
      setNewEvent(prev => ({
        ...prev,
        imageFiles: prev.imageFiles.filter((_, i) => i !== index)
      }));
    }
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

          {/* File Upload Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Event Images</label>
              <div className="space-y-2">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleMultipleFileSelect(e.target.files)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded border border-gray-600 transition-colors"
                >
                  <Image className="w-4 h-4" />
                  Choose image files
                </button>
                {newEvent.imageFiles.length > 0 && (
                  <div className="space-y-1">
                    {newEvent.imageFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-600 p-2 rounded text-sm">
                        <span className="truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFileFromList(index)}
                          className="text-red-400 hover:text-red-300 ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Program PDF</label>
              <div className="space-y-2">
                <input
                  ref={pdfInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setNewEvent({ ...newEvent, pdfFile: e.target.files?.[0] || null })}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  className="w-full flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded border border-gray-600 transition-colors"
                >
                  <File className="w-4 h-4" />
                  {newEvent.pdfFile ? newEvent.pdfFile.name : 'Choose PDF file'}
                </button>
              </div>
            </div>
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
              <th className="p-3 text-left text-sm text-gray-400">Files</th>
              <th className="p-3 text-left text-sm text-gray-400">Status</th>
              <th className="p-3 text-left text-sm text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <React.Fragment key={event.id}>
                <tr className="border-b border-gray-700 hover:bg-gray-800/50">
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
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {event.imageFileNames && event.imageFileNames.length > 0 && (
                        <span className="inline-flex items-center px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                          <Image className="w-3 h-3 mr-1" />
                          {event.imageFileNames.length} IMG{event.imageFileNames.length > 1 ? 'S' : ''}
                        </span>
                      )}
                      {event.pdfFileName && (
                        <span className="inline-flex items-center px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded">
                          <File className="w-3 h-3 mr-1" />
                          PDF
                        </span>
                      )}
                    </div>
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
                    <td colSpan={7} className="p-6 bg-gray-900 border-b border-gray-700">
                      <h3 className="text-lg font-medium mb-4">Edit Event</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
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
                            <option value="concert">Concert</option>
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
                      </div>
                      <div className="mb-4">
                        <label className="block text-xs text-gray-400 mb-1">Description</label>
                        <textarea
                          value={draft.description || ""}
                          onChange={(e) => updateDraft("description", e.target.value)}
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none resize-vertical"
                          rows={3}
                        />
                      </div>

                      {/* Existing Images */}
                      {event.imageFileNames && event.imageFileNames.length > 0 && (
                        <div className="mb-4">
                          <label className="block text-xs text-gray-400 mb-2">Current Images</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {event.imageFileNames.map((imageName, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={`/api/files/images/${imageName}`}
                                  alt={`Event image ${index + 1}`}
                                  className="w-full h-24 object-cover rounded border border-gray-600"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(event.id, imageName)}
                                  className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* File Upload Section for Editing */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Add More Images
                          </label>
                          <div className="space-y-2">
                            <input
                              ref={editImageInputRef}
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleMultipleFileSelect(e.target.files, true)}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => editImageInputRef.current?.click()}
                              className="w-full flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded border border-gray-600 transition-colors"
                            >
                              <Image className="w-4 h-4" />
                              Choose additional images
                            </button>
                            {editFiles.imageFiles.length > 0 && (
                              <div className="space-y-1">
                                {editFiles.imageFiles.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between bg-gray-600 p-2 rounded text-sm">
                                    <span className="truncate">{file.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeFileFromList(index, true)}
                                      className="text-red-400 hover:text-red-300 ml-2"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Program PDF
                          </label>
                          <div className="space-y-2">
                            <input
                              ref={editPdfInputRef}
                              type="file"
                              accept=".pdf"
                              onChange={(e) => setEditFiles(prev => ({ ...prev, pdfFile: e.target.files?.[0] || null }))}
                              className="hidden"
                            />
                            <button
                              type="button"
                              onClick={() => editPdfInputRef.current?.click()}
                              className="w-full flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded border border-gray-600 transition-colors"
                            >
                              <File className="w-4 h-4" />
                              {editFiles.pdfFile ? editFiles.pdfFile.name : 'Choose new PDF'}
                            </button>
                          </div>
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
              </React.Fragment>
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