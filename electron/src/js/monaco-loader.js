/**
 * Monaco Editor Loader
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_MONACO_LOADER_V1
 */

let monacoEditor = null;
let currentModel = null;

/**
 * Initialize Monaco Editor
 */
async function initializeMonaco() {
  try {
    // Monaco Editor is loaded via CDN in index.html
    if (typeof monaco === 'undefined') {
      console.error('Monaco Editor not loaded');
      return false;
    }

    // Configure Monaco
    monaco.editor.defineTheme('truai-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#0f1115',
        'editor.foreground': '#e4e6eb',
        'editor.lineHighlightBackground': '#1a1d23',
        'editorCursor.foreground': '#3b82f6',
        'editor.selectionBackground': '#264f78',
        'editor.inactiveSelectionBackground': '#3a3d41'
      }
    });

    // Create editor instance
    const editorContainer = document.getElementById('monacoEditor');
    if (!editorContainer) {
      console.error('Monaco editor container not found');
      return false;
    }

    monacoEditor = monaco.editor.create(editorContainer, {
      value: '// Welcome to Tru.ai IDE\n// Open a file to start editing\n',
      language: 'javascript',
      theme: 'truai-dark',
      automaticLayout: true,
      fontSize: 14,
      lineNumbers: 'on',
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      wordWrap: 'off',
      tabSize: 4
    });

    // Store current model
    currentModel = monacoEditor.getModel();

    // Add event listeners
    monacoEditor.onDidChangeModelContent(() => {
      updateEditorStatus();
    });

    monacoEditor.onDidChangeCursorPosition((e) => {
      updateCursorPosition(e.position);
    });

    console.log('Monaco Editor initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Monaco Editor:', error);
    return false;
  }
}

/**
 * Load file content into Monaco Editor
 */
function loadFileIntoMonaco(filename, content, language) {
  if (!monacoEditor) {
    console.error('Monaco Editor not initialized');
    return;
  }

  try {
    // Dispose old model if exists
    if (currentModel && currentModel !== monacoEditor.getModel()) {
      currentModel.dispose();
    }

    // Detect language from filename if not provided
    if (!language) {
      language = detectLanguageFromFilename(filename);
    }

    // Create new model
    const uri = monaco.Uri.file(filename);
    currentModel = monaco.editor.createModel(content, language, uri);

    // Set model
    monacoEditor.setModel(currentModel);

    // Update status
    updateEditorStatus();

    console.log(`Loaded file: ${filename} (${language})`);
  } catch (error) {
    console.error('Failed to load file into Monaco:', error);
  }
}

/**
 * Get current editor content
 */
function getMonacoContent() {
  if (!monacoEditor) return '';
  return monacoEditor.getValue();
}

/**
 * Detect language from filename
 */
function detectLanguageFromFilename(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  
  const languageMap = {
    'js': 'javascript',
    'ts': 'typescript',
    'jsx': 'javascript',
    'tsx': 'typescript',
    'json': 'json',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'py': 'python',
    'rb': 'ruby',
    'go': 'go',
    'rs': 'rust',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'sh': 'shell',
    'md': 'markdown',
    'xml': 'xml',
    'yaml': 'yaml',
    'yml': 'yaml',
    'sql': 'sql',
    'php': 'php',
    'swift': 'swift'
  };

  return languageMap[ext] || 'plaintext';
}

/**
 * Update editor status in status bar
 */
function updateEditorStatus() {
  if (!monacoEditor) return;

  const model = monacoEditor.getModel();
  if (!model) return;

  const lineCount = model.getLineCount();
  const language = model.getLanguageId();

  // Update language in status bar
  const langElement = document.getElementById('editorLanguage');
  if (langElement) {
    langElement.textContent = language.toUpperCase();
  }
}

/**
 * Update cursor position in status bar
 */
function updateCursorPosition(position) {
  const posElement = document.getElementById('cursorPosition');
  if (posElement) {
    posElement.textContent = `Ln ${position.lineNumber}, Col ${position.column}`;
  }
}

/**
 * Format document
 */
async function formatDocument() {
  if (!monacoEditor) return;

  try {
    await monacoEditor.getAction('editor.action.formatDocument').run();
    console.log('Document formatted');
  } catch (error) {
    console.error('Failed to format document:', error);
  }
}

/**
 * Find in editor
 */
function findInEditor() {
  if (!monacoEditor) return;
  monacoEditor.getAction('actions.find').run();
}

/**
 * Replace in editor
 */
function replaceInEditor() {
  if (!monacoEditor) return;
  monacoEditor.getAction('editor.action.startFindReplaceAction').run();
}

/**
 * Go to line
 */
function goToLine() {
  if (!monacoEditor) return;
  monacoEditor.getAction('editor.action.gotoLine').run();
}

// Export functions
window.monacoAPI = {
  initialize: initializeMonaco,
  loadFile: loadFileIntoMonaco,
  getContent: getMonacoContent,
  format: formatDocument,
  find: findInEditor,
  replace: replaceInEditor,
  goToLine: goToLine
};
