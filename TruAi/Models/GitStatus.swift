//
//  GitStatus.swift
//  TruAi
//
//  Git status model for version control
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation

struct GitStatus: Codable {
    var currentBranch: String
    var modifiedFiles: [String]
    var stagedFiles: [String]
    var untrackedFiles: [String]
    var ahead: Int
    var behind: Int
    var hasUncommittedChanges: Bool {
        !modifiedFiles.isEmpty || !stagedFiles.isEmpty
    }
    
    init(currentBranch: String = "main") {
        self.currentBranch = currentBranch
        self.modifiedFiles = []
        self.stagedFiles = []
        self.untrackedFiles = []
        self.ahead = 0
        self.behind = 0
    }
}

struct GitCommit: Identifiable, Codable {
    let id: String
    var message: String
    var author: String
    var date: Date
    var hash: String
}
