# Tru.ai iOS Application

A standalone iOS application framework for Tru.ai core functionality, built with SwiftUI and modern iOS development practices.

## Project Structure

```
TruAi/
├── TruAiApp.swift              # Main app entry point
├── Models/                      # Data models
│   ├── AppState.swift          # Global app state
│   ├── User.swift              # User model
│   ├── ChatMessage.swift       # Message model
│   └── Conversation.swift      # Conversation model
├── Services/                    # Business logic layer
│   ├── TruAiService.swift      # Core AI service
│   ├── NetworkService.swift    # API communication
│   └── StorageService.swift    # Local persistence
├── ViewModels/                  # MVVM view models
│   └── ChatViewModel.swift     # Chat view model
├── Views/                       # SwiftUI views
│   ├── ContentView.swift       # Main content view
│   ├── ChatView.swift          # Chat interface
│   ├── HistoryView.swift       # Conversation history
│   └── SettingsView.swift      # Settings screen
├── Utilities/                   # Helper utilities
│   └── Extensions.swift        # Swift extensions
├── Configuration/               # App configuration
│   └── AppConfig.swift         # Configuration constants
├── Info.plist                  # App configuration
└── README.md                    # This file
```

## Features

- **Modern SwiftUI Architecture**: Built with SwiftUI and MVVM pattern
- **AI Integration**: Core service for Tru.ai API communication
- **Conversation Management**: Full CRUD operations for conversations
- **Local Persistence**: UserDefaults-based storage for conversations
- **Streaming Support**: Async streaming for real-time AI responses
- **Dark Mode Support**: Built-in theme management
- **Error Handling**: Comprehensive error handling throughout

## Requirements

- iOS 15.0+
- Xcode 14.0+
- Swift 5.7+

## Setup Instructions

1. **Open in Xcode**
   ```bash
   open TruAi.xcodeproj
   ```

2. **Configure API Key**
   - Set your Tru.ai API key in Settings view
   - Or set environment variable: `TRU_AI_API_KEY`

3. **Build and Run**
   - Select your target device/simulator
   - Press Cmd+R to build and run

## Configuration

### API Configuration

Update `AppConfig.swift` or use Settings view to configure:
- API Base URL
- Default Model
- Temperature
- Max Tokens

### Environment Variables

Set the following environment variables for development:
```bash
export TRU_AI_API_KEY="your-api-key-here"
```

## Architecture

### MVVM Pattern

- **Models**: Data structures and business entities
- **Views**: SwiftUI views for UI presentation
- **ViewModels**: Business logic and state management
- **Services**: Network, storage, and AI service layers

### Key Components

1. **TruAiService**: Core service managing conversations and AI interactions
2. **NetworkService**: Handles all API communication with Tru.ai backend
3. **StorageService**: Manages local persistence using UserDefaults
4. **AppState**: Global application state management

## Usage

### Creating a Conversation

```swift
let aiService = TruAiService()
aiService.createNewConversation()
```

### Sending a Message

```swift
await aiService.sendMessage("Hello, Tru.ai!")
```

### Streaming Responses

```swift
let stream = networkService.sendStreamingChatRequest(messages: messages)
for try await chunk in stream {
    // Handle streaming response
}
```

## Customization

### Adding New Models

1. Create model file in `Models/` directory
2. Conform to `Codable` protocol
3. Add to appropriate service layer

### Adding New Views

1. Create SwiftUI view in `Views/` directory
2. Create corresponding ViewModel if needed
3. Add navigation/routing in `ContentView`

### Extending Services

1. Add methods to appropriate service class
2. Update ViewModels to use new functionality
3. Update Views to expose new features

## Testing

The framework is structured to support:
- Unit tests for services and ViewModels
- UI tests for SwiftUI views
- Integration tests for API communication

## License

Copyright Tru.ai | TruAi | TruAi Core | Tru.ai Core - Proprietary and intellectual property My Deme, Llc. © 2026 All rights reserved.

## Support

For issues and questions, please contact the Tru.ai development team.
