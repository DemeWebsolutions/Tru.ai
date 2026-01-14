/**
 * TruAi Inline AI Engine
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_INLINE_AI_V1
 * 
 * Selection-based AI rewriting, inline diff preview, and manual suggestions
 */

class InlineAIEngine {
  constructor() {
    this.currentDiff = null;
    this.originalContent = null;
    this.rewrittenContent = null;
    this.forensicId = null;
    this.diffWidgetVisible = false;
    this.undoStack = [];
  }

  /**
   * Initialize inline AI features
   */
  initialize() {
    this.setupKeyBindings();
    this.setupSelectionHandlers();
    this.createDiffWidget();
    console.log('[InlineAI] Initialized');
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyBindings() {
    if (!monacoEditor) return;

    // Cmd/Ctrl+K - Rewrite selected text
    monacoEditor.addAction({
      id: 'truai.rewriteSelection',
      label: 'AI Rewrite Selection',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK
      ],
      contextMenuGroupId: 'truai',
      contextMenuOrder: 1,
      run: (ed) => {
        this.handleRewriteSelection();
      }
    });

    // Cmd/Ctrl+Space - AI suggestion at cursor
    monacoEditor.addAction({
      id: 'truai.inlineSuggestion',
      label: 'AI Suggest',
      keybindings: [
        monaco.KeyMod.CtrlCmd | monaco.KeyCode.Space
      ],
      contextMenuGroupId: 'truai',
      contextMenuOrder: 2,
      run: (ed) => {
        this.handleInlineSuggestion();
      }
    });

    // Escape - Dismiss diff preview
    monacoEditor.addAction({
      id: 'truai.dismissDiff',
      label: 'Dismiss AI Suggestion',
      keybindings: [monaco.KeyCode.Escape],
      run: (ed) => {
        if (this.diffWidgetVisible) {
          this.rejectSuggestion();
        }
      }
    });

    console.log('[InlineAI] Key bindings configured');
  }

  /**
   * Setup selection change handlers
   */
  setupSelectionHandlers() {
    if (!monacoEditor) return;

    monacoEditor.onDidChangeCursorSelection((e) => {
      const selection = monacoEditor.getSelection();
      const hasSelection = !selection.isEmpty();
      
      // Show/hide floating rewrite button
      this.updateFloatingButton(hasSelection, selection);
    });
  }

  /**
   * Update floating AI rewrite button visibility
   */
  updateFloatingButton(show, selection) {
    let button = document.getElementById('floatingAIRewriteBtn');
    
    if (show && selection) {
      if (!button) {
        button = document.createElement('button');
        button.id = 'floatingAIRewriteBtn';
        button.className = 'floating-ai-btn';
        button.innerHTML = '✨ AI Rewrite (Cmd+K)';
        button.onclick = () => this.handleRewriteSelection();
        document.body.appendChild(button);
      }

      // Position button near selection
      const position = monacoEditor.getTargetAtClientPoint(
        window.innerWidth / 2,
        window.innerHeight / 2
      );
      
      button.style.display = 'block';
      button.style.left = '50%';
      button.style.top = '100px';
      button.style.transform = 'translateX(-50%)';
    } else if (button) {
      button.style.display = 'none';
    }
  }

  /**
   * Create diff preview widget
   */
  createDiffWidget() {
    const widget = document.createElement('div');
    widget.id = 'inlineDiffWidget';
    widget.className = 'inline-diff-widget';
    widget.style.display = 'none';
    widget.innerHTML = `
      <div class="diff-widget-header">
        <span class="diff-widget-title">📝 AI Suggestion</span>
        <button class="diff-widget-close" onclick="window.inlineAI.rejectSuggestion()">×</button>
      </div>
      <div class="diff-widget-content">
        <div class="diff-section">
          <div class="diff-label">ORIGINAL:</div>
          <pre class="diff-code original-code" id="diffOriginal"></pre>
        </div>
        <div class="diff-section">
          <div class="diff-label">AI REWRITTEN:</div>
          <pre class="diff-code rewritten-code" id="diffRewritten"></pre>
        </div>
      </div>
      <div class="diff-widget-actions">
        <button class="diff-btn accept-btn" onclick="window.inlineAI.acceptSuggestion()">✅ Accept</button>
        <button class="diff-btn reject-btn" onclick="window.inlineAI.rejectSuggestion()">❌ Reject</button>
        <button class="diff-btn revert-btn" onclick="window.inlineAI.revertChanges()" style="display: none;">⬅️ Revert</button>
        <div class="forensic-id" id="diffForensicId"></div>
      </div>
    `;
    
    document.body.appendChild(widget);
    console.log('[InlineAI] Diff widget created');
  }

