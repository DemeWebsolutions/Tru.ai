# Tru.ai Features Guide

Complete guide to using all features of the Tru.ai iOS IDE Framework.

© 2013 - Present My Deme, LLC. All Rights Reserved.

## File Explorer

### Navigation
- Tap folders to expand/collapse
- Tap files to open in editor
- Use search to find files quickly

### File Operations
- Create new file: Tap `+` icon
- Create folder: Tap folder icon
- Delete: Swipe left on item
- Rename: Long press on item

### Tips
- Files open in new tabs automatically
- Multiple files can be open simultaneously
- Hidden files (starting with `.`) are not shown

## Code Editor

### Multi-Tab Editing
- Open multiple files simultaneously
- Switch between tabs by tapping
- Close tabs with `X` button
- Modified files show a blue dot

### Features
- Line numbers on left side
- Syntax highlighting (basic)
- Monospace font for code
- Auto-save when enabled

### Keyboard Shortcuts
- Save: Cmd+S (via command palette)
- Close: Cmd+W (via command palette)
- Find: Cmd+F (via command palette)

### Editing Tips
- Pinch to zoom text size
- Long press for copy/paste menu
- Drag to select text

## Terminal

### Basic Commands
- `help` - Show available commands
- `ls` - List files
- `pwd` - Show current directory
- `clear` - Clear terminal output

### Usage
- Type commands in input field
- Press Enter/Return to execute
- Terminal output shows in green
- Scroll to view history

### Tips
- Terminal simulates basic shell
- For full shell access, use external terminal
- Commands are case-insensitive

## Git Integration

### Status View
- Shows current branch
- Lists modified files
- Shows staged files
- Displays uncommitted changes

### Operations

**Commit**
1. Stage files (automatically staged)
2. Enter commit message
3. Tap "Commit" button

**Push/Pull**
- Tap "Push" to upload changes
- Tap "Pull" to download changes
- Requires Git credentials

**Branch Management**
- View current branch in status bar
- Create branches via command palette
- Switch branches via Git panel

### Tips
- Commit messages are required
- Push requires network connection
- Pull may cause merge conflicts

## Search (Find in Files)

### Basic Search
1. Open Search panel from Activity Bar
2. Enter search text
3. Tap "Search" button
4. Results grouped by file

### Options
- **Case Sensitive**: Match exact case
- **Whole Word**: Match complete words
- **Regex**: Use regular expressions

### Results
- Click result to open file
- Line number shown for each match
- Context shown around match
- Count shown per file

### Tips
- Use regex for complex patterns
- Exclude paths in query settings
- Search is project-wide

## AI Panel (TruAi Core)

### Starting a Chat
1. Open AI panel from Activity Bar
2. Type your question
3. Tap send button
4. Wait for response

### TruAi Core Features

**Automatic Tier Selection**
- Simple queries → Cheap model (GPT-3.5)
- Code review → Mid model (GPT-4)
- Complex tasks → Copilot

**Context Awareness**
- Current file context included
- Project structure considered
- Open files available

**Cost Optimization**
- Efficient model routing
- Token minimization
- Smart caching

### Chat Tips
- Be specific in questions
- Include context when needed
- Review responses carefully
- Save important conversations

### Use Cases
- Code explanation
- Bug finding
- Code generation
- Refactoring suggestions
- Documentation help

## Command Palette

### Opening
- Via Activity Bar settings
- Keyboard: Cmd+Shift+P (when implemented)
- From menu

### Usage
1. Open command palette
2. Type to search commands
3. Tap command to execute
4. Palette closes automatically

### Command Categories
- **File**: New, Open, Save operations
- **Edit**: Undo, Redo, Find, Replace
- **View**: Toggle panels, Zoom
- **Git**: Commit, Push, Pull
- **AI**: Start chat, Explain code

### Tips
- Commands show keyboard shortcuts
- Search by category or name
- Recently used appear first

## Settings

### API Keys
- **ChatGPT**: For cheap/mid tier AI
- **Claude**: Alternative AI source
- **GitHub**: For Copilot integration
- **TruAi Core**: Main orchestration

### Editor Settings
- **Font Size**: 10-24 points
- **Tab Size**: 2-8 spaces
- **Auto Save**: Enable/disable

### AI Settings
- **Default Tier**: Auto, Cheap, Mid, Copilot
- **Default Model**: GPT-3.5, GPT-4, Claude
- **Cost Preferences**: Optimize costs

### Appearance
- **Theme**: Dark, Light, System
- **Color Scheme**: (Future feature)

### Saving Settings
- Tap "Save Settings" button
- Settings persist across sessions
- Stored locally and securely

## Activity Bar

Quick access to main panels:

1. **Explorer** - File navigation
2. **Search** - Find in files
3. **Git** - Version control
4. **Debug** - (Future feature)
5. **Extensions** - (Future feature)
6. **AI** - TruAi Core chat
7. **Settings** - Preferences

## Status Bar

Shows at bottom of screen:

- **Git Branch**: Current branch name
- **File Name**: Currently open file
- **Cursor Position**: Line and column
- **Encoding**: UTF-8 (default)
- **Line Ending**: LF or CRLF

## Keyboard Navigation

While full keyboard support is optimized for iPad with keyboard:

### Supported (via Command Palette)
- New File: Cmd+N
- Open File: Cmd+O
- Save: Cmd+S
- Find: Cmd+F
- Command Palette: Cmd+Shift+P

### Future Enhancements
- Custom key bindings
- Shortcuts customization
- Gesture shortcuts

## Tips & Tricks

### Productivity
1. Use command palette for quick access
2. Keep commonly used files in tabs
3. Use search for large projects
4. Save conversations for reference

### AI Best Practices
1. Provide context in questions
2. Review AI suggestions carefully
3. Test generated code
4. Iterate with follow-up questions

### File Organization
1. Use clear folder structure
2. Name files descriptively
3. Keep project organized
4. Use Git for version control

### Performance
1. Close unused tabs
2. Clear search results when done
3. Limit concurrent operations
4. Restart app if sluggish

## Troubleshooting

### "File not found"
- Check file path
- Verify permissions
- Reload file explorer

### "Git operation failed"
- Check network connection
- Verify credentials
- Ensure repository is valid

### "AI request failed"
- Verify API keys in Settings
- Check network connection
- Try again after a moment
- Check API rate limits

### "App is slow"
- Close unused tabs
- Clear terminal history
- Restart application
- Check available storage

## Getting Help

### In-App
- Command Palette → Help commands
- AI Panel → Ask TruAi Core
- Settings → Documentation links

### External
- Email: support@mydeme.com
- GitHub: Issues section
- Documentation: This guide

## Advanced Features

### TruAi Core Capabilities
- Self-maintenance (automatic optimization)
- Cost tracking (monitor API usage)
- Risk classification (approval workflows)
- Multi-model routing (best AI for task)

### Customization
- Adjust AI tier preferences
- Configure file exclusions
- Set editor preferences
- Customize appearance

### Integration
- Git repository management
- External API calls (AI providers)
- File system operations
- Terminal commands

## Limitations

### Current Version
- Basic syntax highlighting
- Limited keyboard shortcuts on iPhone
- Git requires command line setup
- Terminal is simulated

### Platform Constraints
- iOS sandboxing limits file access
- Some shell commands not available
- Background processing limited
- Network required for AI features

## Future Features

See TruAi.md for planned enhancements:
- Advanced syntax highlighting
- Debugger integration
- Extension system
- Remote file access
- Collaboration features
- Theme customization
- Code formatting
- Linting integration
