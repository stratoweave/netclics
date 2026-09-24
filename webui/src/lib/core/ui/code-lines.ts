export interface CodeSegment {
  text: string;
  kind?: 'add' | 'remove' | 'equal';
}

export interface CodeLine {
  segments: CodeSegment[];
  /** Line-level tone: set when any segment on the line carries a diff kind. */
  kind?: 'add' | 'remove' | 'equal';
}

/** Split plain text into uncolored lines. A trailing newline does not add an empty line. */
export function plainLines(content: string): CodeLine[] {
  if (content === '') return [];
  const parts = content.split('\n');
  if (parts[parts.length - 1] === '') parts.pop();
  return parts.map((text) => ({ segments: [{ text }] }));
}

export function linesToText(lines: CodeLine[]): string {
  return lines.map((line) => line.segments.map((segment) => segment.text).join('')).join('\n');
}
