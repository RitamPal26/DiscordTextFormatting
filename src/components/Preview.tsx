
import React, { useRef } from 'react';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';
import { TextSegment, segmentsToHtml, segmentsToAnsi } from '../utils/ansiUtils';

interface PreviewProps {
  segments: TextSegment[];
}

const Preview: React.FC<PreviewProps> = ({ segments }) => {
  const ansiCodeRef = useRef<HTMLDivElement>(null);
  
  const handleCopy = () => {
    const ansiString = segmentsToAnsi(segments);
    navigator.clipboard.writeText(ansiString).then(
      () => {
        toast.success('ANSI code copied to clipboard', {
          description: 'Now you can paste it in Discord',
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast.error('Failed to copy ANSI code');
      }
    );
  };

  const htmlPreview = segmentsToHtml(segments);

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">Preview</h2>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-md transition-all hover:bg-gray-800 text-sm"
          aria-label="Copy ANSI code"
        >
          <Copy size={14} />
          <span>Copy</span>
        </button>
      </div>
      
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <div 
          className="ansi-preview min-h-12"
          dangerouslySetInnerHTML={{ __html: htmlPreview }}
        />
      </div>
      
      <div className="bg-gray-50 border rounded-lg p-4 font-mono text-xs text-gray-700 overflow-x-auto">
        <div className="text-xs text-gray-500 mb-2">ANSI Code:</div>
        <div ref={ansiCodeRef} className="whitespace-pre-wrap break-all">
          {segments.length > 0 ? segmentsToAnsi(segments).replace(/\u001b/g, '\\u001b') : 'No content yet'}
        </div>
      </div>
    </div>
  );
};

export default Preview;
