//
//  GitViewModel.swift
//  TruAi
//
//  View model for Git integration
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation
import Combine

@MainActor
class GitViewModel: ObservableObject {
    @Published var status: GitStatus?
    @Published var commitMessage: String = ""
    @Published var commitHistory: [GitCommit] = []
    @Published var isLoading: Bool = false
    @Published var error: String?
    
    private let gitService = GitService.shared
    private var cancellables = Set<AnyCancellable>()
    private var repositoryPath: String
    
    init(repositoryPath: String = NSHomeDirectory()) {
        self.repositoryPath = repositoryPath
    }
    
    func loadStatus() async {
        isLoading = true
        error = nil
        
        do {
            status = try await gitService.getStatus(in: repositoryPath)
        } catch {
            self.error = error.localizedDescription
        }
        
        isLoading = false
    }
    
    func commit() async {
        guard !commitMessage.isEmpty else { return }
        
        isLoading = true
        error = nil
        
        do {
            try await gitService.commit(message: commitMessage, in: repositoryPath)
            commitMessage = ""
            await loadStatus()
        } catch {
            self.error = error.localizedDescription
        }
        
        isLoading = false
    }
    
    func push() async {
        isLoading = true
        error = nil
        
        do {
            try await gitService.push(in: repositoryPath)
            await loadStatus()
        } catch {
            self.error = error.localizedDescription
        }
        
        isLoading = false
    }
    
    func pull() async {
        isLoading = true
        error = nil
        
        do {
            try await gitService.pull(in: repositoryPath)
            await loadStatus()
        } catch {
            self.error = error.localizedDescription
        }
        
        isLoading = false
    }
    
    func stageFile(_ file: String) async {
        do {
            try await gitService.stageFile(file, in: repositoryPath)
            await loadStatus()
        } catch {
            self.error = error.localizedDescription
        }
    }
    
    func unstageFile(_ file: String) async {
        do {
            try await gitService.unstageFile(file, in: repositoryPath)
            await loadStatus()
        } catch {
            self.error = error.localizedDescription
        }
    }
    
    func loadHistory() async {
        do {
            commitHistory = try await gitService.getCommitHistory(in: repositoryPath)
        } catch {
            self.error = error.localizedDescription
        }
    }
}
