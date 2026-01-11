//
//  FileSystemService.swift
//  TruAi
//
//  File system operations service
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation

class FileSystemService {
    static let shared = FileSystemService()
    
    private let fileManager = FileManager.default
    
    private init() {}
    
    func loadDirectory(at path: String) -> [FileItem] {
        guard let contents = try? fileManager.contentsOfDirectory(atPath: path) else {
            return []
        }
        
        return contents.compactMap { name in
            let fullPath = (path as NSString).appendingPathComponent(name)
            
            guard !name.hasPrefix(".") else { return nil }
            
            var isDirectory: ObjCBool = false
            fileManager.fileExists(atPath: fullPath, isDirectory: &isDirectory)
            
            return FileItem(
                name: name,
                path: fullPath,
                isDirectory: isDirectory.boolValue
            )
        }.sorted { $0.isDirectory && !$1.isDirectory }
    }
    
    func readFile(at path: String) -> String? {
        return try? String(contentsOfFile: path, encoding: .utf8)
    }
    
    func writeFile(at path: String, content: String) throws {
        try content.write(toFile: path, atomically: true, encoding: .utf8)
    }
    
    func createFile(at path: String, content: String = "") throws {
        let url = URL(fileURLWithPath: path)
        try content.write(to: url, atomically: true, encoding: .utf8)
    }
    
    func createDirectory(at path: String) throws {
        try fileManager.createDirectory(atPath: path, withIntermediateDirectories: true)
    }
    
    func deleteItem(at path: String) throws {
        try fileManager.removeItem(atPath: path)
    }
    
    func moveItem(from: String, to: String) throws {
        try fileManager.moveItem(atPath: from, toPath: to)
    }
    
    func fileExists(at path: String) -> Bool {
        return fileManager.fileExists(atPath: path)
    }
}
