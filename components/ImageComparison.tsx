'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type BgMode = 'transparent' | 'white' | 'black';

interface ImageComparisonProps {
  originalUrl: string;
  resultBase64: string;
  originalFileName: string;
  onReset: () => void;
}

export default function ImageComparison({
  originalUrl,
  resultBase64,
  originalFileName,
  onReset,
}: ImageComparisonProps) {
  const [sliderPos, setSliderPos] = useState(50);
  const [bgMode, setBgMode] = useState<BgMode>('transparent');
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const resultUrl = `data:image/png;base64,${resultBase64}`;

  const bgClass: Record<BgMode, string> = {
    transparent: 'bg-checkered',
    white: 'bg-white',
    black: 'bg-gray-900',
  };

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };

  const updateSlider = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(Math.max(pos, 0), 100));
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging.current) updateSlider(e.clientX);
  }, [updateSlider]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    updateSlider(e.touches[0].clientX);
  }, [updateSlider]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resultUrl;
    const baseName = originalFileName.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}_removed_bg.png`;
    link.click();
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
      {/* Comparison Slider */}
      <div
        ref={containerRef}
        className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-xl cursor-col-resize select-none"
        onMouseDown={handleMouseDown}
        onTouchStart={() => { isDragging.current = true; }}
        onTouchEnd={() => { isDragging.current = false; }}
        onTouchMove={(e) => updateSlider(e.touches[0].clientX)}
      >
        {/* Result image (right side / full) */}
        <div className={`absolute inset-0 ${bgClass[bgMode]}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resultUrl} alt="Background removed" className="w-full h-full object-contain" />
        </div>

        {/* Original image (left side clipped) */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalUrl}
            alt="Original"
            className="absolute inset-0 w-full h-full object-contain"
            style={{ width: `${10000 / sliderPos}%`, maxWidth: 'none' }}
          />
        </div>

        {/* Slider handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l-3 3 3 3M16 9l3 3-3 3" />
            </svg>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">Original</div>
        <div className="absolute top-3 right-3 bg-violet-600/80 text-white text-xs px-2 py-1 rounded-full">Removed BG</div>
      </div>

      {/* Background mode switcher */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-sm text-gray-500">Preview background:</span>
        {(['transparent', 'white', 'black'] as BgMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setBgMode(mode)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${bgMode === mode
                ? 'bg-violet-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
            `}
          >
            {mode === 'transparent' ? '⬜ Transparent' : mode === 'white' ? '🤍 White' : '🖤 Black'}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-violet-200 transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PNG
        </button>
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 shadow hover:shadow-md transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Process Another Image
        </button>
      </div>
    </div>
  );
}
