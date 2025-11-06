'use client';

import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { rust } from '@codemirror/lang-rust';
import { go } from '@codemirror/lang-go';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { sql } from '@codemirror/lang-sql';
import { markdown } from '@codemirror/lang-markdown';

import { getLanguageByValue } from '@/constants/languages';
import { cn } from '@/lib/utils';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  placeholder?: string;
  className?: string;
}

const languageExtensions: Record<string, any> = {
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

export function CodeEditor({
  value,
  onChange,
  language,
  placeholder = 'Paste your code here...',
  className,
}: CodeEditorProps) {
  const selectedLanguage = language ? getLanguageByValue(language) : null;
  const languageExtension =
    selectedLanguage?.codemirrorMode
      ? languageExtensions[selectedLanguage.codemirrorMode] || null
      : null;

  return (
    <div
      className={cn(
        'rounded-md border border-slate-700 overflow-hidden bg-slate-800/50',
        className,
      )}
    >
      <CodeMirror
        value={value}
        height='400px'
        theme={oneDark}
        extensions={languageExtension ? [languageExtension] : []}
        onChange={onChange}
        placeholder={placeholder}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          indentOnInput: true,
          tabSize: 2,
        }}
        className='text-sm'
        style={{
          fontSize: '14px',
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
        }}
      />
    </div>
  );
}

