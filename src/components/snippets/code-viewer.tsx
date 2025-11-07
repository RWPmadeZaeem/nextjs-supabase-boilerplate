'use client';

import { cpp } from '@codemirror/lang-cpp';
import { css } from '@codemirror/lang-css';
import { go } from '@codemirror/lang-go';
import { html } from '@codemirror/lang-html';
import { java } from '@codemirror/lang-java';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { markdown } from '@codemirror/lang-markdown';
import { python } from '@codemirror/lang-python';
import { rust } from '@codemirror/lang-rust';
import { sql } from '@codemirror/lang-sql';
import type { Extension } from '@codemirror/state';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView } from '@codemirror/view';
import CodeMirror from '@uiw/react-codemirror';
import { useMemo } from 'react';

import { cn } from '@/lib/utils';

import { getLanguageByValue } from '@/constants/languages';

interface CodeViewerProps {
  value: string;
  language?: string;
  height?: string;
  className?: string;
  showWindowControls?: boolean;
  windowTitle?: string;
}

const languageExtensions: Record<string, Extension> = {
  javascript: javascript({ jsx: true }),
  typescript: javascript({ jsx: true, typescript: true }),
  python: python(),
  java: java(),
  cpp: cpp(),
  rust: rust(),
  go: go(),
  html: html(),
  css: css(),
  json: json(),
  sql: sql(),
  markdown: markdown(),
};

export function CodeViewer({
  value,
  language,
  height = '200px',
  className,
  showWindowControls = true,
  windowTitle,
}: CodeViewerProps) {
  const selectedLanguage = language ? getLanguageByValue(language) : null;
  const languageExtension = useMemo(() => {
    if (selectedLanguage?.codemirrorMode) {
      return languageExtensions[selectedLanguage.codemirrorMode] || null;
    }
    return null;
  }, [selectedLanguage]);

  const extensions = useMemo(() => {
    const exts = [];
    if (languageExtension) {
      exts.push(languageExtension);
    }
    // Make editor read-only
    exts.push(EditorView.editable.of(false));
    exts.push(EditorView.lineWrapping);
    return exts;
  }, [languageExtension]);

  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden border border-slate-700/50 bg-slate-950/90 shadow-xl shadow-black/30',
        className,
      )}
    >
      {showWindowControls && (
        <div className='flex items-center gap-3 px-3.5 py-2.5 bg-gradient-to-b from-slate-800/60 to-slate-900/60 border-b border-slate-700/50'>
          {/* macOS window controls */}
          <div className='flex items-center gap-1.5 flex-shrink-0'>
            <div className='w-3 h-3 rounded-full bg-red-500/90 shadow-sm hover:bg-red-500 transition-colors' />
            <div className='w-3 h-3 rounded-full bg-yellow-500/90 shadow-sm hover:bg-yellow-500 transition-colors' />
            <div className='w-3 h-3 rounded-full bg-green-500/90 shadow-sm hover:bg-green-500 transition-colors' />
          </div>
          {/* Window title */}
          {windowTitle ? (
            <div className='flex-1 min-w-0'>
              <div className='text-center'>
                <span className='text-[11px] font-medium text-slate-300/80 truncate block'>
                  {windowTitle}
                </span>
              </div>
            </div>
          ) : (
            <div className='flex-1' />
          )}
        </div>
      )}
      <div className='relative [&_.cm-scroller]:overflow-auto [&_.cm-scroller]:hide-scrollbar'>
        <CodeMirror
          value={value}
          height={height}
          theme={oneDark}
          extensions={extensions}
          editable={false}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLine: false,
            bracketMatching: true,
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: false,
            tabSize: 2,
          }}
          className='text-xs'
          style={{
            fontSize: '13px',
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
          }}
        />
      </div>
    </div>
  );
}

