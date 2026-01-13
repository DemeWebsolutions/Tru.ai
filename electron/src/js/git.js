/**
 * Git Integration Module
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_GIT_V1
 */

let currentRepoPath = null;
let gitStatus = null;

/**
 * Initialize Git integration
 */
function initializeGit() {
  // Setup Git panel listeners
  const commitBtn = document.getElementById('gitCommitBtn');
  if (commitBtn) {
    commitBtn.addEventListener('click', handleGitCommit);
  }

  const pushBtn = document.getElementById('gitPushBtn');
  if (pushBtn) {
    pushBtn.addEventListener('click', handleGitPush);
  }

  const pullBtn = document.getElementById('gitPullBtn');
  if (pullBtn) {
    pullBtn.addEventListener('click', handleGitPull);
  }

  const refreshBtn = document.getElementById('gitRefreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', refreshGitStatus);
  }

  console.log('Git integration initialized');
}

/**
 * Set repository path
 */
function setRepoPath(repoPath) {
  currentRepoPath = repoPath;
  refreshGitStatus();
}

/**
 * Refresh Git status
 */
async function refreshGitStatus() {
  if (!currentRepoPath) {
    console.log('No repository path set');
    return;
  }

  try {
    const result = await window.electronAPI.invoke('git-status', currentRepoPath);
    
    if (result.success) {
      gitStatus = result.status;
      updateGitUI();
      updateStatusBarGit();
      console.log('Git status updated');
    } else {
      console.error('Failed to get Git status:', result.error);
    }
  } catch (error) {
    console.error('Failed to refresh Git status:', error);
  }
}

/**
 * Update Git UI
 */
function updateGitUI() {
  if (!gitStatus) return;

  // Update branch display
  const branchElement = document.getElementById('gitBranch');
  if (branchElement) {
    branchElement.textContent = `Branch: ${gitStatus.current}`;
  }

  // Update changes list
  const changesElement = document.getElementById('gitChanges');
  if (changesElement) {
    changesElement.innerHTML = '';

    // Modified files
    gitStatus.modified.forEach(file => {
      const item = createGitFileItem(file, 'M', 'Modified');
      changesElement.appendChild(item);
    });

    // Created files
    gitStatus.created.forEach(file => {
      const item = createGitFileItem(file, 'A', 'Added');
      changesElement.appendChild(item);
    });

    // Deleted files
    gitStatus.deleted.forEach(file => {
      const item = createGitFileItem(file, 'D', 'Deleted');
      changesElement.appendChild(item);
    });

    // Untracked files
    gitStatus.not_added.forEach(file => {
      const item = createGitFileItem(file, '?', 'Untracked');
      changesElement.appendChild(item);
    });

    if (changesElement.children.length === 0) {
      changesElement.innerHTML = '<div class="git-no-changes">No changes</div>';
    }
  }
}

/**
 * Create Git file item element
 */
function createGitFileItem(filename, status, statusText) {
  const item = document.createElement('div');
  item.className = 'git-file-item';

  const statusBadge = document.createElement('span');
  statusBadge.className = `git-status-badge status-${status.toLowerCase()}`;
  statusBadge.textContent = status;

  const fileNameSpan = document.createElement('span');
  fileNameSpan.textContent = filename;
  fileNameSpan.title = statusText;

  item.appendChild(statusBadge);
  item.appendChild(fileNameSpan);

  return item;
}

/**
 * Update status bar Git info
 */
function updateStatusBarGit() {
  if (!gitStatus) return;

  const gitBranchElement = document.getElementById('gitBranch');
  if (gitBranchElement) {
    const changesCount = gitStatus.modified.length + 
                        gitStatus.created.length + 
                        gitStatus.deleted.length;
    
    if (changesCount > 0) {
      gitBranchElement.textContent = `${gitStatus.current} (${changesCount} changes)`;
    } else {
      gitBranchElement.textContent = gitStatus.current;
    }
  }
}

/**
 * Handle Git commit
 */
async function handleGitCommit() {
  if (!currentRepoPath) {
    alert('No repository open');
    return;
  }

  const message = prompt('Enter commit message:');
  if (!message) return;

  try {
    const result = await window.electronAPI.invoke('git-commit', currentRepoPath, message);
    
    if (result.success) {
      console.log('Committed successfully');
      await refreshGitStatus();
    } else {
      alert('Failed to commit: ' + result.error);
    }
  } catch (error) {
    console.error('Failed to commit:', error);
    alert('Failed to commit: ' + error.message);
  }
}

/**
 * Handle Git push
 */
async function handleGitPush() {
  if (!currentRepoPath) {
    alert('No repository open');
    return;
  }

  try {
    const result = await window.electronAPI.invoke('git-push', currentRepoPath);
    
    if (result.success) {
      console.log('Pushed successfully');
      await refreshGitStatus();
    } else {
      alert('Failed to push: ' + result.error);
    }
  } catch (error) {
    console.error('Failed to push:', error);
    alert('Failed to push: ' + error.message);
  }
}

/**
 * Handle Git pull
 */
async function handleGitPull() {
  if (!currentRepoPath) {
    alert('No repository open');
    return;
  }

  try {
    const result = await window.electronAPI.invoke('git-pull', currentRepoPath);
    
    if (result.success) {
      console.log('Pulled successfully');
      await refreshGitStatus();
    } else {
      alert('Failed to pull: ' + result.error);
    }
  } catch (error) {
    console.error('Failed to pull:', error);
    alert('Failed to pull: ' + error.message);
  }
}

// Export functions
window.gitAPI = {
  initialize: initializeGit,
  setRepoPath: setRepoPath,
  refresh: refreshGitStatus
};
