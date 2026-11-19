import React, { useRef, useState, useEffect } from 'react';
import { 
  UploadCloud, 
  FileText, 
  X, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Eye
} from 'lucide-react';

export default function FileUploadArea({ files, onFilesChange, error, setError }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  const maxSizeBytes = 25 * 1024 * 1024; // 25 MB max per file

  // Format file size nicely (e.g. 1.25 MB or 450 KB)
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Generate preview URLs for images
  const [previews, setPreviews] = useState([]);

  useEffect(() => {
    const newPreviews = files.map((file) => {
      if (file.type.startsWith('image/')) {
        return {
          id: `${file.name}-${file.size}-${file.lastModified}`,
          url: URL.createObjectURL(file),
          isPdf: false
        };
      }
      return {
        id: `${file.name}-${file.size}-${file.lastModified}`,
        url: null,
        isPdf: true
      };
    });

    setPreviews(newPreviews);

    return () => {
      // Clean up object URLs
      newPreviews.forEach((p) => {
        if (p.url) URL.revokeObjectURL(p.url);
      });
    };
  }, [files]);

  // Handle validating and appending incoming files
  const processIncomingFiles = (incomingFileList) => {
    setError(null);
    const validFiles = [];
    const invalidTypes = [];
    const oversizedFiles = [];

    Array.from(incomingFileList).forEach((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const isAllowedType = supportedTypes.includes(file.type) || ['jpg', 'jpeg', 'png', 'pdf'].includes(extension);

      if (!isAllowedType) {
        invalidTypes.push(file.name);
        return;
      }

      if (file.size > maxSizeBytes) {
        oversizedFiles.push(file.name);
        return;
      }

      // Check duplicates
      const isDuplicate = files.some(
        (f) => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified
      );

      if (!isDuplicate) {
        validFiles.push(file);
      }
    });

    if (invalidTypes.length > 0) {
      setError(`Unsupported file format: ${invalidTypes.join(', ')}. Please upload only JPG, JPEG, PNG, or PDF files.`);
      return;
    }

    if (oversizedFiles.length > 0) {
      setError(`Files exceed 25MB limit: ${oversizedFiles.join(', ')}.`);
      return;
    }

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles]);
    }
  };

  // Drag and drop events
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processIncomingFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processIncomingFiles(e.target.files);
    }
    // Reset file input so re-uploading the same file works
    e.target.value = '';
  };

  const handleRemoveFile = (indexToRemove) => {
    const updated = files.filter((_, idx) => idx !== indexToRemove);
    onFilesChange(updated);
  };

  const handleClearAll = () => {
    onFilesChange([]);
  };

  const openBrowseDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/80 p-5 sm:p-7 mb-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-slate-800">2. Upload Handwritten Drafts</h2>
          <span className="text-xs bg-school-gold/15 text-school-navy border border-school-gold/30 px-2 py-0.5 rounded-full font-medium">
            English & Hindi Supported
          </span>
        </div>

        {files.length > 0 && (
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
            {files.length} {files.length === 1 ? 'Page Selected' : 'Pages Selected'}
          </span>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
        className="hidden"
      />

      {/* Large Drag-and-Drop Dropzone (Inspired by NoteOCR) */}
      <div
        onClick={openBrowseDialog}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openBrowseDialog();
          }
        }}
        className={`group relative w-full min-h-[280px] sm:min-h-[310px] rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer flex flex-col items-center justify-center p-6 text-center select-none ${
          isDragging
            ? 'border-school-gold bg-amber-50/60 scale-[1.005] shadow-inner'
            : 'border-slate-300 hover:border-school-navy/60 hover:bg-slate-50/70 bg-slate-50/40'
        }`}
      >
        {/* Large Cloud Icon */}
        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-105 ${
            isDragging
              ? 'bg-school-gold/20 text-school-navy'
              : 'bg-school-lightBlue text-school-accent group-hover:bg-school-navy group-hover:text-white'
          }`}
        >
          <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        {/* Heading */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1.5 font-sans">
          Upload Your Handwritten Question Paper
        </h3>

        {/* Supporting text */}
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mb-5 leading-relaxed">
          Drag and drop your files here or browse your computer. Supports multiple handwritten pages in English & Hindi.
        </p>

        {/* Large Browse Files Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openBrowseDialog();
          }}
          className="inline-flex items-center px-6 py-3 rounded-xl bg-school-navy hover:bg-school-accent text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 mb-4 group/btn"
        >
          <Plus className="w-4 h-4 mr-2 text-school-gold group-hover/btn:rotate-90 transition-transform" />
          Browse Files
        </button>

        {/* Supported Formats Notice */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span className="font-medium text-slate-600">Supported formats:</span>
          <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-mono text-[11px] text-slate-600">
            JPG
          </span>
          <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-mono text-[11px] text-slate-600">
            JPEG
          </span>
          <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-mono text-[11px] text-slate-600">
            PNG
          </span>
          <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-mono text-[11px] text-slate-600">
            PDF
          </span>
          <span className="text-slate-400">(Up to 25 MB/file)</span>
        </div>
      </div>

      {/* Validation Error Alert */}
      {error && (
        <div className="mt-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-800">Upload Issue</p>
            <p className="mt-0.5">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Selected File List & Thumbnails */}
      {files.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <h4 className="text-sm font-semibold text-slate-800">
                Selected Draft Pages ({files.length})
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openBrowseDialog}
                className="inline-flex items-center gap-1 text-xs font-semibold text-school-navy hover:text-school-accent bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add More Files
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-md transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            </div>
          </div>

          {/* Grid of File Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {files.map((file, index) => {
              const preview = previews[index];
              const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

              return (
                <div
                  key={`${file.name}-${index}`}
                  className="group relative bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-3 flex items-center gap-3 shadow-xs hover:shadow-sm transition-all"
                >
                  {/* Sequence Badge */}
                  <span className="absolute -top-2 -left-2 bg-school-navy text-school-gold text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs border border-school-gold/40">
                    Page {index + 1}
                  </span>

                  {/* Thumbnail / Document Preview */}
                  <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {preview && preview.url ? (
                      <img
                        src={preview.url}
                        alt={`Page ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-red-500">
                        <FileText className="w-6 h-6" />
                        <span className="text-[9px] font-bold uppercase mt-0.5">PDF</span>
                      </div>
                    )}
                  </div>

                  {/* File Metadata */}
                  <div className="flex-1 min-w-0 pr-1">
                    <p className="text-xs font-semibold text-slate-800 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-slate-500 font-medium">
                        {formatSize(file.size)}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-white text-slate-600 rounded border border-slate-200 uppercase font-mono">
                        {isPdf ? 'PDF' : file.type.split('/')[1]?.toUpperCase() || 'IMG'}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove this page"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
