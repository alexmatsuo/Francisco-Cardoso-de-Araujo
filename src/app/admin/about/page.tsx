'use client';

import { useState, useEffect } from "react";
import { Edit, Save, X, FileText, User, Clock } from "lucide-react";

interface AboutData {
  id: number;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminAbout() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch about data from your DB on mount
  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const res = await fetch("/api/about");
      if (!res.ok) throw new Error('Failed to fetch');
      
      const data = await res.json();
      if (data.success && data.about) {
        setAboutData(data.about);
      }
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = () => {
    setIsEditing(true);
    setDraft(aboutData?.text || '');
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setDraft('');
  };

  const saveEdit = async () => {
    if (!draft.trim()) {
      alert('Biography text cannot be empty');
      return;
    }
    
    setIsSaving(true);
    try {
      const method = aboutData ? 'PUT' : 'POST';
      
      const response = await fetch('/api/about', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: draft.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save about data');
      }

      await fetchAboutData();
      setIsEditing(false);
      setDraft('');
    } catch (error) {
      console.error('Error saving about data:', error);
      alert('Error saving biography. Please try again.');
    } finally {
      setIsSaving(false);
    }
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
        <div className="text-center">Loading about data...</div>
      </main>
    );
  }

  return (
    <main className="p-6 text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage About Section</h1>
        {!isEditing && (
          <button
            onClick={startEdit}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
          >
            <Edit className="w-4 h-4" />
            {aboutData ? 'Edit Biography' : 'Create Biography'}
          </button>
        )}
      </div>

      {/* About Content */}
      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <div className="bg-gray-800 p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-200">Biography Content</h2>
            {aboutData && (
              <span className="px-2 py-1 rounded text-xs bg-green-900 text-green-200">
                Published
              </span>
            )}
          </div>
        </div>

        <div className="bg-gray-900">
          {!aboutData && !isEditing ? (
            // No content exists yet
            <div className="p-8 text-center">
              <FileText className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <div className="text-gray-400 mb-2 text-lg">No biography content found</div>
              <div className="text-sm text-gray-500 mb-4">Create your biography to get started</div>
              <button
                onClick={startEdit}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors mx-auto"
              >
                <Edit className="w-4 h-4" />
                Create Biography
              </button>
            </div>
          ) : isEditing ? (
            // Editing mode
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Biography Text</label>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-3 rounded border border-gray-600 focus:border-blue-500 focus:outline-none resize-vertical"
                  rows={12}
                  placeholder="Enter your biography here..."
                />
                <div className="text-xs text-gray-400 mt-1">
                  Characters: {draft.length}
                </div>
              </div>

              {/* Save / Cancel buttons */}
              <div className="flex gap-3">
                <button
                  onClick={saveEdit}
                  disabled={isSaving || !draft.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed rounded transition-colors"
                >
                  <Save className="w-4 h-4" /> 
                  {isSaving ? 'Saving...' : (aboutData ? 'Update Biography' : 'Create Biography')}
                </button>
                <button
                  onClick={cancelEdit}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded transition-colors"
                >
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            // View mode
            <div className="p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm text-gray-400">Current Biography</label>
                  <button
                    onClick={startEdit}
                    className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                  >
                    <Edit className="w-3 h-3" /> Edit
                  </button>
                </div>
                <div className="bg-gray-800 border border-gray-600 rounded p-4 text-gray-300 leading-relaxed whitespace-pre-wrap border-l-4 border-l-blue-500">
                  {aboutData?.text}
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Created: {formatDateTime(aboutData?.createdAt || '')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: {formatDateTime(aboutData?.updatedAt || '')}</span>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Characters: {aboutData?.text?.length || 0}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
        <h3 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          How it works
        </h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Changes made here will immediately appear on your public about page</li>
          <li>• The biography text supports line breaks and formatting</li>
          <li>• Use the preview to see how your text will look</li>
          <li>• All changes are automatically saved and published when you click save</li>
        </ul>
      </div>
    </main>
  );
}