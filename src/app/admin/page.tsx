'use client';

import Link from 'next/link';
import { Music, Users, FileText, Calendar, ArrowRight, User } from 'lucide-react';

export default function AdminDashboard() {
  const worksSections = [
    { title: 'Solo', href: '/admin/works/solo', description: 'Manage solo compositions' },
    { title: 'Duos & Trios', href: '/admin/works/duos-trios', description: 'Manage duos & trios works' },
    { title: 'Chamber Ensembles', href: '/admin/works/chamber-ensembles', description: 'Manage chamber ensemble' },
    { title: 'Large Ensembles', href: '/admin/works/large-ensembles', description: 'Manage orchestral and large works' },
    { title: 'Multimedia & Installations', href: '/admin/works/multimedia-installations', description: 'Manage multimedia projects' },
  ];

  const projectsSections = [
    { title: 'Kaphca Trio', href: '/admin/projects/kaphca-trio', description: 'Manage Kaphca Trio content' },
    { title: 'Círculo de Invenção Musical', href: '/admin/projects/circulo-invencao-musical', description: 'Manage CIM project content' },
    { title: 'Poetry and Visual Arts', href: '/admin/projects/poetry-visual-arts', description: 'Manage poetry and visual arts content' },
  ];

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">Admin Dashboard</h1>
        <p className="text-gray-300">Manage your website content from here</p>
      </div>

      {/* About Section */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <User className="w-6 h-6 text-[#D3CEAD] mr-3" />
          <h2 className="text-2xl font-bold text-white">About Section</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/about"
            className="group bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-200 border border-gray-700 hover:border-[#D3CEAD]/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white group-hover:text-[#D3CEAD] transition-colors">
                Manage About
              </h3>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#D3CEAD] group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-gray-400 text-sm">Update biography and personal information</p>
          </Link>
        </div>
      </section>

      {/* Works Section */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <Music className="w-6 h-6 text-blue-500 mr-3" />
          <h2 className="text-2xl font-bold text-white">Works Management</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {worksSections.map((section) => (
            <Link
              key={section.href}
              href={section.href}
              className="group bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-200 border border-gray-700 hover:border-blue-500/50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-500 transition-colors">
                  {section.title}
                </h3>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-gray-400 text-sm">{section.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Events Section */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <Calendar className="w-6 h-6 text-purple-500 mr-3" />
          <h2 className="text-2xl font-bold text-white">Events Management</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/events"
            className="group bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-200 border border-gray-700 hover:border-purple-500/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white group-hover:text-purple-500 transition-colors">
                Manage Events
              </h3>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-gray-400 text-sm">Manage all events, performances, and calendar entries</p>
          </Link>
        </div>
      </section>


    </main>
  );
}