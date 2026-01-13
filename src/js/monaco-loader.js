// Monaco Editor Loader
// Load Monaco Editor from CDN for syntax highlighting

let monacoEditor = null;
let monacoLoaded = false;

function initializeMonaco() {
    if (monacoLoaded) return;

    // Load Monaco Editor
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js';
    script.onload = () => {
        require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
        require(['vs/editor/editor.main'], () => {
            monacoLoaded = true;
            createEditor();
        });
    };
    document.head.appendChild(script);
}

function createEditor() {
    const container = document.getElementById('monaco-editor-container');
    if (!container || monacoEditor) return;

    monacoEditor = monaco.editor.create(container, {
        value: '// Welcome to TruAI Desktop IDE\n// Start coding...\n',
        language: 'plaintext',
        theme: 'vs-dark',
        fontSize: 14,
        tabSize: 4,
        wordWrap: 'on',
        minimap: { enabled: true },
        automaticLayout: true,
        scrollBeyondLastLine: false,
        lineNumbers: 'on',
        renderLineHighlight: 'all',
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: true
    });

    // Update status bar on cursor change
    monacoEditor.onDidChangeCursorPosition((e) => {
        updateStatusBar(e.position.lineNumber, e.position.column);
    });

    // Update status bar on model change
    monacoEditor.onDidChangeModel((e) => {
        if (e.newModelUrl) {
            const language = monacoEditor.getModel()?.getLanguageId() || 'plaintext';
            document.getElementById('status-language').textContent = language.toUpperCase();
        }
    });

    // Handle content changes
    monacoEditor.onDidChangeModelContent(() => {
        if (appState.activeFile) {
            markTabAsModified(appState.activeFile);
        }
    });

    window.monacoEditor = monacoEditor;
}

function updateStatusBar(line, col) {
    document.getElementById('status-position').textContent = `Ln ${line}, Col ${col}`;
}

function markTabAsModified(filePath) {
    const tab = document.querySelector(`[data-file="${filePath}"]`);
    if (tab && !tab.classList.contains('modified')) {
        tab.classList.add('modified');
    }
}

function openFileInEditor(filePath, content, language) {
    if (!monacoEditor) {
        setTimeout(() => openFileInEditor(filePath, content, language), 100);
        return;
    }

    // Create or switch to model
    const uri = monaco.Uri.file(filePath);
    let model = monaco.editor.getModel(uri);
    
    if (!model) {
        model = monaco.editor.createModel(content, language, uri);
    } else {
        model.setValue(content);
    }

    monacoEditor.setModel(model);
    
    // Update active file
    appState.activeFile = filePath;
    document.getElementById('status-file').textContent = path.basename(filePath);
    
    // Update language
    document.getElementById('status-language').textContent = (language || 'plaintext').toUpperCase();
}

function getEditorContent() {
    if (!monacoEditor) return '';
    return monacoEditor.getValue();
}

function setEditorLanguage(language) {
    if (!monacoEditor) return;
    const model = monacoEditor.getModel();
    if (model) {
        monaco.editor.setModelLanguage(model, language);
    }
}

// Export functions
window.initializeMonaco = initializeMonaco;
window.openFileInEditor = openFileInEditor;
window.getEditorContent = getEditorContent;
window.setEditorLanguage = setEditorLanguage;
window.updateStatusBar = updateStatusBar;
window.markTabAsModified = markTabAsModified;
