'use client';

import { useCallback, useRef, useState } from 'react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

export default function UploadZone({ onFileSelect, isProcessing }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (!ACCEPTED.includes(file.type)) {
        alert('Unsupported format. Please use JPG, PNG, or WEBP.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('File too large. Please upload an image under 10MB.');
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      onClick={() => !isProcessing && inputRef.current?.click()}
      className={`
        relative flex flex-col items-center justify-center
        w-full max-w-2xl mx-auto h-64 rounded-2xl border-2 border-dashed
        transition-all duration-200 cursor-pointer select-none
        ${isDragging
          ? 'border-violet-500 bg-violet-50 scale-[1.02]'
          : 'border-gray-300 bg-gray-50 hover:border-violet-400 hover:bg-violet-50/50'}
        ${isProcessing ? 'opacity-60 cursor-not-allowed' : ''}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={onInputChange}
        disabled={isProcessing}
      />
      <div className="flex flex-col items-center gap-3 text-center px-4">
        <div className="w-14 h-14 rounded-full bg-violet-100 flex items-center justify-center">
          <svg className="w-7 h-7 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-700">
            Drop your image here
          </p>
          <p className="text-sm text-gray-500 mt-1">
            or <span className="text-violet-600 font-medium">click to browse</span>
          </p>
        </div>
        <p className="text-xs text-gray-400">
          Supports JPG, PNG, WEBP · Max 10MB
        </p>
      </div>
    </div>
  );
}
