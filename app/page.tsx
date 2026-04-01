'use client';

import { useCallback, useState } from 'react';
import UploadZone from '@/components/UploadZone';
import ImageComparison from '@/components/ImageComparison';

type AppState = 'idle' | 'processing' | 'done' | 'error';

const FEATURES = [
  {
    icon: '⚡',
    title: 'Instant Processing',
    desc: 'Results in under 5 seconds, powered by advanced AI models.',
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    desc: 'Images are processed in memory and never stored on our servers.',
  },
  {
    icon: '✨',
    title: 'HD Quality',
    desc: 'Crystal-clear edges and full HD PNG output with transparency.',
  },
];

const FAQS = [
  {
    q: 'Is this background remover really free?',
    a: 'Yes! You can remove image backgrounds completely free with no login or credit card required.',
  },
  {
    q: 'What image formats are supported?',
    a: 'We support JPG, PNG, and WEBP formats. The maximum file size is 10MB.',
  },
  {
    q: 'Are my images stored on your servers?',
    a: 'No. Your images are processed entirely in memory and are never saved or stored on our servers.',
  },
  {
    q: 'What format will the output be in?',
    a: 'The output is always a PNG file with a transparent background, preserving full image quality.',
  },
  {
    q: 'Does it work on mobile devices?',
    a: 'Yes! Our tool is fully responsive and works on all modern smartphones and tablets.',
  },
];

export default function HomePage() {
  const [state, setState] = useState<AppState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [originalFileName, setOriginalFileName] = useState('');
  const [resultBase64, setResultBase64] = useState('');

  const handleFileSelect = useCallback(async (file: File) => {
    setState('processing');
    setErrorMsg('');
    setOriginalUrl(URL.createObjectURL(file));
    setOriginalFileName(file.name);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/remove-bg', { method: 'POST', body: formData });
      const data = await res.json();

      if (data.success) {
        setResultBase64(data.image);
        setState('done');
      } else {
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
        setState('error');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setState('error');
    }
  }, []);

  const handleReset = useCallback(() => {
    setState('idle');
    setErrorMsg('');
    setOriginalUrl('');
    setOriginalFileName('');
    setResultBase64('');
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
              </svg>
            </div>
            <span className="font-bold text-lg text-gray-900">BgRemover.ai</span>
          </div>
          <span className="text-sm text-gray-500 hidden sm:block">Free · No Login · Instant</span>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
            AI-Powered · 100% Free
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Free AI Background Remover —{' '}
            <span className="text-violet-600">Instant</span>, No Login Required
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-12">
            Remove image backgrounds in seconds with AI. Free, fast, and no signup needed.
          </p>

          {/* Upload / Processing / Result area */}
          <div className="min-h-[280px] flex flex-col items-center justify-center">
            {state === 'idle' && (
              <UploadZone onFileSelect={handleFileSelect} isProcessing={false} />
            )}

            {state === 'processing' && (
              <div className="flex flex-col items-center gap-6 py-12">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 rounded-full border-4 border-violet-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-violet-600 border-t-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">✨</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800">Removing background...</p>
                  <p className="text-sm text-gray-500 mt-1">AI is working its magic, usually under 5 seconds</p>
                </div>
              </div>
            )}

            {state === 'error' && (
              <div className="flex flex-col items-center gap-6 py-8 max-w-md mx-auto text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">Processing Failed</p>
                  <p className="text-sm text-red-500 mt-1">{errorMsg}</p>
                </div>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-xl transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {state === 'done' && (
              <ImageComparison
                originalUrl={originalUrl}
                resultBase64={resultBase64}
                originalFileName={originalFileName}
                onReset={handleReset}
              />
            )}
          </div>

          {state === 'idle' && (
            <p className="mt-4 text-xs text-gray-400">
              🔒 We don&apos;t store your images · Privacy guaranteed
            </p>
          )}
        </section>

        {/* Features */}
        <section className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why choose BgRemover.ai?
            </h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow text-center">
                  <div className="text-4xl mb-4">{f.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border border-gray-100 rounded-2xl p-6 hover:border-violet-200 transition-colors">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <p>© 2026 BgRemover.ai · All rights reserved</p>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
