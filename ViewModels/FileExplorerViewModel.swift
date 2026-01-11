//
//  FileExplorerViewModel.swift
//  TruAi
//
//  ViewModel for file explorer
//

import Foundation
import SwiftUI
import Combine

@MainActor
class FileExplorerViewModel: ObservableObject {
    @Published var rootItems: [FileItem] = []
    @Published var selectedItem: FileItem?
    @Published var searchText: String = ""
    @Published var isLoading: Bool = false
    @Published var errorMessage: String?
    
    private let fileSystemService = FileSystemService.shared
    private var cancellables = Set<AnyCancellable>()
    private var rootPath: String = ""
    
    init() {
        // Load default project or recent workspace
        loadProject(at: getDocumentsDirectory())
    }
    
    func loadProject(at path: String) {
        rootPath = path
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                let items = try fileSystemService.listDirectory(at: path)
                await MainActor.run {
                    self.rootItems = items
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
    
    func refresh() {
        loadProject(at: rootPath)
    }
    
    func toggleExpansion(for item: FileItem) {
        guard item.isDirectory else { return }
        
        if let index = rootItems.firstIndex(where: { $0.id == item.id }) {
            var updatedItem = rootItems[index]
            updatedItem.isExpanded.toggle()
            
            if updatedItem.isExpanded && updatedItem.children == nil {
                // Load children
                Task {
                    do {
                        let children = try fileSystemService.listDirectory(at: item.path)
                        await MainActor.run {
                            updatedItem.children = children
                            self.rootItems[index] = updatedItem
                        }
                    } catch {
                        await MainActor.run {
                            self.errorMessage = error.localizedDescription
                        }
                    }
                }
            } else {
                rootItems[index] = updatedItem
            }
        }
    }
    
    func selectItem(_ item: FileItem) {
        selectedItem = item
    }
    
    var filteredItems: [FileItem] {
        if searchText.isEmpty {
            return rootItems
        }
        return filterItems(rootItems, searchText: searchText)
    }
    
    private func filterItems(_ items: [FileItem], searchText: String) -> [FileItem] {
        var results: [FileItem] = []
        let searchLower = searchText.lowercased()
        
        for item in items {
            if item.name.lowercased().contains(searchLower) {
                results.append(item)
            }
            if let children = item.children {
                results.append(contentsOf: filterItems(children, searchText: searchText))
            }
        }
        return results
    }
    
    private func getDocumentsDirectory() -> String {
        let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        return paths[0].path
    }
}
