'use client'

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Edit, ArrowUp, ArrowDown, Eye, X } from "lucide-react";

interface Work {
  id: number;
  title: string;
  year: number;
  instruments: string;
  duration: string;
  information: string;
  programNotes: string;
  imageFileName: string;
  videoUrl: string;
  soundcloudUrl: string;
  slug: string;
}

export default function AdminLargeEnsemblesWorks() {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [newWork, setNewWork] = useState({ 
    title: '', 
    year: new Date().getFullYear(), 
    instruments: '',
    duration: '',
    information: '',
    programNotes: '',
    imageFileName: '',
    videoUrl: '',
    soundcloudUrl: '',
    slug: ''
  });

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const response = await fetch('/api/works/large-ensembles');
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setWorks(data.works || []);
    } catch (error) {
      console.error('Error fetching works:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWorks = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/works/large-ensembles', {
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
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Error saving works: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  const addWork = () => {
    if (!newWork.title.trim() || !newWork.instruments.trim()) {
      alert('Please fill in title and instruments');
      return;
    }

    const work: Work = {
      id: Date.now(), // Temporary ID
      title: newWork.title.trim(),
      year: newWork.year,
      instruments: newWork.instruments.trim(),
      duration: newWork.duration.trim(),
      information: newWork.information.trim(),
      programNotes: newWork.programNotes.trim(),
      imageFileName: newWork.imageFileName.trim(),
      videoUrl: newWork.videoUrl.trim(),
      soundcloudUrl: newWork.soundcloudUrl.trim(),
      slug: newWork.slug.trim() || slugify(newWork.title.trim())
    };

    setWorks([...works, work]);
    setNewWork({ 
      title: '', 
      year: new Date().getFullYear(), 
      instruments: '',
      duration: '',
      information: '',
      programNotes: '',
      imageFileName: '',
      videoUrl: '',
      soundcloudUrl: '',
      slug: ''
    });
  };

  const removeWork = (id: number) => {
    setWorks(works.filter(work => work.id !== id));
  };

  const updateWork = (id: number, field: keyof Work, value: string | number) => {
    setWorks(works.map(work => 
      work.id === id ? { ...work, [field]: value } : work
    ));
  };

  const moveWork = (index: number, direction: "up" | "down") => {
    const newWorks = [...works];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= works.length) return;

    [newWorks[index], newWorks[targetIndex]] = [newWorks[targetIndex], newWorks[index]];
    setWorks(newWorks);
  };

  const openEditModal = (work: Work) => {
    setEditingWork({ ...work });
  };

  const closeEditModal = () => {
    setEditingWork(null);
  };

  const saveEditedWork = () => {
    if (!editingWork) return;
    
    if (!editingWork.title.trim() || !editingWork.instruments.trim()) {
      alert('Please fill in title and instruments');
      return;
    }

    const updatedWork = {
      ...editingWork,
      title: editingWork.title.trim(),
      instruments: editingWork.instruments.trim(),
      duration: editingWork.duration.trim(),
      information: editingWork.information.trim(),
      programNotes: editingWork.programNotes.trim(),
      imageFileName: editingWork.imageFileName.trim(),
      videoUrl: editingWork.videoUrl.trim(),
      soundcloudUrl: editingWork.soundcloudUrl.trim(),
      slug: editingWork.slug.trim() || slugify(editingWork.title.trim())
    };

    setWorks(works.map(work => 
      work.id === editingWork.id ? updatedWork : work
    ));
    closeEditModal();
  };

  const updateEditingWork = (field: keyof Work, value: string | number) => {
    if (!editingWork) return;
    setEditingWork({ ...editingWork, [field]: value });
  };

  const viewWork = (work: Work) => {
    // Navigate to the work's page - adjust the URL structure as needed
    const url = `/works/large-ensembles/${work.slug || work.id}`;
    window.open(url, '_blank');
  };

  // Simple slugify function
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
      <>
        <main className="p-8 max-w-6xl mx-auto font-avenir">
          <div className="text-center text-[#D3CEAD]">Loading works...</div>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Admin - Large Ensembles Works</h1>
          <div className="flex gap-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-[#D3CEAD] hover:bg-[#D3CEAD]/70 text-black px-4 py-2 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Works
              </button>
            ) : (
              <>
                <button
                  onClick={saveWorks}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-[#D3CEAD] hover:bg-[#D3CEAD]/70 disabled:bg-[#D3CEAD] text-black px-4 py-2 rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    fetchWorks();
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Add New Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Title *"
                value={newWork.title}
                onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Year *"
                value={newWork.year}
                onChange={(e) => setNewWork({ ...newWork, year: parseInt(e.target.value) || new Date().getFullYear() })}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none min-w-[100px]"
              />
              <input
                type="text"
                placeholder="Instruments *"
                value={newWork.instruments}
                onChange={(e) => setNewWork({ ...newWork, instruments: e.target.value })}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 5:30)"
                value={newWork.duration}
                onChange={(e) => setNewWork({ ...newWork, duration: e.target.value })}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Video URL"
                value={newWork.videoUrl}
                onChange={(e) => setNewWork({ ...newWork, videoUrl: e.target.value })}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="SoundCloud URL"
                value={newWork.soundcloudUrl}
                onChange={(e) => setNewWork({ ...newWork, soundcloudUrl: e.target.value })}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <input
                type="text"
                placeholder="Image filename"
                value={newWork.imageFileName}
                onChange={(e) => setNewWork({ ...newWork, imageFileName: e.target.value })}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Slug (auto-generated if empty)"
                value={newWork.slug}
                onChange={(e) => setNewWork({ ...newWork, slug: e.target.value })}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <textarea
                placeholder="Information"
                value={newWork.information}
                onChange={(e) => setNewWork({ ...newWork, information: e.target.value })}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                rows={2}
              />
              <textarea
                placeholder="Program Notes"
                value={newWork.programNotes}
                onChange={(e) => setNewWork({ ...newWork, programNotes: e.target.value })}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                rows={2}
              />
            </div>
            <button
              onClick={addWork}
              className="flex items-center justify-center gap-2 bg-[#D3CEAD] hover:bg-[#D3CEAD]/70 text-black px-4 py-2 rounded transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Work
            </button>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="text-left text-white font-medium p-4">Title</th>
                  <th className="text-left text-white font-medium p-4 w-32">Year</th>
                  <th className="text-left text-white font-medium p-4">Instruments</th>
                  <th className="text-left text-white font-medium p-4 w-32">Duration</th>
                  <th className="text-left text-white font-medium p-4 w-48">Actions</th>
                </tr>
              </thead>
              <tbody>
                {works.map((work, index) => (
                  <tr key={work.id} className={`border-t border-gray-700 ${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}`}>
                    <td className="p-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={work.title}
                          onChange={(e) => updateWork(work.id, 'title', e.target.value)}
                          className="w-full bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                      ) : (
                        <span className="text-gray-300">{work.title}</span>
                      )}
                    </td>
                    <td className="p-4 w-32">
                      {isEditing ? (
                        <input
                          type="number"
                          value={work.year}
                          onChange={(e) => updateWork(work.id, 'year', parseInt(e.target.value) || work.year)}
                          className="w-full bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none min-w-[80px]"
                        />
                      ) : (
                        <span className="text-gray-300">{work.year}</span>
                      )}
                    </td>
                    <td className="p-4">
                      {isEditing ? (
                        <input
                          type="text"
                          value={work.instruments}
                          onChange={(e) => updateWork(work.id, 'instruments', e.target.value)}
                          className="w-full bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                      ) : (
                        <span className="text-gray-300">{work.instruments}</span>
                      )}
                    </td>
                    <td className="p-4 w-32">
                      {isEditing ? (
                        <input
                          type="text"
                          value={work.duration}
                          onChange={(e) => updateWork(work.id, 'duration', e.target.value)}
                          className="w-full bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                      ) : (
                        <span className="text-gray-300">{work.duration || '-'}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => viewWork(work)}
                          className="text-green-400 hover:text-green-300 transition-colors"
                          title="View work page"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(work)}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                          title="Edit work details"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {isEditing && (
                          <>
                            <button
                              onClick={() => moveWork(index, "up")}
                              disabled={index === 0}
                              className="text-blue-400 hover:text-blue-300 disabled:text-gray-600 transition-colors"
                              title="Move up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveWork(index, "down")}
                              disabled={index === works.length - 1}
                              className="text-blue-400 hover:text-blue-300 disabled:text-gray-600 transition-colors"
                              title="Move down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeWork(work.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Delete work"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-400">
          Total works: {works.length}
        </div>

        {/* Edit Work Modal */}
        {editingWork && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-white">Edit Work</h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
                  <input
                    type="text"
                    value={editingWork.title}
                    onChange={(e) => updateEditingWork('title', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Year *</label>
                  <input
                    type="number"
                    value={editingWork.year}
                    onChange={(e) => updateEditingWork('year', parseInt(e.target.value) || editingWork.year)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Instruments *</label>
                  <input
                    type="text"
                    value={editingWork.instruments}
                    onChange={(e) => updateEditingWork('instruments', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                  <input
                    type="text"
                    value={editingWork.duration}
                    onChange={(e) => updateEditingWork('duration', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
        
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Video URL</label>
                  <input
                    type="text"
                    value={editingWork.videoUrl}
                    onChange={(e) => updateEditingWork('videoUrl', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">SoundCloud URL</label>
                  <input
                    type="text"
                    value={editingWork.soundcloudUrl}
                    onChange={(e) => updateEditingWork('soundcloudUrl', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Information</label>
                  <textarea
                    value={editingWork.information}
                    onChange={(e) => updateEditingWork('information', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Program Notes</label>
                  <textarea
                    value={editingWork.programNotes}
                    onChange={(e) => updateEditingWork('programNotes', e.target.value)}
                    className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    rows={4}
                  />
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedWork}
                  className="px-4 py-2 bg-[#D3CEAD] hover:bg-[#D3CEAD]/70 text-black rounded transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}