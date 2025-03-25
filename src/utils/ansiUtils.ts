
// ANSI color codes for Discord
export const ansiForegroundColors = {
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
  // Bright colors
  gray: 90,
  brightRed: 91,
  brightGreen: 92,
  brightYellow: 93,
  brightBlue: 94,
  brightMagenta: 95,
  brightCyan: 96,
  brightWhite: 97,
};

export const ansiBackgroundColors = {
  black: 40,
  red: 41,
  green: 42,
  yellow: 43,
  blue: 44,
  magenta: 45,
  cyan: 46,
  white: 47,
  // Bright colors
  gray: 100,
  brightRed: 101,
  brightGreen: 102,
  brightYellow: 103,
  brightBlue: 104,
  brightMagenta: 105,
  brightCyan: 106,
  brightWhite: 107,
};

// Special formatting codes
export const ansiFormatting = {
  bold: 1,
  underline: 4,
  reset: 0,
};

export type ColorName = keyof typeof ansiForegroundColors;
export type FormattingName = keyof typeof ansiFormatting;

// Interface for a segment of text with styling
export interface TextSegment {
  text: string;
  foreground?: ColorName;
  background?: ColorName;
  bold?: boolean;
  underline?: boolean;
}

// Generate ANSI escape code for a specific styling
export const generateAnsiCode = (
  foreground?: ColorName, 
  background?: ColorName,
  bold?: boolean,
  underline?: boolean
): string => {
  const codes: number[] = [];
  
  if (bold) {
    codes.push(ansiFormatting.bold);
  }
  
  if (underline) {
    codes.push(ansiFormatting.underline);
  }
  
  if (foreground && ansiForegroundColors[foreground]) {
    codes.push(ansiForegroundColors[foreground]);
  }
  
  if (background && ansiBackgroundColors[background]) {
    codes.push(ansiBackgroundColors[background]);
  }
  
  if (codes.length === 0) {
    return '\u001b[0m'; // Reset
  }
  
  return '\u001b[' + codes.join(';') + 'm';
};

// Convert an array of styled text segments into a single ANSI-formatted string
export const segmentsToAnsi = (segments: TextSegment[]): string => {
  let result = '';
  
  for (const segment of segments) {
    const ansiCode = generateAnsiCode(
      segment.foreground, 
      segment.background,
      segment.bold,
      segment.underline
    );
    result += ansiCode + segment.text;
  }
  
  // Add reset code at the end
  result += '\u001b[0m';
  
  return result;
};

// Convert a hex color to the closest ANSI color name
export const hexToAnsiColor = (hex: string): ColorName => {
  // Simple mapping from hex to ANSI color
  const hexToAnsi: Record<string, ColorName> = {
    '#000000': 'black',
    '#ff0000': 'red',
    '#00ff00': 'green',
    '#ffff00': 'yellow',
    '#0000ff': 'blue',
    '#ff00ff': 'magenta',
    '#00ffff': 'cyan',
    '#ffffff': 'white',
    '#808080': 'gray',
    '#ff8080': 'brightRed',
    '#80ff80': 'brightGreen',
    '#ffff80': 'brightYellow',
    '#8080ff': 'brightBlue',
    '#ff80ff': 'brightMagenta',
    '#80ffff': 'brightCyan',
    // Removed duplicate '#ffffff': 'brightWhite' entry
  };
  
  // Normalize hex color
  const normalizedHex = hex.toLowerCase();
  
  // Find exact match
  if (hexToAnsi[normalizedHex]) {
    return hexToAnsi[normalizedHex];
  }
  
  // TODO: Add more sophisticated color matching algorithm
  // For now, default to white
  return 'white';
};

