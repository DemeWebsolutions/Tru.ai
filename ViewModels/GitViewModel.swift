//
//  GitViewModel.swift
//  TruAi
//
//  ViewModel for Git integration
//

import Foundation
import SwiftUI
import Combine

@MainActor
class GitViewModel: ObservableObject {
    @Published var status: GitStatus?
    @Published var commits: [GitCommit] = []
    @Published var branches: [String] = []
    @Published var currentBranch: String?
    @Published var isLoading: Bool = false
    @Published var errorMessage: String?
    
    private let gitService = GitService.shared
    private var cancellables = Set<AnyCancellable>()
    private var projectPath: String = ""
    
    func loadStatus(at path: String) {
        projectPath = path
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                let gitStatus = try await gitService.getStatus(at: path)
                await MainActor.run {
                    self.status = gitStatus
                    self.currentBranch = gitStatus.branch
                    self.isLoading = false
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = error.localizedDescription
                    self.isLoading = false
                }
            }
        }
    }
    
    func loadCommits() {
        isLoading = true
        
        Task {
            do {
                let gitCommits = try await gitService.getCommits()
                await MainActor.run {
                    self.commits = gitCommits
                    self.isLoading = false
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = error.localizedDescription
                    self.isLoading = false
                }
            }
        }
    }
    
    func loadBranches() {
        Task {
            do {
                let gitBranches = try await gitService.getBranches()
                await MainActor.run {
                    self.branches = gitBranches
                }
            } catch {
                await MainActor.run {
                    self.errorMessage = error.localizedDescription
                }
            }
        }
    }
    
    func stageFile(_ filePath: String) {
        Task {
            do {
                try await gitService.stageFile(filePath)
                loadStatus(at: projectPath)
            } catch {
                errorMessage = error.localizedDescription
            }
        }
    }
    
    func commit(message: String) {
        Task {
            do {
                try await gitService.commit(message: message)
                loadStatus(at: projectPath)
                loadCommits()
            } catch {
                errorMessage = error.localizedDescription
            }
        }
    }
    
    func push() {
        Task {
            do {
                try await gitService.push()
                loadStatus(at: projectPath)
            } catch {
                errorMessage = error.localizedDescription
            }
        }
    }
    
    func pull() {
        Task {
            do {
                try await gitService.pull()
                loadStatus(at: projectPath)
            } catch {
                errorMessage = error.localizedDescription
            }
        }
    }
}
