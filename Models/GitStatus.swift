//
//  GitStatus.swift
//  TruAi
//
//  Git status and operations model
//

import Foundation

struct GitStatus: Codable {
    let branch: String?
    let isDirty: Bool
    let stagedFiles: [String]
    let modifiedFiles: [String]
    let untrackedFiles: [String]
    let ahead: Int
    let behind: Int
    
    init(branch: String? = nil,
         isDirty: Bool = false,
         stagedFiles: [String] = [],
         modifiedFiles: [String] = [],
         untrackedFiles: [String] = [],
         ahead: Int = 0,
         behind: Int = 0) {
        self.branch = branch
        self.isDirty = isDirty
        self.stagedFiles = stagedFiles
        self.modifiedFiles = modifiedFiles
        self.untrackedFiles = untrackedFiles
        self.ahead = ahead
        self.behind = behind
    }
}

struct GitCommit: Identifiable, Codable {
    let id: String
    let hash: String
    let message: String
    let author: String
    let date: Date
    let filesChanged: [String]
    
    init(id: String = UUID().uuidString,
         hash: String,
         message: String,
         author: String,
         date: Date,
         filesChanged: [String] = []) {
        self.id = id
        self.hash = hash
        self.message = message
        self.author = author
        self.date = date
        self.filesChanged = filesChanged
    }
}
