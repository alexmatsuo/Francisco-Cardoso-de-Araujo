'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ContactForm() {
  const searchParams = useSearchParams();
  const success = searchParams.get('success');
  const error = searchParams.get('error');

  return (
    <>
      {success && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300">
          Thank you! Your message has been sent successfully.
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300">
          Sorry, there was an error sending your message. Please try again.
        </div>
      )}
      
      <form action="/api/submit" method="POST" className="space-y-4 max-w-lg">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
          <input 
            type="text" 
            id="name" 
            name="name"
            className="w-full px-3 py-2 bg-white/10 border border-white/15 rounded-lg focus:outline-none focus:border-white/30 transition-colors"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email"
            className="w-full px-3 py-2 bg-white/10 border border-white/15 rounded-lg focus:outline-none focus:border-white/30 transition-colors"
            required
          />
        </div>
        <div>
          <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
          <input 
            type="text" 
            id="subject" 
            name="subject"
            className="w-full px-3 py-2 bg-white/10 border border-white/15 rounded-lg focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
          <textarea 
            id="message" 
            name="message"
            rows={5}
            className="w-full px-3 py-2 bg-white/10 border border-white/15 rounded-lg focus:outline-none focus:border-white/30 transition-colors resize-vertical"
            required
          ></textarea>
        </div>
        <button 
          type="submit"
          className="px-6 py-2 bg-white/20 hover:bg-white/30 border border-white/15 rounded-lg transition-colors"
        >
          Send Message
        </button>
      </form>
    </>
  );
}

export default function ContactPage() {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Contact</h1>
      
      <div className="space-y-8">
        {/* Email */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Email</h2>
          <a 
            href="mailto:francisco@example.com" 
            className="text-lg text-gray-300 hover:text-white transition-colors underline"
          >
            francisco@example.com
          </a>
        </div>

        {/* Location */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Location</h2>
          <p className="text-lg text-gray-300">
            Curitiba, Paraná, Brazil
          </p>
        </div>

        {/* Professional Affiliations */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Professional Affiliations</h2>
          <div className="space-y-1">
            <p className="text-lg text-gray-300">Círculo de Invenção Musical (Founding Member)</p>
            <p className="text-lg text-gray-300">Atlanta Contemporary Music Collective (Member)</p>
          </div>
        </div>

        {/* Social/Academic Links */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Links</h2>
          <div className="space-y-2">
            <div>
              <a 
                href="#" 
                className="links"
              >
                Academia.edu Profile
              </a>
            </div>
            <div>
              <a 
                href="#" 
                className="links"
              >
                ORCID Profile
              </a>
            </div>
            <div>
              <a 
                href="#" 
                className="links"
              >
                ResearchGate Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}