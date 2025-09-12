'use client';

import { useState, useEffect } from "react";
import {
  FileText,
  X,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Download,
  RotateCw,
} from "lucide-react";

interface Work {
  id: number;
  title: string;
  year: number;
  instruments: string;
  pdfFileName?: string;
}

export default function SoloWorksReactPDF() {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState<number>(0);

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      const response = await fetch("/api/works/solo");
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setWorks(data.works || []);
    } catch (error) {
      console.error("Error fetching works:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch PDF as blob whenever selectedWork changes
  useEffect(() => {
    if (selectedWork) {
      fetch(`/api/works/solo/pdf/${selectedWork.id}`)
        .then(res => res.arrayBuffer())
        .then(buffer => {
          const blob = new Blob([buffer], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          setPdfUrl(url);
          setError("");
        })
        .catch((err) => {
          console.error("Error fetching PDF blob:", err);
          setError("Failed to fetch PDF");
        });
    } else {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      setPdfUrl(null);
    }
  }, [selectedWork]);

  const handleWorkClick = (work: Work) => {
    if (work.pdfFileName) {
      setSelectedWork(work);
      setShowPdfModal(true);
      setPageNumber(1);
      setScale(1.0);
      setRotation(0);
      setError("");
      setIframeKey(prev => prev + 1); // Force iframe reload
    }
  };

  const closePdfModal = () => {
    setShowPdfModal(false);
    setSelectedWork(null);
    setError("");
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  const goToPrevPage = () => {
    setPageNumber((page) => Math.max(1, page - 1));
  };

  const goToNextPage = () => {
    setPageNumber((page) => Math.min(numPages, page + 1));
  };

  const zoomIn = () => {
    setScale((scale) => Math.min(3.0, scale + 0.25));
  };

  const zoomOut = () => {
    setScale((scale) => Math.max(0.5, scale - 0.25));
  };

  const rotate = () => {
    setRotation((rotation) => (rotation + 90) % 360);
  };

  const resetView = () => {
    setScale(1.0);
    setRotation(0);
    setPageNumber(1);
  };

  // Handle iframe load event to extract page count if possible
  const handleIframeLoad = (e: any) => {
    try {
      const iframe = e.target;
      // Try to get the PDF document instance from the iframe
      const pdfDocument = iframe.contentWindow?.PDFViewerApplication?.pdfDocument;
      if (pdfDocument) {
        setNumPages(pdfDocument.numPages);
      } else {
        // Fallback: try to parse the PDF URL to get page count
        // This is a simple workaround since we can't directly access cross-origin iframe content
        setNumPages(0); // Reset to unknown
      }
    } catch (err) {
      console.log("Could not extract page count from iframe");
      setNumPages(0);
    }
  };

  if (isLoading) {
    return (
      <main className="works-container">
        <div className="text-center text-[#D3CEAD]">Loading ...</div>
      </main>
    );
  }

  return (
    <>
      <main className="works-container">
        <h1 className="works-title">Solo Instrumentations</h1>

        <div className="space-y-4">
          {works.map((work) => (
            <div
              key={work.id}
              className={`work-item ${work.pdfFileName ? "work-item-hover" : ""}`}
              onClick={() => handleWorkClick(work)}
            >
              <div className="flex-1">
                {work.title} ({work.year}) -{" "}
                <span className="work-instruments">{work.instruments}</span>
              </div>
              {work.pdfFileName && (
                <div title="Click to view PDF">
                  <FileText className="w-5 h-5 text-[#D3CEAD] hover:text-[#C3BE9D] transition-colors" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="works-count">
          Total Solo Works: {works.length}
        </div>
      </main>

      {/* PDF Modal with iframe */}
      {showPdfModal && selectedWork && (
        <div className="pdf-modal z-50" onClick={closePdfModal}>
          <div className="pdf-container" onClick={(e) => e.stopPropagation()}>
            {/* Header with Controls */}
            <div className="pdf-header">
              <div className="flex items-center gap-4">
                <h2 className="pdf-title">
                  {selectedWork.title} ({selectedWork.year})
                </h2>
                <div className="pdf-footer-text">
                  {selectedWork.instruments}
                </div>
              </div>

              {/* PDF Controls */}
              <div className="pdf-controls">
                {/* Page Navigation */}
                {numPages > 0 && (
                  <div className="control-group">
                    <button
                      onClick={goToPrevPage}
                      disabled={pageNumber <= 1}
                      className="control-button"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="control-text">
                      {pageNumber} / {numPages}
                    </span>
                    <button
                      onClick={goToNextPage}
                      disabled={pageNumber >= numPages}
                      className="control-button"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Zoom Controls */}
                <div className="control-group">
                  <button
                    onClick={zoomOut}
                    disabled={scale <= 0.5}
                    className="control-button"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="control-text">
                    {Math.round(scale * 100)}%
                  </span>
                  <button
                    onClick={zoomIn}
                    disabled={scale >= 3.0}
                    className="control-button"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                {/* Rotate & Reset */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={rotate}
                    className="control-button"
                    title="Rotate 90°"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={resetView}
                    className="px-3 py-2 text-sm hover:bg-[#E5E2D4] rounded"
                    title="Reset view"
                  >
                    Reset
                  </button>
                </div>

                {/* Download */}
                <a
                  href={`/api/works/solo/pdf/${selectedWork.id}`}
                  download={selectedWork.pdfFileName}
                  className="control-button"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </a>

                {/* Close */}
                <button
                  onClick={closePdfModal}
                  className="control-button ml-2"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* PDF Content Area */}
            <div className="pdf-content">
              {error ? (
                <div className="error-message">
                  <div className="error-text">Error loading PDF</div>
                  <div className="error-details">{error}</div>
                  <button
                    onClick={() =>
                      window.open(
                        `/api/works/solo/pdf/${selectedWork.id}`,
                        "_blank"
                      )
                    }
                    className="fallback-button"
                  >
                    Open in new tab
                  </button>
                </div>
              ) : pdfUrl ? (
                <div className="relative w-full h-full">
                  <div 
                    className="absolute inset-0 overflow-auto"
                    style={{
                      transform: `scale(${scale}) rotate(${rotation}deg)`,
                      transformOrigin: 'center'
                    }}
                  >
                    <iframe
                      key={iframeKey}
                      src={pdfUrl}
                      className="w-full h-full border-0"
                      onLoad={handleIframeLoad}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8">
                  <div className="loading-spinner"></div>
                  <span className="loading-text">Loading PDF...</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pdf-footer">
              <div className="pdf-footer-text">
                {selectedWork.pdfFileName}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}