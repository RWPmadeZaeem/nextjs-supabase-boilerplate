import { SiJavascript, SiPython, SiCplusplus, SiRust, SiGo, SiTypescript, SiHtml5, SiCss3, SiJson, SiMysql, SiMarkdown, SiPhp, SiRuby, SiSwift } from 'react-icons/si';
import { FaJava } from 'react-icons/fa';

export interface Language {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  codemirrorMode: string | null;
}

// Popular programming languages similar to LeetCode
export const PROGRAMMING_LANGUAGES: Language[] = [
  {
    value: 'javascript',
    label: 'JavaScript',
    icon: SiJavascript,
    codemirrorMode: 'javascript',
  },
  {
    value: 'typescript',
    label: 'TypeScript',
    icon: SiTypescript,
    codemirrorMode: 'javascript', // TypeScript uses JavaScript mode
  },
  {
    value: 'python',
    label: 'Python',
    icon: SiPython,
    codemirrorMode: 'python',
  },
  {
    value: 'java',
    label: 'Java',
    icon: FaJava,
    codemirrorMode: 'java',
  },
  {
    value: 'cpp',
    label: 'C++',
    icon: SiCplusplus,
    codemirrorMode: 'cpp',
  },
  {
    value: 'rust',
    label: 'Rust',
    icon: SiRust,
    codemirrorMode: 'rust',
  },
  {
    value: 'go',
    label: 'Go',
    icon: SiGo,
    codemirrorMode: 'go',
  },
  {
    value: 'php',
    label: 'PHP',
    icon: SiPhp,
    codemirrorMode: null, // PHP not available in CodeMirror
  },
  {
    value: 'ruby',
    label: 'Ruby',
    icon: SiRuby,
    codemirrorMode: null, // Ruby not available in CodeMirror
  },
  {
    value: 'swift',
    label: 'Swift',
    icon: SiSwift,
    codemirrorMode: null, // Swift not available in CodeMirror
  },
  {
    value: 'html',
    label: 'HTML',
    icon: SiHtml5,
    codemirrorMode: 'html',
  },
  {
    value: 'css',
    label: 'CSS',
    icon: SiCss3,
    codemirrorMode: 'css',
  },
  {
    value: 'json',
    label: 'JSON',
    icon: SiJson,
    codemirrorMode: 'json',
  },
  {
    value: 'sql',
    label: 'SQL',
    icon: SiMysql,
    codemirrorMode: 'sql',
  },
  {
    value: 'markdown',
    label: 'Markdown',
    icon: SiMarkdown,
    codemirrorMode: 'markdown',
  },
];

export const getLanguageByValue = (value: string): Language | undefined => {
  return PROGRAMMING_LANGUAGES.find((lang) => lang.value === value);
};

export const getDefaultLanguage = (): Language => {
  return PROGRAMMING_LANGUAGES[0]; // JavaScript
};

