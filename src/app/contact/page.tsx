'use client';

import { FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { SiSoundcloud } from 'react-icons/si';

export default function ContactPage() {
  return (
    <main className="p-12 ml-16">
      <h1 className="text-4xl font-bold mb-12">Contact</h1>
      
      <div className="space-y-8">
        {/* Email */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Email</h2>
          <a 
            href="mailto:franciscocardoso.composer@gmail.com" 
            className="text-lg text-gray-300 hover:text-white transition-colors underline"
          >
            franciscocardoso.composer@gmail.com
          </a>
        </div>

        {/* Location */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Location</h2>
          <p className="text-lg text-gray-300">
          Nashville, Tennessee, USA [Based] <br />
          Atlanta, Georgia, USA <br />
          Curitiba, Parana, Brazil
          </p>
        </div>

        {/* Affiliations */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Affiliations</h2>
          <div className="space-y-1">
            <p className="text-lg text-gray-300">Círculo de Invenção Musical (Founding Member)</p>
            <p className="text-lg text-gray-300">Atlanta Contemporary Music Collective (Member)</p>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Social Media</h2>
          <div className="flex space-x-4">
            <a 
              href="https://www.instagram.com/fco.crd/" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-105 group"
              aria-label="Instagram"
            >
              <FaInstagram className="w-6 h-6 group-hover:text-white transition-colors" />
            </a>
            <a 
              href="https://www.linkedin.com/in/francisco-cardoso-de-araujo-a96b7010a/" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-105 group"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-6 h-6 group-hover:text-white transition-colors" />
            </a>
            <a 
              href="https://soundcloud.com/franciscocardosodearaujo" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-105 group"
              aria-label="SoundCloud"
            >
              <SiSoundcloud className="w-6 h-6 group-hover:text-white transition-colors" />
            </a>
            <a 
              href="https://www.youtube.com/@franciscocardoso-composer" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-105 group"
              aria-label="YouTube"
            >
              <FaYoutube className="w-6 h-6 group-hover:text-white transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}