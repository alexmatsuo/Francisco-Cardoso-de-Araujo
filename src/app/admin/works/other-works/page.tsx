'use client'

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Edit, ArrowUp, ArrowDown, Eye, X } from "lucide-react";

interface Work {
  id: number;
  title: string;
  year: number;
  instruments: string; // Using this field for "type" (Poetry, Visual Art, Essay, etc.)
  duration: string;
  information: string;
  programNotes: string; // Artist statement / Description
  videoUrls: string[];
  soundcloudUrl: string; // Can be used for audio works
  slug: string;
}

export default function AdminOtherWorks() {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [newWork, setNewWork] = useState({ 
    title: '', 
    year: new Date().getFullYear(), 
    instruments: 'Poetry', // Default type
    duration: '',
    information: '',
    programNotes: '',
    videoUrls: [''],
    soundcloudUrl: '',
    slug: ''
  });

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const response = await fetch('/api/works/other-works');
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      const processedWorks = data.works?.map((work: any) => ({
        ...work,
        videoUrls: Array.isArray(work.videoUrls) ? work.videoUrls : [],
        duration: work.duration || '',
        information: work.information || '',
        programNotes: work.programNotes || '',
        soundcloudUrl: work.soundcloudUrl || '',
        slug: work.slug || ''
      })) || [];
      setWorks(processedWorks);
    } catch (error) {
      console.error('Error fetching works:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWorks = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/works/other-works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ works }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save works');
      }

      const data = await response.json();
      console.log('Works saved:', data);
      alert('Works saved successfully!');
      setIsEditing(false);
      await fetchWorks();
      
    } catch (error) {
      console.error('Error saving works:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const addWork = () => {
    const slug = slugify(newWork.title);
    const workToAdd = {
      id: Date.now(),
      title: newWork.title,
      year: newWork.year,
      instruments: newWork.instruments,
      duration: newWork.duration,
      information: newWork.information,
      programNotes: newWork.programNotes,
      videoUrls: newWork.videoUrls.filter(url => url.trim() !== ''),
      soundcloudUrl: newWork.soundcloudUrl,
      slug: slug
    };
    
    setWorks([...works, workToAdd]);
    setNewWork({ 
      title: '', 
      year: new Date().getFullYear(), 
      instruments: 'Poetry',
      duration: '',
      information: '',
      programNotes: '',
      videoUrls: [''],
      soundcloudUrl: '',
      slug: ''
    });
  };

  const deleteWork = (id: number) => {
    if (confirm("Are you sure you want to delete this work?")) {
      setWorks(works.filter(work => work.id !== id));
    }
  };

  const openEditModal = (work: Work) => {
    setEditingWork({ ...work });
  };

  const closeEditModal = () => {
    setEditingWork(null);
  };

  const saveEdit = () => {
    if (!editingWork) return;
    
    const updatedSlug = slugify(editingWork.title);
    const updatedWork = { ...editingWork, slug: updatedSlug };
    
    setWorks(works.map(work => 
      work.id === editingWork.id ? updatedWork : work
    ));
    closeEditModal();
  };

  const updateEditingWork = (field: keyof Work, value: string | number | string[]) => {
    if (!editingWork) return;
    setEditingWork({ ...editingWork, [field]: value });
  };

  const addVideoUrl = (isNewWork: boolean = false) => {
    if (isNewWork) {
      setNewWork({ ...newWork, videoUrls: [...newWork.videoUrls, ''] });
    } else if (editingWork) {
      updateEditingWork('videoUrls', [...editingWork.videoUrls, '']);
    }
  };

  const removeVideoUrl = (index: number, isNewWork: boolean = false) => {
    if (isNewWork) {
      const newUrls = newWork.videoUrls.filter((_, i) => i !== index);
      setNewWork({ ...newWork, videoUrls: newUrls.length > 0 ? newUrls : [''] });
    } else if (editingWork) {
      const newUrls = editingWork.videoUrls.filter((_, i) => i !== index);
      updateEditingWork('videoUrls', newUrls.length > 0 ? newUrls : ['']);
    }
  };

  const updateVideoUrl = (index: number, value: string, isNewWork: boolean = false) => {
    if (isNewWork) {
      const newUrls = [...newWork.videoUrls];
      newUrls[index] = value;
      setNewWork({ ...newWork, videoUrls: newUrls });
    } else if (editingWork) {
      const newUrls = [...editingWork.videoUrls];
      newUrls[index] = value;
      updateEditingWork('videoUrls', newUrls);
    }
  };

  const moveWork = (index: number, direction: "up" | "down") => {
    const newWorks = [...works];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= works.length) return;

    [newWorks[index], newWorks[targetIndex]] = [newWorks[targetIndex], newWorks[index]];
    setWorks(newWorks);
  };

  const viewWork = (work: Work) => {
    const url = `/works/other-works/${work.slug || work.id}`;
    window.open(url, '_blank');
  };

  const slugify = (text: string): string => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  if (isLoading) {
    return (
      <main className="p-8 max-w-6xl mx-auto">
        <div className="text-center text-gray-300">Loading works...</div>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">Admin - Other Works</h1>
        <div className="flex gap-4">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-white"
            >
              <Edit className="w-5 h-5" />
              Edit Mode
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  fetchWorks();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors text-white"
              >
                <X className="w-5 h-5" />
                Cancel
              </button>
              <button
                onClick={saveWorks}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 rounded transition-colors text-white"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save All'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Add New Work Form */}
      {isEditing && (
        <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Add New Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
              <input
                type="text"
                value={newWork.title}
                onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="Work title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Year *</label>
              <input
                type="number"
                value={newWork.year}
                onChange={(e) => setNewWork({ ...newWork, year: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type *</label>
              <input
                type="text"
                value={newWork.instruments}
                onChange={(e) => setNewWork({ ...newWork, instruments: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="e.g., Poetry, Visual Art, Essay, Photography"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Duration (optional)</label>
              <input
                type="text"
                value={newWork.duration}
                onChange={(e) => setNewWork({ ...newWork, duration: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="e.g., '5 min' or '2:30'"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Information</label>
              <textarea
                value={newWork.information}
                onChange={(e) => setNewWork({ ...newWork, information: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                rows={3}
                placeholder="General information about the work"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Description / Artist Statement</label>
              <textarea
                value={newWork.programNotes}
                onChange={(e) => setNewWork({ ...newWork, programNotes: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                rows={4}
                placeholder="Description or artist statement"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Video URLs</label>
              {newWork.videoUrls.map((url, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => updateVideoUrl(index, e.target.value, true)}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    placeholder="YouTube, Vimeo, or other video URL"
                  />
                  {newWork.videoUrls.length > 1 && (
                    <button
                      onClick={() => removeVideoUrl(index, true)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addVideoUrl(true)}
                className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
              >
                + Add Video URL
              </button>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Audio URL (SoundCloud, etc.)</label>
              <input
                type="text"
                value={newWork.soundcloudUrl}
                onChange={(e) => setNewWork({ ...newWork, soundcloudUrl: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                placeholder="Audio embed URL"
              />
            </div>
          </div>
          <button
            onClick={addWork}
            disabled={!newWork.title || !newWork.instruments}
            className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition-colors text-white"
          >
            <Plus className="w-5 h-5" />
            Add Work
          </button>
        </div>
      )}

      {/* Works List */}
      <div className="space-y-4">
        {works.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No works yet. Add your first work above!
          </div>
        ) : (
          works.map((work, index) => (
            <div key={work.id} className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{work.title}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-300 mb-2">
                    <div><span className="font-medium">Type:</span> {work.instruments}</div>
                    <div><span className="font-medium">Year:</span> {work.year}</div>
                    {work.duration && (
                      <div><span className="font-medium">Duration:</span> {work.duration}</div>
                    )}
                  </div>
                  {work.information && (
                    <p className="text-sm text-gray-400 mb-2">{work.information}</p>
                  )}
                  {work.programNotes && (
                    <p className="text-sm text-gray-400 mb-2 italic">{work.programNotes}</p>
                  )}
                  {work.videoUrls.length > 0 && work.videoUrls.some(url => url) && (
                    <div className="text-sm text-gray-400">
                      <span className="font-medium">Videos:</span> {work.videoUrls.filter(url => url).length} URL(s)
                    </div>
                  )}
                  {work.soundcloudUrl && (
                    <div className="text-sm text-gray-400">
                      <span className="font-medium">Audio:</span> Yes
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  {isEditing && (
                    <>
                      <button
                        onClick={() => moveWork(index, "up")}
                        disabled={index === 0}
                        className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 rounded transition-colors text-white"
                        title="Move up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveWork(index, "down")}
                        disabled={index === works.length - 1}
                        className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 rounded transition-colors text-white"
                        title="Move down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(work)}
                        className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-white"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteWork(work.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 rounded transition-colors text-white"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => viewWork(work)}
                    className="p-2 bg-purple-600 hover:bg-purple-700 rounded transition-colors text-white"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingWork && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Edit Work</h2>
              <button
                onClick={closeEditModal}
                className="p-2 hover:bg-gray-700 rounded transition-colors text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                <input
                  type="text"
                  value={editingWork.title}
                  onChange={(e) => updateEditingWork('title', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Year *</label>
                <input
                  type="number"
                  value={editingWork.year}
                  onChange={(e) => updateEditingWork('year', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Type *</label>
                <input
                  type="text"
                  value={editingWork.instruments}
                  onChange={(e) => updateEditingWork('instruments', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  placeholder="e.g., Poetry, Visual Art, Essay"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                <input
                  type="text"
                  value={editingWork.duration}
                  onChange={(e) => updateEditingWork('duration', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Information</label>
                <textarea
                  value={editingWork.information}
                  onChange={(e) => updateEditingWork('information', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  rows={3}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Description / Artist Statement</label>
                <textarea
                  value={editingWork.programNotes}
                  onChange={(e) => updateEditingWork('programNotes', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                  rows={4}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Video URLs</label>
                {editingWork.videoUrls.map((url, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => updateVideoUrl(index, e.target.value, false)}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                    />
                    {editingWork.videoUrls.length > 1 && (
                      <button
                        onClick={() => removeVideoUrl(index, false)}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addVideoUrl(false)}
                  className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
                >
                  + Add Video URL
                </button>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">Audio URL</label>
                <input
                  type="text"
                  value={editingWork.soundcloudUrl}
                  onChange={(e) => updateEditingWork('soundcloudUrl', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={saveEdit}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors text-white"
              >
                Save Changes
              </button>
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded transition-colors text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}