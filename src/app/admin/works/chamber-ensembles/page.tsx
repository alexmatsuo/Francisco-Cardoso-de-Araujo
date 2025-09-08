'use client'

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, Edit, ArrowUp, ArrowDown } from "lucide-react";

interface Work {
  id: number;
  title: string;
  year: number;
  instruments: string;
}

export default function AdminChamberEnsemblesWorks() {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newWork, setNewWork] = useState({ title: '', year: new Date().getFullYear(), instruments: '' });

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const response = await fetch('/api/works/chamber-ensembles');
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
      const response = await fetch('/api/works/chamber-ensembles', {
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
      instruments: newWork.instruments.trim()
    };

    setWorks([...works, work]);
    setNewWork({ title: '', year: new Date().getFullYear(), instruments: '' });
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
          <h1 className="text-4xl font-bold text-white">Admin - Chamber Ensembles Works</h1>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Title"
                value={newWork.title}
                onChange={(e) => setNewWork({ ...newWork, title: e.target.value })}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Year"
                value={newWork.year}
                onChange={(e) => setNewWork({ ...newWork, year: parseInt(e.target.value) || new Date().getFullYear() })}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none min-w-[100px]"
              />
              <input
                type="text"
                placeholder="Instruments"
                value={newWork.instruments}
                onChange={(e) => setNewWork({ ...newWork, instruments: e.target.value })}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={addWork}
                className="flex items-center justify-center gap-2 bg-[#D3CEAD] hover:bg-[#D3CEAD]/70 text-black px-4 py-2 rounded transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
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
                  {isEditing && <th className="text-left text-white font-medium p-4 w-32">Actions</th>}
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
                    {isEditing && (
                      <td className="p-4 flex items-center gap-2">
                        <button
                          onClick={() => moveWork(index, "up")}
                          disabled={index === 0}
                          className="text-blue-400 hover:text-blue-300 disabled:text-gray-600 transition-colors"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveWork(index, "down")}
                          disabled={index === works.length - 1}
                          className="text-blue-400 hover:text-blue-300 disabled:text-gray-600 transition-colors"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeWork(work.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-400">
          Total works: {works.length}
        </div>
      </main>
    </>
  );
}
