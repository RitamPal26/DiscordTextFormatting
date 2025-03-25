
import React, { useRef, useState, useEffect } from 'react';
import { ColorName, ansiColorToCss, nodesToAnsi } from '../utils/ansiUtils';
import { Bold, Underline, Copy, Paintbrush } from 'lucide-react';
import { toast } from 'sonner';

interface ContentEditableEditorProps {
  className?: string;
}

const ContentEditableEditor: React.FC<ContentEditableEditorProps> = ({
  className
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeColor, setActiveColor] = useState<ColorName | null>(null);
  const [isBackground, setIsBackground] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [ansiCode, setAnsiCode] = useState<string>('');
  const [discordFormat, setDiscordFormat] = useState<string>('');

  useEffect(() => {
    updateAnsiPreview();
  }, []);

  const updateAnsiPreview = () => {
    if (editorRef.current) {
      const generatedAnsi = nodesToAnsi(editorRef.current);
      setAnsiCode(generatedAnsi);
      setDiscordFormat(`\`\`\`ansi\n${generatedAnsi}\n\`\`\``);
    }
  };

  const handleFormat = (e: React.MouseEvent<Element, MouseEvent>, formatType: string, value?: ColorName) => {
    e.preventDefault();
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (range.collapsed) return;
    
    const span = document.createElement('span');
    
    if (formatType === 'foreground' && value) {
      const colorCode = ansiColorToCss[value];
      const ansiCode = getAnsiClassForColor(value, false);
      span.classList.add(ansiCode);
      span.style.color = colorCode;
    } else if (formatType === 'background' && value) {
      const colorCode = ansiColorToCss[value];
      const ansiCode = getAnsiClassForColor(value, true);
      span.classList.add(ansiCode);
      span.style.backgroundColor = colorCode;
    } else if (formatType === 'bold') {
      span.classList.add('ansi-1');
      span.style.fontWeight = 'bold';
    } else if (formatType === 'underline') {
      span.classList.add('ansi-4');
      span.style.textDecoration = 'underline';
    }
    
    const selectionContents = range.extractContents();
    span.appendChild(selectionContents);
    range.insertNode(span);
    selection.removeAllRanges();
    
    // Update the ANSI preview after formatting
    updateAnsiPreview();
  };

  // Helper function to get the appropriate ANSI class name
  const getAnsiClassForColor = (color: ColorName, isBackground: boolean): string => {
    const ansiColors = {
      black: isBackground ? 'ansi-40' : 'ansi-30',
      red: isBackground ? 'ansi-41' : 'ansi-31',
      green: isBackground ? 'ansi-42' : 'ansi-32',
      yellow: isBackground ? 'ansi-43' : 'ansi-33',
      blue: isBackground ? 'ansi-44' : 'ansi-34',
      magenta: isBackground ? 'ansi-45' : 'ansi-35',
      cyan: isBackground ? 'ansi-46' : 'ansi-36',
      white: isBackground ? 'ansi-47' : 'ansi-37',
      gray: isBackground ? 'ansi-100' : 'ansi-90',
      brightRed: isBackground ? 'ansi-101' : 'ansi-91',
      brightGreen: isBackground ? 'ansi-102' : 'ansi-92',
      brightYellow: isBackground ? 'ansi-103' : 'ansi-93',
      brightBlue: isBackground ? 'ansi-104' : 'ansi-94',
      brightMagenta: isBackground ? 'ansi-105' : 'ansi-95',
      brightCyan: isBackground ? 'ansi-106' : 'ansi-96',
      brightWhite: isBackground ? 'ansi-107' : 'ansi-97',
    };
    
    return ansiColors[color];
  };

  const handleCopy = () => {
    if (!editorRef.current) return;
    
    navigator.clipboard.writeText(discordFormat).then(() => {
      toast.success('ANSI code copied to clipboard', {
        description: 'Now you can paste it in Discord'
      });
    }, err => {
      console.error('Could not copy text: ', err);
      toast.error('Failed to copy ANSI code');
    });
  };

  const toggleBackground = () => {
    setIsBackground(!isBackground);
  };

  const toggleBold = () => {
    setIsBold(!isBold);
    if (!isBold) {
      const syntheticEvent = {
        preventDefault: () => {}
      } as React.MouseEvent<Element, MouseEvent>;
      handleFormat(syntheticEvent, 'bold');
    }
  };

  const toggleUnderline = () => {
    setIsUnderline(!isUnderline);
    if (!isUnderline) {
      const syntheticEvent = {
        preventDefault: () => {}
      } as React.MouseEvent<Element, MouseEvent>;
      handleFormat(syntheticEvent, 'underline');
    }
  };

  const applyColor = (color: ColorName) => {
    setActiveColor(color);
    const formatType = isBackground ? 'background' : 'foreground';
    const syntheticEvent = {
      preventDefault: () => {}
    } as React.MouseEvent<Element, MouseEvent>;
    handleFormat(syntheticEvent, formatType, color);
  };

  const handleEditorInput = () => {
    updateAnsiPreview();
  };

  return <div className={`ansi-editor ${className || ''}`}>
      <div className="toolbar">
        <button onClick={toggleBold} className={`format-button ${isBold ? 'active' : ''}`} title="Bold">
          <Bold size={16} />
        </button>
        <button onClick={toggleUnderline} className={`format-button ${isUnderline ? 'active' : ''}`} title="Underline">
          <Underline size={16} />
        </button>
        <button onClick={toggleBackground} className={`format-button ${isBackground ? 'active' : ''}`} title={isBackground ? "Background Color" : "Text Color"}>
          <Paintbrush size={16} />
          {isBackground ? 'BG' : 'FG'}
        </button>
        
        <div className="color-buttons">
          {Object.entries(ansiColorToCss).map(([colorName, colorValue]) => <button key={colorName} onClick={() => applyColor(colorName as ColorName)} className={`color-button ${activeColor === colorName ? 'active' : ''}`} style={{
          backgroundColor: colorValue
        }} title={colorName} />)}
        </div>
        
        <button onClick={handleCopy} className="copy-button" title="Copy ANSI Code">
          <Copy size={16} />
          Copy
        </button>
      </div>
      
      <div ref={editorRef} className="editable-content" contentEditable={true} suppressContentEditableWarning={true} spellCheck={false} data-placeholder="Enter your text here..." onInput={handleEditorInput} />
      
      <div className="ansi-preview">
        <div className="preview-section">
          <h3>Live Preview</h3>
          <div className="preview-content" dangerouslySetInnerHTML={{ __html: editorRef.current?.innerHTML || '' }} />
        </div>
        
        <div className="ansi-code-section">
          <h3>ANSI Code</h3>
          <pre className="ansi-code-display">
            <code>{ansiCode ? ansiCode.replace(/\u001b/g, '\\u001b') : 'No content yet'}</code>
          </pre>
          <div className="discord-format">
            <p className="text-sm text-gray-500">Discord format:</p>
            <pre className="discord-code-display">
              <code>{discordFormat ? discordFormat.replace(/\u001b/g, '\\u001b') : '```ansi\n# Enter text above\n```'}</code>
            </pre>
          </div>
        </div>
      </div>
      
      <style>
        {`
        .ansi-editor {
          display: flex;
          flex-direction: column;
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .toolbar {
          display: flex;
          align-items: center;
          padding: 8px;
          border-bottom: 1px solid #eee;
          background-color: #f9f9f9;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .format-button, .copy-button {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 6px 12px;
          border-radius: 4px;
          border: 1px solid #ddd;
          background-color: white;
          cursor: pointer;
        }
        
        .format-button.active {
          background-color: #e5e5e5;
        }
        
        .color-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        
        .color-button {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          border: 1px solid #ddd;
          cursor: pointer;
        }
        
        .color-button.active {
          border: 2px solid #000;
        }
        
        .editable-content {
          min-height: 100px;
          padding: 16px;
          border-bottom: 1px solid #eee;
          outline: none;
        }
        
        .editable-content:empty:before {
          content: attr(data-placeholder);
          color: #aaa;
        }
        
        .ansi-preview {
          padding: 16px;
          background-color: #f3f3f3;
        }
        
        .ansi-preview h3 {
          margin-top: 0;
          margin-bottom: 12px;
          font-size: 16px;
          font-weight: 500;
        }
        
        .preview-content {
          min-height: 80px;
          padding: 12px;
          background-color: white;
          border-radius: 4px;
          border: 1px solid #ddd;
          margin-bottom: 16px;
        }
        
        .ansi-code-section {
          margin-top: 16px;
        }
        
        .ansi-code-display {
          background-color: #1A1F2C;
          color: #D6BCFA;
          padding: 12px;
          border-radius: 4px;
          overflow-x: auto;
          font-family: monospace;
          font-size: 14px;
          margin-bottom: 16px;
        }
        
        .discord-code-display {
          background-color: #2F3136;
          color: #FFFFFF;
          padding: 12px;
          border-radius: 4px;
          overflow-x: auto;
          font-family: monospace;
          font-size: 14px;
        }
        `}
      </style>
    </div>;
};

export default ContentEditableEditor;