  /**
   * Handle rewrite selection command
   */
  async handleRewriteSelection() {
    if (!monacoEditor) {
      console.error('[InlineAI] Monaco editor not initialized');
      return;
    }

    const selection = monacoEditor.getSelection();
    if (selection.isEmpty()) {
      alert('Please select text to rewrite');
      return;
    }

    const selectedText = monacoEditor.getModel().getValueInRange(selection);
    if (!selectedText.trim()) {
      alert('Selected text is empty');
      return;
    }

    // Get surrounding context
    const model = monacoEditor.getModel();
    const totalLines = model.getLineCount();
    const contextRange = {
      startLineNumber: Math.max(1, selection.startLineNumber - 10),
      endLineNumber: Math.min(totalLines, selection.endLineNumber + 10),
      startColumn: 1,
      endColumn: model.getLineMaxColumn(Math.min(totalLines, selection.endLineNumber + 10))
    };
    const surroundingCode = model.getValueInRange(contextRange);

    // Get file context
    const filePath = window.currentFilePath || 'untitled';
    const language = model.getLanguageId();

    console.log('[InlineAI] Rewriting selection:', selectedText.substring(0, 50) + '...');

    // Show loading
    this.showLoadingDiff();

    try {
      // Call IPC to get AI rewrite
      const result = await window.api.invoke('inline-ai-rewrite', {
        selectedText,
        surroundingCode,
        filePath,
        language,
        selectionRange: {
          startLine: selection.startLineNumber,
          endLine: selection.endLineNumber
        }
      });

      if (result.success) {
        this.originalContent = selectedText;
        this.rewrittenContent = result.rewritten;
        this.forensicId = result.forensicId;
        this.currentSelection = selection;

        // Show diff preview
        this.showDiffPreview(selectedText, result.rewritten, result.forensicId);
      } else {
        alert('AI rewrite failed: ' + result.error);
        this.hideDiffWidget();
      }
    } catch (error) {
      console.error('[InlineAI] Rewrite error:', error);
      alert('Failed to get AI rewrite: ' + error.message);
      this.hideDiffWidget();
    }
  }

  /**
   * Handle inline suggestion command
   */
  async handleInlineSuggestion() {
    if (!monacoEditor) return;

    const position = monacoEditor.getPosition();
    const model = monacoEditor.getModel();

    // Get context around cursor
    const lineNumber = position.lineNumber;
    const contextRange = {
      startLineNumber: Math.max(1, lineNumber - 10),
      endLineNumber: Math.min(model.getLineCount(), lineNumber + 10),
      startColumn: 1,
      endColumn: model.getLineMaxColumn(Math.min(model.getLineCount(), lineNumber + 10))
    };
    const context = model.getValueInRange(contextRange);

    console.log('[InlineAI] Getting suggestion at line', lineNumber);

    this.showLoadingDiff();

    try {
      const result = await window.api.invoke('inline-ai-suggest', {
        cursorLine: lineNumber,
        context,
        filePath: window.currentFilePath || 'untitled',
        language: model.getLanguageId()
      });

      if (result.success) {
        const currentLine = model.getLineContent(lineNumber);
        this.originalContent = currentLine;
        this.rewrittenContent = result.suggestion;
        this.forensicId = result.forensicId;
        this.currentSelection = new monaco.Selection(
          lineNumber, 1,
          lineNumber, currentLine.length + 1
        );

        this.showDiffPreview(currentLine, result.suggestion, result.forensicId);
      } else {
        alert('AI suggestion failed: ' + result.error);
        this.hideDiffWidget();
      }
    } catch (error) {
      console.error('[InlineAI] Suggestion error:', error);
      alert('Failed to get AI suggestion: ' + error.message);
      this.hideDiffWidget();
    }
  }

