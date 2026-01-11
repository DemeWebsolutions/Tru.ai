//
//  FileExplorerViewModel.swift
//  TruAi
//
//  View model for file explorer
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation
import Combine

@MainActor
class FileExplorerViewModel: ObservableObject {
    @Published var files: [FileItem] = []
    @Published var selectedFile: FileItem?
    @Published var searchText: String = ""
    @Published var currentPath: String
    
    private let fileSystemService = FileSystemService.shared
    private var cancellables = Set<AnyCancellable>()
    
    init(path: String = NSHomeDirectory()) {
        self.currentPath = path
        loadFiles()
    }
    
    func loadFiles() {
        files = fileSystemService.loadDirectory(at: currentPath)
    }
    
    func selectFile(_ file: FileItem) {
        selectedFile = file
        
        if file.isDirectory {
            currentPath = file.path
            loadFiles()
        }
    }
    
    func toggleDirectory(_ file: FileItem) {
        guard file.isDirectory else { return }
        
        if let index = files.firstIndex(where: { $0.id == file.id }) {
            var updatedFile = files[index]
            updatedFile.isExpanded.toggle()
            
            if updatedFile.isExpanded {
                updatedFile.children = fileSystemService.loadDirectory(at: updatedFile.path)
            }
            
            files[index] = updatedFile
        }
    }
    
    func createFile(name: String, in directory: String? = nil) throws {
        let path = directory ?? currentPath
        let fullPath = (path as NSString).appendingPathComponent(name)
        try fileSystemService.createFile(at: fullPath)
        loadFiles()
    }
    
    func createDirectory(name: String, in directory: String? = nil) throws {
        let path = directory ?? currentPath
        let fullPath = (path as NSString).appendingPathComponent(name)
        try fileSystemService.createDirectory(at: fullPath)
        loadFiles()
    }
    
    func deleteFile(_ file: FileItem) throws {
        try fileSystemService.deleteItem(at: file.path)
        loadFiles()
    }
    
    func renameFile(_ file: FileItem, newName: String) throws {
        let directory = (file.path as NSString).deletingLastPathComponent
        let newPath = (directory as NSString).appendingPathComponent(newName)
        try fileSystemService.moveItem(from: file.path, to: newPath)
        loadFiles()
    }
    
    var filteredFiles: [FileItem] {
        guard !searchText.isEmpty else { return files }
        return files.filter { $0.name.localizedCaseInsensitiveContains(searchText) }
    }
}
