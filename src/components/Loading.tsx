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
  
    return (
      <main className="works-container">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className={`${sizeClasses[size]} border-2 border-[#D3CEAD] border-t-transparent animate-spin mx-auto mb-4`}></div>
            <div className="text-[#D3CEAD]">{message}</div>
          </div>
        </div>
      </main>
    );
  };
  
  // import { Loading } from '@/components/Loading';
  
  // if (isLoading) {
  //   return <Loading message="Loading catalog..." />;
  // }