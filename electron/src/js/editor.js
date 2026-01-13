/**
 * TruAi Desktop IDE - Editor Utilities
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_EDITOR_UTILS_V1
 */

// Editor module - Monaco editor integration
// Most functionality is in monaco-loader.js, this file provides additional utilities

function getCurrentFileLanguage() {
    if (!monacoEditor) return 'plaintext';
    const model = monacoEditor.getModel();
    return model ? model.getLanguageId() : 'plaintext';
}

function formatDocument() {
    if (!monacoEditor) return;
    monacoEditor.getAction('editor.action.formatDocument').run();
}

function goToLine(lineNumber) {
    if (!monacoEditor) return;
    monacoEditor.setPosition({ lineNumber, column: 1 });
    monacoEditor.revealLineInCenter(lineNumber);
    monacoEditor.focus();
}

function findInEditor() {
    if (!monacoEditor) return;
    monacoEditor.getAction('actions.find').run();
}

function replaceInEditor() {
    if (!monacoEditor) return;
    monacoEditor.getAction('editor.action.startFindReplaceAction').run();
}

// Export functions
window.getCurrentFileLanguage = getCurrentFileLanguage;
window.formatDocument = formatDocument;
window.goToLine = goToLine;
window.findInEditor = findInEditor;
window.replaceInEditor = replaceInEditor;
