'use client';

import React, { useState, useRef } from 'react';

// Extend the Window interface to include emailjs
declare global {
  interface Window {
    emailjs: {
      send: (
        serviceId: string,
        templateId: string,
        templateParams: Record<string, any>,
        publicKey: string
      ) => Promise<{ text: string }>;
      init: (publicKey: string) => void;
    };
  }
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    console.log('Submit button clicked');
    console.log('Form data:', formData);
    console.log('EmailJS loaded:', !!window.emailjs);
    
    // Check if EmailJS is loaded
    if (!window.emailjs) {
      console.error('EmailJS not loaded - waiting a moment...');
      // Wait a bit and try again
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!window.emailjs) {
        console.error('EmailJS still not loaded');
        setSubmitStatus('error');
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      console.log('Sending email with EmailJS...');
      const result = await window.emailjs.send(
        'service_7csehtb',
        'template_318bmiz',
        {
          from_name: formData.from_name,
          from_email: formData.from_email,
          subject: formData.subject,
          message: formData.message,
          to_name: 'Francisco Cardoso'
        },
        '9ZlxtPYewu2W_FRi8'
      );

      console.log('EmailJS result:', result);

      if (result.text === 'OK') {
        setSubmitStatus('success');
        setFormData({ from_name: '', from_email: '', subject: '', message: '' });
      } else {
        console.error('EmailJS returned non-OK status:', result);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('EmailJS error details:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load EmailJS script
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.onload = () => {
      window.emailjs.init('9ZlxtPYewu2W_FRi8');
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const isFormValid = formData.from_name && formData.from_email && formData.subject && formData.message;

  return (
    <main className="p-12 ml-4">
      <h1 className="text-4xl font-bold mb-12">Contact</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="from_name" className="block text-sm font-medium mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="from_name"
                  name="from_name"
                  required
                  value={formData.from_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="from_email" className="block text-sm font-medium mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="from_email"
                  name="from_email"
                  required
                  value={formData.from_email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                placeholder="What's this about?"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all resize-vertical"
                placeholder="Your message..."
              />
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid}
              className="relative flex items-center justify-center space-x-2 w-full md:w-auto px-6 py-3 text-xl
              text-[#D3CEAD]/70 font-semibold transition-all duration-300 bg-white/10 hover:bg-white/20 hover:text-[#C3BE9D]
              disabled:bg-white/5 disabled:text-[#D3CEAD]/30 disabled:cursor-not-allowed overflow-hidden group"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 transition duration-300 group-hover:opacity-100 group-disabled:opacity-0"></span>
              <span className="relative z-10">{isSubmitting ? 'Submiting...' : 'Submit'}</span>
            </button>
            
            {submitStatus === 'success' && (
              <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400">
                Message sent successfully! I'll get back to you soon.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
                Failed to send message. Please try again or contact me directly.
              </div>
            )}
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="space-y-8">
          {/* Direct Email */}
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

          
        </div>
      </div>
    </main>
  );
}