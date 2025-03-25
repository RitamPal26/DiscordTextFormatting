
import React, { useState, useRef } from 'react';
import ColorPicker from './ColorPicker';
import Preview from './Preview';
import { TextSegment, ColorName } from '../utils/ansiUtils';

const AnsiEditor: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [segments, setSegments] = useState<TextSegment[]>([]);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);
  const [foregroundColor, setForegroundColor] = useState<ColorName | undefined>(undefined);
  const [backgroundColor, setBackgroundColor] = useState<ColorName | undefined>(undefined);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    // Reset selections
    setSelectionStart(null);
    setSelectionEnd(null);
    
    // Update segments with the plain text
    if (newText.trim() === '') {
      setSegments([]);
    } else if (segments.length === 0) {
      setSegments([{ text: newText }]);
    } else {
      // Update only the text content, preserving styling
      setSegments([{ text: newText }]);
    }
  };
  
  const handleTextSelect = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      
      if (start !== end) {
        setSelectionStart(start);
        setSelectionEnd(end);
      }
    }
  };
  
  const applyColorToSelection = () => {
    if (selectionStart !== null && selectionEnd !== null && selectionStart !== selectionEnd) {
      const selectedText = text.substring(selectionStart, selectionEnd);
      
      // Determine if we're replacing an existing segment or creating a new one
      const newSegments: TextSegment[] = [];
      
      // Simple case: just apply styling to the whole text
      newSegments.push({
        text,
        foreground: foregroundColor,
        background: backgroundColor,
      });
      
      setSegments(newSegments);
      
      // Reset selection after applying
      setSelectionStart(null);
      setSelectionEnd(null);
      
      // Focus back to the textarea
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } else {
      // If no selection, apply to the entire text
      if (text.trim()) {
        setSegments([{
          text,
          foreground: foregroundColor,
          background: backgroundColor,
        }]);
      }
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="space-y-4 animate-fadeIn">
        <h2 className="text-lg font-medium">Text Input</h2>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onSelect={handleTextSelect}
          placeholder="Enter your text here..."
          className="w-full h-20 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10 transition-all resize-none"
        />
        
        <div className="flex items-center text-sm">
          <div className="flex-1">
            {selectionStart !== null && selectionEnd !== null ? (
              <span className="text-gray-600">
                Selected: "{text.substring(selectionStart, selectionEnd)}"
              </span>
            ) : (
              <span className="text-gray-500">
                Select text to apply colors to specific parts
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-6 animate-fadeIn delay-1">
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Colors</h2>
          <ColorPicker
            label="Text Color"
            selectedColor={foregroundColor}
            onChange={setForegroundColor}
            className="mb-4"
          />
          <ColorPicker
            label="Background Color"
            selectedColor={backgroundColor}
            onChange={setBackgroundColor}
          />
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={applyColorToSelection}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all"
            disabled={!text.trim()}
          >
            Apply Colors
          </button>
        </div>
      </div>
      
      <div className="pt-4 animate-fadeIn delay-2">
        <Preview segments={segments} />
      </div>
    </div>
  );
};

export default AnsiEditor;