// Map ANSI color names to their equivalent CSS colors for preview
export const ansiColorToCss: Record<ColorName, string> = {
  black: '#000000',
  red: '#E74C3C',
  green: '#2ECC71',
  yellow: '#F1C40F',
  blue: '#3498DB',
  magenta: '#9B59B6',
  cyan: '#1ABC9C',
  white: '#FFFFFF',
  gray: '#808080',
  brightRed: '#FF5252',
  brightGreen: '#5CFF5C',
  brightYellow: '#FFFF5C',
  brightBlue: '#5C5CFF',
  brightMagenta: '#FF5CFF',
  brightCyan: '#5CFFFF',
  brightWhite: '#FFFFFF',
};

// Generate a HTML span element with appropriate styling for ANSI preview
export const generateStyledSpan = (segment: TextSegment): string => {
  const style = [];
  
  if (segment.foreground) {
    style.push(`color: ${ansiColorToCss[segment.foreground]}`);
  }
  
  if (segment.background) {
    style.push(`background-color: ${ansiColorToCss[segment.background]}`);
  }
  
  if (segment.bold) {
    style.push('font-weight: bold');
  }
  
  if (segment.underline) {
    style.push('text-decoration: underline');
  }
  
  return `<span style="${style.join('; ')}">${segment.text}</span>`;
};

// Convert text segments to HTML for preview
export const segmentsToHtml = (segments: TextSegment[]): string => {
  return segments.map(generateStyledSpan).join('') || '<span>&nbsp;</span>';
};

// Improved nodesToAnsi function for DOM traversal
export const nodesToAnsi = (node: HTMLElement): string => {
  let result = '';
  
  const processNode = (currentNode: Node): string => {
    let nodeText = '';
    
    // Check if this is a text node
    if (currentNode.nodeType === Node.TEXT_NODE && currentNode.textContent) {
      return currentNode.textContent;
    }
    
    // Process element node
    if (currentNode.nodeType === Node.ELEMENT_NODE) {
      const element = currentNode as HTMLElement;
      
      // Extract styling from classes or inline styles
      let foreground: ColorName | undefined;
      let background: ColorName | undefined;
      let bold = false;
      let underline = false;
      
      // Check for ANSI classes
      for (const className of Array.from(element.classList)) {
        if (className.startsWith('ansi-')) {
          const code = parseInt(className.substring(5));
          
          // Check for formatting
          if (code === 1) {
            bold = true;
          } else if (code === 4) {
            underline = true;
          } 
          // Check for foreground colors (30-37, 90-97)
          else if ((code >= 30 && code <= 37) || (code >= 90 && code <= 97)) {
            // Find the color name by code
            foreground = getColorNameByCode(code, false);
          }
          // Check for background colors (40-47, 100-107)
          else if ((code >= 40 && code <= 47) || (code >= 100 && code <= 107)) {
            // Find the color name by code
            background = getColorNameByCode(code, true);
          }
        }
      }
      
      // Get inner text with all child nodes
      let innerText = '';
      for (const childNode of Array.from(currentNode.childNodes)) {
        innerText += processNode(childNode);
      }
      
      // Apply ANSI codes if we have styling
      if (foreground || background || bold || underline) {
        const ansiCode = generateAnsiCode(foreground, background, bold, underline);
        nodeText = ansiCode + innerText + '\u001b[0m';
      } else {
        nodeText = innerText;
      }
    }
    
    return nodeText;
  };
  
  result = processNode(node);
  return result;
};

// Helper function to get color name by ANSI code
export const getColorNameByCode = (code: number, isBackground: boolean): ColorName | undefined => {
  const colorMap = isBackground ? ansiBackgroundColors : ansiForegroundColors;
  
  for (const [name, value] of Object.entries(colorMap)) {
    if (value === code) {
      return name as ColorName;
    }
  }
  
  return undefined;
};

// Helper function to get ANSI class name for a color
export const getAnsiClassForColor = (color: ColorName, isBackground: boolean): string => {
  const code = isBackground ? ansiBackgroundColors[color] : ansiForegroundColors[color];
  return `ansi-${code}`;
};
