
import React, { useState, useCallback } from 'react';
import { generateColoringPage } from '../services/geminiService';
import { createColoringBookPdf } from '../services/pdfService';
import LoadingSpinner from './LoadingSpinner';
import { DownloadIcon, BrushIcon } from './icons';

const PAGE_COUNT = 5;

const ColoringBookGenerator: React.FC = () => {
  const [theme, setTheme] = useState<string>('Space Dinosaurs');
  const [childName, setChildName] = useState<string>('Alex');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!theme || !childName) {
      setError('Please fill in both the theme and the child\'s name.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setCoverImage(null);

    try {
      const coverPrompt = `A beautiful coloring book cover with the title "${theme} Adventures", featuring various elements of ${theme} for a child named ${childName}.`;
      
      const pagePrompts = Array.from({ length: PAGE_COUNT }, (_, i) => {
          // Add some variation to prompts
          const variations = [`a cute character from ${theme}`, `a fun scene from ${theme}`, `a simple pattern with ${theme} elements`, `a friendly creature from ${theme}`, `an exciting action from ${theme}`];
          return `${variations[i % variations.length]}`;
      });

      const allPrompts = [coverPrompt, ...pagePrompts];
      
      const imagePromises = allPrompts.map(prompt => generateColoringPage(prompt));
      const results = await Promise.all(imagePromises);

      setCoverImage(results[0]);
      setGeneratedImages(results.slice(1));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [theme, childName]);

  const handleDownload = () => {
    if (coverImage && generatedImages.length > 0) {
      createColoringBookPdf(coverImage, generatedImages, `${theme} Adventures`, childName);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
      <div className="text-center mb-6">
        <BrushIcon className="w-12 h-12 mx-auto text-pink-500" />
        <h2 className="text-3xl font-bold text-gray-800 mt-2">Coloring Book Creator</h2>
        <p className="text-gray-600 mt-1">Create a magical coloring book for someone special!</p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">Theme (e.g., "Enchanted Forest")</label>
          <input
            id="theme"
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Enchanted Forest"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-1">Child's Name</label>
          <input
            id="childName"
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Lily"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
            disabled={isLoading}
          />
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full bg-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-pink-600 transition-colors disabled:bg-pink-300 flex items-center justify-center gap-2"
      >
        {isLoading ? 'Creating Magic...' : 'Generate Coloring Book'}
      </button>

      {isLoading && <div className="mt-8"><LoadingSpinner /></div>}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}

      {(coverImage || generatedImages.length > 0) && !isLoading && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-center text-gray-700 mb-4">Your Custom Coloring Book is Ready!</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {coverImage && (
                  <div className="relative border-4 border-pink-300 p-1 rounded-lg shadow-md col-span-full md:col-span-1 md:row-span-2">
                    <img src={coverImage} alt="Coloring Book Cover" className="w-full h-full object-cover rounded" />
                    <div className="absolute top-2 left-2 bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">COVER</div>
                  </div>
              )}
              {generatedImages.map((img, index) => (
                  <div key={index} className="border-2 border-gray-200 p-1 rounded-lg shadow-sm">
                      <img src={img} alt={`Coloring Page ${index + 1}`} className="w-full h-auto object-cover rounded" />
                  </div>
              ))}
          </div>
           <button
            onClick={handleDownload}
            className="w-full mt-6 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <DownloadIcon className="w-6 h-6" />
            Download as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default ColoringBookGenerator;
   