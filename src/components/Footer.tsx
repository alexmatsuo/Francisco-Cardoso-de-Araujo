import { FaInstagram, FaLinkedin, FaYoutube, FaPaperPlane } from 'react-icons/fa';
import { SiSoundcloud } from 'react-icons/si';

export const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Main Content */}
        <div className="text-center space-y-8">
          {/* Name/Brand */}
          <div className="space-y-2">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto"></div>
          </div>
          
          {/* Social Media */}
          <div className="flex justify-center items-center space-x-6">
            <a
              href="https://www.instagram.com/fco.crd/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-4 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/10"
              aria-label="Instagram"
            >
              <FaInstagram className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 via-red-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </a>
            
            <a
              href="https://www.linkedin.com/in/francisco-cardoso-de-araujo-a96b7010a/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-4 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/10"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
              <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </a>
            
            <a
              href="https://soundcloud.com/franciscocardosodearaujo"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-4 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/10"
              aria-label="SoundCloud"
            >
              <SiSoundcloud className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </a>
            
            <a
              href="https://www.youtube.com/@franciscocardoso-composer"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative p-4 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white/10"
              aria-label="YouTube"
            >
              <FaYoutube className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
              <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </a>
          </div>
        </div>
        
        {/* Divider */}
        <div className="my-8">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>
        
        {/* Copyright */}
        <div className="text-center">
          <p className="text-gray-400 text-sm font-light">
            © {year} Francisco Cardoso de Araujo. All rights reserved. Made by Alex Matsuo gmalexmatsuo@gmail.com
          </p>
        </div>
      </div>
    </footer>
  );
};