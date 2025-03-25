
import React from 'react';
import { ansiColorToCss, ColorName } from '../utils/ansiUtils';

interface ColorPickerProps {
  label: string;
  selectedColor?: ColorName;
  onChange: (color?: ColorName) => void;
  className?: string;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  label,
  selectedColor,
  onChange,
  className = '',
}) => {
  // Convert the object keys to an array for mapping
  const colorOptions = Object.keys(ansiColorToCss) as ColorName[];

  return (
    <div className={`${className} transition-all`}>
      <div className="mb-2 text-sm font-medium text-gray-700">{label}</div>
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        <button
          className={`h-8 rounded-md flex items-center justify-center border ${
            !selectedColor ? 'border-black bg-white' : 'border-gray-200'
          }`}
          onClick={() => onChange(undefined)}
          aria-label="No color"
        >
          <span className="text-xs">None</span>
        </button>
        
        {colorOptions.map((color) => (
          <button
            key={color}
            className={`h-8 rounded-md transition-transform hover:scale-105 ${
              selectedColor === color ? 'ring-2 ring-black ring-offset-1' : ''
            }`}
            style={{ backgroundColor: ansiColorToCss[color] }}
            onClick={() => onChange(color)}
            aria-label={`Color ${color}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
