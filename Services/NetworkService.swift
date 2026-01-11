//
//  NetworkService.swift
//  TruAi
//
//  Network service for API communication
//

import Foundation

class NetworkService {
    static let shared = NetworkService()
    
    private let baseURL: String
    private let apiKey: String
    private let session: URLSession
    
    init(baseURL: String? = nil, apiKey: String? = nil) {
        self.baseURL = baseURL ?? "https://api.tru.ai/v1"
        self.apiKey = apiKey ?? ProcessInfo.processInfo.environment["TRU_AI_API_KEY"] ?? ""
        
        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = 60
        configuration.timeoutIntervalForResource = 120
        self.session = URLSession(configuration: configuration)
    }
    
    // MARK: - Chat Request
    
    func sendChatRequest(
        messages: [ChatMessage],
        model: String = "gpt-4",
        temperature: Double = 0.7,
        maxTokens: Int = 2000
    ) async throws -> String {
        let url = URL(string: "\(baseURL)/chat/completions")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let requestBody: [String: Any] = [
            "model": model,
            "messages": messages.map { [
                "role": $0.role.rawValue,
                "content": $0.content
            ]},
            "temperature": temperature,
            "max_tokens": maxTokens
        ]
        
        request.httpBody = try JSONSerialization.data(withJSONObject: requestBody)
        
        let (data, response) = try await session.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.invalidResponse
        }
        
        guard (200...299).contains(httpResponse.statusCode) else {
            throw NetworkError.httpError(httpResponse.statusCode)
        }
        
        let decoder = JSONDecoder()
        let chatResponse = try decoder.decode(ChatResponse.self, from: data)
        
        return chatResponse.choices.first?.message.content ?? ""
    }
    
    // MARK: - Streaming Chat Request
    
    func sendStreamingChatRequest(
        messages: [ChatMessage],
        model: String = "gpt-4",
        temperature: Double = 0.7
    ) -> AsyncThrowingStream<String, Error> {
        return AsyncThrowingStream { continuation in
            Task {
                do {
                    let url = URL(string: "\(baseURL)/chat/completions")!
                    var request = URLRequest(url: url)
                    request.httpMethod = "POST"
                    request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")
                    request.setValue("application/json", forHTTPHeaderField: "Content-Type")
                    
                    var requestBody: [String: Any] = [
                        "model": model,
                        "messages": messages.map { [
                            "role": $0.role.rawValue,
                            "content": $0.content
                        ]},
                        "temperature": temperature,
                        "stream": true
                    ]
                    
                    request.httpBody = try JSONSerialization.data(withJSONObject: requestBody)
                    
                    let (asyncBytes, response) = try await session.bytes(for: request)
                    
                    guard let httpResponse = response as? HTTPURLResponse,
                          (200...299).contains(httpResponse.statusCode) else {
                        continuation.finish(throwing: NetworkError.invalidResponse)
                        return
                    }
                    
                    for try await line in asyncBytes.lines {
                        if line.hasPrefix("data: "), line != "data: [DONE]" {
                            let jsonString = String(line.dropFirst(6))
                            if let data = jsonString.data(using: .utf8),
                               let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                               let choices = json["choices"] as? [[String: Any]],
                               let delta = choices.first?["delta"] as? [String: Any],
                               let content = delta["content"] as? String {
                                continuation.yield(content)
                            }
                        }
                    }
                    
                    continuation.finish()
                } catch {
                    continuation.finish(throwing: error)
                }
            }
        }
    }
}

// MARK: - Response Models

struct ChatResponse: Codable {
    let id: String
    let choices: [ChatChoice]
    let created: Int
}

struct ChatChoice: Codable {
    let index: Int
    let message: ChatMessageResponse
    let finishReason: String?
    
    enum CodingKeys: String, CodingKey {
        case index, message
        case finishReason = "finish_reason"
    }
}

struct ChatMessageResponse: Codable {
    let role: String
    let content: String
}

// MARK: - Error Types

enum NetworkError: LocalizedError {
    case invalidResponse
    case httpError(Int)
    case decodingError
    case invalidURL
    
    var errorDescription: String? {
        switch self {
        case .invalidResponse:
            return "Invalid response from server"
        case .httpError(let code):
            return "HTTP error with code: \(code)"
        case .decodingError:
            return "Failed to decode response"
        case .invalidURL:
            return "Invalid URL"
        }
    }
}
