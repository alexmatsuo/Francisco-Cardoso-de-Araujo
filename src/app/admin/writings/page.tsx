'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  FileText, 
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Save,
  Loader2,
  BookOpen
} from 'lucide-react';

interface Writing {
  id: number;
  title: string;
  author: string;
  style: string;
  description: string;
  pdfUrl?: string;
  order: number;
}

export default function AdminWritingsPage() {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingWriting, setEditingWriting] = useState<Writing | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    style: '',
    description: '',
    pdfUrl: ''
  });

  useEffect(() => {
    fetchWritings();
  }, []);

  const fetchWritings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/writings');
      if (!response.ok) throw new Error('Failed to fetch writings');
      
      const data = await response.json();
      setWritings(data.writings || []);
    } catch (error) {
      console.error('Error fetching writings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.author.trim()) {
      alert('Title and author are required');
      return;
    }

    setIsSaving(true);
    try {
      const url = editingWriting 
        ? `/api/writings/${editingWriting.id}`
        : '/api/writings';
      
      const method = editingWriting ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          order: editingWriting?.order || writings.length
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save writing');
      }

      await fetchWritings();
      handleCancel();
      alert(editingWriting ? 'Writing updated successfully!' : 'Writing created successfully!');
    } catch (error) {
      console.error('Error saving writing:', error);
      alert(`Failed to save writing: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (writing: Writing) => {
    setEditingWriting(writing);
    setFormData({
      title: writing.title,
      author: writing.author,
      style: writing.style || '',
      description: writing.description || '',
      pdfUrl: writing.pdfUrl || ''
    });
    setIsAddingNew(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this writing?')) return;

    try {
      const response = await fetch(`/api/writings/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete writing');
      }

      await fetchWritings();
      alert('Writing deleted successfully!');
    } catch (error) {
      console.error('Error deleting writing:', error);
      alert('Failed to delete writing');
    }
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingWriting(null);
    setFormData({
      title: '',
      author: '',
      style: '',
      description: '',
      pdfUrl: ''
    });
  };

  const moveWriting = async (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === writings.length - 1)) {
      return;
    }

    const newWritings = [...writings];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    
    [newWritings[index], newWritings[targetIndex]] = [newWritings[targetIndex], newWritings[index]];
    
    const updatedWritings = newWritings.map((writing, idx) => ({
      ...writing,
      order: idx
    }));
    
    setWritings(updatedWritings);

    try {
      // Use the main POST route with bulk update format (same as events)
      await fetch('/api/writings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          writings: updatedWritings
        }),
      });
    } catch (error) {
      console.error('Error reordering writings:', error);
      fetchWritings();
    }
  };

  if (isLoading) {
    return (
      <main className="p-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-green-500" />
            Writings Management
          </h1>
          <p className="text-gray-400">Manage articles, essays, and written publications</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors text-white"
        >
          <Plus className="w-5 h-5" />
          Add New Writing
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAddingNew && (
        <div className="bg-white/5 rounded-lg p-6 mb-8 border border-green-500/30">
          <h2 className="text-xl font-semibold mb-4 text-white">
            {editingWriting ? 'Edit Writing' : 'Add New Writing'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                placeholder="Enter writing title"
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                placeholder="Enter author name"
              />
            </div>

            {/* Style */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Style/Genre
              </label>
              <input
                type="text"
                value={formData.style}
                onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                placeholder="e.g., Essay, Academic Article, Review, etc."
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                placeholder="Enter a brief description or abstract of the writing"
              />
            </div>

            {/* PDF Link Section */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-300">PDF Link</label>
              <div className="flex items-center gap-3">
                <input
                  type="url"
                  value={formData.pdfUrl}
                  onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                  placeholder="https://example.com/document.pdf"
                />
                {formData.pdfUrl && (
                  <a
                    href={formData.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300 whitespace-nowrap"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Preview
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 rounded transition-colors text-white"
            >
              {isSaving ? 'Saving...' : editingWriting ? 'Update Writing' : 'Create Writing'}
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

      {/* Writings List */}
      <div className="bg-white/5 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Title & Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Style
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  PDF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {writings.map((writing, index) => (
                <tr key={writing.id} className="hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-white">{writing.title}</div>
                      <div className="text-sm text-gray-400 mt-1">by {writing.author}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded bg-green-600/20 text-green-400">
                      {writing.style || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300 line-clamp-2 max-w-md">
                      {writing.description || 'No description'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {writing.pdfUrl ? (
                      <a 
                        href={writing.pdfUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                      >
                        <FileText className="w-4 h-4" />
                        View
                      </a>
                    ) : (
                      <span className="text-gray-500 text-sm">No PDF</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveWriting(index, "up")}
                        disabled={index === 0}
                        className="text-blue-400 hover:text-blue-300 disabled:text-gray-600 transition-colors p-1"
                        title="Move up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveWriting(index, "down")}
                        disabled={index === writings.length - 1}
                        className="text-blue-400 hover:text-blue-300 disabled:text-gray-600 transition-colors p-1"
                        title="Move down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(writing)}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors p-1"
                        title="Edit writing"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(writing.id)}
                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                        title="Delete writing"
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

      {writings.length === 0 && !isAddingNew && (
        <div className="text-center text-gray-400 py-8">
          No writings yet. Click "Add New Writing" to create one.
        </div>
      )}

      <div className="mt-6 text-sm text-gray-400">
        Total writings: {writings.length}
      </div>
    </main>
  );
}