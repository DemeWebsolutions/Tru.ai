//
//  FileSystemService.swift
//  TruAi
//
//  File system service for file operations
//

import Foundation

class FileSystemService {
    static let shared = FileSystemService()
    
    private init() {}
    
    // MARK: - File Reading
    
    func readFile(at path: String) throws -> String {
        let url = URL(fileURLWithPath: path)
        return try String(contentsOf: url, encoding: .utf8)
    }
    
    func readFileData(at path: String) throws -> Data {
        let url = URL(fileURLWithPath: path)
        return try Data(contentsOf: url)
    }
    
    // MARK: - File Writing
    
    func writeFile(at path: String, content: String) throws {
        let url = URL(fileURLWithPath: path)
        try content.write(to: url, atomically: true, encoding: .utf8)
    }
    
    func writeFileData(at path: String, data: Data) throws {
        let url = URL(fileURLWithPath: path)
        try data.write(to: url)
    }
    
    // MARK: - Directory Operations
    
    func listDirectory(at path: String) throws -> [FileItem] {
        let url = URL(fileURLWithPath: path)
        let fileManager = FileManager.default
        
        guard fileManager.fileExists(atPath: path) else {
            throw FileSystemError.fileNotFound
        }
        
        let contents = try fileManager.contentsOfDirectory(at: url, includingPropertiesForKeys: [.isDirectoryKey, .fileSizeKey, .contentModificationDateKey], options: [])
        
        return try contents.map { url in
            let resourceValues = try url.resourceValues(forKeys: [.isDirectoryKey, .fileSizeKey, .contentModificationDateKey])
            let isDirectory = resourceValues.isDirectory ?? false
            let name = url.lastPathComponent
            let path = url.path
            
            if isDirectory {
                return FileItem(
                    name: name,
                    path: path,
                    type: .directory,
                    modifiedDate: resourceValues.contentModificationDate
                )
            } else {
                let fileExtension = url.pathExtension
                let fileType = FileType(from: fileExtension)
                return FileItem(
                    name: name,
                    path: path,
                    type: fileType,
                    size: Int64(resourceValues.fileSize ?? 0),
                    modifiedDate: resourceValues.contentModificationDate
                )
            }
        }.sorted { first, second in
            // Directories first, then files, both alphabetically
            if first.isDirectory && !second.isDirectory {
                return true
            } else if !first.isDirectory && second.isDirectory {
                return false
            }
            return first.name.localizedCaseInsensitiveCompare(second.name) == .orderedAscending
        }
    }
    
    func createDirectory(at path: String) throws {
        let url = URL(fileURLWithPath: path)
        try FileManager.default.createDirectory(at: url, withIntermediateDirectories: true)
    }
    
    func createFile(at path: String, content: String = "") throws {
        let url = URL(fileURLWithPath: path)
        try content.write(to: url, atomically: true, encoding: .utf8)
    }
    
    func deleteItem(at path: String) throws {
        let url = URL(fileURLWithPath: path)
        try FileManager.default.removeItem(at: url)
    }
    
    func moveItem(from sourcePath: String, to destinationPath: String) throws {
        let sourceURL = URL(fileURLWithPath: sourcePath)
        let destinationURL = URL(fileURLWithPath: destinationPath)
        try FileManager.default.moveItem(at: sourceURL, to: destinationURL)
    }
    
    func copyItem(from sourcePath: String, to destinationPath: String) throws {
        let sourceURL = URL(fileURLWithPath: sourcePath)
        let destinationURL = URL(fileURLWithPath: destinationPath)
        try FileManager.default.copyItem(at: sourceURL, to: destinationURL)
    }
    
    // MARK: - File Info
    
    func fileExists(at path: String) -> Bool {
        return FileManager.default.fileExists(atPath: path)
    }
    
    func isDirectory(at path: String) -> Bool {
        var isDirectory: ObjCBool = false
        FileManager.default.fileExists(atPath: path, isDirectory: &isDirectory)
        return isDirectory.boolValue
    }
}

enum FileSystemError: LocalizedError {
    case fileNotFound
    case permissionDenied
    case invalidPath
    case readError
    case writeError
    
    var errorDescription: String? {
        switch self {
        case .fileNotFound:
            return "File not found"
        case .permissionDenied:
            return "Permission denied"
        case .invalidPath:
            return "Invalid path"
        case .readError:
            return "Failed to read file"
        case .writeError:
            return "Failed to write file"
        }
    }
}