  /**
   * Show loading state in diff widget
   */
  showLoadingDiff() {
    const widget = document.getElementById('inlineDiffWidget');
    widget.style.display = 'block';
    document.getElementById('diffOriginal').textContent = 'Loading...';
    document.getElementById('diffRewritten').textContent = 'AI is thinking...';
    document.getElementById('diffForensicId').textContent = '';
    this.diffWidgetVisible = true;
  }

  /**
   * Show diff preview
   */
  showDiffPreview(original, rewritten, forensicId) {
    const widget = document.getElementById('inlineDiffWidget');
    widget.style.display = 'block';

    document.getElementById('diffOriginal').textContent = original;
    document.getElementById('diffRewritten').textContent = rewritten;
    document.getElementById('diffForensicId').textContent = `Forensic ID: ${forensicId}`;

    // Hide revert button initially
    document.querySelector('.revert-btn').style.display = 'none';

    this.diffWidgetVisible = true;
    console.log('[InlineAI] Diff preview shown');
  }

  /**
   * Hide diff widget
   */
  hideDiffWidget() {
    const widget = document.getElementById('inlineDiffWidget');
    widget.style.display = 'none';
    this.diffWidgetVisible = false;
  }

  /**
   * Accept AI suggestion
   */
  acceptSuggestion() {
    if (!this.rewrittenContent || !this.currentSelection) {
      console.warn('[InlineAI] No suggestion to accept');
      return;
    }

    // Save current state for undo
    this.undoStack.push({
      selection: this.currentSelection,
      content: this.originalContent,
      timestamp: Date.now()
    });

    // Apply rewritten content
    monacoEditor.executeEdits('inline-ai', [{
      range: this.currentSelection,
      text: this.rewrittenContent
    }]);

    console.log('[InlineAI] Suggestion accepted, forensic ID:', this.forensicId);

    // Show revert button
    document.querySelector('.revert-btn').style.display = 'inline-block';

    // Hide diff widget after short delay
    setTimeout(() => {
      this.hideDiffWidget();
    }, 500);

    // Focus editor
    monacoEditor.focus();
  }

  /**
   * Reject AI suggestion
   */
  rejectSuggestion() {
    console.log('[InlineAI] Suggestion rejected');
    this.hideDiffWidget();
    this.currentDiff = null;
    this.originalContent = null;
    this.rewrittenContent = null;
    monacoEditor.focus();
  }

  /**
   * Revert last accepted change
   */
  revertChanges() {
    if (this.undoStack.length === 0) {
      alert('No changes to revert');
      return;
    }

    const lastChange = this.undoStack.pop();

    // Revert to original content
    monacoEditor.executeEdits('inline-ai-revert', [{
      range: lastChange.selection,
      text: lastChange.content
    }]);

    console.log('[InlineAI] Changes reverted');
    this.hideDiffWidget();
    monacoEditor.focus();
  }
}

// Initialize inline AI engine
let inlineAI = null;

// Wait for Monaco to be ready
window.addEventListener('DOMContentLoaded', () => {
  // Initialize after Monaco is loaded
  setTimeout(() => {
    if (typeof monaco !== 'undefined' && monacoEditor) {
      inlineAI = new InlineAIEngine();
      inlineAI.initialize();
      window.inlineAI = inlineAI;
      console.log('[InlineAI] Engine ready');
    } else {
      console.log('[InlineAI] Waiting for Monaco...');
      // Retry after delay
      setTimeout(() => {
        if (monacoEditor) {
          inlineAI = new InlineAIEngine();
          inlineAI.initialize();
          window.inlineAI = inlineAI;
          console.log('[InlineAI] Engine ready (delayed)');
        }
      }, 2000);
    }
  }, 1000);
});
