interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loading = ({
  message = "Loading...",
  size = 'md',
  className = ""
}: LoadingProps) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const svgSizes = {
    sm: 24,
    md: 32,
    lg: 48
  };

  return (
    <main className="works-container">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          {/* Musical Note Spinner */}
          <div className={`${sizeClasses[size]} mx-auto mb-4 flex items-center justify-center`}>
            <svg
              width={svgSizes[size]}
              height={svgSizes[size]}
              viewBox="0 0 24 24"
              className="animate-spin text-[#D3CEAD]"
              style={{
                animation: 'spin 2s linear infinite'
              }}
            >
              {/* Main musical note */}
              <path
                d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"
                fill="currentColor"
                opacity="0.9"
              />
              {/* Decorative musical elements that rotate with the note */}
              <circle cx="6" cy="6" r="1" fill="currentColor" opacity="0.6" />
              <circle cx="18" cy="8" r="0.8" fill="currentColor" opacity="0.5" />
              <circle cx="19" cy="16" r="0.7" fill="currentColor" opacity="0.4" />
              {/* Additional small note for visual interest */}
              <path
                d="M20 4v6c-.3-.2-.6-.3-1-.3-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2V6h1V4h-2z"
                fill="currentColor"
                opacity="0.3"
              />
            </svg>
          </div>
          
          {/* Loading message with site typography */}
          <div className={`text-[#D3CEAD] font-avenir ${className}`}>
            {message}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
};